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
    <div className={`inline-block animate-spin rounded-full border-solid border-midnight-900 border-r-transparent ${sizeClasses[size]} ${className}`}>
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
    <p className="text-sm font-medium text-midnight-500">{label}</p>
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
        <div className="min-h-[200px] flex items-center justify-center p-6">
          <div className="surface-panel max-w-sm px-8 py-10 text-center">
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
  <div className="surface-panel p-6" aria-hidden="true">
    <div className="flex justify-between items-start mb-4">
      <div className="skeleton h-4 w-1/4"></div>
      <div className="skeleton h-6 w-16 !rounded-full"></div>
    </div>
    <div className="skeleton h-6 w-3/4 mb-2"></div>
    <div className="skeleton h-4 w-full mb-4"></div>
    <div className="flex items-center gap-4 mb-4">
      <div className="skeleton h-4 w-20"></div>
      <div className="skeleton h-4 w-24"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="skeleton h-4 w-16"></div>
      <div className="skeleton h-9 w-24 !rounded-full"></div>
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
  <div className="rounded-2xl border border-dashed border-midnight-900/20 bg-surface-0/60 text-center py-16 px-6">
    {Icon && (
      <div className="icon-tile mx-auto mb-4 h-14 w-14 rounded-2xl">
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
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    dark: 'btn-primary',
    danger: 'btn-danger',
    link: 'link inline-flex items-center gap-1.5',
  }
  const sizes = {
    sm: '!px-3.5 !py-1.5 !text-xs',
    md: '',
    lg: '!px-6 !py-3.5 !text-base',
  }
  return (
    <Comp
      ref={ref}
      className={`${variants[variant] || variants.primary} ${variant === 'link' ? '' : sizes[size]} ${className}`}
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
    neutral: 'badge-neutral',
    brand: 'badge-lilac',
    lilac: 'badge-lilac',
    lime: 'badge-lime',
    ink: 'badge-ink',
    outline: 'badge-outline',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    glow: 'badge-lime',
    dark: 'badge bg-white/10 text-surface-50',
  }
  return (
    <span className={`${variants[variant] || variants.neutral} ${className}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}

/** Page-level header used across Events / Community / Lost & Found / Placements. */
export const PageHeader = ({ eyebrow, title, description, actions, dark = false }) => (
  <div className={`flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between ${dark ? 'border-white/10 text-surface-50' : 'border-midnight-900/10'}`}>
    <div className="max-w-2xl">
      {eyebrow && <span className={dark ? 'eyebrow-dark' : 'eyebrow'}>{eyebrow}</span>}
      <h1 className={`text-display mt-4 text-3xl sm:text-4xl lg:text-[2.9rem] leading-[1.05] ${dark ? 'text-surface-50' : 'text-midnight-900'}`}>
        {title}
      </h1>
      {description && (
        <p className={`mt-3 text-base leading-relaxed ${dark ? 'text-surface-50/70' : 'text-midnight-500'}`}>{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-3">{actions}</div>}
  </div>
)

/** Reusable stat tile — used in dashboards / feature summaries. */
export const Stat = ({ label, value, hint, icon: Icon, dark = false }) => (
  <div className={`flex items-start gap-3 ${dark ? 'text-surface-50' : ''}`}>
    {Icon && (
      <div className={`h-10 w-10 ${dark ? 'icon-tile-dark border border-white/10' : 'icon-tile'}`}>
        <Icon className="h-5 w-5" />
      </div>
    )}
    <div>
      <p className={`text-2xl font-display font-bold leading-none ${dark ? 'text-surface-50' : 'text-midnight-900'}`}>{value}</p>
      <p className={`mt-1 text-xs font-medium ${dark ? 'text-surface-50/60' : 'text-midnight-500'}`}>{label}</p>
      {hint && (
        <p className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${dark ? 'bg-glow-400 text-midnight-900' : 'bg-glow-400 text-midnight-900'}`}>{hint}</p>
      )}
    </div>
  </div>
)

/** Reusable alert — one notification per failed operation, themed by tone. */
export const Alert = ({ tone = 'info', icon: Icon, title, children, action, className = '' }) => (
  <div role={tone === 'error' ? 'alert' : 'status'} className={`alert-${tone} ${className}`}>
    {Icon && <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />}
    <div className="min-w-0 flex-1">
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)

/**
 * Marquee — seamless horizontal loop. Renders children twice inside the
 * track so translateX(-50%) lands exactly on the start of the second copy.
 * The duplicate is aria-hidden and hidden entirely for reduced motion.
 */
export const Marquee = ({ children, reverse = false, className = '', gap = 'gap-4' }) => (
  <div className={`marquee pause-on-hover mask-fade-x ${className}`}>
    <div className={`marquee-track ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
      <div className={`flex shrink-0 items-stretch ${gap} ${gap.replace('gap-', 'pr-')}`}>{children}</div>
      <div className={`flex shrink-0 items-stretch ${gap} ${gap.replace('gap-', 'pr-')}`} aria-hidden="true" data-marquee-duplicate>
        {children}
      </div>
    </div>
  </div>
)
