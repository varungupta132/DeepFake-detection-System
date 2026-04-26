'use client'

import Link from 'next/link'
import { Shield, Github, Twitter, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-gradient">DeepGuard AI</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Next-generation deepfake detection powered by Vision Transformer and multi-modal AI analysis. Protecting digital authenticity.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Mail, href: 'mailto:contact@deepguard.ai', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/50 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/model-info', label: 'Model Info' },
                { href: '/about', label: 'About' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Tech Stack</h4>
            <ul className="space-y-3">
              {['Next.js 14', 'FastAPI', 'PyTorch', 'Vision Transformer', 'OpenCV', 'TypeScript'].map((tech) => (
                <li key={tech} className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            © {year} DeepGuard AI. Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for digital truth.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
