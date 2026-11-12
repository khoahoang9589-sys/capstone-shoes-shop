import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../services/auth'
export default function RequireAuth({ children }) {
  const location = useLocation()
  return getToken() ? children : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
}
