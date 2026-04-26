'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Zap, Brain, Eye, TrendingUp, Lock,
  ChevronRight, Star, Users, CheckCircle, ArrowRight
} from 'lucide-react'
import UploadSection from './components/UploadSection'
import ResultsSection from './components/ResultsSection'

export interface DetectionResult {
  output: 'REAL' | 'FAKE'
  confidence: number
  raw_confidence?: number
  probabilities: { real: number; fake: number }
  analysis: {
    frames_extracted: number
    faces_detected: number
    frame_quality: number
    face_detection_confidence: number
    temporal_consistency: number
    compression_artifacts: number
    warning_flags: string[]
    suspicious_score?: number
    edge_consistency?: number
    color_distribution?: number
    motion_patterns?: number
  }
  preprocessed_images: string[]
  faces_cropped_images: string[]
  original_video: string
  processing_time?: number
  frames_analyzed?: number
  detection_method?: string
  note?: string
}

const features = [
  {
    icon: Brain,
    title: 'Vision Transformer',
    desc: 'ViT architecture with 6 attention heads analyzes spatial features across 16×16 patches for deep manipulation detection.',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(124,58,237,0.3)',
  },
  {
    icon: Eye,
    title: 'Temporal Analysis',
    desc: 'Frame-to-frame consistency checking detects unnatural motion patterns and temporal artifacts invisible to the human eye.',
    color: 'from-cyan-500 to-blue-600',
    glow: 'rgba(0,212,255,0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Frequency Domain',
    desc: 'DCT-based frequency analysis exposes compression artifacts and GAN fingerprints left behind by deepfake generators.',
    color: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.3)',
  },
  {
    icon: Lock,
    title: 'Multi-Modal Fusion',
    desc: 'Six independent CV signals fused together for a robust, high-confidence verdict resistant to adversarial attacks.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
  },
]

const stats = [
  { value: '93%+', label: 'Detection Accuracy', icon: TrendingUp },
  { value: '<5s', label: 'Processing Time', icon: Zap },
  { value: '6', label: 'Analysis Signals', icon: Brain },
  { value: '100MB', label: 'Max File Size', icon: Shield },
]

const steps = [
  { num: '01', title: 'Upload Video', desc: 'Drag & drop or browse your video file (MP4, AVI, MOV, MKV)' },
  { num: '02', title: 'AI Analysis', desc: 'Vision Transformer extracts and analyzes frames in real-time' },
  { num: '03', title: 'Multi-Signal Fusion', desc: 'Six detection signals combined for maximum accuracy' },
  { num: '04', title: 'Detailed Report', desc: 'Get confidence scores, frame analysis, and warning flags' },
]

export default function Home() {
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [showUpload, setShowUpload] = useState(false)

  const handleReset = () => {
    setResult(null)
    setShowUpload(false)
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ResultsSection result={result} onReset={handleReset} />
          </motion.div>
        ) : showUpload ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UploadSection onResult={setResult} onBack={() => setShowUpload(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ── HERO ── */}
            <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4">
              {/* Decorative orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 mb-8"
                >
                  <span className="tag tag-cyan">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    AI-Powered Detection
                  </span>
                  <span className="tag tag-purple">Vision Transformer v4.0</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6"
                >
                  Detect Deepfakes
                  <br />
                  <span className="text-gradient">With AI Precision</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                  Upload any video and our Vision Transformer model analyzes it across 6 independent signals — temporal consistency, frequency artifacts, face quality, and more.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                  <button
                    onClick={() => setShowUpload(true)}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
                  >
                    <Zap className="w-5 h-5" />
                    Analyze Video Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="/how-it-works"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                  >
                    How It Works
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                  {stats.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="glass rounded-2xl p-4 text-center">
                      <div className="text-2xl font-black text-gradient mb-1">{value}</div>
                      <div className="text-slate-400 text-xs font-medium">{label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              >
                <span className="text-slate-500 text-xs">Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
                >
                  <div className="w-1 h-2 rounded-full bg-violet-400" />
                </motion.div>
              </motion.div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-24 px-4">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <span className="tag tag-purple mb-4 inline-flex">Core Technology</span>
                  <h2 className="text-4xl sm:text-5xl font-black mb-4">
                    Multi-Modal <span className="text-gradient">AI Engine</span>
                  </h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Four powerful detection systems working in parallel to catch even the most sophisticated deepfakes.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-6"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}
                        style={{ boxShadow: `0 8px 30px ${f.glow}` }}
                      >
                        <f.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-24 px-4">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <span className="tag tag-cyan mb-4 inline-flex">Simple Process</span>
                  <h2 className="text-4xl sm:text-5xl font-black mb-4">
                    How It <span className="text-gradient">Works</span>
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((step, i) => (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      <div className="glass-card p-6 h-full">
                        <div className="text-5xl font-black text-gradient opacity-30 mb-3">{step.num}</div>
                        <h3 className="text-white font-bold mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                          <ChevronRight className="w-6 h-6 text-violet-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="py-24 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl p-12 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(0,212,255,0.2) 100%)',
                    border: '1px solid rgba(124,58,237,0.3)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-500/10" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                      Ready to Detect Deepfakes?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                      Upload your video and get a detailed AI analysis report in under 5 seconds.
                    </p>
                    <button
                      onClick={() => setShowUpload(true)}
                      className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-105 transition-all duration-300"
                    >
                      <Zap className="w-5 h-5" />
                      Start Free Analysis
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-slate-400 text-sm mt-4 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      No signup required · 100% free · Results in seconds
                    </p>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
