'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Users, Lightbulb, ArrowRight, CheckCircle, Zap } from 'lucide-react'
import Link from 'next/link'

const useCases = [
  { title: 'Journalists & Media', desc: 'Verify video authenticity before publication to maintain credibility and combat misinformation.', icon: '📰' },
  { title: 'Researchers', desc: 'Study deepfake detection techniques and contribute to more robust detection methods.', icon: '🔬' },
  { title: 'Law Enforcement', desc: 'Investigate cases involving manipulated video evidence and digital fraud.', icon: '⚖️' },
  { title: 'General Public', desc: 'Verify suspicious videos on social media and protect yourself from misinformation.', icon: '👥' },
]

const roadmap = [
  'Real-time video stream detection',
  'Browser extension for social media',
  'Public REST API for developers',
  'Audio deepfake detection',
  'Multi-language support',
  'Community verified dataset',
]

const techStack = [
  { name: 'Next.js 14', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Framer Motion', category: 'Frontend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'PyTorch', category: 'AI/ML' },
  { name: 'OpenCV', category: 'AI/ML' },
  { name: 'Vision Transformer', category: 'AI/ML' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="tag tag-cyan mb-4 inline-flex">About the Project</span>
          <h1 className="text-5xl sm:text-6xl font-black mb-5">
            Fighting <span className="text-gradient">Digital Deception</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            DeepGuard AI is an open-source deepfake detection system built to protect digital authenticity and combat AI-generated misinformation.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">Our Mission</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg">
            As deepfake technology becomes increasingly accessible, the need for reliable detection tools has never been more critical. We're democratizing access to advanced AI detection — making it available to everyone from journalists to everyday users concerned about digital authenticity.
          </p>
        </motion.div>

        {/* Use cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            Who Uses DeepGuard?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6"
              >
                <div className="text-3xl mb-3">{uc.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{uc.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-pink-400" />
            Built With
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {techStack.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 text-center hover:border-violet-500/30 transition-all"
              >
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs mt-1">{t.category}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            Roadmap
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roadmap.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-black text-white mb-4">Ready to Try It?</h2>
          <p className="text-slate-400 text-lg mb-8">Upload a video and get your AI analysis in seconds.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Analyze a Video
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
