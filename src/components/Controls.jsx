import React from 'react'

const SPEEDS = [0.5, 1, 2, 3, 5]

export const Controls = ({
  onDraw, onReset, onFullscreen,
  autoMode, setAutoMode,
  autoSpeed, setAutoSpeed,
  voiceOn, setVoiceOn,
  remaining,
}) => (
  <div className="flex flex-col gap-3">
    {/* Main action row */}
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={onDraw}
        disabled={remaining === 0}
        className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-base transition-colors"
      >
        {remaining === 0 ? 'Fin del juego' : 'Sacar numero'}
      </button>

      <button
        onClick={() => setAutoMode(v => !v)}
        disabled={remaining === 0}
        title="Modo automatico"
        className={`py-3 px-4 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          autoMode
            ? 'bg-amber-500 hover:bg-amber-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        {autoMode ? 'Auto \u25CF' : 'Auto'}
      </button>

      <button
        onClick={() => setVoiceOn(v => !v)}
        title={voiceOn ? 'Silenciar voz' : 'Activar voz'}
        className={`py-3 px-4 rounded-xl font-bold text-lg transition-colors ${
          voiceOn
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-300'
        }`}
      >
        {voiceOn ? '🔊' : '🔇'}
      </button>

      <button
        onClick={onFullscreen}
        title="Pantalla completa (proyector)"
        className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-colors"
      >
        &#x26F6;
      </button>

      <button
        onClick={onReset}
        title="Reiniciar juego"
        className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-bold text-base transition-colors"
      >
        &#x21BA;
      </button>
    </div>

    {/* Speed slider — only visible when auto mode is on */}
    {autoMode && (
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-3 py-2.5 rounded-xl">
        <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">Velocidad</span>
        <input
          type="range"
          min={0}
          max={SPEEDS.length - 1}
          step={1}
          value={SPEEDS.indexOf(autoSpeed)}
          onChange={e => setAutoSpeed(SPEEDS[+e.target.value])}
          className="flex-1 h-2 accent-amber-500"
        />
        <span className="text-xs font-bold text-amber-700 w-10 text-right tabular-nums">
          {autoSpeed}s
        </span>
      </div>
    )}

    <p className="text-xs text-gray-400 text-center leading-relaxed">
      Espacio / Enter &mdash; sacar &nbsp;&bull;&nbsp; Esc &mdash; cerrar pantalla completa
    </p>
  </div>
)
