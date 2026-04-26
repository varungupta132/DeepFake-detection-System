import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'DeepScan AI — Deepfake Detection System',
  description: 'Next-generation AI-powered deepfake detection using Vision Transformer + Temporal Analysis. Detect manipulated videos with 93%+ accuracy.',
  keywords: 'deepfake detection, AI video analysis, fake video detector, vision transformer',
  openGraph: {
    title: 'DeepScan AI — Deepfake Detection',
    description: 'Detect deepfake videos with AI precision',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-animated grid-pattern`}>
        <div className="min-h-screen flex flex-col relative z-10">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(10, 15, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              color: '#e2e8f0',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
