import React from 'react'

const LogoTile = ({ icon: Icon, label, gradient = 'from-blue-500 to-purple-600', size = 'md' }) => {
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
    <div className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${sizes[size]} shadow-md shrink-0`}>
      {Icon ? (
        <Icon className={`${iconSizes[size]} text-white`} />
      ) : (
        <span className="text-white font-bold">{initials}</span>
      )}
    </div>
  )
}

export default LogoTile
