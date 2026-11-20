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
  const [sortOrder, setSortOrder] = useState('')
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const getAllProduct = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_URL)
      const listProduct = (res.data.content || []).filter((item) => item.feature)
      setArrProduct(listProduct)
    } catch (error) {
      console.log('Lỗi call API tìm kiếm:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProduct()
  }, [])

  let filteredProducts = arrProduct

  if (keyword.trim()) {
    filteredProducts = _.filter(filteredProducts, (sp) =>
      sp.name.toLowerCase().includes(keyword.trim().toLowerCase())
    )
  }

  if (sortOrder === 'decrease') {
    filteredProducts = _.orderBy(filteredProducts, ['price'], ['desc'])
  } else if (sortOrder === 'ascending') {
    filteredProducts = _.orderBy(filteredProducts, ['price'], ['asc'])
  }

  return (
    <div className="search-page pb-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <label htmlFor="search-input" className="form-label fw-bold fs-5 mb-2">Search</label>
        <div className="row g-2">
          <div className="col-12 col-md-9">
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="product name ...."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <button
              type="button"
              className="btn btn-primary w-100 fw-bold"
              onClick={() => {}}
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>

      <div
        className="p-3 text-white rounded-3 mb-4 fw-bold fs-4"
        style={{ background: 'linear-gradient(90deg, #E21B90 0%, #1B02B5 100%)' }}
      >
        Search result
      </div>

      <div className="row align-items-center mb-4 g-3">
        <div className="col-12 col-sm-6 col-md-4">
          <label htmlFor="price-sort" className="form-label fw-bold mb-1">Price</label>
          <select
            id="price-sort"
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">-- Chọn sắp xếp giá --</option>
            <option value="decrease">decrease</option>
            <option value="ascending">ascending</option>
          </select>
        </div>
        <div className="col-12 col-sm-6 col-md-8 text-sm-end">
          <span className="text-muted">
            Tìm thấy <strong className="text-primary">{filteredProducts.length}</strong> sản phẩm
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Đang tải dữ liệu sản phẩm...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4">
          <p className="fs-1">🔍</p>
          <h4 className="fw-bold">Không tìm thấy sản phẩm nào</h4>
          <p className="text-muted">Thử nhập từ khóa khác hoặc điều chỉnh lại bộ lọc.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <div className="card h-100 product-card shadow-sm border-0 position-relative">
                <span className="position-absolute top-0 end-0 p-3 fs-5" style={{ cursor: 'pointer' }}>
                  🤍
                </span>
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
                  <div className="d-flex align-items-center mt-auto pt-2">
                    <NavLink
                      to={`/detail/${product.id}`}
                      className="btn btn-warning fw-bold text-dark w-50 me-2"
                    >
                      Buy now
                    </NavLink>
                    <span className="bg-light fw-bold text-center py-2 px-3 rounded w-50 border">
                      {product.price}$
                    </span>
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
