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

  const getAllProduct = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_URL)
      const listProduct = (res.data.content || []).filter((item) => item.feature)
      setArrProduct(listProduct)
    } catch (error) {
      console.log('Lỗi call API danh sách giày:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProduct()
  }, [])

  return (
    <div className="home-page pb-5">
      <div className="card border-0 rounded-4 bg-primary text-white p-4 p-md-5 mb-5 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-7">
            <span className="badge bg-light text-primary mb-2">SHOES SHOP 2026</span>
            <h1 className="fw-bold mb-3">Product name</h1>
            <p className="lead mb-4 text-white-50">
              Product description ...
            </p>
            <div className="d-flex gap-3">
              <a href="#product-feature" className="btn btn-warning text-dark fw-bold px-4">
                Buy now
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

      <div
        id="product-feature"
        className="p-3 text-white rounded-3 mb-4 fw-bold fs-4"
        style={{ background: 'linear-gradient(90deg, #E21B90 0%, #1B02B5 100%)' }}
      >
        Product Feature
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải sản phẩm...</span>
          </div>
          <p className="text-muted mt-2">Đang tải danh sách giày...</p>
        </div>
      ) : (
        <div className="row g-4">
          {arrProduct.map((product) => (
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

export default HomePage
