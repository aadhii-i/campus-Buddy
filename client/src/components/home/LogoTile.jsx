import React from 'react'

// Palette variants for monogram/icon tiles. The legacy `gradient` prop (a
// Tailwind gradient string, still present in data/DB records) is accepted for
// compatibility but no longer drives colour — the variant is derived from the
// label so the same club/company always gets the same tile.
const VARIANTS = [
  'bg-midnight-900 text-glow-400',
  'bg-brand-200 text-midnight-900 border border-midnight-900/10',
  'bg-glow-400 text-midnight-900 border border-midnight-900/10',
]

const pickVariant = (label = '') => {
  let hash = 0
  for (let i = 0; i < label.length; i += 1) hash = (hash * 31 + label.charCodeAt(i)) >>> 0
  return VARIANTS[hash % VARIANTS.length]
}

const LogoTile = ({ icon: Icon, label, size = 'md' }) => {
  const sizes = {
    sm: 'w-10 h-10 rounded-lg',
    md: 'w-14 h-14 rounded-xl',
    lg: 'w-20 h-20 rounded-2xl'
  }
  const iconSizes = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' }

  const initials = label
    ? label.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <div className={`flex items-center justify-center ${pickVariant(label)} ${sizes[size]} shrink-0`}>
      {Icon ? (
        <Icon className={iconSizes[size]} />
      ) : (
        <span className="font-display font-bold">{initials}</span>
      )}
    </div>
  )
}

export default LogoTile
