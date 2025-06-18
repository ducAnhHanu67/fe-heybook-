import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

export default function MyOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng của tôi</CardTitle>
        <CardDescription>Quản lý và theo dõi các đơn hàng của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">Chưa có đơn hàng</h3>
          <p className="mb-4 text-gray-500">
            Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm và đặt hàng ngay!
          </p>
          <Link to="/">
            <Button>Mua sắm ngay</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
