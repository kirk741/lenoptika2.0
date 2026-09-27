import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './BookingForm.module.css'
import Button from '../../ui/Button/Button.jsx'
import Input from '../../ui/Input/Input.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import Skeleton from '../../ui/Skeleton/Skeleton.jsx'
import { fetchSlots } from '../../../api/appointmentAPI.js'
import {
  phoneDigits,
  phoneFill,
  buildPhone,
  validPhone,
  formatTg,
  validTg,
  formatEmail,
} from '../../../utils/masks.js'

const wayConfig = [
  { kind: 'phone', label: 'Телефон', format: 'phone', placeholder: 'Номер телефона', icon: 'phone' },
  { kind: 'mail', label: 'Почта', format: 'email', placeholder: 'name@example.com', icon: 'mail' },
  { kind: 'telegram', label: 'Telegram', format: 'tg', placeholder: '@username', icon: 'telegram' },
  { kind: 'max', label: 'MAX', format: 'phone', placeholder: 'Номер телефона', icon: 'max' },
]

const defaultWays = wayConfig.map((config, index) => ({
  id: index + 1,
  kind: config.kind,
  label: config.label,
  format: config.format,
  placeholder: config.placeholder,
  icon: config.icon,
}))

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function formatByKind(format, raw) {
  if (format === 'phone') return phoneDigits(raw)
  if (format === 'email') return formatEmail(raw)
  return formatTg(raw)
}

function isValidByKind(format, value) {
  if (format === 'phone') return validPhone(value)
  if (format === 'email') return emailRegex.test(value)
  return validTg(value)
}

function mapError(format) {
  if (format === 'email') return 'Некорректный e-mail'
  if (format === 'phone') return 'Некорректный номер телефона'
  return 'Некорректный ник'
}

function FieldLabel({ children }) {
  return <span className={styles.label}>{children}</span>
}

export default function BookingForm(props) {
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [name, setName] = useState('')
  const [contactWay, setContactWay] = useState(defaultWays[0]?.id ?? null)
  const [contactValue, setContactValue] = useState('')
  const [contactFocused, setContactFocused] = useState(false)
  const phoneInputRef = useRef(null)
  const caretDigitsRef = useRef(0)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSlots()
      .then((data) => {
        setSlots(data?.rows || [])
        setSlotsLoading(false)
      })
      .catch((error) => console.error(error))
  }, [])

  const activeWay = defaultWays.find((way) => way.id === contactWay)

  useLayoutEffect(() => {
    if (!contactFocused || activeWay?.format !== 'phone') return
    const input = phoneInputRef.current
    if (!input) return
    const rendered = phoneFill(contactValue)
    let caret
    if (caretDigitsRef.current === 0) {
      const firstEmpty = rendered.indexOf('_')
      caret = firstEmpty === -1 ? rendered.length : firstEmpty
    } else {
      let seen = 0
      for (let i = 4; i < rendered.length; i++) {
        if (/\d/.test(rendered[i])) {
          seen += 1
          if (seen === caretDigitsRef.current) {
            caret = i + 1
            break
          }
        }
      }
    }
    input.setSelectionRange(caret ?? rendered.length, caret ?? rendered.length)
  }, [contactValue, contactFocused, activeWay?.format])

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = {}

    if (!name.trim()) {
      nextErrors.name = 'Введите имя'
    }

    const isEmptyContact = () => {
      const value = contactValue.trim()
      if (activeWay.format === 'phone') return !validPhone(value)
      if (activeWay.format === 'tg') return value === '' || value === '@'
      return value === ''
    }

    if (!activeWay) {
      nextErrors.contact = 'Способ связи недоступен'
    } else if (isEmptyContact()) {
      nextErrors.contact = 'Заполните контакт'
    } else if (!isValidByKind(activeWay.format, contactValue.trim())) {
      nextErrors.contact = mapError(activeWay.format)
    }

    if (!date) {
      nextErrors.date = 'Выберите дату'
    }

    if (!time) {
      nextErrors.time = 'Выберите время'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      console.log({
        name: name.trim(),
        contactMethodId: activeWay.id,
        contactValue: contactValue.trim(),
        date,
        time,
      })
    }
  }

  const handleDateChange = (e) => {
    const value = e.target.value
    setDate(value)
    setTime('')
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate {...props}>
      <h2 className={styles.title}>Записаться на проверку зрения</h2>

      <div className={styles.field}>
        <FieldLabel>Имя</FieldLabel>
        <Input
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
          }}
          invalid={!!errors.name}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <FieldLabel>Способ связи</FieldLabel>
        <div className={styles.contactRow}>
          <div className={styles.socials} role="radiogroup" aria-label="Способ связи">
            {defaultWays.map((way) => (
              <label
                key={way.id}
                className={`${styles.socialBtn} ${way.id === contactWay ? styles.socialActive : ''}`}
              >
                <input
                  type="radio"
                  name="contactWay"
                  value={way.id}
                  aria-label={way.label}
                  checked={contactWay === way.id}
                  onChange={() => {
                    setContactWay(way.id)
                    setContactValue('')
                    caretDigitsRef.current = 0
                    setErrors((prev) => ({ ...prev, contact: undefined }))
                  }}
                />
                <span className={styles.socialPlate}>
                  <Icon name={way.icon} size="lg" />
                </span>
              </label>
            ))}
          </div>
          <div className={styles.contactInput}>
            <Input
              inputRef={phoneInputRef}
              placeholder={activeWay?.placeholder}
              inputMode={
                activeWay?.format === 'phone'
                  ? 'tel'
                  : activeWay?.format === 'email'
                    ? 'email'
                    : undefined
              }
              value={
                activeWay?.format === 'phone'
                  ? contactFocused
                    ? phoneFill(contactValue)
                    : buildPhone(contactValue)
                  : contactValue
              }
              onFocus={() => setContactFocused(true)}
              onBlur={() => setContactFocused(false)}
              onChange={(e) => {
                const before = e.target.value.slice(0, e.target.selectionStart ?? 0)
                const digitsBefore = (before.match(/\d/g) || []).length - (before.startsWith('+7') ? 1 : 0)
                caretDigitsRef.current = Math.max(0, digitsBefore)
                setContactValue(formatByKind(activeWay?.format, e.target.value))
                if (errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }))
              }}
              invalid={!!errors.contact}
            />
          </div>
        </div>
        {errors.contact && <span className={styles.error}>{errors.contact}</span>}
      </div>

      <div className={`${styles.field} ${styles.dateField}`}>
        <FieldLabel>Дата</FieldLabel>
        <Input
          type="date"
          value={date}
          onChange={handleDateChange}
          invalid={!!errors.date}
        />
        {errors.date && <span className={styles.error}>{errors.date}</span>}
      </div>

      <div className={styles.field}>
        <FieldLabel>Доступное время</FieldLabel>
        <div className={`${styles.timesBox} ${errors.time ? styles.timesInvalid : ''}`}>
          {slotsLoading ? (
            <>
              <Skeleton className={styles.skeletonTime} />
              <Skeleton className={styles.skeletonTime} />
              <Skeleton className={styles.skeletonTime} />
              <Skeleton className={styles.skeletonTime} />
            </>
          ) : !date ? (
            <span className={styles.timesEmpty}>Выберите дату</span>
          ) : slots.length === 0 ? (
            <span className={styles.timesEmpty}>Нет доступного времени</span>
          ) : (
            slots.map((slot) => {
              const value = slot.time.slice(0, 5)
              return (
                <button
                  key={slot.id}
                  type="button"
                  className={`${styles.timeBtn} ${value === time ? styles.timeActive : ''}`}
                  onClick={() => {
                    setTime(value)
                    setErrors((prev) => ({ ...prev, time: undefined }))
                  }}
                >
                  {value}
                </button>
              )
            })
          )}
        </div>
        {errors.time && <span className={styles.error}>{errors.time}</span>}
      </div>

      <Button variant="primary">Подтвердить</Button>
    </form>
  )
}