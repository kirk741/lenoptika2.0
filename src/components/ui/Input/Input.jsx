import styles from './Input.module.css'

export default function Input({ className, invalid, inputRef, ...props }) {
  return (
    <label className={styles.field}>
      <input
        ref={inputRef}
        className={`${styles.input} ${invalid ? styles.invalid : ''} ${className || ''}`}
        {...props}
      />
    </label>
  )
}