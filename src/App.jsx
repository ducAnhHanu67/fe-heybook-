import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import AuthPage from './pages/Auth/AuthPage'
import Dashboard from './pages/Dashboard/Dashboard'
import Client from './pages/Client/Client'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/userSlice'
import { usePermission } from './hooks/usePermissions'
import { permissions } from './config/rbacConfig'

const ProtectedRoute = ({ requirePermission }) => {
  const currentUser = useSelector(selectCurrentUser)
  const { hasPermission } = usePermission(currentUser?.role)

  if (!currentUser) return <Navigate to="/login" replace />
  if (requirePermission && !hasPermission(requirePermission)) {
    // Redirect về "/" thay vì "/client"
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function App() {
  return (
    <Routes>
      {/* ✅ Trang / là Client luôn */}
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<Client />} />
      </Route>

      {/* ✅ Dashboard chỉ dành cho admin */}
      <Route element={<ProtectedRoute requirePermission={permissions.VIEW_ADMIN} />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>

      {/* ✅ Auth */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
    </Routes>
  )
}

export default App
