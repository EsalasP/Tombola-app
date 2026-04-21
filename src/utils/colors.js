// Loteria: 10 groups of 9 numbers (1-90), each with a distinct color
export const LOTERIA_COLORS = [
  { bg: '#ef4444', text: '#ffffff' }, //  1-9   red
  { bg: '#f97316', text: '#ffffff' }, // 10-18  orange
  { bg: '#eab308', text: '#1a1a1a' }, // 19-27  yellow  (dark text for contrast)
  { bg: '#84cc16', text: '#ffffff' }, // 28-36  lime
  { bg: '#22c55e', text: '#ffffff' }, // 37-45  green
  { bg: '#14b8a6', text: '#ffffff' }, // 46-54  teal
  { bg: '#06b6d4', text: '#ffffff' }, // 55-63  cyan
  { bg: '#3b82f6', text: '#ffffff' }, // 64-72  blue
  { bg: '#8b5cf6', text: '#ffffff' }, // 73-81  violet
  { bg: '#ec4899', text: '#ffffff' }, // 82-90  pink
]

// Bingo: 5 columns (B-I-N-G-O), 15 numbers each
export const BINGO_COLUMNS = [
  { letter: 'B', bg: '#3b82f6', text: '#ffffff', min: 1,  max: 15 },
  { letter: 'I', bg: '#ef4444', text: '#ffffff', min: 16, max: 30 },
  { letter: 'N', bg: '#f97316', text: '#ffffff', min: 31, max: 45 },
  { letter: 'G', bg: '#22c55e', text: '#ffffff', min: 46, max: 60 },
  { letter: 'O', bg: '#8b5cf6', text: '#ffffff', min: 61, max: 75 },
]

/**
 * Returns { bg, text, letter } for a given number in a given mode.
 * letter is null for loteria, a capital letter for bingo.
 */
export const getBallInfo = (num, mode) => {
  if (mode === 'loteria') {
    const idx = Math.min(Math.floor((num - 1) / 9), 9)
    return { ...LOTERIA_COLORS[idx], letter: null }
  }
  const idx = Math.min(Math.floor((num - 1) / 15), 4)
  return { ...BINGO_COLUMNS[idx] }
}
