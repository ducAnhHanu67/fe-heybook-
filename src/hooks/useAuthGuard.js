import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { selectCurrentUser } from '@/redux/userSlice'

/**
 * Hook để bảo vệ các route yêu cầu authentication
 * @param {Object} options - Tùy chọn cấu hình
 * @param {string} options.redirectTo - Đường dẫn redirect khi chưa đăng nhập (mặc định: '/login')
 * @param {string} options.message - Thông báo khi chưa đăng nhập
 * @param {boolean} options.showToast - Hiển thị toast notification (mặc định: true)
 * @returns {Object} - { isAuthenticated, currentUser }
 */
export const useAuthGuard = (options = {}) => {
  const { redirectTo = '/login', message = 'Vui lòng đăng nhập để tiếp tục!', showToast = true } = options

  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = !!currentUser

  useEffect(() => {
    if (!isAuthenticated) {
      if (showToast) {
        toast.error(message)
      }
      navigate(redirectTo)
    }
  }, [isAuthenticated, navigate, redirectTo, message, showToast])

  return {
    isAuthenticated,
    currentUser
  }
}

/**
 * Hook để kiểm tra authentication cho các action cụ thể (không redirect)
 * @param {Object} options - Tùy chọn cấu hình
 * @param {string} options.message - Thông báo khi chưa đăng nhập
 * @param {boolean} options.showToast - Hiển thị toast notification (mặc định: true)
 * @returns {Function} - Function để check auth trước khi thực hiện action
 */
export const useAuthCheck = (options = {}) => {
  const { message = 'Vui lòng đăng nhập để thực hiện hành động này!', showToast = true } = options

  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = !!currentUser

  const checkAuth = (callback, redirectTo = '/login') => {
    if (!isAuthenticated) {
      if (showToast) {
        toast.error(message)
      }
      navigate(redirectTo)
      return false
    }

    if (callback && typeof callback === 'function') {
      callback()
    }
    return true
  }

  return {
    isAuthenticated,
    currentUser,
    checkAuth
  }
}

/**
 * Hook để bảo vệ các route admin - chỉ cho phép ADMIN và USER
 * @param {Object} options - Tùy chọn cấu hình
 * @param {string} options.redirectTo - Đường dẫn redirect khi không có quyền (mặc định: '/')
 * @param {string} options.message - Thông báo khi không có quyền
 * @param {boolean} options.showToast - Hiển thị toast notification (mặc định: true)
 * @returns {Object} - { isAuthenticated, currentUser, hasAdminAccess }
 */
export const useAdminGuard = (options = {}) => {
  const {
    redirectTo = '/',
    message = 'Bạn không có quyền truy cập trang quản trị!',
    showToast = true
  } = options

  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = !!currentUser
  const hasAdminAccess = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'USER')

  useEffect(() => {
    if (!isAuthenticated) {
      if (showToast) {
        toast.error('Vui lòng đăng nhập để tiếp tục!')
      }
      navigate('/login')
      return
    }

    if (!hasAdminAccess) {
      if (showToast) {
        toast.error(message)
      }
      navigate(redirectTo)
    }
  }, [isAuthenticated, hasAdminAccess, navigate, redirectTo, message, showToast])

  return {
    isAuthenticated,
    currentUser,
    hasAdminAccess
  }
}
