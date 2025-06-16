import { GoogleLogin } from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import { googleLoginUserAPI } from '@/redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export function GoogleLoginButton() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // credentialResponse.credential contains the id_token (JWT)
      const result = await dispatch(googleLoginUserAPI(credentialResponse.credential))

      if (!result.error) {
        // Navigate to dashboard on successful login
        navigate('/dashboard')
        toast.success('Đăng nhập với Google thành công!')
      }
    } catch {
      toast.error('Đăng nhập với Google thất bại!')
    }
  }

  const handleGoogleError = () => {
    toast.error('Đăng nhập với Google thất bại!')
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  )
}
