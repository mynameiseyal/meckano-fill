'use client'
import Link from 'next/link'

export default function SetupPage() {
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
              <Link href="/setup" className="text-white border-b-2 border-blue-400">
                Setup Guide
              </Link>
              <Link href="/download" className="text-white/90 hover:text-white transition-colors">
                Download the Project
              </Link>
              <Link href="/instructions" className="text-white/90 hover:text-white transition-colors">
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
              Setup Guide
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Get your system ready to run Meckano Filler by installing the required prerequisites
            </p>
          </div>

          {/* Prerequisites Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Important Prerequisites</h2>
                <p className="text-white/70">You need Node.js and npm installed before proceeding</p>
              </div>
            </div>
          </div>

          {/* Operating System Installation Instructions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Node.js Installation by Operating System</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Windows */}
              <div className="bg-black/20 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🪟</span>
                  <h3 className="text-xl font-bold text-white">Windows</h3>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-white/90 text-sm">
                  <li>Visit <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">nodejs.org</a></li>
                  <li>Download <strong>LTS version</strong></li>
                  <li>Run the <code className="bg-gray-700 px-1 py-0.5 rounded text-xs">.msi</code> installer</li>
                  <li>Follow installation wizard</li>
                  <li><strong>Restart computer</strong></li>
                </ol>
              </div>

              {/* macOS */}
              <div className="bg-black/20 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🍎</span>
                  <h3 className="text-xl font-bold text-white">macOS</h3>
                </div>
                <div className="text-sm">
                  <p className="text-white/90 font-medium mb-2">Option 1: Direct Download</p>
                  <ol className="list-decimal list-inside space-y-1 text-white/80 mb-3">
                    <li>Visit <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">nodejs.org</a></li>
                    <li>Download LTS version</li>
                    <li>Run <code className="bg-gray-700 px-1 py-0.5 rounded text-xs">.pkg</code> installer</li>
                  </ol>
                  <p className="text-white/90 font-medium mb-2">Option 2: Homebrew</p>
                  <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
                    <span className="text-white">brew install node</span>
                  </div>
                </div>
              </div>

              {/* Linux */}
              <div className="bg-black/20 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🐧</span>
                  <h3 className="text-xl font-bold text-white">Ubuntu/Linux</h3>
                </div>
                <div className="text-sm">
                  <p className="text-white/90 font-medium mb-2">Package Manager:</p>
                  <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs mb-3 space-y-1">
                    <div className="text-white">sudo apt update</div>
                    <div className="text-white">sudo apt install nodejs npm</div>
                  </div>
                  <p className="text-white/90 font-medium mb-2">Latest Version:</p>
                  <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs space-y-1">
                    <div className="text-white text-xs">curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -</div>
                    <div className="text-white">sudo apt-get install -y nodejs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-8 mb-8 border border-green-400/30">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Verify Installation</h2>
                <p className="text-white/70">Check that Node.js and npm are properly installed</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <p className="text-white mb-4">Open your terminal/command prompt and run these commands:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm space-y-2 mb-4">
                <div className="text-white">node --version</div>
                <div className="text-white">npm --version</div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/80 text-sm">
                  Both commands should return version numbers (e.g., v18.17.0 for Node.js and 9.6.7 for npm).
                  If you see version numbers, you're ready to proceed!
                </p>
              </div>
            </div>
          </div>



          {/* Next Steps */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 border border-blue-400/30">
              <h3 className="text-2xl font-bold text-white mb-4">✅ Ready to Continue?</h3>
              <p className="text-white/80 mb-6">
                Once Node.js and npm are installed and verified, you can proceed to download the project files.
              </p>
              <Link 
                href="/download" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-block"
              >
                Download Project Files →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 