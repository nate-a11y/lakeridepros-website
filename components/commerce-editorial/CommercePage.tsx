import type { ComponentProps } from 'react'
import styles from './commerce-editorial.module.css'

/** Scope the public commerce presentation without changing transaction components. */
export default function CommercePage({ children, className = '', variant = 'default', ...props }: ComponentProps<'div'> & {
  variant?: 'default' | 'shop' | 'product' | 'cart' | 'receipt' | 'membership' | 'entry'
}) {
  return <div {...props} data-commerce-page={variant} className={`${styles.page} ${styles[variant] || ''} ${className}`}>{children}</div>
}
