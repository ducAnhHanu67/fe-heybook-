import { Link, useNavigate } from 'react-router-dom'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '@/utils/validatiors'
import { useForm } from 'react-hook-form'
import FieldAlertError from '@/components/Form/FieldAlertError'
import { registerUserAPI } from '@/apis'
import { toast } from 'react-toastify'
import { GoogleLoginButton } from '@/components/Auth/GoogleLoginButton'

export function RegisterForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const submitRegister = (data) => {
    const { email, password } = data
    toast
      .promise(registerUserAPI({ email, password }), {
        pending: 'Đang đăng ký...'
      })
      .then((user) => {
        navigate(`/login?registeredEmail=${user.email}`)
      })
  }

  return (
    <Card className="w-full">
      <form
        className="flex w-full flex-1 flex-col gap-2 p-5 lg:px-6"
        onSubmit={handleSubmit(submitRegister)}
        noValidate
      >
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Đăng ký</h1>
          <p className="text-muted-foreground px-3 text-sm font-medium text-wrap">
            Nhập email và mật khẩu để đăng ký!
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
              placeholder="Nhập mật khẩu của bạn"
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
          </div>
          <div className="grid w-full gap-1">
            <Label className="pl-[3px] font-medium" htmlFor="password-confirmation">
              Nhập lại mật khẩu
            </Label>
            <Input
              className="z-1 h-10 w-full bg-white"
              id="password-confirmation"
              type="password"
              {...register('password-confirmation', {
                validate: (value) => {
                  if (value === watch('password')) return true
                  return PASSWORD_CONFIRMATION_MESSAGE
                }
              })}
            />
            <FieldAlertError errors={errors} fieldName={'password-confirmation'} />
          </div>
          <Button type="submit" className="mt-2 h-10 w-full text-base">
            Đăng ký
          </Button>{' '}
          <div className="after:border-border relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2 font-medium">Hoặc</span>
          </div>
          <GoogleLoginButton />
          <div className="my-1 flex w-full items-center justify-center gap-1 text-center text-sm">
            <p>Bạn đã có tài khoản? </p>
            <Link to="/login" className="text-[15px] font-medium text-blue-600 underline underline-offset-4">
              Đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </Card>
  )
}
