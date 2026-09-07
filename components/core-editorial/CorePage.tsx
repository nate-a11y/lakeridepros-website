import type { ComponentProps } from 'react'
import styles from './core-editorial.module.css'

/** Public editorial pages use a deliberate white reading surface, independent of the site chrome. */
export default function CorePage({ children, className = '', ...props }: ComponentProps<'div'>) {
  return <div {...props} className={`${styles.page} ${className}`}>{children}</div>
}
