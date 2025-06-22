import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  CheckCircle,
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
  Home,
  Receipt,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { formatPriceWithCurrency } from '@/utils/formatters'
import { getOrderByNumberAPI, cancelOrderAPI } from '@/apis'
import { toast } from 'react-toastify'

const ThankYou = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelingOrder, setCancelingOrder] = useState(false)

  const orderNumber = searchParams.get('orderNumber')

  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrderAPI,
    onSuccess: (response) => {
      toast.success('Hủy đơn hàng thành công!')
      setOrder(response.data)
      setCancelingOrder(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng!')
      setCancelingOrder(false)
    }
  })

  const handleCancelOrder = () => {
    setCancelingOrder(true)
    cancelOrderMutation.mutate(order.id)
  }

  const canCancelOrder = (orderData) => {
    return ['PENDING', 'CONFIRMED'].includes(orderData?.status)
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        toast.error('Không tìm thấy thông tin đơn hàng')
        navigate('/cart')
        return
      }

      try {
        const response = await getOrderByNumberAPI(orderNumber)
        setOrder(response.data)
      } catch {
        // console.error('Lỗi khi lấy thông tin đơn hàng:', error)
        toast.error('Không thể tải thông tin đơn hàng')
        navigate('/cart')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderNumber, navigate])

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'SHIPPED':
        return 'Đang giao hàng'
      case 'DELIVERED':
        return 'Đã giao hàng'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ thanh toán'
      case 'PAID':
        return 'Đã thanh toán'
      case 'FAILED':
        return 'Thanh toán thất bại'
      case 'REFUNDED':
        return 'Đã hoàn tiền'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Không tìm thấy thông tin đơn hàng</p>
          <Button onClick={() => navigate('/cart')}>Quay lại giỏ hàng</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Đặt hàng thành công!</h1>
          <p className="text-lg text-gray-600">
            Cảm ơn bạn đã mua hàng tại HeyBook. Đơn hàng của bạn đã được tiếp nhận và sẽ được xử lý sớm nhất.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                <span className="font-mono font-medium">{order.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thanh toán:</span>
                <Badge variant="outline">{getPaymentStatusText(order.paymentStatus)}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phương thức thanh toán:</span>
                <span className="font-medium">
                  {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ngày đặt hàng:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tạm tính:</span>
                  <span>{formatPriceWithCurrency(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Giảm giá:</span>
                    <span>-{formatPriceWithCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">{formatPriceWithCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Thông tin giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Người nhận:</span>
                </div>
                <p className="font-medium">{order.recipientName}</p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Số điện thoại:</span>
                </div>
                <p className="font-medium">{order.recipientPhone}</p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Email:</span>
                </div>
                <p className="font-medium">{order.recipientEmail}</p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Địa chỉ giao hàng:</span>
                </div>
                <p className="font-medium">{order.shippingAddress}</p>
              </div>

              {order.notes && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ghi chú:</span>
                  </div>
                  <p className="text-gray-700 italic">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sản phẩm đã đặt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <img
                    src={item.productImage || item.product?.coverImageUrl}
                    alt={item.productName}
                    className="h-16 w-16 rounded border border-gray-200 object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productName}</h4>
                    <div className="mt-1 text-sm text-gray-600">
                      <span>Số lượng: {item.quantity}</span>
                      <span className="mx-2">•</span>
                      <span>Đơn giá: {formatPriceWithCurrency(item.unitPrice)}</span>
                      {item.discount > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-green-600">Giảm {item.discount}%</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPriceWithCurrency(item.totalPrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          {canCancelOrder(order) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={cancelingOrder}
                >
                  <XCircle className="h-4 w-4" />
                  {cancelingOrder ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Xác nhận hủy đơn hàng
                  </DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn hủy đơn hàng <strong>#{order?.orderNumber}</strong> không?
                    <br />
                    <span className="text-sm text-red-600">
                      Lưu ý: Hành động này không thể hoàn tác. Số lượng sản phẩm sẽ được hoàn lại kho và
                      coupon (nếu có) sẽ được hoàn lại.
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button variant="outline">Không, giữ đơn hàng</Button>
                  </DialogTrigger>
                  <Button
                    variant="destructive"
                    onClick={handleCancelOrder}
                    disabled={cancelOrderMutation.isLoading}
                  >
                    {cancelOrderMutation.isLoading ? 'Đang hủy...' : 'Có, hủy đơn hàng'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Tiếp tục mua sắm
          </Button>

          <Button onClick={() => navigate('/profile/orders')} className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Xem đơn hàng của tôi
          </Button>
        </div>

        {/* Additional Info */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <h4 className="mb-2 font-medium text-blue-900">Thông tin quan trọng</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Đơn hàng sẽ được xử lý trong vòng 1-2 ngày làm việc</li>
                  <li>• Bạn sẽ nhận được email xác nhận và thông tin vận chuyển</li>
                  <li>• Thời gian giao hàng dự kiến: 2-5 ngày làm việc</li>
                  <li>• Liên hệ hotline: 1900-xxxx nếu cần hỗ trợ</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ThankYou
