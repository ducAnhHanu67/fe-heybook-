import { useState, useEffect } from 'react'
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
import { Pencil, X } from 'lucide-react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { productSchema } from '@/utils/validatiors'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { toast } from 'react-toastify'
import { updateProductAPI, getBrandsByCategoryAPI } from '@/apis'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'

export default function UpdateDialog({ product, categories, fetchData }) {
  const [open, setOpen] = useState(false)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(product?.coverImageUrl || '')
  const [brands, setBrands] = useState([])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(productSchema),
    shouldUnregister: true,
    defaultValues: {
      ...product,
      highlights: Object.entries(product?.highlights || {}).map(([key, value]) => ({ key, value }))
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights'
  })

  useEffect(() => {
    if (open && product?.categoryId) {
      handleSelectCategory(product.categoryId)
    }
  }, [open])

  const handleSelectCategory = async (val) => {
    try {
      const res = await getBrandsByCategoryAPI(Number(val))
      setBrands(res.data || [])
    } catch (err) {
      console.error(err)
      setBrands([])
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

  const updateProduct = async (data) => {
    const formData = new FormData()
    const { ...rest } = data

    const payload = {
      ...rest,
      highlights:
        data.highlights?.reduce((acc, item) => {
          if (item.key && item.value) acc[item.key] = item.value
          return acc
        }, {}) || {}
    }

    const appendPayload = (obj, parentKey = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value == null || value === '') return
        if (key === 'coverImageUrl') return
        const name = parentKey ? `${parentKey}[${key}]` : key
        if (typeof value === 'object' && !Array.isArray(value)) {
          appendPayload(value, name)
        } else {
          formData.append(name, value)
        }
      })
    }
    appendPayload(payload)

    if (coverFile) {
      formData.append('coverImageUrl', coverFile, coverFile.name)
    }

    try {
      await toast.promise(updateProductAPI(product.id, formData), {
        pending: 'Đang cập nhật sản phẩm…'
      })
      toast.success('Cập nhật sản phẩm thành công!')
      if (fetchData) fetchData()
      setOpen(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const onValid = (data) => {
    updateProduct(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="cursor-pointer text-gray-600 hover:text-blue-600 dark:text-gray-400">
          <Pencil size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Sửa sản phẩm</DialogTitle>
          <DialogDescription>Cập nhật thông tin sản phẩm.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)}>
          <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto px-2 py-3">
            {/* name */}
            <div className="flex flex-col gap-1">
              <Label>Tên sản phẩm<span className="text-red-500">*</span></Label>
              <Input className="bg-white" {...register('name')} defaultValue={product?.name} />
              <FieldAlertError errors={errors} fieldName="name" />
            </div>

            {/* category */}
            <div className="flex w-[250px] flex-col gap-1.5">
              <Label>Danh mục<span className="text-red-500">*</span></Label>
              <Controller
                name="categoryId"
                control={control}
                defaultValue={product?.categoryId}
                render={({ field }) => (
                  <Select
                    value={String(field.value || '')}
                    onValueChange={(val) => {
                      field.onChange(Number(val))
                      handleSelectCategory(val)
                    }}
                  >
                    <SelectTrigger className="bg-white">
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
            </div>

            {/* brand */}
            {brands.length > 0 && (
              <div className="flex w-[250px] flex-col gap-1.5">
                <Label>Hãng<span className="text-red-500">*</span></Label>
                <Controller
                  name="brandId"
                  control={control}
                  defaultValue={product?.brandId}
                  render={({ field }) => (
                    <Select
                      value={String(field.value || '')}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Chọn hãng" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[250px]">
                        {brands?.map((brand) => (
                          <SelectItem key={brand.id} value={String(brand.id)}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldAlertError errors={errors} fieldName="brandId" />
              </div>
            )}

            {/* price, discount, stock */}
            <div className="flex flex-col gap-1">
              <Label>Giá<span className="text-red-500">*</span></Label>
              <Input className="bg-white" {...register('price')} defaultValue={product?.price} />
              <FieldAlertError errors={errors} fieldName="price" />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Giảm giá (%)<span className="text-red-500">*</span></Label>
              <Input className="bg-white" {...register('discount')} defaultValue={product?.discount} />
              <FieldAlertError errors={errors} fieldName="discount" />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Số lượng<span className="text-red-500">*</span></Label>
              <Input className="bg-white" {...register('stock')} defaultValue={product?.stock} />
              <FieldAlertError errors={errors} fieldName="stock" />
            </div>

            {/* flashSale */}
            <div className="flex flex-col gap-1 mt-3">
              <Label>Giá Flash Sale</Label>
              <Input className="bg-white" type="number" {...register('flashSale.flashPrice')} defaultValue={product?.flashSale?.flashPrice} />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col flex-1 gap-1">
                <Label>Bắt đầu Flash Sale</Label>
                <Input className="bg-white" type="datetime-local" {...register('flashSale.startTime')} defaultValue={product?.flashSale?.startTime} />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <Label>Kết thúc Flash Sale</Label>
                <Input className="bg-white" type="datetime-local" {...register('flashSale.endTime')} defaultValue={product?.flashSale?.endTime} />
              </div>
            </div>

            {/* description */}
            <div className="flex flex-col gap-1">
              <Label>Mô tả<span className="text-red-500">*</span></Label>
              <Controller
                name="description"
                control={control}
                defaultValue={product?.description}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value || ''}
                    onChange={(event, editor) => field.onChange(editor.getData())}
                  />
                )}
              />
              <FieldAlertError errors={errors} fieldName="description" />
            </div>

            {/* highlights */}
            <div className="flex flex-col gap-2 mt-3">
              <Label>Đặc điểm nổi bật</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input className="bg-white w-1/2" {...register(`highlights.${index}.key`)} defaultValue={field.key} placeholder="Thuộc tính" />
                  <Input className="bg-white w-1/2" {...register(`highlights.${index}.value`)} defaultValue={field.value} placeholder="Giá trị" />
                  <Button type="button" variant="destructive" className="px-2" onClick={() => remove(index)}>
                    <X size={14} />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-32 border border-blue-500 text-blue-500" onClick={() => append({ key: '', value: '' })}>
                + Thêm đặc điểm
              </Button>
            </div>

            {/* coverImage */}
            <div className="flex flex-col gap-1">
              <Label>Ảnh bìa<span className="text-red-500">*</span></Label>
              <Input type="file" accept="image/*" className="bg-white" onChange={handleCoverImageChange} />
              {coverPreviewUrl && (
                <div className="relative mx-auto mt-1 h-34 w-34">
                  <img src={coverPreviewUrl} alt="Cover preview" className="h-full w-full rounded object-cover" />
                  <button type="button" onClick={removeCoverImage} className="absolute top-1 right-1 rounded bg-red-500 p-0.5 text-white">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* dimension */}
            <div className="flex flex-col gap-1">
              <Label>Kích thước</Label>
              <Input className="bg-white" {...register('dimension')} defaultValue={product?.dimension} />
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
