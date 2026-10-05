import React from 'react'

const PATTERNS = [
  { id: 'linea',      label: 'Linea',         desc: 'Cinco numeros en horizontal, vertical o diagonal.' },
  { id: 'dos-lineas', label: 'Dos lineas',    desc: 'Dos lineas completas en el mismo carton.' },
  { id: 'figura',     label: 'Figura',        desc: 'Figura con nombre (varia segun la sala). Ejemplo mostrado: 4 esquinas.' },
  { id: 'full',       label: 'Full',          desc: 'Carton lleno: todos los numeros marcados.' },
  { id: 'letra',      label: 'Letra completa', desc: 'Completar toda la columna de la letra elegida.' },
]

const LETTERS = ['B', 'I', 'N', 'G', 'O']

export const WinPatternSelector = ({
  pattern, onSetPattern,
  targetLetter, onSetTargetLetter, onDrawTargetLetter,
  drawAllLetters, onSetDrawAllLetters,
}) => {
  const active = PATTERNS.find(p => p.id === pattern)

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
        Patron de esta ronda
      </p>

      <div className="grid grid-cols-5 gap-1">
        {PATTERNS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSetPattern(pattern === id ? null : id)}
            className={`py-2 px-1 rounded-lg text-[10.5px] font-bold leading-tight transition-colors ${
              pattern === id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {pattern === 'letra' && (
        <div className="flex items-center gap-1 justify-center">
          {LETTERS.map(l => (
            <button
              key={l}
              onClick={() => onSetTargetLetter(l)}
              className={`w-9 h-9 rounded-lg font-black text-sm transition-colors ${
                targetLetter === l
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {l}
            </button>
          ))}
          <button
            onClick={onDrawTargetLetter}
            title="Sortear letra al azar"
            className="w-9 h-9 rounded-lg bg-amber-50 hover:bg-amber-100 text-base transition-colors"
          >
            &#x1F3B2;
          </button>
        </div>
      )}

      {pattern === 'letra' && (
        <label className="flex items-center justify-center gap-2 text-[11px] text-gray-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={drawAllLetters}
            onChange={e => onSetDrawAllLetters(e.target.checked)}
            className="w-3.5 h-3.5 accent-purple-600"
          />
          Sacar numeros de todas las letras
        </label>
      )}

      {pattern === 'letra' && !drawAllLetters && (
        <p className="text-[11px] text-amber-600 text-center leading-snug px-1">
          {targetLetter
            ? `Solo saldran numeros de la columna ${targetLetter}.`
            : 'Elegí una letra para restringir el sorteo a esa columna.'}
        </p>
      )}

      {active && (
        <p className="text-[11px] text-gray-400 text-center leading-snug px-1">
          {active.desc}
        </p>
      )}
    </div>
  )
}
