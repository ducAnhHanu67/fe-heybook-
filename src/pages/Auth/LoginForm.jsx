import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Label } from '@radix-ui/react-label'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { GoogleLoginButton } from '@/components/Auth/GoogleLoginButton'

import { loginUserAPI } from '@/redux/userSlice'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '@/utils/validatiors'

export function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await dispatch(loginUserAPI(data))

      if (!result.error) {
        const user = result.payload

        // Logic điều hướng theo role
        if (user.role === 'ADMIN' || user.role === 'USER') {
          // Chỉ ADMIN hoặc USER mới được vào dashboard
          navigate('/dashboard')
          toast.success('Đăng nhập thành công!')
        } else {
          // CLIENT không được vào dashboard, chuyển về trang chủ
          navigate('/')
          toast.success('Đăng nhập thành công!')
        }
      } else {
        toast.error(result.error?.message || 'Đăng nhập thất bại!')
      }
    } catch {
      toast.error('Có lỗi xảy ra khi đăng nhập!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <form
        className="flex w-full flex-1 flex-col gap-2 p-5 lg:px-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="text-muted-foreground px-3 text-sm font-medium text-wrap">
            Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn
          </p>
        </div>

        <div className="grid w-full gap-3 p-4 pb-0">
          <div className="grid w-full gap-1">
            <Label className="pl-[3px] font-medium" htmlFor="email">
              Email
            </Label>
            <Input
              className="z-1 h-10 w-full bg-white"
              id="email"
              type="email"
              placeholder="example@gmail.com"
              error={!!errors['email']}
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })}
            />
            <FieldAlertError errors={errors} fieldName={'email'} />
          </div>

          <div className="grid w-full gap-1">
            <Label className="pl-[3px] font-medium" htmlFor="password">
              Mật khẩu
            </Label>
            <Input
              className="z-1 h-10 w-full bg-white"
              id="password"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              error={!!errors['password']}
              {...register('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
            />
            <FieldAlertError errors={errors} fieldName={'password'} />

            <Link
              to="#"
              className="ml-auto pr-[2px] text-[15px] font-medium text-[#465fff] underline-offset-3 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" className="mt-2 h-10 w-full text-base" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <div className="after:border-border relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2 font-medium">Hoặc</span>
          </div>

          <GoogleLoginButton />

          <div className="my-1 flex w-full items-center justify-center gap-1 text-center text-sm">
            <p>Bạn chưa có tài khoản? </p>
            <Link
              to="/register"
              className="text-[15px] font-medium text-blue-600 underline underline-offset-4"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </form>
    </Card>
  )
}
