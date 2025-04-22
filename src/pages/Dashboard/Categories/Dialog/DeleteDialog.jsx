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
import { deleteCategoryAPI } from '@/apis'
import { toast } from 'react-toastify'

export function DeleteDialog({ categoryId, getCategories }) {
  const [open, setOpen] = useState(false)

  const deleteCategory = async () => {
    deleteCategoryAPI(categoryId).then((res) => {
      if (!res.error) {
        toast.success('Xóa danh mục thành công!')
        getCategories()
        handleOpenChange(false)
      }
    })
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="dark:hover:text-error-500 text-gray-600underline cursor-pointer p-[1px] font-medium hover:text-red-600 dark:text-gray-400">
          <Trash2 size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bạn có chắc chắn muốn xóa danh mục này?</DialogTitle>
          <DialogDescription>
            Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn dữ
            liệu của bạn khỏi cơ sở dữ liệu.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-1">
          <Button
            type="button"
            className="ml-auto w-20 bg-gray-500 hover:bg-gray-600"
            onClick={() => handleOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            type="button"
            className="w-25"
            onClick={() => deleteCategory()}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
