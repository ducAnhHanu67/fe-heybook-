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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bạn có chắc chắn muốn xóa mã giảm giá này?</DialogTitle>
          <DialogDescription>
            Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn mã giảm giá &ldquo;{discount?.name}&rdquo; khỏi cơ sở dữ liệu.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-1">
          <Button
            type="button"
            className="ml-auto w-20 bg-gray-500 hover:bg-gray-600"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            type="button"
            className="w-25"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Đang xóa...' : 'Xác nhận'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
