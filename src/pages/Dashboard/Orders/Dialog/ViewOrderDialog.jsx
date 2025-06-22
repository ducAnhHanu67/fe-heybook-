import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getOrderByIdAdminAPI } from '@/apis'
import { formatPriceWithCurrency, formatDate } from '@/utils/formatters'

export default function ViewOrderDialog({ orderId, children }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchOrder = async () => {
    if (!orderId) return

    setLoading(true)
    try {
      const data = await getOrderByIdAdminAPI(orderId)
      setOrder(data)
    } catch {
      // Handle error silently
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (newOpen && !order) {
      fetchOrder()
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', label: 'Chờ xử lý' },
      CONFIRMED: { variant: 'default', label: 'Đã xác nhận' },
      PROCESSING: { variant: 'default', label: 'Đang xử lý' },
      SHIPPED: { variant: 'default', label: 'Đã gửi' },
      DELIVERED: { variant: 'default', label: 'Đã giao' },
      CANCELLED: { variant: 'destructive', label: 'Đã hủy' },
      RETURNED: { variant: 'destructive', label: 'Đã trả' }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', label: 'Chờ thanh toán' },
      PAID: { variant: 'default', label: 'Đã thanh toán' },
      FAILED: { variant: 'destructive', label: 'Thất bại' },
      REFUNDED: { variant: 'destructive', label: 'Đã hoàn tiền' }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          <DialogDescription>Xem thông tin chi tiết của đơn hàng</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">Đang tải...</div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Thông tin đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thanh toán:</span>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                  {order.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPay'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">Thông tin giao hàng</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Người nhận:</span>
                    <div className="font-medium">{order.recipientName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div>{order.recipientEmail}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <div>{order.recipientPhone}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Địa chỉ:</span>
                    <div>{order.shippingAddress}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Sản phẩm đã đặt</h3>
              <div className="space-y-4">
                {!order.orderItems || order.orderItems.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">Không có sản phẩm nào trong đơn hàng</div>
                ) : (
                  order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="h-16 w-16 flex-shrink-0">
                        {item.product?.coverImageUrl ? (
                          <img
                            src={item.product.coverImageUrl}
                            alt={item.product.name}
                            className="h-16 w-16 rounded border object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded border bg-gray-200 text-gray-500">
                            <span className="text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name || item.productName}</h4>
                        <div className="text-sm text-gray-600">
                          <div>
                            Giá gốc: {formatPriceWithCurrency(item.unitPrice)} × {item.quantity}
                          </div>
                          {item.discount > 0 && (
                            <div className="text-green-600">Giảm giá: -{item.discount}%</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatPriceWithCurrency(item.totalPrice)}</div>
                        {item.discount > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPriceWithCurrency(item.unitPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Tổng kết đơn hàng</h3>
              <div className="ml-auto max-w-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatPriceWithCurrency(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPriceWithCurrency(order.discountAmount)}</span>
                  </div>
                )}
                {order.couponCode && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Mã giảm giá:</span>
                    <span>{order.couponCode}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{formatPriceWithCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Ghi chú</h3>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              </>
            )}

            {/* Payment Info */}
            {order.vnpTransactionNo && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Thông tin thanh toán</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã giao dịch:</span>
                      <span className="font-mono">{order.vnpTransactionNo}</span>
                    </div>
                    {order.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thời gian thanh toán:</span>
                        <span>{formatDate(order.paidAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>Không thể tải thông tin đơn hàng</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
