import { useState, useEffect } from 'react'
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
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { createBrandAPI, getCategoriesAPI } from '@/apis'
import { toast } from 'react-toastify'
import { BrandSchema } from '@/utils/validatiors'

export function CreateDialog({ fetchData, categories }) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(BrandSchema)
  })

  const createBrand = (data) => {
    const { name, categoryId } = data
    createBrandAPI({ name, categoryId })
      .then((res) => {
        if (!res.error) {
          toast.success('Thêm hãng thành công!')
          fetchData()
          reset()
          setOpen(false)
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Có lỗi xảy ra!'))
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
        <Button className="ml-auto gap-1 pl-10">
          <Plus />
          Thêm hãng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm hãng</DialogTitle>
          <DialogDescription>
            Vui lòng chọn danh mục trước, sau đó nhập tên hãng muốn thêm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createBrand)}>
          <div className="flex w-full flex-col gap-3 py-3">
            {/* Chọn Category */}
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 pl-[3px] font-medium" htmlFor="categoryId">
                Chọn danh mục
              </Label>
              <select
                id="categoryId"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3"
                {...register('categoryId', { required: true })}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FieldAlertError errors={errors} fieldName={'categoryId'} />
            </div>

            {/* Nhập tên Brand */}
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 pl-[3px] font-medium" htmlFor="name">
                Tên hãng
              </Label>
              <Input
                className="z-1 h-10 w-full bg-white"
                id="name"
                type="text"
                placeholder="VD: Samsung, Apple..."
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