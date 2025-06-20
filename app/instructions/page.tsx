'use client'
import Link from 'next/link'

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white font-bold text-xl hover:text-blue-300 transition-colors">
              Meckano Filler
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/setup" className="text-white/90 hover:text-white transition-colors">
                Setup Guide
              </Link>
              <Link href="/download" className="text-white/90 hover:text-white transition-colors">
                Download the Project
              </Link>
              <Link href="/instructions" className="text-white border-b-2 border-blue-400">
                Running Instructions
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Running Instructions
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Step-by-step guide to configure and run your Meckano timesheet automation
            </p>
          </div>

          {/* Prerequisites Check */}
          <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl p-6 mb-8 border border-yellow-500/30">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-bold text-white">Before You Start</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center text-white/90">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Node.js and npm installed
              </div>
              <div className="flex items-center text-white/90">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Project files downloaded
              </div>
            </div>
            <p className="text-yellow-200 mt-4 text-sm">
              Need help with these? Check our <Link href="/setup" className="underline hover:text-yellow-100">Setup Guide</Link> and <Link href="/download" className="underline hover:text-yellow-100">Download</Link> pages.
            </p>
          </div>

          {/* Step 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8 border border-white/20">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Install Dependencies</h2>
                <p className="text-white/70">Install Playwright and project dependencies</p>
              </div>
            </div>

            <div className="ml-16">
              <div className="bg-black/30 rounded-lg p-6 mb-4">
                <p className="text-white mb-3">Navigate to your project directory and run:</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm space-y-2">
                  <div className="text-gray-400"># Install project dependencies</div>
                  <div className="text-white">npm install</div>
                  <div className="text-gray-400 mt-3"># Install Playwright browser</div>
                  <div className="text-white">npx playwright install chromium</div>
                </div>
              </div>
              
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-200 text-sm">
                    This downloads Chromium browser (~100MB) and installs TypeScript, Playwright, and other dependencies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8 border border-white/20">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Configure Credentials</h2>
                <p className="text-white/70">Set up your Meckano login and work hour preferences</p>
              </div>
            </div>

            <div className="ml-16">
              <div className="bg-black/30 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-white mb-3">Create your configuration file:</h3>
                <ol className="text-white/90 space-y-2 mb-4">
                  <li>1. Rename <code className="bg-gray-700 px-2 py-1 rounded">.env.example</code> to <code className="bg-gray-700 px-2 py-1 rounded">.env</code></li>
                  <li>2. Open the <code className="bg-gray-700 px-2 py-1 rounded">.env</code> file in any text editor</li>
                  <li>3. Replace the example values with your actual details:</li>
                </ol>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm space-y-1">
                  <div className="text-gray-400"># Your Meckano login credentials</div>
                  <div className="text-white">MECKANO_EMAIL=<span className="text-yellow-300">your-email@example.com</span></div>
                  <div className="text-white">MECKANO_PASSWORD=<span className="text-yellow-300">your-password</span></div>
                  <div className="text-gray-400 mt-3"># Work Hours Configuration (Optional)</div>
                  <div className="text-white">ENTRANCE_START=08:30</div>
                  <div className="text-white">ENTRANCE_END=09:30</div>
                  <div className="text-white">EXIT_START=17:00</div>
                  <div className="text-white">EXIT_END=18:00</div>
                </div>
              </div>
              
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-red-200 text-sm">
                    <p className="font-semibold mb-1">Security Important:</p>
                    <p>Never commit your .env file to version control. It contains your sensitive login credentials.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8 border border-white/20">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Run the Automation</h2>
                <p className="text-white/70">Execute the script to fill your timesheet</p>
              </div>
            </div>

            <div className="ml-16">
              <div className="bg-black/30 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-white mb-3">Choose your run mode:</h3>
                
                {/* Headless Mode */}
                <div className="mb-6">
                  <h4 className="font-semibold text-green-400 mb-2">🚀 Headless Mode (Recommended)</h4>
                  <p className="text-white/80 text-sm mb-2">Runs in the background without opening a browser window:</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                    <span className="text-white">npm test</span>
                  </div>
                </div>

                {/* Headed Mode */}
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-400 mb-2">👁️ Headed Mode (For Debugging)</h4>
                  <p className="text-white/80 text-sm mb-2">Opens browser window so you can watch the automation:</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                    <span className="text-white">npx playwright test --headed</span>
                  </div>
                </div>

                {/* Debug Mode */}
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">🐛 Debug Mode (For Troubleshooting)</h4>
                  <p className="text-white/80 text-sm mb-2">Step through the automation with debugging tools:</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                    <span className="text-white">npx playwright test --debug</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-8 mb-8 border border-green-400/30">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">What to Expect</h2>
                <p className="text-white/70">Here's what happens when you run the automation</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">✅ The Process</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">1.</span>
                    Opens Meckano login page
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">2.</span>
                    Enters your credentials automatically
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">3.</span>
                    Handles 2FA if required (you'll need to complete it)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">4.</span>
                    Navigates to monthly timesheet
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">5.</span>
                    Fills only empty time entries
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">6.</span>
                    Skips weekends and existing entries
                  </li>
                </ul>
              </div>

              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">📊 Sample Output</h3>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs space-y-1">
                  <div className="text-blue-400">ℹ️ Starting automation...</div>
                  <div className="text-green-400">✅ Logged in successfully</div>
                  <div className="text-yellow-400">⏭️ Row 1: Already filled, skipping</div>
                  <div className="text-green-400">✅ Row 2: Filled 09:15 - 18:30</div>
                  <div className="text-yellow-400">⏭️ Row 5: Weekend, skipping</div>
                  <div className="text-blue-400">ℹ️ Processed: 15, Skipped: 10</div>
                </div>
              </div>
            </div>
          </div>



          {/* Success */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 border border-purple-400/30">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">🎉 You're All Set!</h3>
              <p className="text-white/80 mb-6">
                Your Meckano timesheet automation is ready to use. Run it whenever you need to fill your timesheet entries.
              </p>
              <p className="text-white/60 text-sm">
                Use responsibly and in accordance with your company's policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 