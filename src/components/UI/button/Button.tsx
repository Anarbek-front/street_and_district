import { forwardRef, type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './button.module.css'

export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, BtnProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            isLoading = false,
            disabled,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={clsx(
                    styles.button,
                    styles[variant],
                    styles[size],
                    fullWidth && styles.fullwidth,
                    isLoading && styles.loading,
                    className,
                )}
                {...props}
            >
                {isLoading ? 'Loading...' : children}
            </button>
        )
    },
)
