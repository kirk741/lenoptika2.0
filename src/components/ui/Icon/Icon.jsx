import styles from './Icon.module.css'
import {
  Search,
  Favorite,
  User,
  Eye,
  Hamburger,
  Phone,
  Mail,
  Telegram,
  Max,
  ArrowLeft,
  ArrowRight,
  Location,
  Clock,
} from '../../../assets/icons/index.js'

const icons = {
  search: Search,
  favorite: Favorite,
  user: User,
  eye: Eye,
  hamburger: Hamburger,
  phone: Phone,
  mail: Mail,
  telegram: Telegram,
  max: Max,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  location: Location,
  clock: Clock,
}

export default function Icon({ name, size = 'md' }) {
  const Component = icons[name]
  if (!Component) return null

  const className = size === 'lg' ? `${styles.icon} ${styles.lg}` : styles.icon

  return (
    <span className={className} aria-hidden="true">
      <Component />
    </span>
  )
}