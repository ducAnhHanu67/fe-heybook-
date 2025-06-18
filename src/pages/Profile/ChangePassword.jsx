import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { changePasswordAPI } from '@/redux/userSlice'
import { toast } from 'react-toastify'

export default function ChangePassword() {
  const dispatch = useDispatch()

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validatePasswordForm = () => {
    const errors = {}

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Mật khẩu hiện tại không được để trống'
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'Mật khẩu mới không được để trống'
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Xác nhận mật khẩu không được để trống'
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (passwordData.currentPassword === passwordData.newPassword && passwordData.currentPassword) {
      errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsChangingPassword(true)

    try {
      await dispatch(changePasswordAPI({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap()

      toast.success('Đổi mật khẩu thành công!')

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
        <CardDescription>
          Thay đổi mật khẩu để bảo mật tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại *</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu mới"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập lại mật khẩu mới"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <Alert>
            <AlertDescription>
              Mật khẩu phải có ít nhất 6 ký tự và khác với mật khẩu hiện tại.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              {isChangingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
