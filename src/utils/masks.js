export function phoneDigits(raw) {
  return raw.replace(/\D/g, '').replace(/^7/, '').slice(0, 10)
}

export function phoneFill(raw) {
  const digits = phoneDigits(raw)
  const d = (i) => digits[i] ?? '_'
  return `+7 (${d(0)}${d(1)}${d(2)}) ${d(3)}${d(4)}${d(5)}-${d(6)}${d(7)}-${d(8)}${d(9)}`
}

export function buildPhone(raw) {
  const digits = phoneDigits(raw)
  if (!digits) return ''
  const d = (i) => digits[i] ?? ''
  if (digits.length <= 3) {
    return digits.length === 3 ? `+7 (${digits})` : `+7 (${digits}`
  }
  if (digits.length === 6) return `+7 (${d(0)}${d(1)}${d(2)}) ${d(3)}${d(4)}${d(5)}`
  if (digits.length >= 9) return `+7 (${d(0)}${d(1)}${d(2)}) ${d(3)}${d(4)}${d(5)}-${d(6)}${d(7)}-${d(8)}${d(9)}`
  return `+7 (${d(0)}${d(1)}${d(2)}) ${d(3)}${d(4)}${d(5)}-${d(6)}${d(7)}`
}

export function validPhone(raw) {
  return phoneDigits(raw).length === 10
}

export function formatNick(raw) {
  return raw.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 32)
}

export function formatTg(raw) {
  const nick = raw.replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 32)
  return nick ? `@${nick}` : '@'
}

export function validTg(raw) {
  const nick = raw.replace(/^@/, '')
  return /^[a-zA-Z0-9_]+$/.test(nick) && nick.length >= 3
}

export function formatEmail(raw) {
  return raw.replace(/[^a-zA-Z0-9@._+-]/g, '').replace(/\s/g, '').slice(0, 64)
}