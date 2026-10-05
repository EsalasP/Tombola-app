import React from 'react'

const MODES = [
  { id: 'loteria', label: 'Loteria  1–90' },
  { id: 'bingo',   label: 'Bingo  1–75'   },
]

export const ModeSelector = ({ mode, onSwitch }) => (
  <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
    {MODES.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => onSwitch(id)}
        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
          mode === id
            ? 'bg-white text-purple-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
)
