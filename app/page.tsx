'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold text-xl">
              Meckano Filler
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/setup" className="text-white/90 hover:text-white transition-colors">
                Set the Stage
              </Link>
              <Link href="/download" className="text-white/90 hover:text-white transition-colors">
                Pull the Code
              </Link>
              <Link href="/instructions" className="text-white/90 hover:text-white transition-colors">
                Launch Automation
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Hero Image */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Meckano Filler</span>
          </h1>
          
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Automate your timesheet entries with smart, secure browser automation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/setup" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105 text-center font-medium"
            >
              Setup Guide
            </Link>
            <Link 
              href="/download" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105 text-center font-medium"
            >
              Download the Project
            </Link>
            <Link 
              href="/instructions" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105 text-center font-medium"
            >
              Running Instructions
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-white/60 text-sm">
            <p>© 2025 Meckano Filler. Use responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 