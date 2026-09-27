const API_URL = import.meta.env.VITE_API_URL || ''

export async function fetchStaff() {
  const response = await fetch(`${API_URL}/api/view/staff`)
  if (!response.ok) {
    throw new Error(`Ошибка загрузки команды: ${response.status}`)
  }
  return response.json()
}