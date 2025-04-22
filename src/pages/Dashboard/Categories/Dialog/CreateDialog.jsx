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
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { categorySchema } from '@/utils/validatiors'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { createCategoryAPI } from '@/apis'
import { toast } from 'react-toastify'

export function CreateDialog({ getCategories }) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(categorySchema)
  })

  const createCategory = (data) => {
    const { name } = data
    createCategoryAPI({ name })
      .then(() => {
        toast.success('Thêm danh mục thành công!')
        getCategories('1')
        reset()
        setOpen(false)
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra!')
      )
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      clearErrors()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Thêm danh mục</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm danh mục</DialogTitle>
          <DialogDescription>
            Nhập tên danh mục bạn muốn thêm vào danh sách.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createCategory)}>
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
