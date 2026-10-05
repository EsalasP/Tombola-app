import React from 'react'
import { BINGO_COLUMNS } from '../utils/colors'

// Casilla libre en la posicion tradicional: centro del carton (columna N, fila 2)
const FREE_ROW = 2
const FREE_LETTER = 'N'

const isCellActive = (pattern, targetLetter, letter, row) => {
  switch (pattern) {
    case 'letra':      return letter === targetLetter
    case 'linea':      return row === 2
    case 'dos-lineas': return row === 1 || row === 3
    case 'full':       return true
    case 'figura':     return (row === 0 || row === 4) && (letter === 'B' || letter === 'O')
    default:           return false
  }
}

/**
 * Carton de muestra 5x5 (B-I-N-G-O) de referencia, con estrellas en vez de
 * numeros reales (para no confundir con numeros del sorteo). Resalta las
 * casillas que corresponden al patron de victoria elegido por el anfitrion.
 */
export const BingoSampleCard = ({ pattern, targetLetter }) => (
  <div>
    {/* Encabezado de letras */}
    <div className="grid grid-cols-5 gap-1 mb-1">
      {BINGO_COLUMNS.map(col => {
        const colActive = [0, 1, 2, 3, 4].some(row =>
          isCellActive(pattern, targetLetter, col.letter, row)
        )
        const dimmed = pattern && !colActive
        return (
          <div
            key={col.letter}
            className="flex items-center justify-center rounded-lg font-black text-lg aspect-square transition-all duration-300"
            style={{
              backgroundColor: col.bg,
              color: col.text,
              opacity: dimmed ? 0.3 : 1,
              transform: colActive ? 'scale(1.06)' : 'scale(1)',
              boxShadow: colActive ? `0 0 0 3px ${col.bg}55, 0 4px 14px ${col.bg}77` : 'none',
            }}
          >
            {col.letter}
          </div>
        )
      })}
    </div>

    {/* Cuerpo del carton */}
    <div className="grid grid-cols-5 gap-1">
      {[0, 1, 2, 3, 4].map(row =>
        BINGO_COLUMNS.map(col => {
          const isFree = row === FREE_ROW && col.letter === FREE_LETTER
          const active = isCellActive(pattern, targetLetter, col.letter, row)
          const dimmed = pattern && !active
          return (
            <div
              key={`${col.letter}-${row}`}
              className="flex items-center justify-center aspect-square rounded-lg border-2 transition-all duration-300"
              style={{
                borderColor: active ? col.bg : '#e5e7eb',
                backgroundColor: active ? `${col.bg}14` : '#ffffff',
                color: active ? col.bg : '#9ca3af',
                opacity: dimmed ? 0.35 : 1,
              }}
            >
              {isFree
                ? <span className="text-[8px] font-black tracking-tight">LIBRE</span>
                : <span className="text-base leading-none">&#9733;</span>}
            </div>
          )
        })
      )}
    </div>
  </div>
)
