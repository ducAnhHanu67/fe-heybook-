import { useSelector } from 'react-redux'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Lock, ShoppingBag } from 'lucide-react'
import { selectCurrentUser } from '@/redux/userSlice'
import PersonalInfo from './PersonalInfo'
import ChangePassword from './ChangePassword'
import MyOrders from './MyOrders'

export default function Profile() {
  const currentUser = useSelector(selectCurrentUser)
  const location = useLocation()

  const navigationItems = [
    {
      path: '/profile',
      label: 'Thông tin cá nhân',
      icon: User
    },
    {
      path: '/profile/change-password',
      label: 'Đổi mật khẩu',
      icon: Lock
    },
    {
      path: '/profile/orders',
      label: 'Đơn hàng của tôi',
      icon: ShoppingBag
    }
  ]

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Vui lòng đăng nhập để xem thông tin cá nhân.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tài khoản của tôi</h1>
        <p className="mt-2 text-gray-600">Quản lý thông tin tài khoản và đơn hàng của bạn</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.fullName} className="object-cover" />
                  <AvatarFallback>
                    {currentUser.fullName?.charAt(0) || currentUser.userName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{currentUser.fullName || currentUser.userName}</h3>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                        isActive ? 'bg-red-50 font-medium text-red-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Routes>
            <Route path="/" element={<PersonalInfo />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/orders" element={<MyOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
