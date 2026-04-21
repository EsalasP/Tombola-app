import React from 'react'
import { getBallInfo } from '../utils/colors'

export const RecentBalls = ({ drawn, mode }) => {
  const recent = drawn.slice(0, 7)

  if (recent.length === 0) {
    return (
      <p className="text-xs text-gray-300 text-center py-1 select-none">
        Sin numeros sacados aun
      </p>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-400 font-medium whitespace-nowrap select-none">
        Ultimos:
      </span>
      <div className="flex gap-1.5 flex-wrap">
        {recent.map((num, i) => {
          const info = getBallInfo(num, mode)
          return (
            <div
              key={`${num}-${i}`}
              title={info.letter ? `${info.letter}-${num}` : String(num)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 select-none"
              style={{
                backgroundColor: info.bg,
                color: info.text,
                opacity: 1 - i * 0.1,
              }}
            >
              {num}
            </div>
          )
        })}
      </div>
    </div>
  )
}
