import { useEffect, useMemo, useState } from 'react'
import styles from './NewItems.module.css'
import Button from '../../ui/Button/Button.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import Skeleton from '../../ui/Skeleton/Skeleton.jsx'
import { fetchTypes, fetchProducts } from '../../../api/productAPI.js'
import { dashIfEmpty } from '../../../utils/format.js'
import noImageBg from '../../../assets/images/no-image.png'

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

function NoImage() {
  return (
    <div className={styles.noImage} role="img" aria-label="Нет изображения">
      <span className={styles.noImageBg} style={{ backgroundImage: `url(${noImageBg})` }} />
      <span className={styles.noImageText}>Нет изображения</span>
    </div>
  )
}

const formatPrice = (price) =>
  price === null || price === undefined ? '–' : `${Math.round(price).toLocaleString('ru-RU')} ₽`

function productAlt(product) {
  const parts = []
  if (product.type?.name) parts.push(product.type.name)
  if (product.brand?.name) parts.push(product.brand.name)
  if (product.name) parts.push(product.name)
  return parts.join(', ')
}

export default function NewItems() {
  const [types, setTypes] = useState([])
  const [activeTypeId, setActiveTypeId] = useState(null)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [activeId, setActiveId] = useState(null)
  const [perView, setPerView] = useState(4)

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

  useEffect(() => {
    fetchTypes()
      .then((data) => {
        const rows = data?.rows || []
        setTypes(rows)
        if (rows.length > 0) {
          setActiveTypeId((current) => current ?? rows[0].id)
        }
      })
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    if (activeTypeId === null) return
    setIndex(0)
    setProductsLoading(true)
    fetchProducts({ typeId: activeTypeId, limit: 10 })
      .then((data) => {
        const rows = data?.rows || []
        setProducts(rows)
        setActiveId((current) => {
          if (rows.some((p) => p.id === current)) return current
          return rows[rows.length - 1]?.id ?? null
        })
        setProductsLoading(false)
      })
      .catch((error) => console.error(error))
  }, [activeTypeId])

  const featured = products.find((p) => p.id === activeId) || products[products.length - 1] || null

  const sliderItems = useMemo(() => {
    return [...products].slice(-10).reverse()
  }, [products])

  const lastIndex = Math.max(sliderItems.length - perView, 0)

  useEffect(() => {
    setIndex((current) => Math.min(current, lastIndex))
  }, [lastIndex])

  const goTo = (next) => {
    setIndex(Math.min(Math.max(next, 0), lastIndex))
  }

  const openCatalog = () => {
    const params = new URLSearchParams()
    if (activeTypeId) params.set('type', activeTypeId)
    if (featured?.brand?.id) params.set('brand', featured.brand.id)
    window.location.hash = `#catalog?${params.toString()}`
  }

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.plaque}>
            <h2 className={styles.title}>Новинки</h2>

            <div className={styles.tags}>
              {types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`${styles.tag} ${type.id === activeTypeId ? styles.tagActive : ''}`}
                  onClick={() => setActiveTypeId(type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>

            {productsLoading ? (
              <div className={styles.skeletonDetails}>
                <Skeleton height="16px" width="45%" radius="var(--radius-sm)" />
                <Skeleton height="16px" width="28%" radius="var(--radius-sm)" />
                <Skeleton height="16px" width="35%" radius="var(--radius-sm)" />
                <Skeleton height="16px" width="40%" radius="var(--radius-sm)" />
              </div>
            ) : (
            featured && (
              <dl className={styles.details}>
                <div className={styles.detail}>
                  <dt className={styles.detailLabel}>Название</dt>
                  <dd className={styles.detailValue}>{dashIfEmpty(featured.name)}</dd>
                </div>
                <div className={styles.detail}>
                  <dt className={styles.detailLabel}>Цена</dt>
                  <dd className={styles.detailValue}>{formatPrice(featured.price)}</dd>
                </div>
                <div className={styles.detail}>
                  <dt className={styles.detailLabel}>Бренд</dt>
                  <dd className={styles.detailValue}>{dashIfEmpty(featured.brand?.name)}</dd>
                </div>
                <div className={styles.detail}>
                  <dt className={styles.detailLabel}>Остаток на складе</dt>
                  <dd className={styles.detailValue}>{
                    featured.quantity === null || featured.quantity === undefined
                      ? '–'
                      : `${featured.quantity} шт`
                  }</dd>
                </div>
              </dl>
            )
            )}

            <div className={styles.actions}>
              <div className={styles.actionHeart}>
                <Button variant="outline" aria-label="В избранное">
                  <Icon name="favorite" />
                </Button>
              </div>
              <div className={styles.actionDetails}>
                <Button variant="outline" onClick={openCatalog}>Похожие</Button>
              </div>
            </div>
          </div>

          <div className={styles.sliderWrap}>
            <div className={styles.viewport}>
              <div className={styles.track} style={{ '--offset': `calc(-${index} * (100% / var(--cards) + var(--space) / var(--cards)))` }}>
                {productsLoading
                  ? Array.from({ length: perView }, (_, i) => (
                      <div className={styles.card} key={i}>
                        <Skeleton className={styles.skeletonFill} />
                      </div>
                    ))
                  : sliderItems.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className={`${styles.card} ${product.id === activeId ? styles.cardActive : ''}`}
                        onClick={() => setActiveId(product.id)}
                      >
                        {product.img && product.img !== 'temp' ? (
                          <img src={product.img} alt={productAlt(product)} loading="lazy" />
                        ) : (
                          <NoImage />
                        )}
                        <span className={styles.price}>{formatPrice(product.price)}</span>
                      </button>
                    ))}
              </div>
            </div>
            {!productsLoading && index > 0 && <Arrow direction="left" onClick={() => goTo(index - 1)} />}
            {!productsLoading && index < lastIndex && <Arrow direction="right" onClick={() => goTo(index + 1)} />}
          </div>
        </div>

        <div className={styles.image}>
          {productsLoading ? (
            <Skeleton className={styles.skeletonFill} />
          ) : featured?.img && featured.img !== 'temp' ? (
            <img src={featured.img} alt={productAlt(featured)} loading="lazy" />
          ) : (
            <NoImage />
          )}
        </div>
      </div>
    </section>
  )
}