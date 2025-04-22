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
            <Label
              className="pl-[3px] font-medium"
              htmlFor="password-confirmation"
            >
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
            <FieldAlertError
              errors={errors}
              fieldName={'password-confirmation'}
            />
          </div>

          <Button type="submit" className="mt-2 h-10 w-full text-base">
            Đăng ký
          </Button>

          <div className="after:border-border relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2 font-medium">
              Hoặc
            </span>
          </div>
          <Button
            variant="outline"
            type="button"
            className="h-10 w-full gap-1.5 bg-[#f2f4f7] text-base hover:bg-[#e4e7ec]"
          >
            <svg
              viewBox="-3 0 262 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              fill="#000000"
              className="mr-2 h-5 w-5"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                ></path>
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                ></path>
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                ></path>
              </g>
            </svg>
            Đăng nhập với Google
          </Button>

          <div className="my-1 flex w-full items-center justify-center gap-1 text-center text-sm">
            <p>Bạn đã có tài khoản? </p>
            <Link
              to="/login"
              className="text-[15px] font-medium text-blue-600 underline underline-offset-4"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </Card>
  )
}
