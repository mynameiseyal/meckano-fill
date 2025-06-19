import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const file = searchParams.get('file')
  
  if (!file) {
    return NextResponse.json({ error: 'File parameter required' }, { status: 400 })
  }

  try {
    // Define allowed files for security
    const allowedFiles: { [key: string]: string } = {
      'package.json': 'package.json',
      'tsconfig.json': 'tsconfig.json',
      'playwright.config.ts': 'playwright.config.ts',
      'fill-hours.spec.ts': 'tests/fill-hours.spec.ts',
      'config.ts': 'src/config.ts',
      'logger.ts': 'src/logger.ts',
      'time-utils.ts': 'src/time-utils.ts',
      'README.md': 'README.md',
      '.env.example': '.env.example'
    }

    if (!allowedFiles[file]) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const filePath = join(process.cwd(), allowedFiles[file])
    
    // Special handling for .env.example
    if (file === '.env.example') {
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

      return new NextResponse(envContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename=".env.example"`
        }
      })
    }

    const fileContent = readFileSync(filePath, 'utf8')
    const fileName = allowedFiles[file].split('/').pop()
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })

  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
} 