import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { updateOrderStatusAdminAPI } from '@/apis'
import { toast } from 'react-toastify'

export default function UpdateOrderStatusDialog({ orderId, currentStatus, children, onRefresh }) {
  const [open, setOpen] = useState(false)
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPED', label: 'Đã gửi' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'RETURNED', label: 'Đã trả' }
  ]

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

  const handleSubmit = async () => {
    if (!newStatus || newStatus === currentStatus) {
      toast.error('Vui lòng chọn trạng thái mới')
      return
    }

    setLoading(true)
    try {
      await updateOrderStatusAdminAPI(orderId, newStatus)
      toast.success('Cập nhật trạng thái đơn hàng thành công!')
      setOpen(false)
      onRefresh?.()
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) {
      setNewStatus(currentStatus)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>Thay đổi trạng thái của đơn hàng</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Trạng thái hiện tại</Label>
            <div className="mt-2">{getStatusBadge(currentStatus)}</div>
          </div>

          <div>
            <Label htmlFor="status">Trạng thái mới</Label>
            <Select value={newStatus} onValueChange={setNewStatus} disabled={loading}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === currentStatus}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newStatus && newStatus !== currentStatus && (
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Trạng thái mới:</span>
                {getStatusBadge(newStatus)}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !newStatus || newStatus === currentStatus}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
