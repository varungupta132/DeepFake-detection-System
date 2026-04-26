'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, X, ArrowLeft, Video, Zap, FileVideo,
  CheckCircle, AlertCircle, Loader2, SlidersHorizontal
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { DetectionResult } from '../page'

interface Props {
  onResult: (result: DetectionResult) => void
  onBack: () => void
}

const STAGES = [
  { label: 'Uploading video', icon: Upload },
  { label: 'Extracting frames', icon: FileVideo },
  { label: 'Detecting faces', icon: Zap },
  { label: 'Running AI analysis', icon: Zap },
  { label: 'Generating report', icon: CheckCircle },
]

export default function UploadSection({ onResult, onBack }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [numFrames, setNumFrames] = useState(30)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return
    const f = accepted[0]
    if (f.size > 100 * 1024 * 1024) {
      toast.error('File must be under 100MB')
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    toast.success('Video ready for analysis!')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm'] },
    maxFiles: 1,
    multiple: false,
    disabled: isProcessing,
  })

  const removeFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please select a video first')

    setIsProcessing(true)
    setProgress(0)
    setStage(0)

    // Animate through stages
    const stageInterval = setInterval(() => {
      setStage((s) => {
        if (s >= STAGES.length - 1) { clearInterval(stageInterval); return s }
        return s + 1
      })
    }, 1200)

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 88) { clearInterval(progressInterval); return 88 }
        return p + Math.random() * 8
      })
    }, 600)

    const formData = new FormData()
    formData.append('upload_video_file', file)
    formData.append('num_frames', numFrames.toString())

    try {
      const res = await fetch('/api/predict', { method: 'POST', body: formData })

      clearInterval(stageInterval)
      clearInterval(progressInterval)
      setProgress(100)
      setStage(STAGES.length - 1)

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error ${res.status}`)
      }

      const data = await res.json()
      await new Promise((r) => setTimeout(r, 600))
      onResult(data)
    } catch (err: any) {
      clearInterval(stageInterval)
      clearInterval(progressInterval)
      setIsProcessing(false)
      setProgress(0)
      setStage(0)
      toast.error(err.message || 'Analysis failed. Is the backend running?')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <button
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">Video Analysis</h1>
            <p className="text-slate-400 text-sm">Upload a video to detect deepfake manipulation</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Upload + Settings */}
          <div className="lg:col-span-3 space-y-5">
            {/* Drop zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    {...getRootProps()}
                    className={`upload-zone cursor-pointer p-12 text-center transition-all duration-300 ${
                      isDragActive ? 'active' : ''
                    } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input {...getInputProps()} />
                    <motion.div
                      animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center">
                        <Upload className={`w-9 h-9 ${isDragActive ? 'text-cyan-400' : 'text-violet-400'} transition-colors`} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg mb-1">
                          {isDragActive ? 'Drop it here!' : 'Drag & drop your video'}
                        </p>
                        <p className="text-slate-400 text-sm">or click to browse files</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {['MP4', 'AVI', 'MOV', 'MKV', 'WebM'].map((fmt) => (
                          <span key={fmt} className="tag tag-purple text-[10px]">{fmt}</span>
                        ))}
                      </div>
                      <p className="text-slate-500 text-xs">Maximum file size: 100MB</p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Video thumbnail */}
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                        {preview && (
                          <video src={preview} className="w-full h-full object-cover" muted />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="w-6 h-6 text-white/60" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{file.name}</p>
                        <p className="text-slate-400 text-sm mt-0.5">{formatSize(file.size)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-medium">Ready for analysis</span>
                        </div>
                      </div>
                      {!isProcessing && (
                        <button
                          onClick={removeFile}
                          className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                <h3 className="text-white font-semibold">Analysis Settings</h3>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white text-sm font-medium">Frames to Analyze</p>
                    <p className="text-slate-400 text-xs mt-0.5">More frames = higher accuracy but slower</p>
                  </div>
                  <span className="text-2xl font-black text-gradient">{numFrames}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={numFrames}
                  onChange={(e) => setNumFrames(Number(e.target.value))}
                  disabled={isProcessing}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50"
                  style={{
                    background: `linear-gradient(to right, #7c3aed ${((numFrames - 10) / 40) * 100}%, rgba(255,255,255,0.1) ${((numFrames - 10) / 40) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-slate-500 text-xs mt-2">
                  <span>10 (Fast)</span>
                  <span>30 (Balanced)</span>
                  <span>50 (Thorough)</span>
                </div>
              </div>
            </motion.div>

            {/* Analyze button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleAnalyze}
                disabled={!file || isProcessing}
                className="w-full py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
                  boxShadow: file && !isProcessing ? '0 10px 40px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Analyze for Deepfakes
                    </>
                  )}
                </span>
              </button>
            </motion.div>
          </div>

          {/* Right: Status panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 sticky top-24"
            >
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                Analysis Status
              </h3>

              {/* Progress */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="progress-bar h-full rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stages */}
              <div className="space-y-3">
                {STAGES.map((s, i) => {
                  const done = isProcessing && i < stage
                  const active = isProcessing && i === stage
                  const pending = !isProcessing || i > stage

                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          done
                            ? 'bg-emerald-500/20 border border-emerald-500/40'
                            : active
                            ? 'bg-violet-500/20 border border-violet-500/40'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        {done ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : active ? (
                          <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          done ? 'text-emerald-400' : active ? 'text-white font-medium' : 'text-slate-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Info */}
              {!isProcessing && (
                <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Make sure the Python backend is running on port 8000</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Supports MP4, AVI, MOV, MKV, WebM up to 100MB</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Average processing time: 3–8 seconds</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
