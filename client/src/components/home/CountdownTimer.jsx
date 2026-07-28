import React, { useEffect, useState } from 'react'

const getTimeLeft = (target) => {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60)
  }
}

const CountdownTimer = ({ target, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target))

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 60000)
    return () => clearInterval(timer)
  }, [target])

  const units = [
    { label: 'd', value: timeLeft.days },
    { label: 'h', value: timeLeft.hours },
    { label: 'm', value: timeLeft.minutes }
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {units.map((unit) => (
        <div key={unit.label} className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[2.5rem]">
          <span className="text-sm font-bold text-white">{unit.value}</span>
          <span className="text-xs text-white/70 ml-0.5">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

export default CountdownTimer
