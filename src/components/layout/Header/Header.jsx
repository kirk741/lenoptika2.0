import { useEffect, useState } from 'react'
import styles from './Header.module.css'
import Button from '../../ui/Button/Button.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import logo from '../../../assets/logo.svg'

function IconButton({ label, icon }) {
  return (
    <button className={styles.iconButton} aria-label={label} type="button">
      <span className={styles.iconBox}>
        <Icon name={icon} />
      </span>
    </button>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1000px)')
    const onChange = (e) => setMobile(e.matches)
    setMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const className = [
    styles.header,
    scrolled ? styles.scrolled : '',
    mobile ? styles.mobile : '',
  ].join(' ')

  return (
    <header className={className}>
      <div className={styles.side}>
        <Button variant="ghost">Каталог</Button>
      </div>

      <div className={styles.logoWrap}>
        <img src={logo} className={styles.logo} alt="Леноптика" />
      </div>

      <div className={styles.side}>
        <IconButton label="Поиск" icon="search" />
        <IconButton label="Избранное" icon="favorite" />
        <IconButton label="Профиль" icon="user" />
        <IconButton label="Версия для слабовидящих" icon="eye" />
      </div>
    </header>
  )
}