import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { xoaSPKhoiGioHang, capNhatSoLuong, xoaTatCa } from '../redux/reducers/cartReducer'
import { userApi, getProfile } from '../services/auth'

const Carts = () => {
  const { mangSanPham } = useSelector((state) => state.cartReducer)
  const dispatch = useDispatch()
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [orderDone, setOrderDone] = useState(false)

  const tongSoLuong = mangSanPham.reduce((total, item) => total + item.soLuong, 0)

  const tongTien = mangSanPham.reduce((total, item) => total + item.price * item.soLuong, 0)

  const handleCheckout = async () => {
    if (mangSanPham.length === 0) return
    try {
      setLoadingOrder(true)
      const profileRes = await getProfile()
      const email = profileRes.data?.content?.email

      const orderData = {
        orderDetail: mangSanPham.map((item) => ({
          productId: String(item.id),
          quantity: item.soLuong,
        })),
        email: email,
      }

      await userApi.post('/order', orderData)

      dispatch(xoaTatCa())
      setOrderDone(true)
    } catch (error) {
      console.log('Lỗi gửi đơn hàng:', error)
      alert('Không thể hoàn tất đơn hàng. Vui lòng thử lại!')
    } finally {
      setLoadingOrder(false)
    }
  }

  if (orderDone) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: '500px' }}>
          <h2 className="text-success fw-bold mb-3">✓ Đặt Hàng Thành Công!</h2>
          <p className="text-muted mb-4">
            Cảm ơn bạn đã mua hàng tại Shoes Shop. Đơn hàng của bạn đã được ghi nhận.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <NavLink to="/profile" className="btn btn-primary">
              Xem lịch sử đơn hàng
            </NavLink>
            <NavLink to="/" className="btn btn-outline-secondary" onClick={() => setOrderDone(false)}>
              Tiếp tục mua sắm
            </NavLink>
          </div>
        </div>
      </div>
    )
  }

  if (mangSanPham.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm rounded-4">
          <h2 className="fw-bold mb-3">Giỏ hàng của bạn đang trống</h2>
          <p className="text-muted mb-4">Hãy chọn những mẫu giày ưng ý để thêm vào giỏ hàng nhé!</p>
          <div>
            <NavLink to="/" className="btn btn-primary px-4">
              Xem danh sách sản phẩm
            </NavLink>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 fw-bold mb-0">Carts</h2>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ?')) {
              dispatch(xoaTatCa())
            }
          }}
        >
          Xóa tất cả
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>id</th>
                <th>img</th>
                <th>name</th>
                <th>price</th>
                <th>quantity</th>
                <th>total</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {mangSanPham.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                    />
                  </td>
                  <td>
                    <NavLink to={`/detail/${item.id}`} className="text-decoration-none fw-semibold text-dark">
                      {item.name}
                    </NavLink>
                    {item.size && <div className="text-muted small">Size: {item.size}</div>}
                  </td>
                  <td className="fw-semibold">${item.price}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => dispatch(capNhatSoLuong({ id: item.id, soLuong: -1 }))}
                      >
                        -
                      </button>
                      <span className="fw-bold px-2">{item.soLuong}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => dispatch(capNhatSoLuong({ id: item.id, soLuong: 1 }))}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="fw-bold text-success">
                    ${(item.price * item.soLuong).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => dispatch(xoaSPKhoiGioHang(item.id))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan="4" className="fw-bold text-end">
                  Total:
                </td>
                <td className="fw-bold">{tongSoLuong}</td>
                <td className="fw-bold text-success fs-5">
                  ${tongTien.toLocaleString()}
                </td>
                <td>
                  <button
                    className="btn btn-warning fw-bold text-dark btn-sm w-100"
                    disabled={loadingOrder}
                    onClick={handleCheckout}
                  >
                    {loadingOrder ? 'Submitting...' : 'SUBMIT ORDER'}
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Carts
