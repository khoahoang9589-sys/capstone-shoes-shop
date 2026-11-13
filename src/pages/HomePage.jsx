// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Trang chủ — hiển thị danh sách sản phẩm giày từ API
// THAM KHẢO: reactjsbc97/src/pages/DemoAPI/GetAllProduct.jsx

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { themSPVaoGioHang } from '../redux/reducers/cartReducer'
import heroImg from '../assets/hero.png'

const API_URL = 'https://shop.cyberlearn.vn/api/Product'

const HomePage = () => {
  const [arrProduct, setArrProduct] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  // B1: Hàm gọi API lấy danh sách toàn bộ sản phẩm
  const getAllProduct = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_URL)
      setArrProduct(res.data.content || [])
    } catch (error) {
      console.log('Lỗi call API danh sách giày:', error)
    } finally {
      setLoading(false)
    }
  }

  // B2: useEffect gọi API 1 lần duy nhất khi component mount
  useEffect(() => {
    getAllProduct()
  }, [])

  return (
    <div className="home-page pb-5">
      {/* Banner giới thiệu */}
      <div className="card border-0 rounded-4 bg-primary text-white p-4 p-md-5 mb-5 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-7">
            <span className="badge bg-light text-primary mb-2">SHOES SHOP 2026</span>
            <h1 className="fw-bold mb-3">Bộ Sưu Tập Giày Thời Trang</h1>
            <p className="lead mb-4 text-white-50">
              Khám phá các mẫu giày thể thao chính hãng chất lượng cao với thiết kế hiện đại và êm ái.
            </p>
            <div className="d-flex gap-3">
              <a href="#danh-sach-sp" className="btn btn-light text-primary fw-semibold px-4">
                Mua ngay
              </a>
              <NavLink to="/search" className="btn btn-outline-light px-4">
                Tìm kiếm
              </NavLink>
            </div>
          </div>
          <div className="col-12 col-md-5 text-center">
            <img
              src={heroImg}
              alt="Shoes Shop Hero"
              className="img-fluid"
              style={{ maxHeight: '220px', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Tiêu đề danh sách */}
      <div id="danh-sach-sp" className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 fw-bold mb-0">Danh Sách Sản Phẩm</h2>
        <span className="text-muted small">Hiển thị {arrProduct.length} mẫu giày</span>
      </div>

      {/* Trạng thái Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải sản phẩm...</span>
          </div>
          <p className="text-muted mt-2">Đang tải danh sách giày...</p>
        </div>
      ) : (
        /* B3: Render danh sách sản phẩm dạng Grid */
        <div className="row g-4">
          {arrProduct.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <div className="card h-100 product-card shadow-sm border-0">
                <div className="bg-light p-3 text-center rounded-top">
                  <img
                    src={product.image}
                    className="img-fluid"
                    alt={product.name}
                    style={{ height: '160px', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-body d-flex flex-column p-3">
                  <h3 className="card-title h6 fw-bold text-capitalize text-truncate mb-2" title={product.name}>
                    {product.name}
                  </h3>
                  <p
                    className="card-text text-muted small flex-grow-1"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.shortDescription || product.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-5 fw-bold text-success">${product.price}</span>
                    <span className="badge bg-success-subtle text-success small">Còn hàng</span>
                  </div>
                  <div className="d-flex gap-2">
                    <NavLink to={`/detail/${product.id}`} className="btn btn-outline-primary btn-sm w-50">
                      Chi tiết
                    </NavLink>
                    <button
                      className="btn btn-primary btn-sm w-50"
                      onClick={() => {
                        dispatch(themSPVaoGioHang(product))
                        alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
                      }}
                    >
                      + Giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
