import styles from './Footer.module.css'
import Button from '../../ui/Button/Button.jsx'
import Icon from '../../ui/Icon/Icon.jsx'

const contacts = [
  { icon: 'phone', label: 'Телефон', href: 'tel:+71234567890' },
  { icon: 'mail', label: 'Почта', href: 'mailto:info@lenoptika.ru' },
  { icon: 'telegram', label: 'Telegram', href: 'https://t.me/lenoptika' },
  { icon: 'max', label: 'MAX', href: '#' },
]

const navigation = [
  { label: 'Каталог', href: '#catalog' },
  { label: 'Наша команда', href: '#team' },
  { label: 'Записаться на приём', href: '#booking' },
]

const scrollToTarget = (e, href) => {
  e.preventDefault()
  const id = href.replace('#', '')
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <h2 className={styles.title}>Как нас найти</h2>
          <div className={styles.mapBox}>
            <div className={styles.mapFrame}>
              <a
                href="https://yandex.ru/maps/org/lenoptika/179375721391/?utm_medium=mapframe&utm_source=maps"
                className={styles.mapLink}
              >
                ЛенОптика
              </a>
              <a
                href="https://yandex.ru/maps/2/saint-petersburg/category/optics/184106052/?utm_medium=mapframe&utm_source=maps"
                className={styles.mapLink}
              >
                Оптика в Санкт-Петербурге
              </a>
              <iframe
                className={styles.map}
                src="https://yandex.ru/map-widget/v1/org/lenoptika/179375721391/?from=mapframe&ll=30.210093%2C59.982179&z=14"
                title="Леноптика в Питерлэнде на карте"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>
              <Icon name="location" size="lg" />
            </span>
            <span>ТРК Питерлэнд, Приморский пр. 72, 1 этаж</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>
              <Icon name="clock" size="lg" />
            </span>
            <span>Ежедневно 10:00-22:00</span>
          </div>
          <div className={styles.copyright}>© 2026 ЛенОПТИКА</div>
        </div>

        <div className={styles.col}>
          <h2 className={styles.title}>Контакты</h2>
          <div className={styles.contactRow}>
            <div className={styles.contactIcons}>
              {contacts.map((contact) => (
                <a
                  key={contact.icon}
                  className={styles.contactLink}
                  href={contact.href}
                  aria-label={contact.label}
                >
                  <Icon name={contact.icon} size="lg" />
                </a>
              ))}
            </div>
            <a className={styles.phone} href="tel:+71234567890">
              +7 123 456 78 90
            </a>
          </div>
          <div className={styles.cta}>
            <Button
              variant="outline"
              onClick={(e) => scrollToTarget(e, '#booking')}
            >
              Записаться на приём
            </Button>
          </div>

          <h2 className={`${styles.title} ${styles.section}`}>Навигация</h2>
          <nav className={styles.links}>
            {navigation.map((item) => (
              <a
                key={item.label}
                className={styles.link}
                href={item.href}
                onClick={(e) => scrollToTarget(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <h2 className={`${styles.title} ${styles.section}`}>Документы</h2>
          <nav className={styles.links}>
            <a className={styles.link} href="#">
              Политика конфиденциальности
            </a>
            <a className={styles.link} href="#">
              Лицензии и реквизиты
            </a>
          </nav>

          <p className={styles.notice}>
            Информация на сайте носит ознакомительный характер и не является публичной офертой.
            Имеются противопоказания. Необходима консультация специалиста.
          </p>
        </div>
      </div>
    </footer>
  )
}