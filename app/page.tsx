'use client'

import { useState } from 'react'

export default function Home() {
  const [downloadStatus, setDownloadStatus] = useState<string>('')

  const downloadFiles = async () => {
    setDownloadStatus('Individual file downloads available below. For complete setup, use git clone method.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meckano Fill
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automated timesheet filling for Meckano system using Playwright browser automation
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              🚀 Quick Start Guide
            </h2>
            
            {/* Download Section */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                📥 Download Project Files
              </h3>
              <p className="text-blue-800 mb-4">
                Get all the necessary files to run the Meckano automation on your computer.
              </p>
              
              {/* Git Clone Method (Recommended) */}
              <div className="mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Method 1: Git Clone (Recommended)</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <div className="mb-2"># Clone the repository</div>
                  <div className="text-white">git clone https://github.com/mynameiseyal/meckano-fill.git</div>
                  <div className="text-white">cd meckano-fill</div>
                </div>
              </div>

              {/* Direct Download Method */}
              <div className="mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Method 2: Individual File Downloads</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  <a href="/api/download?file=package.json" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    package.json
                  </a>
                  <a href="/api/download?file=tsconfig.json" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    tsconfig.json
                  </a>
                  <a href="/api/download?file=playwright.config.ts" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    playwright.config.ts
                  </a>
                  <a href="/api/download?file=fill-hours.spec.ts" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    fill-hours.spec.ts
                  </a>
                  <a href="/api/download?file=config.ts" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    config.ts
                  </a>
                  <a href="/api/download?file=logger.ts" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    logger.ts
                  </a>
                  <a href="/api/download?file=time-utils.ts" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    time-utils.ts
                  </a>
                  <a href="/api/download?file=.env.example" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    .env.example
                  </a>
                  <a href="/api/download?file=README.md" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors">
                    README.md
                  </a>
                </div>
                <p className="text-sm text-blue-700">
                  💡 Tip: Right-click and "Save As" to download individual files, or use git clone for complete setup.
                </p>
              </div>
            </div>

            {/* Installation Steps */}
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 1: Install Dependencies
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto mb-3">
                  <div className="text-white">npm install</div>
                </div>
                <p className="text-gray-600">
                  This installs Playwright and TypeScript dependencies needed for the automation.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 2: Install Browser
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto mb-3">
                  <div className="text-white">npx playwright install chromium</div>
                </div>
                <p className="text-gray-600">
                  Downloads the Chromium browser that Playwright will use for automation.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 3: Configure Credentials
                </h3>
                <div className="mb-3">
                  <p className="text-gray-600 mb-2">Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file with your Meckano credentials:</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <div className="text-gray-400"># Meckano Login Credentials</div>
                    <div className="text-white">MECKANO_EMAIL=your-email@example.com</div>
                    <div className="text-white">MECKANO_PASSWORD=your-password</div>
                    <div className="text-gray-400 mt-2"># Work Hours Configuration</div>
                    <div className="text-white">ENTRANCE_START=08:30</div>
                    <div className="text-white">ENTRANCE_END=09:30</div>
                    <div className="text-white">EXIT_START=17:00</div>
                    <div className="text-white">EXIT_END=18:00</div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>Security Note:</strong> Never commit your .env file to version control. 
                    It contains your sensitive login credentials.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 4: Run the Automation
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto mb-3">
                  <div className="text-white">npm test</div>
                </div>
                <p className="text-gray-600">
                  Runs the automation script that will log into Meckano and fill your timesheet entries.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ✨ Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Smart field detection - only fills empty timesheet entries
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Random entrance/exit times within your configured ranges
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Handles 2FA authentication prompts
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Comprehensive logging and error handling
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Works with existing timesheet data (won't overwrite)
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">
                🆘 Need Help?
              </h3>
              <div className="space-y-2 text-red-800">
                <p>• Make sure your Meckano credentials are correct in the .env file</p>
                <p>• Check that you have a stable internet connection</p>
                <p>• If 2FA is enabled, be ready to complete it when prompted</p>
                <p>• The script only fills empty timesheet entries - existing data is preserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 