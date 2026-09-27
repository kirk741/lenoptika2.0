import { useEffect, useState } from 'react'
import styles from './TeamSlider.module.css'
import Button from '../../ui/Button/Button.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import Skeleton from '../../ui/Skeleton/Skeleton.jsx'
import { fetchStaff } from '../../../api/staffAPI.js'
import { dashIfEmpty } from '../../../utils/format.js'

function Arrow({ direction, onClick }) {
  const name = direction === 'left' ? 'arrowLeft' : 'arrowRight'
  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Предыдущий слайд' : 'Следующий слайд'}
      className={`${styles.arrow} ${direction === 'left' ? styles.arrowLeft : styles.arrowRight}`}
      onClick={onClick}
    >
      <Icon name={name} />
    </button>
  )
}

export default function TeamSlider() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(4)

  useEffect(() => {
    fetchStaff()
      .then((data) => {
        setStaff(
          (data?.rows || [])
            .map((member) => ({ ...member }))
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        )
        setLoading(false)
      })
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth
      if (width <= 1000) setPerView(2)
      else if (width <= 1280) setPerView(3)
      else setPerView(4)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  const lastIndex = Math.max(staff.length - perView, 0)

  useEffect(() => {
    setIndex((current) => Math.min(current, lastIndex))
  }, [lastIndex])

  const goTo = (next) => {
    setIndex(Math.min(Math.max(next, 0), lastIndex))
  }

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.section} id="team">
      <div className={styles.layout}>
        <aside className={styles.plaque}>
          <h2 className={styles.plaqueTitle}>Наша команда</h2>
          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt className={styles.statValue}>40000+</dt>
              <dd className={styles.statLabel}>выполненных заказов</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>от 7 дней</dt>
              <dd className={styles.statLabel}>изготовление сложных линз</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>17+ лет</dt>
              <dd className={styles.statLabel}>безупречной работы</dd>
            </div>
          </dl>
        </aside>
        <div className={styles.viewportWrap}>
          <div className={styles.viewport}>
            <div
              className={styles.track}
              style={{ '--offset': `calc(-${index} * (100% / var(--cards) + var(--space) / var(--cards)))` }}
            >
              {loading
                ? [1, 2, 3, 4].map((i) => (
                    <article className={styles.card} key={i}>
                      <div className={styles.photo}>
                        <Skeleton className={styles.skeletonPhoto} />
                      </div>
                      <div className={styles.info}>
                        <Skeleton width="70%" height="16px" radius="var(--radius-sm)" />
                        <Skeleton width="50%" height="16px" radius="var(--radius-sm)" />
                        <Skeleton width="40%" height="16px" radius="var(--radius-sm)" />
                        <Skeleton width="30%" height="16px" radius="var(--radius-sm)" />
                      </div>
                    </article>
                  ))
                : staff.map((member) => (
                <article className={styles.card} key={member.id}>
                  <div className={styles.photo}>
                    {member.photo ? (
                      <img src={member.photo} alt={`${member.name}, ${member.jobTitle}`} loading="lazy" />
                    ) : null}
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.name}>{dashIfEmpty(member.name)}</h3>
                    <p className={styles.job}>{dashIfEmpty(member.jobTitle)}</p>
                    <p className={styles.exp}>Стаж {
                      member.experience === null || member.experience === undefined
                        ? '–'
                        : `${member.experience} лет`
                    }</p>
                    {member.profileUrl && (
                      <a className={styles.more} href={member.profileUrl} target="_blank" rel="noreferrer">
                        Подробнее
                      </a>
                    )}
                  </div>
                </article>
                ))}
            </div>
          </div>
          <div className={styles.arrows}>
            {index > 0 && <Arrow direction="left" onClick={() => goTo(index - 1)} />}
            {index < lastIndex && <Arrow direction="right" onClick={() => goTo(index + 1)} />}
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.cta}>
            <Button variant="primary" onClick={scrollToBooking}>Проверить зрение</Button>
          </div>
        </div>
      </div>
    </section>
  )
}