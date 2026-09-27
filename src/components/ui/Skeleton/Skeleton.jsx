import styles from './Skeleton.module.css'

export default function Skeleton({ width, height, radius, className = '' }) {
  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(radius ? { borderRadius: radius } : {}),
  }
  return <span className={`${styles.skeleton} ${className}`} style={style} aria-hidden="true" />
}