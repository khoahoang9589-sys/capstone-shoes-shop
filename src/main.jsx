import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/700.css'

import './assets/css/main.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'

import HomeTemplate from './templates/HomeTemplate'

import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Carts from './pages/Carts'
import RequireAuth from './components/RequireAuth'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="" element={<HomeTemplate />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="detail/:id" element={<Detail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="carts" element={<RequireAuth><Carts /></RequireAuth>} />
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>
)
