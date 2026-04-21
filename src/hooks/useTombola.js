import { useState, useCallback, useEffect, useRef } from 'react'

// ─── Pool helpers ────────────────────────────────────────────────────────────

const createPool = (mode) =>
  Array.from({ length: mode === 'loteria' ? 90 : 75 }, (_, i) => i + 1)

// ─── Web Audio API ────────────────────────────────────────────────────────────

let _audioCtx = null

const getAudioCtx = () => {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Browsers suspend AudioContext until a user gesture; resume if needed
  if (_audioCtx.state === 'suspended') _audioCtx.resume()
  return _audioCtx
}

/** Short ascending "pop" tone */
const playPop = () => {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(260, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.14)
    gain.gain.setValueAtTime(0.38, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.28)
  } catch (_) { /* AudioContext may be unavailable in some contexts */ }
}

/** 4-note triumphant fanfare (C-E-G-C) */
const playFanfare = () => {
  try {
    const ctx = getAudioCtx()
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.26
      gain.gain.setValueAtTime(0.001, t)
      gain.gain.linearRampToValueAtTime(0.42, t + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48)
      osc.start(t)
      osc.stop(t + 0.48)
    })
  } catch (_) {}
}

// ─── Speech synthesis ─────────────────────────────────────────────────────────

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O']

/**
 * Reads a number aloud using the browser's speech synthesis.
 * In bingo mode prepends the column letter with a short pause.
 */
const speak = (num, mode) => {
  if (!globalThis.speechSynthesis) return
  globalThis.speechSynthesis.cancel()
  const label = mode === 'bingo'
    ? `${BINGO_LETTERS[Math.floor((num - 1) / 15)]}, ${num}`
    : String(num)
  const utter = new SpeechSynthesisUtterance(label)
  utter.lang  = 'es-ES'
  utter.rate  = 0.88
  utter.pitch = 1.05
  globalThis.speechSynthesis.speak(utter)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useTombola = () => {
  const [mode, _setMode]          = useState('loteria')
  const [pool, setPool]           = useState(() => createPool('loteria'))
  const [drawn, setDrawn]         = useState([])
  const [currentBall, setCurrent] = useState(null)
  const [animKey, setAnimKey]     = useState(0)
  const [autoMode, setAutoMode]   = useState(false)
  const [autoSpeed, setAutoSpeed] = useState(2)
  const [showFS, setShowFS]       = useState(false)
  const [voiceOn, setVoiceOn]     = useState(true)

  // Stable refs so drawNumber never captures stale values
  const poolRef    = useRef(pool)
  const modeRef    = useRef(mode)
  const voiceOnRef = useRef(voiceOn)
  poolRef.current    = pool
  modeRef.current    = mode
  voiceOnRef.current = voiceOn

  const drawNumber = useCallback(() => {
    const p = poolRef.current
    if (p.length === 0) return
    const idx  = Math.floor(Math.random() * p.length)
    const num  = p[idx]
    const next = p.filter((_, i) => i !== idx)
    setPool(next)
    setDrawn(prev => [num, ...prev])
    setCurrent(num)
    setAnimKey(k => k + 1)
    playPop()
    if (voiceOnRef.current) speak(num, modeRef.current)
    if (next.length === 0) setTimeout(playFanfare, 350)
  }, [])

  const reset = useCallback(() => {
    setPool(createPool(mode))
    setDrawn([])
    setCurrent(null)
    setAnimKey(0)
    setAutoMode(false)
  }, [mode])

  const switchMode = useCallback((newMode) => {
    _setMode(newMode)
    setPool(createPool(newMode))
    setDrawn([])
    setCurrent(null)
    setAnimKey(0)
    setAutoMode(false)
  }, [])

  // ── Auto-play interval ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoMode) return
    if (poolRef.current.length === 0) { setAutoMode(false); return }
    const id = setInterval(drawNumber, autoSpeed * 1000)
    return () => clearInterval(id)
  }, [autoMode, autoSpeed, drawNumber])

  // Stop auto when pool empties mid-interval
  useEffect(() => {
    if (pool.length === 0 && autoMode) setAutoMode(false)
  }, [pool.length, autoMode])

  // ── Global keyboard shortcuts ───────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      // Don't intercept when user is interacting with a range slider
      if (e.target.tagName === 'INPUT') return
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        drawNumber()
      } else if (e.code === 'Escape') {
        setShowFS(false)
      }
    }
    globalThis.addEventListener('keydown', onKey)
    return () => globalThis.removeEventListener('keydown', onKey)
  }, [drawNumber])

  return {
    mode, pool, drawn, currentBall, animKey,
    autoMode, autoSpeed,
    voiceOn, setVoiceOn,
    showFullscreen: showFS,
    setShowFullscreen: setShowFS,
    drawNumber, reset, switchMode,
    setAutoMode, setAutoSpeed,
    total:      mode === 'loteria' ? 90 : 75,
    drawnCount: drawn.length,
    remaining:  pool.length,
  }
}
