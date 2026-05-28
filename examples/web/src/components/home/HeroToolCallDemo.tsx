'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Clock } from 'lucide-react'

type Phase = 'idle' | 'running' | 'done'

const DURATIONS: Record<Phase, number> = { idle: 1200, running: 2400, done: 1800 }

export function HeroToolCallDemo() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const phases: Phase[] = ['idle', 'running', 'done']
    let timeout: ReturnType<typeof setTimeout>
    let interval: ReturnType<typeof setInterval>

    function advance() {
      setPhase((cur) => {
        const next = phases[(phases.indexOf(cur) + 1) % phases.length] as Phase
        if (next === 'running') {
          setProgress(0)
          let p = 0
          interval = setInterval(() => {
            p += 2
            setProgress(Math.min(p, 100))
            if (p >= 100) clearInterval(interval)
          }, DURATIONS.running / 55)
        }
        timeout = setTimeout(advance, DURATIONS[next])
        return next
      })
    }

    timeout = setTimeout(advance, DURATIONS.idle)
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [])

  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-3xl blur-3xl"
        style={{ backgroundColor: 'var(--site-accent-glow)' }}
      />
      {/* Ghost cards */}
      <div className="absolute -top-4 left-6 right-6 h-14 rounded-xl opacity-25"
        style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }} />
      <div className="absolute -bottom-4 left-6 right-6 h-14 rounded-xl opacity-15"
        style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }} />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-sm rounded-xl p-5 shadow-2xl"
        style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs"
              style={{ backgroundColor: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
            >
              fn
            </div>
            <span className="font-mono text-sm font-medium" style={{ color: 'var(--site-text)' }}>
              search_files
            </span>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: 'var(--site-bg-subtle)', color: 'var(--site-text-subtle)' }}>
                <Clock className="h-3 w-3" /> idle
              </motion.div>
            )}
            {phase === 'running' && (
              <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: 'oklch(0.82 0.18 85 / 0.15)', color: 'var(--site-warning)' }}>
                <Loader2 className="h-3 w-3 animate-spin" /> running
              </motion.div>
            )}
            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: 'oklch(0.72 0.17 145 / 0.15)', color: 'var(--site-success)' }}>
                <CheckCircle2 className="h-3 w-3" /> done
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Args */}
        <div className="mb-4 rounded-md p-3 font-mono text-xs"
          style={{ backgroundColor: 'var(--site-bg)', border: '1px solid var(--site-border)', color: 'var(--site-text-muted)' }}>
          <span style={{ color: 'var(--site-text-subtle)' }}>path: </span>
          <span style={{ color: 'var(--site-accent)' }}>&quot;/src&quot;</span>
          {', '}
          <span style={{ color: 'var(--site-text-subtle)' }}>pattern: </span>
          <span style={{ color: 'var(--site-accent)' }}>&quot;*.ts&quot;</span>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {phase === 'running' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mb-3 overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--site-bg-subtle)', height: 3 }}>
              <div className="h-full rounded-full"
                style={{ backgroundColor: 'var(--site-accent)', width: `${progress}%`, transition: 'width 50ms linear' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-md p-3 text-sm"
              style={{ backgroundColor: 'oklch(0.72 0.17 145 / 0.08)', border: '1px solid oklch(0.72 0.17 145 / 0.25)', color: 'var(--site-success)' }}>
              Found 47 TypeScript files
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
