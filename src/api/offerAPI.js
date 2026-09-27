const API_URL = import.meta.env.VITE_API_URL || ''

export async function fetchOffers() {
  const response = await fetch(`${API_URL}/api/view/offers`)
  if (!response.ok) {
    throw new Error(`Ошибка загрузки акций: ${response.status}`)
  }
  return response.json()
}