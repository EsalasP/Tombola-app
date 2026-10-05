import React from 'react'
import { useTombola }        from './hooks/useTombola'
import { ModeSelector }      from './components/ModeSelector'
import { BallDisplay }       from './components/BallDisplay'
import { NumberGrid }        from './components/NumberGrid'
import { Controls }          from './components/Controls'
import { RecentBalls }       from './components/RecentBalls'
import { FullscreenOverlay } from './components/FullscreenOverlay'
import { BingoSampleCard }   from './components/BingoSampleCard'
import { WinPatternSelector } from './components/WinPatternSelector'

export default function App() {
  const t = useTombola()

  const isBingo = t.mode === 'bingo'

  // Request native fullscreen from within a user-gesture handler for
  // maximum browser compatibility (gesture trust expires asynchronously).
  const openFullscreen = () => {
    t.setShowFullscreen(true)
    document.documentElement.requestFullscreen?.().catch?.(() => {})
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Fullscreen overlay (projection mode) ─────────────────────── */}
      {t.showFullscreen && (
        <FullscreenOverlay
          currentBall={t.currentBall}
          animKey={t.animKey}
          mode={t.mode}
          drawn={t.drawn}
          drawnCount={t.drawnCount}
          total={t.total}
          remaining={t.remaining}
          winPattern={t.winPattern}
          targetLetter={t.targetLetter}
          onDraw={t.drawNumber}
          onClose={() => t.setShowFullscreen(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            Tombola Virtual
          </h1>
          <ModeSelector
            mode={t.mode}
            onSwitch={t.switchMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Ball + counters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-5">
              <BallDisplay
                currentBall={t.currentBall}
                animKey={t.animKey}
                mode={t.mode}
              />
              <div className="flex gap-8 text-center w-full justify-center">
                <div>
                  <div className="text-3xl font-black text-gray-800 tabular-nums">
                    {t.drawnCount}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
                    Sacados
                  </div>
                </div>
                <div className="w-px bg-gray-100" />
                <div>
                  <div className="text-3xl font-black text-gray-800 tabular-nums">
                    {t.remaining}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
                    Restantes
                  </div>
                </div>
              </div>
            </div>

            {/* Recent balls */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <RecentBalls drawn={t.drawn} mode={t.mode} />
            </div>

            {/* Patron de victoria — solo tiene sentido con letras B-I-N-G-O */}
            {isBingo && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <WinPatternSelector
                  pattern={t.winPattern}
                  onSetPattern={t.setWinPattern}
                  targetLetter={t.targetLetter}
                  onSetTargetLetter={t.setTargetLetter}
                  onDrawTargetLetter={t.drawTargetLetter}
                  drawAllLetters={t.drawAllLetters}
                  onSetDrawAllLetters={t.setDrawAllLetters}
                />
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <Controls
                onDraw={t.drawNumber}
                onReset={t.reset}
                onFullscreen={openFullscreen}
                autoMode={t.autoMode}
                setAutoMode={t.setAutoMode}
                autoSpeed={t.autoSpeed}
                setAutoSpeed={t.setAutoSpeed}
                voiceOn={t.voiceOn}
                setVoiceOn={t.setVoiceOn}
                remaining={t.remaining}
              />
            </div>

          </div>

          {/* ── Right column: number board + carton de muestra ───────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {t.mode === 'loteria' ? 'Tablero — 1 al 90' : 'Tablero — B I N G O'}
              </h2>
              <NumberGrid mode={t.mode} drawn={t.drawn} />
            </div>

            {isBingo && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
                  Carton de muestra
                </p>
                <div className="max-w-xs mx-auto">
                  <BingoSampleCard pattern={t.winPattern} targetLetter={t.targetLetter} />
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}
