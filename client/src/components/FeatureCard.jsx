import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

// variant drives the visual treatment so an ecosystem grid doesn't read as N
// identical rectangles — 'spotlight' is the large dark hero tile, 'default'
// is a light elevated card, 'compact' is a leaner list-style tile.
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  stats,
  variant = 'default',
  className = '',
  onClick
}) => {
  const CardWrapper = href ? Link : 'div'
  const cardProps = href ? { to: href } : { onClick }

  if (variant === 'spotlight') {
    return (
      <CardWrapper
        {...cardProps}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-midnight-900 p-8 text-white shadow-card-hover transition-transform duration-300 hover:-translate-y-1 ${className}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-noise" />
        <div className="relative flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Icon className="h-6 w-6 text-glow-400" />
          </div>
          <ArrowUpRight className="h-5 w-5 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
        </div>
        <h3 className="text-display relative mt-6 text-2xl">{title}</h3>
        <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-white/60">{description}</p>
        {stats && (
          <div className="relative mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-5 pt-6">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="font-display text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </CardWrapper>
    )
  }

  if (variant === 'compact') {
    return (
      <CardWrapper
        {...cardProps}
        className={`group flex items-center gap-4 rounded-2xl border border-midnight-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${className}`}
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-midnight-900">{title}</h3>
          <p className="truncate text-sm text-midnight-500">{description}</p>
        </div>
        {href && <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-midnight-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600" />}
      </CardWrapper>
    )
  }

  return (
    <CardWrapper
      {...cardProps}
      className={`group flex h-full cursor-pointer flex-col rounded-2xl border border-midnight-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${className}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
          <Icon className="h-5.5 w-5.5 text-white" />
        </div>
        {href && (
          <ArrowUpRight className="h-5 w-5 text-midnight-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
        )}
      </div>

      <h3 className="mb-2 text-lg font-bold text-midnight-900 transition-colors duration-300 group-hover:text-brand-700">
        {title}
      </h3>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-midnight-500">
        {description}
      </p>

      {stats && (
        <div className="grid grid-cols-2 gap-4 border-t border-midnight-100 pt-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-xl font-bold text-brand-600">{stat.value}</div>
              <div className="text-xs text-midnight-400">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </CardWrapper>
  )
}

export default FeatureCard
