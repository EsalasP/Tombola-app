import React from 'react'
import { getBallInfo, BINGO_COLUMNS } from '../utils/colors'

// Loteria: 10 cols x 9 rows (numbers 1-90, left-to-right, top-to-bottom)
const LotteriaGrid = ({ drawnSet }) => (
  <div className="grid grid-cols-10 gap-1">
    {Array.from({ length: 90 }, (_, i) => i + 1).map(num => {
      const hit  = drawnSet.has(num)
      const info = getBallInfo(num, 'loteria')
      return (
        <div
          key={num}
          title={String(num)}
          className={`aspect-square flex items-center justify-center rounded text-xs font-bold transition-all duration-300 ${
            hit ? 'shadow-sm scale-105' : 'opacity-25'
          }`}
          style={
            hit
              ? { backgroundColor: info.bg, color: info.text }
              : { backgroundColor: '#e5e7eb', color: '#6b7280' }
          }
        >
          {num}
        </div>
      )
    })}
  </div>
)

// Bingo: 5 rows (B I N G O) x 15 numbers each — horizontal layout, no scroll needed
const BingoGrid = ({ drawnSet }) => (
  <div className="flex flex-col gap-1.5">
    {BINGO_COLUMNS.map(col => (
      <div key={col.letter} className="flex gap-1 items-center">
        {/* Letter badge */}
        <div
          className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center font-black text-sm select-none"
          style={{ backgroundColor: col.bg, color: col.text }}
        >
          {col.letter}
        </div>
        {/* 15 numbers */}
        {Array.from({ length: 15 }, (_, i) => col.min + i).map(num => {
          const hit = drawnSet.has(num)
          return (
            <div
              key={num}
              title={String(num)}
              className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold transition-all duration-300 ${
                hit ? 'shadow-sm scale-105' : 'opacity-25'
              }`}
              style={
                hit
                  ? { backgroundColor: col.bg, color: col.text }
                  : { backgroundColor: '#e5e7eb', color: '#6b7280' }
              }
            >
              {num}
            </div>
          )
        })}
      </div>
    ))}
  </div>
)

export const NumberGrid = ({ mode, drawn }) => {
  const drawnSet = new Set(drawn)
  return mode === 'loteria'
    ? <LotteriaGrid drawnSet={drawnSet} />
    : <BingoGrid   drawnSet={drawnSet} />
}
