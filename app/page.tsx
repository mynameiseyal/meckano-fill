'use client'

export default function Home() {
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
                <h4 className="font-medium text-blue-900 mb-2">Method 2: Download Zip File</h4>
                <a
                  href="/api/download"
                  download="meckano-fill.zip"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer inline-flex no-underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download meckano-fill.zip
                </a>
                
                {/* Fallback direct link */}
                <div className="mt-2">
                  <a 
                    href="/api/download" 
                    download="meckano-fill.zip"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Alternative: Direct download link
                  </a>
                </div>
                
                <p className="text-sm text-blue-700 mt-2">
                  📦 Contains all project files, dependencies, and setup instructions
                </p>
              </div>
            </div>

            {/* Installation Steps */}
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 1: Extract & Install Dependencies
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto mb-3">
                  <div className="text-gray-400"># Extract the downloaded zip file</div>
                  <div className="text-gray-400"># Open terminal in the extracted folder</div>
                  <div className="text-white">npm install</div>
                </div>
                <p className="text-gray-600">
                  Extract the zip file to a folder, then install Playwright and TypeScript dependencies.
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
                  <p className="text-gray-600 mb-2">Rename <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> to <code className="bg-gray-100 px-2 py-1 rounded">.env</code> and add your credentials:</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <div className="text-gray-400"># Rename .env.example to .env</div>
                    <div className="text-gray-400"># Then edit with your details:</div>
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