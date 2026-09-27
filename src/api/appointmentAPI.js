const API_URL = import.meta.env.VITE_API_URL || ''

export async function fetchSlots() {
  const response = await fetch(`${API_URL}/api/appointment/slots`)
  if (!response.ok) {
    throw new Error(`Ошибка загрузки слотов: ${response.status}`)
  }
  return response.json()
}

export async function fetchContactMethods() {
  const response = await fetch(`${API_URL}/api/appointment/contact_methods`)
  if (!response.ok) {
    throw new Error(`Ошибка загрузки способов связи: ${response.status}`)
  }
  return response.json()
}