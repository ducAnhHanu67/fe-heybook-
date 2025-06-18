import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

export default function MyOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng của tôi</CardTitle>
        <CardDescription>
          Quản lý và theo dõi các đơn hàng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có đơn hàng
          </h3>
          <p className="text-gray-500 mb-4">
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
