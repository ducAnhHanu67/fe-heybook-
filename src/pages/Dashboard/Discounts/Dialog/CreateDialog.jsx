import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const formSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Mã giảm giá phải có ít nhất 3 ký tự')
      .max(50, 'Mã giảm giá không được quá 50 ký tự')
      .regex(/^[A-Z0-9_]+$/, 'Mã giảm giá chỉ được chứa chữ in hoa, số và dấu gạch dưới'),
    name: z.string().min(1, 'Tên mã giảm giá là bắt buộc').max(255, 'Tên không được quá 255 ký tự'),
    description: z.string().optional(),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
      required_error: 'Vui lòng chọn loại giảm giá'
    }),
    value: z.number().min(0, 'Giá trị phải lớn hơn 0').max(100, 'Giá trị phần trăm không được quá 100%'),
    minOrderAmount: z.number().min(0, 'Số tiền đơn hàng tối thiểu phải lớn hơn hoặc bằng 0').optional(),
    maxDiscountAmount: z.number().min(0, 'Số tiền giảm tối đa phải lớn hơn hoặc bằng 0').optional(),
    usageLimit: z.number().min(1, 'Giới hạn sử dụng phải lớn hơn 0'),
    startDate: z.string({
      required_error: 'Ngày bắt đầu là bắt buộc'
    }),
    endDate: z.string({
      required_error: 'Ngày kết thúc là bắt buộc'
    }),
    isActive: z.boolean().default(true)
  })
  .refine(
    (data) => {
      if (data.type === 'PERCENTAGE' && data.value > 100) {
        return false
      }
      return true
    },
    {
      message: 'Giá trị phần trăm không được vượt quá 100%',
      path: ['value']
    }
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      return endDate > startDate
    },
    {
      message: 'Ngày kết thúc phải sau ngày bắt đầu',
      path: ['endDate']
    }
  )

export default function CreateDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 1,
      isActive: true
    }
  })

  const watchType = form.watch('type')

  const onSubmit = async () => {
    try {
      setLoading(true)

      // TODO: Replace with actual API call
      // await createDiscount(values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call onSuccess callback
      onSuccess?.()

      // Reset form
      form.reset()
    } catch {
      // TODO: Handle error properly
      // showErrorToast('Lỗi khi tạo mã giảm giá')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm mã giảm giá mới</DialogTitle>
          <DialogDescription>
            Tạo một mã giảm giá mới cho cửa hàng. Điền đầy đủ thông tin bên dưới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã giảm giá *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: SUMMER2024"
                        {...field}
                        className="font-mono"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên mã giảm giá *</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Giảm giá mùa hè" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết về mã giảm giá này..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giảm giá *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại giảm giá" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị giảm giá *{watchType === 'PERCENTAGE' ? ' (%)' : ' (VNĐ)'}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max={watchType === 'PERCENTAGE' ? '100' : undefined}
                        step={watchType === 'PERCENTAGE' ? '0.01' : '1000'}
                        placeholder={watchType === 'PERCENTAGE' ? '10' : '50000'}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Min Order Amount */}
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền đơn hàng tối thiểu (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="100000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Discount Amount */}
              <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền giảm tối đa (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="50000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Usage Limit */}
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới hạn số lần sử dụng *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>Tổng số lần mã này có thể được sử dụng</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} min={new Date().toISOString().slice(0, 16)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        min={form.watch('startDate') || new Date().toISOString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Is Active */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Trạng thái hoạt động</FormLabel>
                    <FormDescription>Bật để kích hoạt mã giảm giá ngay sau khi tạo</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo mã giảm giá'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
