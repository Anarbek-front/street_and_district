import { forwardRef, type SelectHTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './select.module.css'

export type Option = {
    id: number
    name: string
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    options: Option[]
    placeholder?: string
    error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ options, placeholder, error, className, ...props }, ref) => {
        console.log(options)

        return (
            <div className={clsx(styles.wrapper)}>
                <select
                    ref={ref}
                    className={clsx(
                        styles.select,
                        error && styles.error,
                        className,
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled hidden>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.id} value={opt.name}>
                            {opt.name}
                        </option>
                    ))}
                </select>
                {error && <span className={styles.errorText}>{error}</span>}
            </div>
        )
    },
)
