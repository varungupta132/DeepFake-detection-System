'use client'

import { motion } from 'framer-motion'
import { Upload, Cpu, BarChart3, FileText, ArrowRight, CheckCircle, Zap, Brain, Eye, Activity } from 'lucide-react'

const pipeline = [
  {
    step: '01',
    icon: Upload,
    title: 'Video Upload & Validation',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(124,58,237,0.3)',
    points: [
      'Accepts MP4, AVI, MOV, MKV, WebM formats',
      'File size validation up to 100MB',
      'Automatic format detection and preprocessing',
      'Secure temporary storage with auto-cleanup',
    ],
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Intelligent Frame Extraction',
    color: 'from-cyan-500 to-blue-600',
    glow: 'rgba(0,212,255,0.3)',
    points: [
      'Quality-based frame selection algorithm',
      'Laplacian variance blur detection',
      'Adaptive sampling rate based on video length',
      'Multi-scale face detection with Haar Cascades',
    ],
  },
  {
    step: '03',
    icon: Brain,
    title: 'Multi-Modal AI Analysis',
    color: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.3)',
    points: [
      'Vision Transformer spatial feature extraction',
      'Temporal consistency across frame sequences',
      'DCT-based frequency domain artifact detection',
      'Color distribution and motion pattern analysis',
    ],
  },
  {
    step: '04',
    icon: FileText,
    title: 'Report Generation',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
    points: [
      'Confidence score with probability breakdown',
      'Per-frame analysis visualization',
      'Warning flags for suspicious indicators',
      'Exportable JSON report with full metadata',
    ],
  },
]

const signals = [
  { icon: Activity, label: 'Temporal Consistency', desc: 'Frame-to-frame optical flow analysis detects unnatural transitions', color: 'text-violet-400' },
  { icon: Zap, label: 'Compression Artifacts', desc: 'DCT block analysis reveals GAN generation fingerprints', color: 'text-cyan-400' },
  { icon: Eye, label: 'Face Quality', desc: 'Multi-scale Haar Cascade detection with eye verification', color: 'text-pink-400' },
  { icon: BarChart3, label: 'Edge Consistency', desc: 'Canny edge density variance across frames', color: 'text-emerald-400' },
  { icon: Brain, label: 'Color Distribution', desc: 'HSV histogram entropy analysis for unnatural patterns', color: 'text-amber-400' },
  { icon: Cpu, label: 'Motion Patterns', desc: 'Lucas-Kanade optical flow for unnatural movement detection', color: 'text-blue-400' },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="tag tag-cyan mb-4 inline-flex">Technical Deep Dive</span>
          <h1 className="text-5xl sm:text-6xl font-black mb-5">
            How It <span className="text-gradient">Works</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            A four-stage pipeline combining computer vision and deep learning to detect deepfake manipulation with high accuracy.
          </p>
        </motion.div>

        {/* Pipeline */}
        <div className="space-y-6 mb-24">
          {pipeline.map((stage, i) => (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0 flex items-center gap-4">
                  <div className="text-6xl font-black text-gradient opacity-20">{stage.step}</div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-xl`}
                    style={{ boxShadow: `0 10px 30px ${stage.glow}` }}
                  >
                    <stage.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-4">{stage.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stage.points.map((point) => (
                      <div key={point} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="hidden sm:flex items-center self-center">
                    <ArrowRight className="w-6 h-6 text-violet-500" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 6 Detection Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="tag tag-purple mb-4 inline-flex">Detection Engine</span>
          <h2 className="text-4xl font-black mb-4">
            6 Independent <span className="text-gradient">Detection Signals</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Each signal independently scores the video. The final verdict is a weighted fusion of all six.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {signals.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6"
            >
              <s.icon className={`w-8 h-8 ${s.color} mb-4`} />
              <h4 className="text-white font-bold mb-2">{s.label}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
