'use client'

import { motion } from 'framer-motion'
import { Brain, Layers, Cpu, TrendingUp, Database, Zap, CheckCircle } from 'lucide-react'

const architecture = [
  { label: 'Model Type', value: 'Vision Transformer (ViT)', icon: Brain },
  { label: 'Embedding Dim', value: '384', icon: Layers },
  { label: 'Transformer Layers', value: '6', icon: Cpu },
  { label: 'Attention Heads', value: '6', icon: Zap },
  { label: 'Patch Size', value: '16 × 16 px', icon: TrendingUp },
  { label: 'Input Resolution', value: '224 × 224 px', icon: Database },
]

const performance = [
  { metric: 'Detection Accuracy', value: '93%+', desc: 'On FaceForensics++ benchmark', color: 'text-emerald-400' },
  { metric: 'Processing Speed', value: '3–5s', desc: 'Per video on CPU', color: 'text-cyan-400' },
  { metric: 'False Positive Rate', value: '<8%', desc: 'Real videos flagged as fake', color: 'text-violet-400' },
  { metric: 'False Negative Rate', value: '<12%', desc: 'Fakes missed by the model', color: 'text-pink-400' },
]

const datasets = [
  { name: 'FaceForensics++', desc: '1000 original + 4000 manipulated videos', tag: 'Primary' },
  { name: 'Celeb-DF', desc: '590 real + 5639 deepfake celebrity videos', tag: 'Validation' },
  { name: 'DFDC', desc: 'Facebook Deepfake Detection Challenge dataset', tag: 'Testing' },
]

export default function ModelInfoPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="tag tag-purple mb-4 inline-flex">Model Architecture</span>
          <h1 className="text-5xl sm:text-6xl font-black mb-5">
            The AI <span className="text-gradient">Behind It</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            A Vision Transformer architecture enhanced with temporal attention and frequency domain analysis for robust deepfake detection.
          </p>
        </motion.div>

        {/* Architecture specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Brain className="w-6 h-6 text-violet-400" />
            Architecture Specs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {architecture.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all"
              >
                <item.icon className="w-5 h-5 text-violet-400 mb-3" />
                <div className="text-xl font-black text-gradient mb-1">{item.value}</div>
                <div className="text-slate-400 text-xs">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {performance.map((p, i) => (
              <motion.div
                key={p.metric}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-6 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className={`text-4xl font-black ${p.color} mb-2`}>{p.value}</div>
                <div className="text-white font-semibold text-sm mb-1">{p.metric}</div>
                <div className="text-slate-500 text-xs">{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Training datasets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Database className="w-6 h-6 text-pink-400" />
            Training Datasets
          </h2>
          <div className="space-y-4">
            {datasets.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white font-semibold">{d.name}</div>
                  <div className="text-slate-400 text-sm">{d.desc}</div>
                </div>
                <span className="tag tag-cyan text-[10px]">{d.tag}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Analysis pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Layers className="w-6 h-6 text-emerald-400" />
            Analysis Pipeline
          </h2>
          <div className="space-y-3">
            {[
              { step: 1, title: 'Frame Extraction', desc: 'Quality-based sampling with Laplacian blur detection' },
              { step: 2, title: 'Face Detection', desc: 'Multi-scale Haar Cascade with eye verification fallback' },
              { step: 3, title: 'ViT Inference', desc: 'Patch embedding → Multi-head attention → Classification head' },
              { step: 4, title: 'Temporal Analysis', desc: 'Optical flow consistency across consecutive frame pairs' },
              { step: 5, title: 'Frequency Analysis', desc: 'DCT block artifact scoring and edge density variance' },
              { step: 6, title: 'Fusion & Decision', desc: 'Weighted combination of all signals → Final verdict' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{item.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
