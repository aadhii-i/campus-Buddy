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
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-midnight-900 p-8 text-surface-50 transition-transform duration-300 hover:-translate-y-1 ${className}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-dots-dark" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-200/10" />
        <div className="relative flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-glow-400">
            <Icon className="h-6 w-6 text-midnight-900" />
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-glow-400 group-hover:bg-glow-400">
            <ArrowUpRight className="h-5 w-5 text-surface-50/60 transition-all duration-300 group-hover:text-midnight-900" />
          </span>
        </div>
        <span className="eyebrow-dark relative mt-8 self-start">AI-powered</span>
        <h3 className="text-display relative mt-4 text-3xl">{title}</h3>
        <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-surface-50/65">{description}</p>
        {stats && (
          <div className="relative mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="font-display text-2xl font-bold text-glow-400">{stat.value}</div>
                <div className="text-xs text-surface-50/55">{stat.label}</div>
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
        className={`group flex items-center gap-4 rounded-2xl border border-midnight-900/10 bg-brand-200/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-midnight-900/40 ${className}`}
      >
        <div className="icon-tile-dark h-11 w-11">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-midnight-900">{title}</h3>
          <p className="truncate text-sm text-midnight-600">{description}</p>
        </div>
        {href && <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-midnight-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-midnight-900" />}
      </CardWrapper>
    )
  }

  return (
    <CardWrapper
      {...cardProps}
      className={`group flex h-full cursor-pointer flex-col rounded-2xl border border-midnight-900/10 bg-surface-0 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-midnight-900/40 hover:shadow-card-hover ${className}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="icon-tile h-12 w-12 rounded-2xl">
          <Icon className="h-5.5 w-5.5" />
        </div>
        {href && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-midnight-900/15 transition-colors duration-300 group-hover:border-midnight-900 group-hover:bg-glow-400">
            <ArrowUpRight className="h-4.5 w-4.5 text-midnight-700 transition-colors duration-300 group-hover:text-midnight-900" />
          </span>
        )}
      </div>

      <h3 className="mb-2 text-lg font-bold text-midnight-900">
        {title}
      </h3>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-midnight-600">
        {description}
      </p>

      {stats && (
        <div className="grid grid-cols-2 gap-4 border-t border-midnight-900/10 pt-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="font-display text-xl font-bold text-midnight-900">{stat.value}</div>
              <div className="text-xs text-midnight-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </CardWrapper>
  )
}

export default FeatureCard
