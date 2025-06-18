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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Users, DollarSign, Percent, CheckCircle, XCircle } from 'lucide-react'

export default function ReadDialog({ open, onOpenChange, discount }) {
  if (!discount) return null

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('vi-VN')
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

  const getUsagePercentage = () => {
    return Math.min((discount.usedCount / discount.usageLimit) * 100, 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono text-blue-600">{discount.code}</span>
            {getStatusBadge(discount)}
          </DialogTitle>
          <DialogDescription>Chi tiết thông tin mã giảm giá</DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Tên mã giảm giá</p>
                  <p className="text-base font-semibold">{discount.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Mã giảm giá</p>
                  <p className="font-mono text-base font-semibold text-blue-600">{discount.code}</p>
                </div>
              </div>

              {discount.description && (
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Mô tả</p>
                  <p className="text-base">{discount.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discount Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5" />
                Chi tiết giảm giá
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      {discount.type === 'PERCENTAGE' ? (
                        <Percent className="h-4 w-4 text-green-600" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Loại & Giá trị</p>
                      <p className="text-lg font-bold text-green-600">{getDiscountDisplay(discount)}</p>
                      <p className="text-muted-foreground text-xs">
                        {discount.type === 'PERCENTAGE' ? 'Giảm theo phần trăm' : 'Giảm số tiền cố định'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Đơn hàng tối thiểu</p>
                    <p className="text-base font-semibold">
                      {discount.minOrderAmount ? formatCurrency(discount.minOrderAmount) : 'Không yêu cầu'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Giảm tối đa</p>
                    <p className="text-base font-semibold">
                      {discount.maxDiscountAmount ? formatCurrency(discount.maxDiscountAmount) : ''}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Thống kê sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Đã sử dụng</p>
                    <p className="text-2xl font-bold">
                      {discount.usedCount} / {discount.usageLimit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm font-medium">Tỷ lệ sử dụng</p>
                    <p className="text-2xl font-bold text-blue-600">{getUsagePercentage().toFixed(1)}%</p>
                  </div>
                </div>

                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${getUsagePercentage()}%`
                    }}
                  ></div>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                  Còn lại: {discount.usageLimit - discount.usedCount} lượt sử dụng
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Thời gian hiệu lực
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Ngày bắt đầu</p>
                  <p className="text-base font-semibold">{formatDate(discount.startDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Ngày kết thúc</p>
                  <p className="text-base font-semibold">{formatDate(discount.endDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Trạng thái & Thông tin khác
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    {discount.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Trạng thái hệ thống</p>
                    <p className="text-base font-semibold">
                      {discount.isActive ? 'Đang kích hoạt' : 'Đã tạm dừng'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground font-medium">Ngày tạo</p>
                    <p>{formatDateTime(discount.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Cập nhật lần cuối</p>
                    <p>{formatDateTime(discount.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
