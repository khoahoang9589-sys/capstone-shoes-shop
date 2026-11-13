// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Trang chi tiết sản phẩm — lấy dữ liệu theo params.id từ URL
// THAM KHẢO: reactjsbc97/src/pages/Detail.jsx

import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { themSPVaoGioHang } from '../redux/reducers/cartReducer'

const Detail = () => {
  const params = useParams()
  const dispatch = useDispatch()

  const [productDetail, setProductDetail] = useState({})
  const [loading, setLoading] = useState(true)
  const [soLuong, setSoLuong] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)

  // B1: Hàm call API lấy chi tiết sản phẩm theo id
  const getDetail = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`https://shop.cyberlearn.vn/api/Product/getbyid?id=${params.id}`)
      const data = res.data.content
      setProductDetail(data || {})

      // Chọn size mặc định là size đầu tiên nếu có
      if (Array.isArray(data?.size) && data.size.length > 0) {
        setSelectedSize(data.size[0])
      }
      setSoLuong(1)
    } catch (error) {
      console.log('Lỗi call API chi tiết sản phẩm:', error)
    } finally {
      setLoading(false)
    }
  }

  // B2: Gọi lại API mỗi khi params.id thay đổi
  useEffect(() => {
    getDetail()
    window.scrollTo(0, 0)
  }, [params.id])

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    dispatch(
      themSPVaoGioHang({
        id: productDetail.id,
        name: productDetail.name,
        image: productDetail.image,
        price: productDetail.price,
        soLuong: soLuong,
        size: selectedSize,
      })
    )
    alert(`Đã thêm ${soLuong} "${productDetail.name}" vào giỏ hàng!`)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted">Đang tải thông tin chi tiết sản phẩm...</p>
      </div>
    )
  }

  return (
    <div className="detail-page pb-5">
      {/* Breadcrumb điều hướng */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink to="/">Trang chủ</NavLink>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {productDetail.name}
          </li>
        </ol>
      </nav>

      {/* Khối chi tiết sản phẩm */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
        <div className="row g-4 align-items-center">
          {/* CỘT TRÁI: HÌNH ẢNH */}
          <div className="col-12 col-md-5 text-center">
            <div className="bg-light rounded-4 p-4">
              <img
                src={productDetail.image}
                alt={productDetail.name}
                className="img-fluid"
                style={{ maxHeight: '280px', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <div className="col-12 col-md-7">
            <h1 className="h2 fw-bold text-capitalize mb-2">{productDetail.name}</h1>
            <p className="fs-3 fw-bold text-success mb-3">${productDetail.price}</p>

            {/* Chọn Size */}
            {Array.isArray(productDetail.size) && productDetail.size.length > 0 && (
              <div className="mb-3">
                <label className="fw-semibold d-block mb-2">Chọn size:</label>
                <div className="d-flex flex-wrap gap-2">
                  {productDetail.size.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`btn btn-sm ${selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chọn Số Lượng */}
            <div className="mb-4">
              <label className="fw-semibold d-block mb-2">Số lượng:</label>
              <div className="d-flex align-items-center gap-3">
                <div className="input-group" style={{ width: '130px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSoLuong((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="form-control text-center">{soLuong}</span>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSoLuong((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>

                <button className="btn btn-primary px-4" onClick={handleAddToCart}>
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            {/* Mô tả */}
            <div className="border-top pt-3">
              <h5 className="fw-bold">Mô tả sản phẩm:</h5>
              <p className="text-muted">{productDetail.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm tương tự (Related Products) */}
      {Array.isArray(productDetail.relatedProducts) && productDetail.relatedProducts.length > 0 && (
        <section className="related-section">
          <h3 className="h4 fw-bold mb-4">Sản Phẩm Tương Tự</h3>
          <div className="row g-4">
            {productDetail.relatedProducts.map((rel) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={rel.id}>
                <div className="card h-100 shadow-sm border-0 product-card">
                  <div className="bg-light p-3 text-center rounded-top">
                    <img
                      src={rel.image}
                      className="img-fluid"
                      alt={rel.name}
                      style={{ height: '140px', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column p-3">
                    <h4 className="card-title h6 fw-bold text-capitalize text-truncate mb-2" title={rel.name}>
                      {rel.name}
                    </h4>
                    <p className="fw-bold text-success mb-3">${rel.price}</p>
                    <NavLink to={`/detail/${rel.id}`} className="btn btn-outline-primary btn-sm mt-auto">
                      Xem chi tiết
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Detail
