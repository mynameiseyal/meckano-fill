import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import archiver from 'archiver'
import { Readable } from 'stream'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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

    // Add files to the archive
    for (const file of filesToInclude) {
      try {
        const filePath = join(process.cwd(), file.source)
        const fileContent = readFileSync(filePath, 'utf8')
        archive.append(fileContent, { name: file.destination })
      } catch (error) {
        console.warn(`Could not read file ${file.source}:`, error)
      }
    }

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
        console.error('Archive error:', error)
        reject(new NextResponse(
          JSON.stringify({ error: 'Failed to create zip file' }), 
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        ))
      })
    })

  } catch (error) {
    console.error('Error creating zip file:', error)
    return NextResponse.json({ error: 'Failed to create zip file' }, { status: 500 })
  }
} 