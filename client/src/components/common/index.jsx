import React, { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

// Lazy load components for better performance
const LazyEventCard = lazy(() => import('../EventCard'))
const LazyLoginModal = lazy(() => import('../LoginModal'))

/**
 * Loading spinner component
 */
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-[3px]',
    large: 'w-12 h-12 border-4'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-solid border-brand-600 border-r-transparent ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Full-section loading state — use instead of a bare spinner whenever a page
 * region is fetching data, so loading always has consistent presence/copy.
 */
export const LoadingState = ({ label = 'Loading…', className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 py-20 text-center ${className}`}>
    <LoadingSpinner size="large" />
    <p className="text-sm font-medium text-midnight-400">{label}</p>
  </div>
)

/**
 * Error boundary component
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-midnight-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-midnight-500 mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Skeleton loader for cards
 */
export const CardSkeleton = () => (
  <div className="surface-panel p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-4 bg-midnight-100 rounded w-1/4"></div>
      <div className="h-6 bg-midnight-100 rounded w-16"></div>
    </div>
    <div className="h-6 bg-midnight-100 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-midnight-100 rounded w-full mb-4"></div>
    <div className="flex items-center gap-4 mb-4">
      <div className="h-4 bg-midnight-100 rounded w-20"></div>
      <div className="h-4 bg-midnight-100 rounded w-24"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-midnight-100 rounded w-16"></div>
      <div className="h-8 bg-midnight-100 rounded w-20"></div>
    </div>
  </div>
)

/**
 * Empty state component
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => (
  <div className="text-center py-16 px-6">
    {Icon && (
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-6 w-6" />
      </div>
    )}
    <h3 className="text-base font-semibold text-midnight-900 mb-1.5">{title}</h3>
    <p className="text-sm text-midnight-500 mb-6 max-w-sm mx-auto">{description}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary">
        {actionLabel}
      </button>
    )}
  </div>
)

/**
 * Optimized EventCard with lazy loading
 */
export const OptimizedEventCard = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<CardSkeleton />}>
      <LazyEventCard {...props} />
    </Suspense>
  </ErrorBoundary>
)

/**
 * Optimized LoginModal with lazy loading
 */
export const OptimizedLoginModal = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <LazyLoginModal {...props} />
    </Suspense>
  </ErrorBoundary>
)

/**
 * Fade in animation wrapper
 */
export const FadeIn = ({ children, delay = 0, className = '', y = 20 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

/**
 * Stagger container for lists
 */
export const StaggerContainer = ({ children, className = '' }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

/**
 * Stagger item for use within StaggerContainer
 */
export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 18 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

/* =========================================================================
   New design-system primitives (this redesign). Kept small and composable —
   prefer these over one-off className strings when building/editing pages.
   ========================================================================= */

/**
 * Button — the one button component the app should use going forward.
 * Existing raw <button className="btn-primary"> markup elsewhere still works
 * (those classes are defined in index.css), this just gives new code a typed API.
 */
export const Button = React.forwardRef(function Button(
  { as: Comp = 'button', variant = 'primary', size = 'md', icon: Icon, iconRight, className = '', children, ...props },
  ref
) {
  const variants = {
    primary: 'bg-brand-600 text-white shadow-glow hover:bg-brand-700',
    secondary: 'bg-midnight-100 text-midnight-800 hover:bg-midnight-200',
    ghost: 'border border-midnight-200 text-midnight-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
    dark: 'bg-midnight-900 text-white hover:bg-midnight-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    link: 'text-brand-700 hover:text-brand-800 !px-0 !py-0 !shadow-none bg-transparent',
  }
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }
  return (
    <Comp
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
      {iconRight && <ArrowUpRight className="h-4 w-4" />}
    </Comp>
  )
})

/** Small pill label — status, category, "AI", "New", etc. */
export const Badge = ({ children, variant = 'neutral', className = '', icon: Icon }) => {
  const variants = {
    neutral: 'bg-midnight-100 text-midnight-600',
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    glow: 'bg-glow-500/10 text-glow-600',
    dark: 'bg-white/10 text-white',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${variants[variant]} ${className}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}

/** Page-level header used across Events / Community / Lost & Found / Placements. */
export const PageHeader = ({ eyebrow, title, description, actions, dark = false }) => (
  <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${dark ? 'text-white' : ''}`}>
    <div className="max-w-2xl">
      {eyebrow && <span className={`eyebrow ${dark ? '!text-glow-400' : ''}`}>{eyebrow}</span>}
      <h1 className={`text-display mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.05] ${dark ? 'text-white' : 'text-midnight-900'}`}>
        {title}
      </h1>
      {description && (
        <p className={`mt-3 text-base leading-relaxed ${dark ? 'text-white/70' : 'text-midnight-500'}`}>{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-shrink-0 items-center gap-3">{actions}</div>}
  </div>
)

/** Reusable stat tile — used in dashboards / feature summaries. */
export const Stat = ({ label, value, hint, icon: Icon, dark = false }) => (
  <div className={`flex items-start gap-3 ${dark ? 'text-white' : ''}`}>
    {Icon && (
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${dark ? 'bg-white/10 text-glow-400' : 'bg-brand-50 text-brand-600'}`}>
        <Icon className="h-5 w-5" />
      </div>
    )}
    <div>
      <p className={`text-2xl font-display font-bold leading-none ${dark ? 'text-white' : 'text-midnight-900'}`}>{value}</p>
      <p className={`mt-1 text-xs font-medium ${dark ? 'text-white/60' : 'text-midnight-500'}`}>{label}</p>
      {hint && <p className="text-[11px] text-glow-600 font-semibold mt-0.5">{hint}</p>}
    </div>
  </div>
)
