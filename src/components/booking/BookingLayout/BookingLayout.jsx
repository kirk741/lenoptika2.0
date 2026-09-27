import { useEffect, useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import styles from './BookingLayout.module.css'
import BookingForm from '../BookingForm/BookingForm.jsx'
import Button from '../../ui/Button/Button.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import Skeleton from '../../ui/Skeleton/Skeleton.jsx'
import { fetchOffers } from '../../../api/offerAPI.js'
import { fetchProduct } from '../../../api/productAPI.js'
import { dashIfEmpty } from '../../../utils/format.js'
import noImageBg from '../../../assets/images/no-image.png'

const sanitize = (html) => DOMPurify.sanitize(html, { ALLOWED_TAGS: ['mark', 'br', 'strong', 'em', 'span'] })

function productAlt(product) {
  const parts = []
  if (product.type?.name) parts.push(product.type.name)
  if (product.brand?.name) parts.push(product.brand.name)
  if (product.name) parts.push(product.name)
  return parts.join(', ')
}

export default function BookingLayout() {
  const [offers, setOffers] = useState([])
  const [offersLoading, setOffersLoading] = useState(true)
  const [goods, setGoods] = useState([])
  const [goodsLoading, setGoodsLoading] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetchOffers()
      .then((data) => {
        setOffers(data?.rows || [])
        setOffersLoading(false)
      })
      .catch((error) => console.error(error))
  }, [])

  const latest = useMemo(() => {
    if (offers.length === 0) return null
    return [...offers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
  }, [offers])

  const productIds = useMemo(() => {
    const raw = latest?.offerProducts || []
    return Array.isArray(raw) ? raw : []
  }, [latest])

  useEffect(() => {
    if (productIds.length === 0) {
      setGoods([])
      setGoodsLoading(false)
      return
    }
    let cancelled = false
    setGoodsLoading(true)
    Promise.all(productIds.map((id) => fetchProduct(id)))
      .then((items) => {
        if (!cancelled) {
          setGoods(items.filter(Boolean))
          setGoodsLoading(false)
        }
      })
      .catch((error) => console.error(error))
    return () => {
      cancelled = true
    }
  }, [productIds])

  const visibleCount = 2
  const lastIndex = Math.max(goods.length - visibleCount, 0)

  useEffect(() => {
    setIndex((current) => Math.min(current, lastIndex))
  }, [lastIndex])

  const goTo = (next) => {
    setIndex(Math.min(Math.max(next, 0), lastIndex))
  }

  return (
    <div className={styles.layout}>
      <BookingForm id="booking" />
      <div className={styles.promo}>
        {latest ? (
          <div className={styles.promoCard}>
            <h2
              className={styles.promoTitle}
              dangerouslySetInnerHTML={{ __html: sanitize(latest.title) }}
            />
            <div
              className={styles.promoDescription}
              dangerouslySetInnerHTML={{ __html: sanitize(latest.description) }}
            />
            <div className={styles.promoButton}>
              <Button variant="outline">В каталог</Button>
            </div>
          </div>
        ) : offersLoading ? (
          <div className={styles.promoCard}>
            <Skeleton width="70%" height="20px" radius="var(--radius-sm)" />
            <Skeleton width="100%" height="16px" radius="var(--radius-sm)" />
            <Skeleton width="90%" height="16px" radius="var(--radius-sm)" />
            <Skeleton width="100%" height="var(--btn-height)" radius="var(--radius-sm)" />
          </div>
        ) : null}
        {(goodsLoading || offersLoading) ? (
          <div className={styles.sliderWrap}>
            <div className={styles.track}>
              <div className={`${styles.promoGood} ${styles.skeletonGood}`}>
                <Skeleton className={styles.skeletonBlock} />
              </div>
              <div className={`${styles.promoGood} ${styles.skeletonGood}`}>
                <Skeleton className={styles.skeletonBlock} />
              </div>
            </div>
          </div>
        ) : goods.length > 0 && (
          <div className={styles.sliderWrap}>
            <div className={styles.viewport}>
              <div
                className={styles.track}
                style={{ '--offset': `calc(-${index} * (100% / var(--goods-cards) + var(--space) / var(--goods-cards)))` }}
              >
                {goods.map((product) => (
                  <div className={styles.promoGood} key={product.id}>
                    {product.img && product.img !== 'temp' ? (
                      <img
                        src={product.img}
                        alt={productAlt(product)}
                        className={styles.promoGoodImg}
                        loading="lazy"
                      />
                    ) : (
<div className={styles.noImage} role="img" aria-label="Нет изображения">
  <span className={styles.noImageBg} style={{ backgroundImage: `url(${noImageBg})` }} />
  <span className={styles.noImageText}>Нет изображения</span>
</div>
                    )}
                    <div className={styles.promoGoodOverlay} />
                    <div className={styles.promoGoodText}>
                      <h3 className={styles.promoGoodName}>{dashIfEmpty(product.name)}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {index > 0 && (
              <button
                type="button"
                aria-label="Предыдущий слайд"
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={() => goTo(index - 1)}
              >
                <Icon name="arrowLeft" />
              </button>
            )}
            {index < lastIndex && (
              <button
                type="button"
                aria-label="Следующий слайд"
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={() => goTo(index + 1)}
              >
                <Icon name="arrowRight" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}