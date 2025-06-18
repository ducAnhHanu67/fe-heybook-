import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useForm, Controller } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import FieldAlertError from '@/components/Form/FieldAlertError'

const discountSchema = Joi.object({
  code: Joi.string().required().messages({
    'string.empty': 'Mã giảm giá không được để trống',
    'any.required': 'Mã giảm giá là bắt buộc'
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Tên mã giảm giá không được để trống',
    'any.required': 'Tên mã giảm giá là bắt buộc'
  }),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('PERCENTAGE', 'FIXED_AMOUNT').required().messages({
    'any.only': 'Loại giảm giá phải là Phần trăm hoặc Số tiền cố định',
    'any.required': 'Loại giảm giá là bắt buộc'
  }),
  value: Joi.number().min(0).required().messages({
    'number.base': 'Giá trị phải là số',
    'number.min': 'Giá trị phải lớn hơn hoặc bằng 0',
    'any.required': 'Giá trị là bắt buộc'
  }),
  minOrderAmount: Joi.number().min(0).required().messages({
    'number.base': 'Số tiền tối thiểu phải là số',
    'number.min': 'Số tiền tối thiểu phải lớn hơn hoặc bằng 0',
    'any.required': 'Số tiền tối thiểu là bắt buộc'
  }),
  maxDiscountAmount: Joi.number().min(0).optional().allow(null).messages({
    'number.base': 'Số tiền giảm tối đa phải là số',
    'number.min': 'Số tiền giảm tối đa phải lớn hơn hoặc bằng 0'
  }),
  usageLimit: Joi.number().integer().min(1).required().messages({
    'number.base': 'Giới hạn sử dụng phải là số',
    'number.integer': 'Giới hạn sử dụng phải là số nguyên',
    'number.min': 'Giới hạn sử dụng phải lớn hơn 0',
    'any.required': 'Giới hạn sử dụng là bắt buộc'
  }),
  startDate: Joi.string().required().messages({
    'string.empty': 'Ngày bắt đầu không được để trống',
    'any.required': 'Ngày bắt đầu là bắt buộc'
  }),
  endDate: Joi.string().required().messages({
    'string.empty': 'Ngày kết thúc không được để trống',
    'any.required': 'Ngày kết thúc là bắt buộc'
  }),
  isActive: Joi.boolean().required()
})

export default function UpdateDialog({ open, onOpenChange, discount, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
    watch,
    setValue
  } = useForm({
    resolver: joiResolver(discountSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 1,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date().toISOString().slice(0, 16),
      isActive: true
    }
  })

  const watchType = watch('type')

  // Load discount data when dialog opens
  useEffect(() => {
    if (discount && open) {
      setValue('code', discount.code || '')
      setValue('name', discount.name || '')
      setValue('description', discount.description || '')
      setValue('type', discount.type || 'PERCENTAGE')
      setValue('value', discount.value || 0)
      setValue('minOrderAmount', discount.minOrderAmount || 0)
      setValue('maxDiscountAmount', discount.maxDiscountAmount || 0)
      setValue('usageLimit', discount.usageLimit || 1)
      setValue('startDate', discount.startDate
        ? (discount.startDate.includes('T') ? discount.startDate.slice(0, 16) : discount.startDate + 'T00:00')
        : new Date().toISOString().slice(0, 16))
      setValue('endDate', discount.endDate
        ? (discount.endDate.includes('T') ? discount.endDate.slice(0, 16) : discount.endDate + 'T23:59')
        : new Date().toISOString().slice(0, 16))
      setValue('isActive', discount.isActive ?? true)
    }
  }, [discount, open, setValue])

  const onSubmit = async () => {
    try {
      setLoading(true)

      // TODO: Replace with actual API call
      // console.log('Updating discount:', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call onSuccess callback
      onSuccess?.()
    } catch {
      // TODO: Handle error properly
      // console.error('Error updating discount:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      reset()
      clearErrors()
    }
    onOpenChange(isOpen)
  }

  if (!discount) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin mã giảm giá. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            {/* Mã giảm giá */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">
                Mã giảm giá<span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: SUMMER2024"
                {...register('code')}
                className="relative z-[1] bg-white font-mono"
                onChange={(e) => {
                  const value = e.target.value.toUpperCase()
                  e.target.value = value
                  register('code').onChange(e)
                }}
              />
              <FieldAlertError errors={errors} fieldName="code" />
            </div>

            {/* Tên mã giảm giá */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">
                Tên mã giảm giá<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Giảm giá mùa hè"
                {...register('name')}
                className="relative z-[1] bg-white"
              />
              <FieldAlertError errors={errors} fieldName="name" />
            </div>

            {/* Mô tả */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">
                Mô tả
              </Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về mã giảm giá..."
                {...register('description')}
                className="relative z-[1] bg-white min-h-[80px]"
              />
              <FieldAlertError errors={errors} fieldName="description" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Loại giảm giá */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="type">
                  Loại giảm giá<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="relative z-[1] bg-white">
                        <SelectValue placeholder="Chọn loại giảm giá" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldAlertError errors={errors} fieldName="type" />
              </div>

              {/* Giá trị */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="value">
                  Giá trị<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step={watchType === 'PERCENTAGE' ? '0.01' : '1000'}
                  placeholder={watchType === 'PERCENTAGE' ? '0' : '0'}
                  {...register('value', { valueAsNumber: true })}
                  className="relative z-[1] bg-white"
                />
                <FieldAlertError errors={errors} fieldName="value" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Số tiền đơn hàng tối thiểu */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="minOrderAmount">
                  Số tiền đơn hàng tối thiểu<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  {...register('minOrderAmount', { valueAsNumber: true })}
                  className="relative z-[1] bg-white"
                />
                <FieldAlertError errors={errors} fieldName="minOrderAmount" />
              </div>

              {/* Số tiền giảm tối đa */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maxDiscountAmount">
                  Số tiền giảm tối đa
                </Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  {...register('maxDiscountAmount', { valueAsNumber: true })}
                  className="relative z-[1] bg-white"
                />
                <FieldAlertError errors={errors} fieldName="maxDiscountAmount" />
              </div>
            </div>

            {/* Giới hạn số lần sử dụng */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usageLimit">
                Giới hạn số lần sử dụng<span className="text-red-500">*</span>
              </Label>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                {...register('usageLimit', { valueAsNumber: true })}
                className="relative z-[1] bg-white"
              />
              <FieldAlertError errors={errors} fieldName="usageLimit" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Ngày bắt đầu */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="startDate">
                  Ngày bắt đầu<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  {...register('startDate')}
                  className="relative z-[1] bg-white"
                />
                <FieldAlertError errors={errors} fieldName="startDate" />
              </div>

              {/* Ngày kết thúc */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="endDate">
                  Ngày kết thúc<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...register('endDate')}
                  min={watch('startDate') || new Date().toISOString().slice(0, 16)}
                  className="relative z-[1] bg-white"
                />
                <FieldAlertError errors={errors} fieldName="endDate" />
              </div>
            </div>

            {/* Trạng thái hoạt động */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="isActive">Trạng thái hoạt động</Label>
              <div className="flex items-center space-x-2">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  {watch('isActive') ? 'Đang hoạt động' : 'Tạm dừng'}
                </Label>
              </div>
              <FieldAlertError errors={errors} fieldName="isActive" />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
