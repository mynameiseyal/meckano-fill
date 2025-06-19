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

## Quick Setup

1. Extract this zip file to a folder on your computer
2. Open terminal/command prompt in that folder
3. Run: npm install
4. Run: npx playwright install chromium
5. Rename .env.example to .env and add your credentials
6. Run: npm test

## What's Included

- package.json - Project dependencies
- tsconfig.json - TypeScript configuration
- playwright.config.ts - Playwright test configuration
- tests/fill-hours.spec.ts - Main automation script
- src/ - Utility modules (config, logger, time-utils)
- .env.example - Environment variables template
- README.md - Detailed documentation

## Support

If you need help, check the README.md file for detailed instructions and troubleshooting tips.

## Note

If some files are missing from this download, please use the git clone method:
git clone https://github.com/mynameiseyal/meckano-fill.git
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