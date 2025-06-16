import { Search, Bell, ShoppingCart, User, ChevronDown, Menu, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '@/redux/userSlice'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const currentUser = useSelector(selectCurrentUser)

  const handleLogout = () => {
    dispatch(logoutUserAPI())
  }
  const handleAdminAccess = () => {
    navigate('/dashboard')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                <span className="text-sm font-bold text-white"></span>
              </div>
              <span className="text-xl font-bold text-red-500">HeyBook.com</span>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="ml-3 hidden items-center md:flex">
            <Button variant="outline" className="flex items-center space-x-2 border-gray-300">
              <Menu className="h-4 w-4" />
              <span className="text-sm">Danh mục</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mx-4 max-w-2xl flex-1">
            <div className="relative flex">
              <Input
                type="text"
                placeholder="Mọi Con Người Và Một Dân Tộc"
                className="flex-1 border-gray-300 pr-12 focus:border-red-500 focus:ring-red-500"
              />
              <Button
                size="sm"
                className="absolute top-0 right-0 h-full rounded-l-none bg-red-500 px-4 text-white hover:bg-red-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                {/* Shopping Cart */}
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    0
                  </span>
                </Button>{' '}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{currentUser.userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Thông tin tài khoản</span>
                    </DropdownMenuItem>
                    {/* Admin Access - only show for ADMIN or USER roles */}
                    {(currentUser.role === 'ADMIN' || currentUser.role === 'USER') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleAdminAccess}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Truy cập Admin</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-500 focus:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Not logged in - show login and register buttons
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleLogin} className="text-sm">
                  Đăng nhập
                </Button>
                <Button
                  size="sm"
                  onClick={handleRegister}
                  className="bg-red-500 text-sm text-white hover:bg-red-600"
                >
                  Đăng ký
                </Button>
              </div>
            )}
            {/* Vietnamese Flag
            <div className="flex items-center space-x-1">
              <div className="relative h-4 w-6 bg-red-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 border border-yellow-400">
                    <div className="h-full w-full scale-75 rotate-45 transform bg-yellow-400"></div>
                  </div>
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-600" />
            </div> */}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center justify-between py-2 md:hidden">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Menu className="h-4 w-4" />
            <span className="text-sm">Danh mục</span>
          </Button>
        </div>
      </div>

      {/* Secondary Navigation */}
      {/* <div className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-6">
              <span className="text-gray-600">Thông Báo</span>
              <span className="text-gray-600">Giỏ Hàng</span>
              <span className="text-gray-600">Tài Khoản</span>
            </div>
          </div>
        </div>
      </div> */}
    </header>
  )
}
