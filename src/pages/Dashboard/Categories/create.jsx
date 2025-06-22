// import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { categorySchema } from '@/utils/validatiors'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { createCategoryAPI } from '@/apis'
import { toast } from 'react-toastify'

export default function Create() {
  // const nameRef = useRef(null)
  // const descriptionRef = useRef(null)
  // const createCategory = (e) => {
  //   e.preventDefault()
  //   const data = {
  //     name: nameRef.current?.value || '',
  //     description: descriptionRef.current?.value || ''
  //   }
  //   createCategoryAPI(data).then((res) => {
  //     nameRef.current.value = ''
  //     descriptionRef.current.value = ''
  //   })
  // }
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(categorySchema)
  })

  const createCategory = (data) => {
    const { name, description } = data
    // console.log(data)
    createCategoryAPI({ name, description }).then((res) => {
      if (!res.error) toast.success('Thêm danh mục thành công!')
    })
  }

  return (
    <form
      // onSubmit={createCategory}
      onSubmit={handleSubmit(createCategory)}
      className="flex flex-1 flex-col items-center"
    >
      <p className="self-start p-4 text-lg font-medium">Tạo danh mục</p>
      <div className="flex w-1/2 flex-col items-center justify-center gap-3 p-4 pb-0">
        <div className="flex w-full flex-col gap-1">
          <Label className="pl-[3px] font-medium" htmlFor="name">
            Tên danh mục
          </Label>
          <Input
            className="z-1 h-10 w-full bg-white"
            id="name"
            type="text"
            placeholder="VD: Bút bi"
            // ref={nameRef}
            error={!!errors['name']}
            {...register('name')}
          />
          <FieldAlertError errors={errors} fieldName={'name'} />
        </div>

        <div className="flex w-full flex-col gap-1">
          <Label className="pl-[3px] font-medium" htmlFor="description">
            Mô tả
          </Label>
          <Textarea
            className="z-1 h-10 w-full bg-white"
            id="description"
            placeholder="Nếu có..."
            // ref={descriptionRef}
            {...register('description')}
          />
          <FieldAlertError errors={errors} fieldName={'description'} />
        </div>

        <Button type="submit" className="ml-auto h-10 text-base">
          Xác nhận
        </Button>
      </div>
    </form>
  )
}
