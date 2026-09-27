const API_URL = import.meta.env.VITE_API_URL || ''

export async function fetchProducts(options = {}) {
  const params = new URLSearchParams()
  if (options.typeId) params.set('typeId', options.typeId)
  if (options.limit) params.set('limit', options.limit)
  const query = params.toString()
  const response = await fetch(`${API_URL}/api/products/items${query ? `?${query}` : ''}`)
  if (!response.ok) {
    throw new Error(`Ошибка загрузки товаров: ${response.status}`)
  }
  return response.json()
}

export async function fetchProduct(id) {
  const response = await fetch(`${API_URL}/api/products/items/${id}`)
  if (!response.ok) {
    throw new Error(`Ошибка загрузки товара: ${response.status}`)
  }
  return response.json()
}

export async function fetchTypes() {
  const response = await fetch(`${API_URL}/api/products/types`)
  if (!response.ok) {
    throw new Error(`Ошибка загрузки типов: ${response.status}`)
  }
  return response.json()
}