import { useState, useCallback, useEffect, useRef } from 'react'

// ─── Pool helpers ────────────────────────────────────────────────────────────

const totalFor = (mode) => (mode === 'loteria' ? 90 : 75)

const createPool = (mode) =>
  Array.from({ length: totalFor(mode) }, (_, i) => i + 1)

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

/** [min, max] number range covered by a B-I-N-G-O letter column */
const letterRange = (letter) => {
  const i = BINGO_LETTERS.indexOf(letter)
  return [i * 15 + 1, i * 15 + 15]
}

/** Numbers still drawable given the current letter-restriction settings */
const drawableFrom = (pool, mode, winPattern, targetLetter, drawAllLetters) => {
  const restricted = mode === 'bingo' && winPattern === 'letra' && targetLetter && !drawAllLetters
  if (!restricted) return pool
  const [min, max] = letterRange(targetLetter)
  return pool.filter(n => n >= min && n <= max)
}

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
  const [winPattern, _setWinPattern]   = useState(null) // 'linea' | 'dos-lineas' | 'figura' | 'full' | 'letra' | null
  const [targetLetter, setTargetLetter] = useState(null) // only relevant when winPattern === 'letra'
  const [drawAllLetters, setDrawAllLetters] = useState(true) // false = only draw from targetLetter's column

  // Stable refs so drawNumber never captures stale values
  const poolRef           = useRef(pool)
  const modeRef           = useRef(mode)
  const voiceOnRef        = useRef(voiceOn)
  const winPatternRef     = useRef(winPattern)
  const targetLetterRef   = useRef(targetLetter)
  const drawAllLettersRef = useRef(drawAllLetters)
  poolRef.current           = pool
  modeRef.current           = mode
  voiceOnRef.current        = voiceOn
  winPatternRef.current     = winPattern
  targetLetterRef.current   = targetLetter
  drawAllLettersRef.current = drawAllLetters

  const drawNumber = useCallback(() => {
    const p = poolRef.current
    const candidates = drawableFrom(
      p, modeRef.current, winPatternRef.current, targetLetterRef.current, drawAllLettersRef.current
    )
    if (candidates.length === 0) return
    const num  = candidates[Math.floor(Math.random() * candidates.length)]
    const next = p.filter(n => n !== num)
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
    if (newMode !== 'bingo') { _setWinPattern(null); setTargetLetter(null); setDrawAllLetters(true) }
  }, [])

  const setWinPattern = useCallback((pattern) => {
    _setWinPattern(pattern)
    if (pattern !== 'letra') { setTargetLetter(null); setDrawAllLetters(true) }
  }, [])

  const drawTargetLetter = useCallback(() => {
    setTargetLetter(BINGO_LETTERS[Math.floor(Math.random() * BINGO_LETTERS.length)])
  }, [])

  const remaining = drawableFrom(pool, mode, winPattern, targetLetter, drawAllLetters).length

  // ── Auto-play interval ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoMode) return
    if (remaining === 0) { setAutoMode(false); return }
    const id = setInterval(drawNumber, autoSpeed * 1000)
    return () => clearInterval(id)
  }, [autoMode, autoSpeed, drawNumber, remaining])

  // Stop auto when the drawable pool empties mid-interval
  useEffect(() => {
    if (remaining === 0 && autoMode) setAutoMode(false)
  }, [remaining, autoMode])

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
    winPattern, setWinPattern, targetLetter, setTargetLetter, drawTargetLetter,
    drawAllLetters, setDrawAllLetters,
    showFullscreen: showFS,
    setShowFullscreen: setShowFS,
    drawNumber, reset, switchMode,
    setAutoMode, setAutoSpeed,
    total:      totalFor(mode),
    drawnCount: drawn.length,
    remaining,
  }
}
