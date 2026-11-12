import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userApi, clearSession, profileErrorMessage } from '../services/auth'
import { paginate, favoriteProducts, formatPrice, formatOrderDate } from '../services/profileData'

function ProductImage({ src, name }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  return src && !failed
    ? <img className="activity-product-image" src={src} alt={name || 'Sản phẩm'} loading="lazy" onError={() => setFailed(true)} />
    : <span className="activity-product-image activity-image-placeholder" role="img" aria-label="Chưa có ảnh sản phẩm">—</span>
}

function Pagination({ page, pageCount, onChange, label }) {
  if (pageCount <= 1) return null
  const pages = [...new Set([1, page - 1, page, page + 1, pageCount])].filter(number => number >= 1 && number <= pageCount).sort((a, b) => a - b)
  return <nav aria-label={label} className="mt-4">
    <ul className="pagination justify-content-end flex-wrap gap-1 mb-0">
      <li className={`page-item${page === 1 ? ' disabled' : ''}`}><button type="button" className="page-link" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Trang trước">‹</button></li>
      {pages.map((number, index) => <li key={number} className="d-flex gap-1">
        {index > 0 && number - pages[index - 1] > 1 && <span className="page-link pagination-gap" aria-hidden="true">…</span>}
        <button type="button" className={`page-link${number === page ? ' active' : ''}`} aria-current={number === page ? 'page' : undefined} aria-label={`Trang ${number}`} onClick={() => onChange(number)}>{number}</button>
      </li>)}
      <li className={`page-item${page === pageCount ? ' disabled' : ''}`}><button type="button" className="page-link" disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Trang sau">›</button></li>
    </ul>
  </nav>
}

export default function ProfileActivity({ ordersHistory }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [orderPage, setOrderPage] = useState(1)
  const [favoritePage, setFavoritePage] = useState(1)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [removing, setRemoving] = useState(null)
  const orders = Array.isArray(ordersHistory) ? ordersHistory : []
  const orderPagination = paginate(orders, orderPage, 2)
  const favoritePagination = paginate(favorites, favoritePage, 6)

  function handleError(error, operation) {
    if ([401, 403].includes(error.response?.status)) {
      clearSession()
      navigate('/login', { replace: true, state: { from: '/profile' } })
    } else setError(profileErrorMessage(error, operation))
  }

  useEffect(() => {
    if (tab !== 'favorites') return
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setNotice('')
    userApi.get('/getproductfavorite', { signal: controller.signal })
      .then(({ data }) => setFavorites(favoriteProducts(data.content)))
      .catch(error => { if (!controller.signal.aborted) handleError(error, 'Tải sản phẩm yêu thích') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [tab, attempt])

  async function removeFavorite(productId) {
    setRemoving(productId)
    setError('')
    setNotice('')
    try {
      await userApi.get('/unlike', { params: { productId } })
      setFavorites(current => current.filter(product => product.id !== productId))
      setNotice('Đã bỏ sản phẩm khỏi danh sách yêu thích.')
    } catch (error) { handleError(error, 'Bỏ yêu thích') }
    finally { setRemoving(null) }
  }

  function handleTabKey(event) {
    const buttons = [...event.currentTarget.parentElement.querySelectorAll('[role="tab"]')]
    let index = buttons.indexOf(event.currentTarget)
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') index = (index + 1) % buttons.length
    else if (event.key === 'Home') index = 0
    else if (event.key === 'End') index = buttons.length - 1
    else return
    event.preventDefault()
    buttons[index].focus()
    buttons[index].click()
  }

  return <section className="card profile-activity mt-4" aria-label="Đơn hàng và sản phẩm yêu thích">
    <div className="profile-tabs" role="tablist" aria-label="Hoạt động tài khoản">
      {[['orders', 'Order history'], ['favorites', 'Favourite']].map(([id, label]) => <button key={id} id={`tab-${id}`} type="button" role="tab" aria-selected={tab === id} aria-controls={`panel-${id}`} tabIndex={tab === id ? 0 : -1} onKeyDown={handleTabKey} onClick={() => setTab(id)}>{label}</button>)}
    </div>
    <div id="panel-orders" role="tabpanel" aria-labelledby="tab-orders" tabIndex={0} hidden={tab !== 'orders'} className="activity-panel">
      <h2 className="visually-hidden">Lịch sử đơn hàng</h2>
      {!orders.length ? <div className="activity-empty"><p>Bạn chưa có đơn hàng nào.</p><Link to="/" className="btn btn-outline-primary">Khám phá sản phẩm</Link></div> : <>
        {orderPagination.items.map((order, index) => <article key={order.id ?? index} className="order-history">
          <h3 className="order-heading">Đơn hàng #{order.id ?? '—'} · Ngày đặt: {formatOrderDate(order.date)}</h3>
          <div className="table-responsive"><table className="table activity-table align-middle">
            <caption className="visually-hidden">Sản phẩm trong đơn hàng {order.id}</caption>
            <thead><tr><th scope="col">ID</th><th scope="col">Ảnh</th><th scope="col">Tên sản phẩm</th><th scope="col">Giá</th><th scope="col">Số lượng</th><th scope="col">Thành tiền</th></tr></thead>
            <tbody>{Array.isArray(order.orderDetail) && order.orderDetail.length ? order.orderDetail.map((item, itemIndex) => <tr key={`${item.id ?? itemIndex}-${itemIndex}`}>
              <td>{item.id ?? '—'}</td><td><ProductImage src={item.image} name={item.name} /></td>
              <td>{item.id != null ? <Link to={`/detail/${item.id}`}>{item.name || 'Sản phẩm'}</Link> : item.name || 'Sản phẩm'}</td>
              <td>{formatPrice(item.price)}</td><td>{item.quantity ?? '—'}</td><td>{item.price != null && item.quantity != null ? formatPrice(Number(item.price) * Number(item.quantity)) : '—'}</td>
            </tr>) : <tr><td colSpan={6} className="text-muted text-center py-4">Đơn hàng chưa có chi tiết sản phẩm.</td></tr>}</tbody>
          </table></div>
        </article>)}
        <p className="small text-muted mt-3 mb-0" role="status">Trang {orderPagination.page}/{orderPagination.pageCount} · {orders.length} đơn hàng</p>
        <Pagination {...orderPagination} onChange={setOrderPage} label="Phân trang lịch sử đơn hàng" />
      </>}
    </div>
    <div id="panel-favorites" role="tabpanel" aria-labelledby="tab-favorites" tabIndex={0} hidden={tab !== 'favorites'} className="activity-panel" aria-busy={loading}>
      <h2 className="visually-hidden">Sản phẩm yêu thích</h2>
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}<button type="button" className="btn btn-outline-primary ms-3" disabled={loading || removing !== null} onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div>}
      {loading ? <div className="activity-empty" role="status"><span className="spinner-border text-primary" aria-hidden="true" /><p className="mt-3">Đang tải sản phẩm yêu thích…</p></div> : !error && !favorites.length ? <div className="activity-empty"><p>Bạn chưa có sản phẩm yêu thích.</p><Link to="/" className="btn btn-outline-primary">Khám phá sản phẩm</Link></div> : !error && <>
        <div className="row g-3">{favoritePagination.items.map(product => <div key={product.id} className="col-sm-6 col-lg-4">
          <article className="favorite-card h-100">
            <Link to={`/detail/${product.id}`} className="favorite-image-link"><ProductImage src={product.image} name={product.name} /></Link>
            <h3 className="h6 mt-3"><Link to={`/detail/${product.id}`}>{product.name}</Link></h3>
            <p className="fw-bold text-primary">{formatPrice(product.price)}</p>
            <button className="btn btn-outline-danger mt-auto" type="button" disabled={removing !== null} onClick={() => removeFavorite(product.id)} aria-label={`Bỏ yêu thích ${product.name}`}>{removing === product.id ? 'Đang bỏ yêu thích…' : 'Bỏ yêu thích'}</button>
          </article>
        </div>)}</div>
        <p className="small text-muted mt-3 mb-0" role="status">Trang {favoritePagination.page}/{favoritePagination.pageCount} · {favorites.length} sản phẩm</p>
        <Pagination {...favoritePagination} onChange={setFavoritePage} label="Phân trang sản phẩm yêu thích" />
      </>}
    </div>
  </section>
}
