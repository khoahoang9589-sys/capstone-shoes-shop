export function paginate(items, requestedPage, pageSize) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.max(1, Math.min(requestedPage, pageCount))
  return { page, pageCount, items: items.slice((page - 1) * pageSize, page * pageSize) }
}

export function favoriteProducts(content) {
  const products = Array.isArray(content) ? content : content?.productsFavorite
  if (!Array.isArray(products)) throw new Error('Invalid favorite products response')
  return products
}

export function formatPrice(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) : '—'
}

export function formatOrderDate(value) {
  if (!value) return 'Chưa có ngày đặt'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Chưa có ngày đặt' : date.toLocaleDateString('vi-VN')
}
