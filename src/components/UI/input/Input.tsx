import { forwardRef, type InputHTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './input.module.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: string
    fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, fullWidth = false, className, ...props }, ref) => {
        return (
            <div className={clsx(fullWidth && styles.wrapper)}>
                <input
                    ref={ref}
                    {...props}
                    className={(styles.input, error && styles.error, className)}
                />
                {error && (
                    <span className={clsx(styles.errorText)}>{error}</span>
                )}
            </div>
        )
    },
)