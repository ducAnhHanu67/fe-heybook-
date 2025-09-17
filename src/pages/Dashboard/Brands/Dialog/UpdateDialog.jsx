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
import { BrandSchema } from '@/utils/validatiors'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { updateBrandAPI } from '@/apis'
import { toast } from 'react-toastify'
import { Pencil } from 'lucide-react'

export default function UpdateDialog({ brand, fetchData, categories }) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(BrandSchema),
    defaultValues: {
      name: brand.name,
      categoryId: brand.categoryId
    }

  })

  const updateBrand = (data) => {
    const { name, categoryId } = data
    updateBrandAPI(brand.id, { name, categoryId })
      .then((res) => {
        if (!res.error) {
          toast.success('Sửa thông tin brand thành công!')
          fetchData?.()
          reset()
          setOpen(false)
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra!')
      })
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (isOpen) {
      reset({
        name: brand.name,
        categoryId: brand.categoryId
      })
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
          <DialogTitle>Sửa brand</DialogTitle>
          <DialogDescription>Thay đổi thông tin brand bạn muốn sửa.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(updateBrand)}>
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
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 pl-[3px] font-medium" htmlFor="name">
                Tên brand
              </Label>
              <Input
                className="z-1 h-10 w-full bg-white"
                id="name"
                type="text"
                placeholder="VD: Deli"
                error={!!errors['name']}
                {...register('name')}
                defaultValue={brand.name}
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
