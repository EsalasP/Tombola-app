import React from 'react'
import { getBallInfo } from '../utils/colors'

export const BallDisplay = ({ currentBall, animKey, mode, bingoVariant }) => {
  if (!currentBall) {
    return (
      <div className="flex items-center justify-center w-44 h-44 rounded-full bg-gray-100 select-none">
        <span className="text-6xl font-black text-gray-300">?</span>
      </div>
    )
  }

  const info = getBallInfo(currentBall, mode, bingoVariant)

  return (
    <div
      key={animKey}
      className="ball-bounce flex flex-col items-center justify-center w-44 h-44 rounded-full shadow-lg select-none"
      style={{ backgroundColor: info.bg }}
    >
      {info.letter && (
        <span
          className="font-black tracking-widest leading-none"
          style={{ color: info.text, opacity: 0.75, fontSize: 22 }}
        >
          {info.letter}
        </span>
      )}
      <span
        className="font-black leading-none"
        style={{ color: info.text, fontSize: currentBall >= 10 ? 72 : 84 }}
      >
        {currentBall}
      </span>
    </div>
  )
}
