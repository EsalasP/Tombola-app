import React from 'react'

const MODES = [
  { id: 'loteria', label: 'Loteria  1–90' },
  { id: 'bingo',   label: 'Bingo'         },
]

const BINGO_VARIANTS = [
  { id: '75', label: '75 bolas' },
  { id: '90', label: '90 bolas' },
]

export const ModeSelector = ({ mode, onSwitch, bingoVariant, onSwitchBingoVariant }) => (
  <div className="flex flex-wrap items-center gap-2">
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

    {mode === 'bingo' && (
      <div className="flex gap-1 bg-purple-50 p-1 rounded-xl">
        {BINGO_VARIANTS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSwitchBingoVariant(id)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              bingoVariant === id
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-purple-400 hover:text-purple-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    )}
  </div>
)
