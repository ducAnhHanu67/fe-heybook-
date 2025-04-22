import { useLocation } from 'react-router-dom'
import { GalleryVerticalEnd } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export default function AuthPage() {
  const location = useLocation()

  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  return (
    <div className="min-h-svh w-full lg:flex lg:flex-row lg:items-center lg:justify-between">
      <div className="hidden text-center lg:block lg:w-1/2">
        <h1 className="text-4xl font-medium">HeyBook</h1>
      </div>

      <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 lg:w-1/2">
        <a href="" className="mt-3 flex gap-2 text-lg font-semibold lg:hidden">
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          HeyBook
        </a>

        <div className="w-full md:max-w-6/10 lg:max-w-8/10">
          {isLogin && <LoginForm />}
          {isRegister && <RegisterForm />}
        </div>
      </div>
    </div>
  )
}
