import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join, resolve, relative } from 'path'
import archiver from 'archiver'

export const dynamic = 'force-dynamic'

// Security: Define allowed files to prevent path traversal
const ALLOWED_FILES = new Set([
  'package.json',
  'tsconfig.json', 
  'playwright.config.ts',
  'tests/fill-hours.spec.ts',
  'src/config.ts',
  'src/logger.ts',
  'src/time-utils.ts',
  'README.md'
]);

// Simple rate limiting (in production, use Redis or similar)
const downloadAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 5; // 5 downloads per minute per IP
const CLEANUP_INTERVAL = 300000; // 5 minutes

// Cleanup old entries to prevent memory leak
function cleanupOldEntries(): void {
  const now = Date.now();
  const ipsToDelete: string[] = [];
  
  downloadAttempts.forEach((data, ip) => {
    if (now - data.lastAttempt > RATE_LIMIT_WINDOW * 2) {
      ipsToDelete.push(ip);
    }
  });
  
  ipsToDelete.forEach(ip => downloadAttempts.delete(ip));
}

// Run cleanup periodically
setInterval(cleanupOldEntries, CLEANUP_INTERVAL);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = downloadAttempts.get(ip);
  
  if (!attempts || now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    downloadAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  return true;
}

// Fallback content for files that might not be available in serverless environment
const fallbackContent: Record<string, string> = {
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
  'playwright.config.ts': `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://app.meckano.co.il',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});`,
  'tests/fill-hours.spec.ts': `import { test, Locator, Page } from '@playwright/test';
import { config } from '../src/config';
import { generateTimeEntry, isValidTimeFormat } from '../src/time-utils';
import { logger } from '../src/logger';

interface RowData {
  index: number;
  dateText: string;
  isWeekend: boolean;
  entranceCell: Locator;
  exitCell: Locator;
}

interface FillResult {
  success: boolean;
  value?: string;
  error?: string;
}

/**
 * Clicks on a cell, fills it with the specified value, and validates the input.
 * Skips filling if the cell already contains a value.
 */
async function clickAndFill(cell: Locator, value: string): Promise<FillResult> {
  const page = cell.page();

  try {
    const inputLocator = cell.locator('input');
    const timeSpan = cell.locator('span').nth(1); // span with visible text

    const hasInput = await inputLocator.count() > 0;

    if (hasInput) {
      const isVisible = await inputLocator.isVisible();

      let currentValue = '';

      if (isVisible) {
        currentValue = (await inputLocator.inputValue()).trim();
        logger.debug(\`Input is visible. Current input value: "\${currentValue}"\`);
      } else {
        // Fall back to reading the displayed span
        currentValue = (await timeSpan.innerText()).trim();
        logger.debug(\`Input not visible. Current span value: "\${currentValue}"\`);
      }

      if (currentValue) {
        logger.skip(\`Field already contains "\${currentValue}"\`);
        return { success: true, value: currentValue };
      }
    } else {
      // No input at all, fall back to checking span
      const spanText = (await timeSpan.innerText()).trim();
      logger.debug(\`No input element found. Span value: "\${spanText}"\`);

      if (spanText) {
        logger.skip(\`Field already contains "\${spanText}"\`);
        return { success: true, value: spanText };
      }
    }

    // Validate input before attempting to fill
    if (!isValidTimeFormat(value)) {
      throw new Error(\`Invalid time format: \${value}\`);
    }

    // Only if really empty, we try to type
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await cell.click();
        await page.waitForTimeout(300);

        // Clear existing content and type new value
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(value, { delay: 100 });

        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // Wait for span to be visible and validate content
        await timeSpan.waitFor({ state: 'visible', timeout: 5000 });

        let newText = (await timeSpan.innerText()).trim();
        if (!newText) {
          logger.warn(\`Empty span after typing. Waiting 1 second...\`);
          await page.waitForTimeout(1000);
          newText = (await timeSpan.innerText()).trim();
        }

        if (newText.includes(value)) {
          logger.success(\`Filled "\${value}" successfully on attempt \${attempt}\`);
          return { success: true, value: newText };
        } else {
          logger.warn(\`Validation failed: Expected "\${value}", got "\${newText}". Retrying...\`);
        }
      } catch (error) {
        logger.warn(\`Span not ready on attempt \${attempt}. Error: \${error}. Retrying...\`);
      }

      await page.waitForTimeout(500);
    }

    const errorMsg = \`Failed to fill "\${value}" after \${maxAttempts} attempts\`;
    logger.error(errorMsg);
    return { success: false, error: errorMsg };

  } catch (error) {
    const errorMsg = \`Unexpected error while filling "\${value}": \${error}\`;
    logger.error(errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Checks if a date represents a weekend (Friday or Saturday in Hebrew)
 */
function isWeekend(dateText: string): boolean {
  return dateText.includes('ו') || dateText.includes('ש');
}

/**
 * Extracts row data from a table row
 */
async function extractRowData(row: Locator, index: number): Promise<RowData | null> {
  try {
    const tds = row.locator('td');
    const cellCount = await tds.count();

    if (cellCount < 4) {
      logger.warn(\`Row \${index}: Not enough cells (\${cellCount}), skipping.\`);
      return null;
    }

    const dateCell = tds.nth(1);
    const dateText = (await dateCell.locator('span div div p').first().textContent() || '').trim();
    const isWeekendDay = isWeekend(dateText);

    return {
      index,
      dateText,
      isWeekend: isWeekendDay,
      entranceCell: tds.nth(2),
      exitCell: tds.nth(3),
    };
  } catch (error) {
    logger.error(\`Failed to extract data from row \${index}: \${error}\`);
    return null;
  }
}

/**
 * Waits for the next row to be ready for interaction
 */
async function waitForNextRow(rows: Locator, currentIndex: number): Promise<void> {
  const nextIndex = currentIndex + 1;
  const totalRows = await rows.count();

  if (nextIndex < totalRows) {
    try {
      const nextEntranceCell = rows.nth(nextIndex).locator('td').nth(2);
      logger.info(\`Waiting for Row \${nextIndex} entrance cell to be ready...\`);
      await nextEntranceCell.waitFor({ state: 'visible', timeout: 5000 });
      await nextEntranceCell.page().waitForTimeout(300);
    } catch (error) {
      logger.warn(\`Row \${nextIndex} not ready: \${error}\`);
    }
  }
}

test('fill meckano hours after login', async ({ page }: { page: Page }) => {
  logger.info('Starting Meckano hours filling automation');
  
  // Setup popup handlers to automatically close any popups
  page.on('dialog', async (dialog) => {
    logger.warn(\`Popup detected: \${dialog.type()} - "\${dialog.message()}" - Auto-dismissing\`);
    await dialog.dismiss();
  });

  // Handle page alerts and confirmations
  page.on('pageerror', (error) => {
    logger.warn(\`Page error detected: \${error.message}\`);
  });

  try {
    // Navigate to login page
    await page.goto(config.baseUrl);
    logger.info(\`Navigated to \${config.baseUrl}\`);

    // Fill login credentials
    await page.fill('#email', config.email);
    await page.fill('#password', config.password);
    await page.click('#submitButtons');
    logger.info('Login credentials submitted');

    // Wait for login confirmation and navigation to dashboard
    logger.info('Waiting for confirmation code if needed...');
    await page.waitForURL('**/#dashboard', { timeout: config.timeouts.login });
    logger.success('Successfully logged in and navigated to dashboard');

    // Navigate to monthly report
    await page.getByText('כפתור כניסה', { exact: true }).waitFor({ 
      state: 'visible', 
      timeout: config.timeouts.navigation 
    });
    
    await page.locator('a:has-text("דוח חודשי")').click();
    logger.info('Navigated to monthly report');
    try {
      await page.locator('#systemAlert-dialog a').first().click();
    } catch (error: unknown) {
      // Silently handle system alert dialog errors as they're not critical
      if (process.env.NODE_ENV !== 'production') {
        if (error instanceof Error) {
          console.error('Click failed:', error.message);
        } else {
          console.error('Unknown error during click.');
        }
      }
    }

    // Wait for table to load
    await page.getByRole('cell', { name: 'תאריך' }).locator('span').waitFor({ 
      state: 'visible', 
      timeout: config.timeouts.element 
    });

    // Use CSS selector instead of XPath
    await page.waitForSelector('#mainview table', { 
      state: 'visible', 
      timeout: config.timeouts.element 
    });

    const rows = page.locator('#mainview table tbody tr');
    const rowCount = await rows.count();
    logger.info(\`Found \${rowCount} rows to process\`);

    let processedRows = 0;
    let skippedRows = 0;
    let errorRows = 0;

    // Process each row
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowData = await extractRowData(row, i);

      if (!rowData) {
        skippedRows++;
        continue;
      }

      if (rowData.isWeekend) {
        logger.skip(\`Row \${i}: \${rowData.dateText} is Friday or Saturday, skipping.\`);
        skippedRows++;
        continue;
      }

      // Generate time entries
      const timeEntry = generateTimeEntry(config.time);
      logger.info(\`Row \${i}: Processing \${rowData.dateText} - Entrance=\${timeEntry.entrance}, Exit=\${timeEntry.exit}\`);

      // Fill entrance time
      const entranceResult = await clickAndFill(rowData.entranceCell, timeEntry.entrance);
      if (!entranceResult.success) {
        logger.error(\`Row \${i}: Failed to fill entrance time - \${entranceResult.error}\`);
        errorRows++;
        continue;
      }

      // Fill exit time
      const exitResult = await clickAndFill(rowData.exitCell, timeEntry.exit);
      if (!exitResult.success) {
        logger.error(\`Row \${i}: Failed to fill exit time - \${exitResult.error}\`);
        errorRows++;
        continue;
      }

      processedRows++;
      logger.success(\`Row \${i}: Successfully processed \${rowData.dateText}\`);

      // Wait before processing next row
      await page.waitForTimeout(1000);
      await waitForNextRow(rows, i);
    }

    // Log summary
    logger.info('Automation completed', {
      totalRows: rowCount,
      processedRows,
      skippedRows,
      errorRows,
    });

  } catch (error) {
    logger.error(\`Automation failed: \${error}\`);
    throw error;
  }
});`
};

function getFileContent(filePath: string, fileName: string): string | null {
  try {
    if (existsSync(filePath)) {
      return readFileSync(filePath, 'utf8');
    } else {
      console.warn(`File not found: ${filePath}, using fallback if available`);
      return fallbackContent[fileName] || null;
    }
  } catch (error) {
    console.warn(`Error reading file ${filePath}:`, error instanceof Error ? error.message : 'Unknown error');
    return fallbackContent[fileName] || null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Security: Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many download attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Create a new archiver instance
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    })

    // Define the files to include in the zip
    const filesToInclude = [
      { source: 'package.json', destination: 'package.json' },
      { source: 'tsconfig.json', destination: 'tsconfig.json' },
      { source: 'playwright.config.ts', destination: 'playwright.config.ts' },
      { source: 'tests/fill-hours.spec.ts', destination: 'tests/fill-hours.spec.ts' },
      { source: 'src/config.ts', destination: 'src/config.ts' },
      { source: 'src/logger.ts', destination: 'src/logger.ts' },
      { source: 'src/time-utils.ts', destination: 'src/time-utils.ts' },
      { source: 'README.md', destination: 'README.md' }
    ]

    let addedFiles = 0;

    // Add files to the archive with security validation
    for (const file of filesToInclude) {
      try {
        // Security: Validate file is in allowed list
        if (!ALLOWED_FILES.has(file.source)) {
          console.warn(`File not in allowed list: ${file.source}`)
          continue
        }

        const filePath = resolve(join(process.cwd(), file.source))
        const projectRoot = resolve(process.cwd())
        
        // Security: Ensure file is within project directory (prevent path traversal)
        const relativePath = relative(projectRoot, filePath)
        if (relativePath.startsWith('..') || relativePath.includes('..')) {
          console.warn(`Path traversal attempt detected: ${file.source}`)
          continue
        }

        const fileContent = getFileContent(filePath, file.source);
        if (fileContent) {
          archive.append(fileContent, { name: file.destination })
          addedFiles++;
        } else {
          console.warn(`Skipping file ${file.source}: no content available`)
        }
      } catch (error) {
        console.warn(`Could not process file ${file.source}:`, error instanceof Error ? error.message : 'Unknown error')
      }
    }

    console.log(`Added ${addedFiles} files to archive`);

    // Add .env.example file with template content
    const envContent = `# Meckano Login Credentials
# Replace with your actual Meckano login details
MECKANO_EMAIL=your-email@example.com
MECKANO_PASSWORD=your-password

# Work Hours Configuration
# Time ranges for random entrance/exit times (24-hour format)
ENTRANCE_START=08:30
ENTRANCE_END=09:30
EXIT_START=17:00
EXIT_END=18:00

# Optional: Specific work hours (if you want fixed times instead of random)
# WORK_START_TIME=09:00
# WORK_END_TIME=17:30`

    archive.append(envContent, { name: '.env.example' })

    // Add installation instructions
    const installInstructions = `# Meckano Fill - Installation Instructions

## Prerequisites: Install Node.js and npm

**You need Node.js (which includes npm) installed on your computer first.**

### Windows:
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Restart your computer after installation

### macOS:
**Option 1 (Recommended):**
1. Go to https://nodejs.org/
2. Download the LTS version
3. Run the .pkg installer

**Option 2 (Using Homebrew):**
\`\`\`bash
brew install node
\`\`\`

### Ubuntu/Linux:
**Option 1 (Using package manager):**
\`\`\`bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
\`\`\`

**Option 2 (Using NodeSource repository for latest version):**
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### Verify Node.js Installation:
Open terminal/command prompt and run:
\`\`\`bash
node --version
npm --version
\`\`\`
Both commands should return version numbers.

## Quick Setup (After Node.js is installed)

1. **Extract** this zip file to a folder on your computer
2. **Open terminal/command prompt** in that folder:
   - **Windows:** Right-click in the folder → "Open in Terminal" (Windows 11) or Shift+Right-click → "Open PowerShell window here"
   - **macOS:** Right-click in Finder → "New Terminal at Folder" or drag folder to Terminal
   - **Linux:** Right-click in file manager → "Open in Terminal"

3. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

4. **Install Playwright browser:**
   \`\`\`bash
   npx playwright install chromium
   \`\`\`

5. **Configure credentials:**
   - Rename \`.env.example\` to \`.env\`
   - Edit the \`.env\` file with your Meckano login details

6. **Run the automation:**
   \`\`\`bash
   npm test
   \`\`\`

## What's Included

- **package.json** - Project dependencies
- **tsconfig.json** - TypeScript configuration  
- **playwright.config.ts** - Playwright test configuration
- **tests/fill-hours.spec.ts** - Main automation script
- **src/** - Utility modules (config, logger, time-utils)
- **.env.example** - Environment variables template
- **README.md** - Detailed documentation

## Troubleshooting

### "npm is not recognized" or "command not found"
- Node.js/npm is not installed or not in PATH
- Restart terminal/computer after installing Node.js
- Try \`node --version\` first to verify installation

### "Permission denied" errors (Linux/Mac)
- Don't use \`sudo\` with npm commands
- If needed, fix npm permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

### Playwright installation issues
- Run: \`npx playwright install-deps\` (Linux)
- Make sure you have enough disk space (browser downloads ~100MB)

## Alternative: Use Git Clone

If you prefer to use git (requires git installation):
\`\`\`bash
git clone https://github.com/mynameiseyal/meckano-fill.git
cd meckano-fill
npm install
npx playwright install chromium
\`\`\`

## Support

For detailed help and troubleshooting, check the README.md file or visit the GitHub repository.
`

    archive.append(installInstructions, { name: 'INSTALL.md' })

    // Finalize the archive
    archive.finalize()

    // Convert archive to buffer
    const chunks: Buffer[] = []
    archive.on('data', (chunk: Buffer) => chunks.push(chunk))
    
    return new Promise<NextResponse>((resolve, reject) => {
      archive.on('end', () => {
        const buffer = Buffer.concat(chunks)
        
        const response = new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="meckano-fill.zip"',
            'Content-Length': buffer.length.toString()
          }
        })
        
        resolve(response)
      })

      archive.on('error', (error: Error) => {
        // Log error internally without exposing details
        console.error('Archive creation failed:', error.message)
        reject(new NextResponse(
          JSON.stringify({ error: 'Failed to create zip file' }), 
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        ))
      })
    })

  } catch (error) {
    // Log error internally without exposing details
    console.error('Zip creation error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Failed to create zip file' }, { status: 500 })
  }
} 