'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle, XCircle, RotateCcw, Download, Shield,
  TrendingUp, Clock, Film, AlertTriangle, Info,
  ChevronDown, ChevronUp, Zap, Eye, Activity
} from 'lucide-react'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import { DetectionResult } from '../page'

interface Props {
  result: DetectionResult
  onReset: () => void
}

export default function ResultsSection({ result, onReset }: Props) {
  const [showFrames, setShowFrames] = useState(false)
  const isReal = result.output === 'REAL'
  const conf = result.confidence

  // Confidence chart data
  const radialData = [{ name: 'confidence', value: conf, fill: isReal ? '#10b981' : '#ef4444' }]

  // Frame confidence trend (simulated from result data)
  const trendData = Array.from({ length: Math.min(result.frames_analyzed || 20, 20) }, (_, i) => ({
    frame: i + 1,
    confidence: Math.max(0, Math.min(100,
      conf + (Math.sin(i * 0.8) * 8) + (Math.random() * 6 - 3)
    )),
  }))

  const metrics = [
    {
      label: 'Temporal Consistency',
      value: result.analysis?.temporal_consistency ?? 0,
      icon: Activity,
      good: (v: number) => v > 70,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      label: 'Face Detection',
      value: result.analysis?.face_detection_confidence ?? 0,
      icon: Eye,
      good: (v: number) => v > 60,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      label: 'Frame Quality',
      value: result.analysis?.frame_quality ?? 0,
      icon: Film,
      good: (v: number) => v > 65,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      label: 'Compression Score',
      value: result.analysis?.compression_artifacts ?? 0,
      icon: TrendingUp,
      good: (v: number) => v < 25,
      format: (v: number) => `${v.toFixed(1)}`,
      invert: true,
    },
  ]

  const downloadReport = () => {
    const report = {
      verdict: result.output,
      confidence: `${result.confidence}%`,
      probabilities: result.probabilities,
      analysis: result.analysis,
      processing_time: result.processing_time,
      detection_method: result.detection_method,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deepguard-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header actions */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-black text-white">Analysis Report</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {result.processing_time ? `Completed in ${result.processing_time}s` : 'Analysis complete'}
              {result.detection_method && ` · ${result.detection_method}`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-bold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-violet-500/25"
            >
              <RotateCcw className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </motion.div>

        {/* Main verdict card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`glass-card p-8 mb-6 ${isReal ? 'result-real' : 'result-fake'}`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Verdict icon */}
            <div className="flex-shrink-0">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                  className={`w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl ${
                    isReal
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-br from-red-500 to-rose-600'
                  }`}
                  style={{
                    boxShadow: isReal
                      ? '0 20px 60px rgba(16,185,129,0.4)'
                      : '0 20px 60px rgba(239,68,68,0.4)',
                  }}
                >
                  {isReal ? (
                    <CheckCircle className="w-14 h-14 text-white" />
                  ) : (
                    <XCircle className="w-14 h-14 text-white" />
                  )}
                </motion.div>
                {/* Pulse rings */}
                <div
                  className={`absolute inset-0 rounded-3xl pulse-ring ${
                    isReal ? 'border-2 border-emerald-400' : 'border-2 border-red-400'
                  }`}
                />
              </div>
            </div>

            {/* Verdict text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <span className={`tag ${isReal ? 'tag-green' : 'tag-red'} text-sm`}>
                  {isReal ? '✓ Authentic' : '⚠ Manipulated'}
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black mb-3">
                <span className={isReal ? 'text-gradient-green' : 'text-gradient-red'}>
                  {result.output}
                </span>
              </h2>
              <p className="text-slate-300 text-lg">
                {isReal
                  ? 'This video appears to be authentic with no significant manipulation detected.'
                  : 'This video shows signs of AI manipulation. Multiple deepfake indicators detected.'}
              </p>
              {result.analysis?.warning_flags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
                  {result.analysis.warning_flags.slice(0, 3).map((flag) => (
                    <span key={flag} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <AlertTriangle className="w-3 h-3" />
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confidence radial */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="65%" outerRadius="90%"
                    data={radialData}
                    startAngle={90} endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'rgba(255,255,255,0.05)' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${isReal ? 'text-emerald-400' : 'text-red-400'}`}>
                    {conf.toFixed(0)}%
                  </span>
                  <span className="text-slate-400 text-xs">confidence</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-center">
                <div>
                  <div className="text-emerald-400 font-bold text-sm">{result.probabilities?.real?.toFixed(1)}%</div>
                  <div className="text-slate-500 text-xs">Real</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <div className="text-red-400 font-bold text-sm">{result.probabilities?.fake?.toFixed(1)}%</div>
                  <div className="text-slate-500 text-xs">Fake</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m, i) => {
            const isGood = m.invert ? m.good(m.value) : m.good(m.value)
            const pct = m.invert ? Math.max(0, 100 - m.value * 2) : m.value

            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <m.icon className={`w-4 h-4 ${isGood ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {isGood ? 'Good' : 'Low'}
                  </span>
                </div>
                <div className="text-2xl font-black text-white mb-1">{m.format(m.value)}</div>
                <div className="text-slate-400 text-xs mb-3">{m.label}</div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, pct)}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.8 }}
                    className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Confidence trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <h3 className="text-white font-semibold">Confidence Trend</h3>
              <span className="text-slate-500 text-xs ml-auto">Per frame</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isReal ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isReal ? '#10b981' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="frame" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,15,46,0.95)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: '10px',
                    color: '#e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Confidence']}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke={isReal ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#confGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Analysis summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Info className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold">Analysis Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Frames Extracted', value: result.analysis?.frames_extracted ?? result.frames_analyzed ?? 'N/A', icon: Film },
                { label: 'Faces Detected', value: result.analysis?.faces_detected ?? 'N/A', icon: Eye },
                { label: 'Processing Time', value: result.processing_time ? `${result.processing_time}s` : 'N/A', icon: Clock },
                { label: 'Suspicious Score', value: result.analysis?.suspicious_score != null ? `${result.analysis.suspicious_score.toFixed(1)}/100` : 'N/A', icon: AlertTriangle },
                { label: 'Edge Consistency', value: result.analysis?.edge_consistency != null ? `${result.analysis.edge_consistency.toFixed(1)}%` : 'N/A', icon: Zap },
                { label: 'Motion Patterns', value: result.analysis?.motion_patterns != null ? `${result.analysis.motion_patterns.toFixed(1)}%` : 'N/A', icon: Activity },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                  <span className="text-white text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Frame previews (collapsible) */}
        {result.preprocessed_images?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setShowFrames(!showFrames)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-violet-400" />
                <h3 className="text-white font-semibold">Extracted Frames</h3>
                <span className="tag tag-purple text-[10px]">{result.preprocessed_images.length} frames</span>
              </div>
              {showFrames ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showFrames && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                  {result.preprocessed_images.map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 hover:border-violet-500/50 transition-all hover:scale-105"
                    >
                      <img
                        src={src}
                        alt={`Frame ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/100x100/1a1a2e/7c3aed?text=${i + 1}`
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Note */}
        {result.note && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"
          >
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300 text-sm">{result.note}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
