'use client'
import Link from 'next/link'

export default function DownloadPage() {
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
              <Link href="/download" className="text-white border-b-2 border-blue-400">
                Download
              </Link>
              <Link href="/instructions" className="text-white/90 hover:text-white transition-colors">
                Instructions
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
              Download Project
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Get the Meckano Filler project files and start automating your timesheet entries
            </p>
          </div>

          {/* Download Methods */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Git Clone Method */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Git Clone</h2>
                  <p className="text-green-400 font-semibold">Recommended</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Best for developers</h3>
                <ul className="text-white/80 space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Always get the latest version
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Easy to update with git pull
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full project history
                  </li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-4 mb-6">
                <p className="text-white/80 text-sm mb-2">Run this command in your terminal:</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                  <div className="text-gray-400 mb-2"># Clone the repository</div>
                  <div className="text-white select-all">git clone https://github.com/mynameiseyal/meckano-fill.git</div>
                  <div className="text-white select-all mt-2">cd meckano-fill</div>
                </div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-200 text-sm">
                    Requires Git to be installed. If you don't have Git, download it from <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">git-scm.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Zip Download Method */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Download Zip</h2>
                  <p className="text-blue-400 font-semibold">Quick & Easy</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Perfect for beginners</h3>
                <ul className="text-white/80 space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No Git required
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Includes all project files
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Setup instructions included
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <a
                  href="/api/download"
                  download="meckano-fill.zip"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 no-underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download meckano-fill.zip
                </a>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-200 text-sm">
                    Contains all project files, dependencies list, and detailed setup instructions. Just extract and follow the included guide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">📦 What's Included</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Core Files</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <code className="text-blue-300">tests/fill-hours.spec.ts</code> - Main automation script
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <code className="text-blue-300">src/</code> - Utility modules (config, logger, time-utils)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <code className="text-blue-300">.env.example</code> - Configuration template
                  </li>
                </ul>
              </div>

              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Configuration Files</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <code className="text-blue-300">playwright.config.ts</code> - Test configuration
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <code className="text-blue-300">tsconfig.json</code> - TypeScript configuration
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <code className="text-blue-300">package.json</code> - Dependencies and scripts
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 border border-green-400/30">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Ready to Get Started?</h3>
              <p className="text-white/80 mb-6">
                After downloading, follow the setup instructions to configure and run the automation.
              </p>
              <Link 
                href="/instructions" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-block"
              >
                View Instructions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 