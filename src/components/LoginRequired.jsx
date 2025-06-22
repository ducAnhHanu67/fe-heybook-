import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, ShoppingCart } from 'lucide-react'

const LoginRequired = ({
  title = 'Cần đăng nhập',
  message = 'Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.',
  redirectPath = '/login',
  showCartIcon = false
}) => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            {showCartIcon ? (
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            ) : (
              <LogIn className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mb-6 text-gray-600">{message}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate(redirectPath)}>
              <LogIn className="mr-2 h-4 w-4" />
              Đăng nhập
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginRequired
