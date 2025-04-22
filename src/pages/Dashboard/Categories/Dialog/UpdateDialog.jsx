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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { categorySchema } from '@/utils/validatiors'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { updateCategoryAPI } from '@/apis'
import { toast } from 'react-toastify'
import { Pencil } from 'lucide-react'

export function UpdateDialog({ category, getCategories }) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(categorySchema)
  })

  const updateCategory = (data) => {
    const { name } = data
    updateCategoryAPI(category.id, { name })
      .then(() => {
        toast.success('Sửa thông tin danh mục thành công!')
        getCategories('1')
        reset()
        setOpen(false)
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra!')
      })
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (isOpen) {
      // Cập nhật URL
      window.history.pushState({}, '', `/dashboard/categories/${category.id}`)
    } else {
      // Reset URL về mặc định
      window.history.pushState({}, '', '/dashboard/categories')
      reset({ name: category.name })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="dark:hover:text-error-500 mr-2 cursor-pointer p-[1px] font-medium text-gray-600 underline hover:text-blue-600 dark:text-gray-400">
          <Pencil size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sửa danh mục</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin danh mục bạn muốn sửa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(updateCategory)}>
          <div className="flex w-full flex-col gap-3 py-3">
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 pl-[3px] font-medium" htmlFor="name">
                Tên danh mục
              </Label>
              <Input
                className="z-1 h-10 w-full bg-white"
                id="name"
                type="text"
                placeholder="VD: Bút bi"
                error={!!errors['name']}
                {...register('name')}
                defaultValue={category.name}
              />
              <FieldAlertError errors={errors} fieldName={'name'} />
            </div>
          </div>
          <DialogFooter className="mt-1">
            <Button
              type="button"
              className="ml-auto w-20 bg-gray-500 hover:bg-gray-600"
              onClick={() => handleOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="w-25">
              Xác nhận
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
