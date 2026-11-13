// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Trang tìm kiếm + lọc giá sản phẩm bằng Lodash
// THAM KHẢO: Hướng dẫn PLAN.md & reactjsbc97

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { themSPVaoGioHang } from '../redux/reducers/cartReducer'

const API_URL = 'https://shop.cyberlearn.vn/api/Product'

const SearchPage = () => {
  const [arrProduct, setArrProduct] = useState([])
  const [keyword, setKeyword] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  // B1: Gọi API lấy toàn bộ sản phẩm
  const getAllProduct = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_URL)
      setArrProduct(res.data.content || [])
    } catch (error) {
      console.log('Lỗi call API tìm kiếm:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProduct()
  }, [])

  // B2 & B3: Lọc theo từ khóa và khoảng giá bằng Lodash (_.filter)
  let filteredProducts = arrProduct

  if (keyword.trim()) {
    filteredProducts = _.filter(filteredProducts, (sp) =>
      sp.name.toLowerCase().includes(keyword.trim().toLowerCase())
    )
  }

  if (minPrice !== '') {
    filteredProducts = _.filter(filteredProducts, (sp) => sp.price >= Number(minPrice))
  }

  if (maxPrice !== '') {
    filteredProducts = _.filter(filteredProducts, (sp) => sp.price <= Number(maxPrice))
  }

  return (
    <div className="search-page pb-5">
      <h2 className="h3 fw-bold mb-4">Tìm Kiếm Sản Phẩm</h2>

      {/* Thanh công cụ tìm kiếm và lọc giá */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Tên sản phẩm:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên giày (ví dụ: nike, vans...)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label fw-semibold">Giá từ ($):</label>
            <input
              type="number"
              className="form-control"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label fw-semibold">Giá đến ($):</label>
            <input
              type="number"
              className="form-control"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Số lượng kết quả */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-muted">
          Tìm thấy <strong className="text-primary">{filteredProducts.length}</strong> sản phẩm phù hợp
        </span>
        {(keyword || minPrice || maxPrice) && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setKeyword('')
              setMinPrice('')
              setMaxPrice('')
            }}
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Đang tải dữ liệu sản phẩm...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4">
          <p className="fs-1">🔍</p>
          <h4 className="fw-bold">Không tìm thấy sản phẩm nào</h4>
          <p className="text-muted">Thử nhập từ khóa khác hoặc điều chỉnh lại khoảng giá lọc.</p>
        </div>
      ) : (
        /* B4: Render danh sách kết quả dạng Grid Card */
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <div className="card h-100 product-card shadow-sm border-0">
                <div className="bg-light p-3 text-center rounded-top">
                  <img
                    src={product.image}
                    className="img-fluid"
                    alt={product.name}
                    style={{ height: '150px', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-body d-flex flex-column p-3">
                  <h3 className="card-title h6 fw-bold text-capitalize text-truncate mb-2" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="fs-5 fw-bold text-success mb-3">${product.price}</p>
                  <div className="d-flex gap-2 mt-auto">
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

export default SearchPage
