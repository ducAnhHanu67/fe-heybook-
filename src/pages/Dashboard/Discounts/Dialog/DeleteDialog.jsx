import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TicketPercent } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function DeleteDialog({ open, onOpenChange, discount, onSuccess }) {
  const [loading, setLoading] = useState(false)

  if (!discount) return null

  const handleDelete = async () => {
    try {
      setLoading(true)

      // TODO: Replace with actual API call
      // await deleteDiscount(discount.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call onSuccess callback
      onSuccess?.()
    } catch {
      // TODO: Handle error properly
      // showErrorToast('Lỗi khi xóa mã giảm giá')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getDiscountDisplay = (discount) => {
    if (discount.type === 'PERCENTAGE') {
      return `${discount.value}%`
    }
    return formatCurrency(discount.value)
  }

  const getStatusBadge = (discount) => {
    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    if (!discount.isActive) {
      return <Badge variant="secondary">Tạm dừng</Badge>
    }
    if (now < startDate) {
      return <Badge variant="outline">Chưa bắt đầu</Badge>
    }
    if (now > endDate) {
      return <Badge variant="destructive">Đã hết hạn</Badge>
    }
    return <Badge variant="default">Đang hoạt động</Badge>
  }

  const isDiscountActive = () => {
    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    return discount.isActive && now >= startDate && now <= endDate
  }

  const hasBeenUsed = () => {
    return discount.usedCount > 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận xóa mã giảm giá
          </DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Mã giảm giá sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Discount Info Card */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <TicketPercent className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-red-700">{discount.code}</span>
                    {getStatusBadge(discount)}
                  </div>
                  <h4 className="font-semibold text-gray-900">{discount.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Giá trị:</span> {getDiscountDisplay(discount)}
                    </div>
                    <div>
                      <span className="font-medium">Đã dùng:</span> {discount.usedCount}/{discount.usageLimit}
                    </div>
                    <div>
                      <span className="font-medium">Bắt đầu:</span> {formatDate(discount.startDate)}
                    </div>
                    <div>
                      <span className="font-medium">Kết thúc:</span> {formatDate(discount.endDate)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning Messages */}
          <div className="space-y-3">
            {isDiscountActive() && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Cảnh báo: Mã giảm giá đang hoạt động</p>
                  <p>Mã này hiện đang trong thời gian hiệu lực và có thể đang được sử dụng bởi khách hàng.</p>
                </div>
              </div>
            )}

            {hasBeenUsed() && (
              <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Thông tin: Mã đã được sử dụng</p>
                  <p>
                    Mã này đã được sử dụng {discount.usedCount} lần. Việc xóa có thể ảnh hưởng đến lịch sử đơn
                    hàng.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Không thể hoàn tác</p>
                <p>
                  Sau khi xóa, tất cả thông tin của mã giảm giá này sẽ bị mất vĩnh viễn và không thể khôi
                  phục.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-center text-sm text-gray-700">
              Bạn có chắc chắn muốn xóa mã giảm giá{' '}
              <span className="font-mono font-semibold text-red-600">{discount.code}</span> không?
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Đang xóa...' : 'Xóa mã giảm giá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
