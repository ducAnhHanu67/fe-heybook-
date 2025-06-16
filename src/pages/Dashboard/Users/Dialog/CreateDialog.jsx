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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { createUserAPI } from '@/apis'
import { toast } from 'react-toastify'

const userSchema = Joi.object({
  userName: Joi.string().required().messages({
    'string.empty': 'Tên người dùng không được để trống',
    'any.required': 'Tên người dùng là bắt buộc'
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  role: Joi.string().valid('ADMIN', 'CLIENT').required().messages({
    'any.only': 'Vai trò phải là ADMIN hoặc CLIENT',
    'any.required': 'Vai trò là bắt buộc'
  }),
  isActive: Joi.boolean().required()
})

export function CreateDialog({ getUsers }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(userSchema),
    defaultValues: {
      role: 'CLIENT',
      isActive: true
    }
  })

  const createUser = async (data) => {
    setIsLoading(true)
    try {
      const res = await createUserAPI(data)
      if (!res.error) {
        toast.success('Thêm người dùng thành công!')
        getUsers()
        reset()
        setOpen(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      reset()
      clearErrors()
    }
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-2">
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>Nhập thông tin để tạo người dùng mới. Nhấn lưu khi hoàn tất.</DialogDescription>
        </DialogHeader>        <form onSubmit={handleSubmit(createUser)}>
          <div className="grid gap-4 py-4">
            {/* Tên người dùng */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="userName">
                Tên người dùng<span className="text-red-500">*</span>
              </Label>
              <Input
                id="userName"
                placeholder="Nhập tên người dùng"
                {...register('userName')}
                className="relative z-[1] bg-white"
              />
              <FieldAlertError errors={errors} fieldName="userName" />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                {...register('email')}
                className="relative z-[1] bg-white"
              />
              <FieldAlertError errors={errors} fieldName="email" />
            </div>

            {/* Mật khẩu */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">
                Mật khẩu<span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                {...register('password')}
                className="relative z-[1] bg-white"
              />
              <FieldAlertError errors={errors} fieldName="password" />
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">
                Vai trò<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="relative z-[1] bg-white">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Khách hàng</SelectItem>
                      <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldAlertError errors={errors} fieldName="role" />
            </div>

            {/* Trạng thái hoạt động */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="isActive">
                Trạng thái hoạt động
              </Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="isActive">
                      {field.value ? 'Hoạt động' : 'Không hoạt động'}
                    </Label>
                  </div>
                )}
              />
              <FieldAlertError errors={errors} fieldName="isActive" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
