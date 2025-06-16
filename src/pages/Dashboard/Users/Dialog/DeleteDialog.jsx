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
import { Trash2 } from 'lucide-react'
import { deleteUserAPI } from '@/apis'
import { toast } from 'react-toastify'

export function DeleteDialog({ userId, getUsers }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const deleteUser = async () => {
    setIsLoading(true)
    try {
      const res = await deleteUserAPI(userId)
      if (!res.error) {
        toast.success('Xóa người dùng thành công!')
        getUsers()
        setOpen(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={deleteUser} disabled={isLoading}>
            {isLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
