import React, { useEffect } from 'react'
import { getBallInfo } from '../utils/colors'
import { BingoSampleCard } from './BingoSampleCard'
import { NumberGrid } from './NumberGrid'

export const FullscreenOverlay = ({
  currentBall, animKey, mode,
  drawn, drawnCount, total, remaining, winPattern, targetLetter,
  onDraw, onClose,
}) => {
  // Sync overlay close when the browser exits native fullscreen (e.g. Esc key)
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) onClose()
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [onClose])

  // Exit native fullscreen when the overlay unmounts programmatically
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  const mainInfo   = currentBall ? getBallInfo(currentBall, mode) : null
  const prevBalls  = drawn.slice(1, 6) // 4 balls before the current one

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto select-none"
      style={{ backgroundColor: '#1a1035' }}
    >
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 flex justify-between items-center px-6 py-4"
        style={{ backgroundColor: '#1a1035' }}
      >
        <div className="text-white/60 text-sm font-medium">
          <span className="text-white font-black text-xl tabular-nums">{drawnCount}</span>
          <span> / {total} sacados</span>
          <span className="ml-3 text-white/35">({remaining} restantes)</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          &times;
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 px-6 pb-10">

        {/* ── Columna izquierda: bola, carton de muestra, controles ────── */}
        <div className="flex flex-col items-center flex-shrink-0">
          {mainInfo ? (
            <div
              key={animKey}
              className="fs-ball-bounce flex flex-col items-center justify-center rounded-full shadow-2xl"
              style={{ backgroundColor: mainInfo.bg, width: 280, height: 280 }}
            >
              {mainInfo.letter && (
                <span
                  className="font-black tracking-widest leading-none"
                  style={{ color: mainInfo.text, opacity: 0.72, fontSize: 34 }}
                >
                  {mainInfo.letter}
                </span>
              )}
              <span
                className="font-black leading-none tabular-nums"
                style={{ color: mainInfo.text, fontSize: currentBall >= 10 ? 108 : 124 }}
              >
                {currentBall}
              </span>
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded-full"
              style={{ backgroundColor: '#2d2060', width: 280, height: 280 }}
            >
              <span className="font-black text-white/20" style={{ fontSize: 100 }}>?</span>
            </div>
          )}

          {/* ── Previous balls row ──────────────────────────────────────── */}
          {prevBalls.length > 0 && (
            <div className="flex items-center gap-3 mt-8">
              {prevBalls.map((num, i) => {
                const info = getBallInfo(num, mode)
                const size = 52 - i * 7
                const fs   = Math.max(16 - i * 2, 10)
                return (
                  <div
                    key={`prev-${num}-${i}`}
                    className="rounded-full flex items-center justify-center font-bold shadow-lg flex-shrink-0"
                    style={{
                      backgroundColor: info.bg,
                      color: info.text,
                      width: size,
                      height: size,
                      fontSize: fs,
                      opacity: 0.88 - i * 0.13,
                    }}
                  >
                    {num}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Draw button ─────────────────────────────────────────────── */}
          <button
            onClick={onDraw}
            disabled={remaining === 0}
            className="mt-10 px-14 py-4 rounded-2xl font-black text-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#7c3aed' }}
          >
            {remaining === 0 ? 'Fin del juego!' : 'Sacar siguiente →'}
          </button>

          <p className="mt-5 text-white/25 text-xs tracking-wide">
            Espacio &middot; Enter para sacar &nbsp;&bull;&nbsp; Esc para cerrar
          </p>
        </div>

        {/* ── Columna derecha: tablero + carton de muestra debajo ───────── */}
        <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl flex flex-col gap-5 mt-2">

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
          >
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 text-center lg:text-left">
              Tablero
            </p>
            <NumberGrid mode={mode} drawn={drawn} dark />
          </div>

          {mode === 'bingo' && (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 text-center">
                Carton de muestra
              </p>
              <div className="max-w-xs mx-auto">
                <BingoSampleCard pattern={winPattern} targetLetter={targetLetter} />
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
