import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const HomeTemplate = () => {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Đến nội dung chính</a>
      <Header />
      <main id="main-content" className="container"><Outlet /></main>
      <Footer />
    </div>
  )
}

export default HomeTemplate
