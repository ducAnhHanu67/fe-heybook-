import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { productSchema } from '@/utils/validatiors'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import { createProductAPI } from '@/apis'
import { Textarea } from '@/components/ui/textarea'

export default function CreateDialog({ categories, bookGenres }) {
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(productSchema),
    shouldUnregister: true,
    defaultValues: {
      highlights: []
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights'
  })

  const type = watch('type')

  const handleSelectCategory = (val) => {
    const categoryBookId = categories?.find(
      (cat) => cat.name.normalize('NFD').toLowerCase() === 'sách'.normalize('NFD').toLowerCase()
    )?.id
    const selectedCategory = categories.find((cat) => cat.id === Number(val))
    if (selectedCategory?.id === categoryBookId) {
      setValue('type', 'BOOK')
    } else {
      setValue('type', 'STATIONERY')
    }
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0]
    setCoverFile(file)
    setCoverPreviewUrl(URL.createObjectURL(file))
  }

  const removeCoverImage = () => {
    setCoverFile(null)
    setCoverPreviewUrl('')
    setValue('coverImageUrl', null, { shouldValidate: true })
  }

  const createProduct = async (data) => {
    // Tách riêng FormData và các phần text/object
    console.log(data, 'da su huynh');

    const formData = new FormData()
    const { bookDetail, stationeryDetail, ...rest } = data

    const payload = {
      ...rest,
      ...(data.type === 'BOOK' ? { bookDetail } : {}),
      ...(data.type === 'STATIONERY' ? { stationeryDetail } : {}),
      highlights: data.highlights?.reduce((acc, item) => {
        if (item.key && item.value) {
          acc[item.key] = item.value
        }
        return acc
      }, {}) || {}
    }
    // Hàm đệ quy để append payload nested dưới dạng bracket-notation
    const appendPayload = (obj, parentKey = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value == null || value === '') return // bỏ qua null/empty

        // ⚡ Bỏ qua coverImageUrl vì sẽ xử lý riêng ở dưới
        if (key === 'coverImageUrl') return

        const name = parentKey ? `${parentKey}[${key}]` : key

        if (value instanceof Date) {
          formData.append(name, value.toISOString())
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          appendPayload(value, name)
        } else {
          formData.append(name, value)
        }
      })
    }

    appendPayload(payload)

    // Cuối cùng thêm file:
    if (coverFile) {
      formData.append('coverImageUrl', coverFile, coverFile.name)
    }

    try {
      await toast.promise(createProductAPI(formData), {
        pending: 'Đang tạo sản phẩm…'
      })
      toast.success('Thêm sản phẩm thành công!')
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const onValid = (data) => {
    console.log('✅ onValid, data:', data)
    createProduct(data)
  }
  const onInvalid = (errors) => {
    console.log('❌ onInvalid, errors:', errors)
    // In ra toàn bộ data hiện tại của form
    console.log('📌 current form data:', getValues())
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto gap-1 pl-10">
          <Plus />
          Thêm sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm</DialogTitle>
          <DialogDescription>Nhập sản phẩm bạn muốn thêm vào danh sách.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          <div className="flex max-h-[520px] w-full scroll-py-0 flex-col gap-3 overflow-y-auto px-2 py-3">
            {/* name */}
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 gap-0 pl-[3px]" htmlFor="name">
                Tên sản phẩm<span className="text-red-500">*</span>
              </Label>
              <Input
                className="z-1 h-10 w-full bg-white"
                id="name"
                type="text"
                placeholder="VD: Trường Ca Achilles"
                {...register('name')}
              />
              <FieldAlertError errors={errors} fieldName={'name'} />
            </div>

            {/* categoryId */}
            <div className="flex w-[250px] flex-col gap-1.5">
              <Label className="gap-0 pl-[3px]">
                Danh mục<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value || '')}
                    onValueChange={(val) => {
                      field.onChange(Number(val))
                      handleSelectCategory(val)
                    }}
                  >
                    <SelectTrigger className="z-1 mb-[-3px] w-[250px] bg-white">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldAlertError errors={errors} fieldName="categoryId" />
              <Input type="hidden" {...register('type')} />
            </div>

            {/* bookDetail */}
            {type === 'BOOK' && (
              <>
                <div className="flex w-[250px] flex-col gap-1.5">
                  <Label className="gap-0 pl-[3px]">
                    Thể loại sách<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="bookDetail.bookGenreId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={String(field.value || '')}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="z-1 mb-[-3px] w-[250px] bg-white">
                          <SelectValue placeholder="Chọn thể loại" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px]">
                          {bookGenres.map((genre) => (
                            <SelectItem key={genre.id} value={String(genre.id)}>
                              {genre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldAlertError errors={errors} fieldName="bookDetail.bookGenreId" />
                </div>

                {/* author */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="author">
                    Tác giả<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="author"
                    type="text"
                    {...register('bookDetail.author')}
                    placeholder="VD: Nguyễn Văn A"
                  />
                  <FieldAlertError errors={errors} fieldName="bookDetail.author" />
                </div>

                {/* translator */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 pl-[3px] font-medium italic" htmlFor="translator">
                    Người dịch (Nếu có)
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="translator"
                    type="text"
                    {...register('bookDetail.translator')}
                  />
                  <FieldAlertError errors={errors} fieldName="bookDetail.translator" />
                </div>

                {/* language */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="language">
                    Ngôn ngữ<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="language"
                    type="text"
                    {...register('bookDetail.language')}
                  />
                  <FieldAlertError errors={errors} fieldName="bookDetail.language" />
                </div>

                {/* publisher */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="publisher">
                    Nhà xuất bản<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="publisher"
                    type="text"
                    {...register('bookDetail.publisher')}
                  />
                  <FieldAlertError errors={errors} fieldName="bookDetail.publisher" />
                </div>

                {/* publishYear */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] font-medium italic" htmlFor="publishYear">
                    Năm xuất bản<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="publishYear"
                    type="text"
                    {...register('bookDetail.publishYear')}
                  />
                  <FieldAlertError errors={errors} fieldName="bookDetail.publishYear" />
                </div>

                {/* pageCount */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="pageCount">
                    Số trang<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="pageCount"
                    type="text"
                    {...register('bookDetail.pageCount')}
                  />
                  <FieldAlertError errors={errors} fieldName="bookDetail.pageCount" />
                </div>
              </>
            )}

            {type === 'STATIONERY' && (
              <>
                {/* brand */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="brand">
                    Thương hiệu<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="brand"
                    type="text"
                    {...register('stationeryDetail.brand')}
                    placeholder="VD: Nguyễn Văn A"
                  />
                  <FieldAlertError errors={errors} fieldName="stationeryDetail.brand" />
                </div>

                {/* placeProduction */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="placeProduction">
                    Nơi sản xuất<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="placeProduction"
                    type="text"
                    {...register('stationeryDetail.placeProduction')}
                    placeholder="VD: Nguyễn Văn A"
                  />
                  <FieldAlertError errors={errors} fieldName="stationeryDetail.placeProduction" />
                </div>

                {/* color */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="color">
                    Màu sắc (Nếu có)
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="color"
                    type="text"
                    {...register('stationeryDetail.color')}
                  />
                  <FieldAlertError errors={errors} fieldName="stationeryDetail.color" />
                </div>

                {/* material */}
                <div className="flex w-full flex-col gap-1">
                  <Label className="mb-1 gap-0 pl-[3px] italic" htmlFor="material">
                    Chất liệu (Nếu có)
                  </Label>
                  <Input
                    className="z-1 h-10 w-full bg-white"
                    id="material"
                    type="text"
                    {...register('stationeryDetail.material')}
                  />
                  <FieldAlertError errors={errors} fieldName="stationeryDetail.material" />
                </div>
              </>
            )}

            {/* price */}
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 gap-0 pl-[3px]" htmlFor="price">
                Giá<span className="text-red-500">*</span>
              </Label>
              <Input className="z-1 h-10 w-full bg-white" id="price" type="text" {...register('price')} />
              <FieldAlertError errors={errors} fieldName="price" />
            </div>
            {/* discount */}
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 gap-0 pl-[3px]" htmlFor="discount">
                Giảm giá(%)<span className="text-red-500">*</span>
              </Label>
              <Input
                className="z-1 h-10 w-full bg-white"
                id="discount"
                type="text"
                {...register('discount')}
              />
              <FieldAlertError errors={errors} fieldName="discount" />
            </div>
            {/* stock */}
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 gap-0 pl-[3px]" htmlFor="stock">
                Số lượng<span className="text-red-500">*</span>
              </Label>
              <Input className="z-1 h-10 w-full bg-white" id="stock" type="text" {...register('stock')} />
              <FieldAlertError errors={errors} fieldName="stock" />
            </div>
            {/* description */}
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-1 gap-0 pl-[3px]">
                Mô tả<span className="text-red-500">*</span>
              </Label>
              <Textarea className="z-1 h-30 bg-white" {...register('description')} />
              <FieldAlertError errors={errors} fieldName="description" />
            </div>
            {/* Ảnh */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="coverImageUrl" className="gap-0 pl-[3px]">
                Ảnh bìa<span className="text-red-500">*</span>
              </Label>

              <Input
                type="file"
                id="coverImageUrl"
                accept="image/*"
                className="z-1 bg-white"
                {...register('coverImageUrl', {
                  // RHF sẽ merge handler này với onChange của nó
                  onChange: (e) => {
                    handleCoverImageChange(e)
                  }
                })}
              />
              <FieldAlertError errors={errors} fieldName="coverImageUrl" />

              {coverPreviewUrl && (
                <div className="relative mx-auto mt-1 h-34 w-34">
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    className="h-full w-full rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-1 right-1 rounded bg-red-500 p-0.5 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col gap-1">
              {/* dimension */}
              <Label className="mb-1 pl-[3px]" htmlFor="dimension">
                Kích thước (Nếu có)
              </Label>
              <Input
                className="z-1 h-10 w-full bg-white"
                id="dimension"
                type="text"
                {...register('dimension')}
              />
            </div>
            {/* flashSale */}
            <div className="flex w-full flex-col gap-1 mt-3">
              <Label className="mb-1 pl-[3px]" htmlFor="flashPrice">
                Giá Flash Sale (nếu có)
              </Label>
              <Input
                className="z-1 h-10 w-full bg-white"
                id="flashPrice"
                type="number"
                {...register('flashSale.flashPrice')}
                placeholder="VD: 80000"
              />
              <FieldAlertError errors={errors} fieldName="flashSale.flashPrice" />
            </div>

            <div className="flex w-full gap-3">
              <div className="flex flex-col flex-1 gap-1">
                <Label className="mb-1 pl-[3px]" htmlFor="startTime">
                  Bắt đầu Flash Sale
                </Label>
                <Input
                  className="z-1 h-10 w-full bg-white"
                  id="startTime"
                  type="datetime-local"
                  {...register('flashSale.startTime')}
                />
                <FieldAlertError errors={errors} fieldName="flashSale.startTime" />
              </div>

              <div className="flex flex-col flex-1 gap-1">
                <Label className="mb-1 pl-[3px]" htmlFor="endTime">
                  Kết thúc Flash Sale
                </Label>
                <Input
                  className="z-1 h-10 w-full bg-white"
                  id="endTime"
                  type="datetime-local"
                  {...register('flashSale.endTime')}
                />
                <FieldAlertError errors={errors} fieldName="flashSale.endTime" />
              </div>
            </div>


            {/* Đặc điểm nổi bật */}
            <div className="flex w-full flex-col gap-2 mt-3">
              <Label className="mb-1 pl-[3px]">Đặc điểm nổi bật</Label>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input
                    className="z-1 h-10 w-1/2 bg-white"
                    placeholder="Thuộc tính"
                    {...register(`highlights.${index}.key`)}
                  />
                  <Input
                    className="z-1 h-10 w-1/2 bg-white"
                    placeholder="Giá trị"
                    {...register(`highlights.${index}.value`)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    className="px-2"
                    onClick={() => remove(index)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="mt-1 w-32 border border-blue-500 text-blue-500"
                onClick={() => append({ key: '', value: '' })}
              >
                + Thêm đặc điểm
              </Button>
            </div>

          </div>

          <DialogFooter className="mt-2 mr-4">
            <DialogClose asChild>
              <Button type="button" className="ml-auto w-20 bg-gray-500 hover:bg-gray-600">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" className="w-25">
              Xác nhận
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
