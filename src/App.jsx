import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import AuthPage from './pages/Auth/AuthPage'
import Dashboard from './pages/Dashboard/Dashboard'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/userSlice'

// https://www.robinwieruch.de/react-router-private-routes
// https://reactrouter.com/api/components/Outlet#outlet
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/dashboard/*" element={<Dashboard />} replace={true} />
      </Route>

      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
    </Routes>
  )
}

export default App
