import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meckano Fill - Timesheet Automation',
  description: 'Automated timesheet filling for Meckano system using Playwright browser automation. Download the complete project with setup instructions.',
  keywords: ['meckano', 'timesheet', 'automation', 'playwright', 'typescript'],
  authors: [{ name: 'Meckano Fill Team' }],
  creator: 'Meckano Fill Team',
  publisher: 'Meckano Fill Team',
  openGraph: {
    title: 'Meckano Fill - Timesheet Automation',
    description: 'Automated timesheet filling for Meckano system using Playwright browser automation',
    url: 'https://meckano-fill.vercel.app',
    siteName: 'Meckano Fill',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meckano Fill - Timesheet Automation',
    description: 'Automated timesheet filling for Meckano system using Playwright browser automation',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
} 