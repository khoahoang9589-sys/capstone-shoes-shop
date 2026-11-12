import test from 'node:test'
import assert from 'node:assert/strict'
import { paginate, favoriteProducts, formatPrice, formatOrderDate } from '../src/services/profileData.js'

test('orders are paginated without dropping or duplicating records', () => {
  const orders = Array.from({ length: 5 }, (_, id) => ({ id }))
  const pages = [1, 2, 3].map(page => paginate(orders, page, 2))
  assert.deepEqual(pages.flatMap(page => page.items), orders)
  assert.equal(pages[2].pageCount, 3)
  assert.deepEqual(pages[2].items, [{ id: 4 }])
})

test('removing the last favorite on a page returns to a valid page', () => {
  const products = Array.from({ length: 7 }, (_, id) => ({ id }))
  assert.equal(paginate(products, 2, 6).items.length, 1)
  const remaining = products.filter(product => product.id !== 6)
  const result = paginate(remaining, 2, 6)
  assert.equal(result.page, 1)
  assert.equal(result.items.length, 6)
  assert.deepEqual(paginate([], 5, 6), { page: 1, pageCount: 1, items: [] })
})

test('favorites accept the API envelope and distinguish malformed responses from empty lists', () => {
  const products = [{ id: 1, name: 'Shoes' }]
  assert.deepEqual(favoriteProducts({ productsFavorite: products }), products)
  assert.deepEqual(favoriteProducts(products), products)
  assert.deepEqual(favoriteProducts({ productsFavorite: [] }), [])
  assert.throws(() => favoriteProducts({ message: 'Server error' }))
})

test('order values display real totals, zero prices, and missing dates', () => {
  assert.equal(formatPrice(19.99 * 3), '$59.97')
  assert.equal(formatPrice(0), '$0.00')
  assert.equal(formatPrice('invalid'), '—')
  assert.equal(formatOrderDate(null), 'Chưa có ngày đặt')
  assert.equal(formatOrderDate('invalid'), 'Chưa có ngày đặt')
  assert.match(formatOrderDate('2026-11-12T10:00:00+07:00'), /2026/)
})
