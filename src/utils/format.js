export function dashIfEmpty(value) {
  if (value === null || value === undefined) return '–'
  return String(value).trim() === '' ? '–' : value
}