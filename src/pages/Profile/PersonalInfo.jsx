import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Save } from 'lucide-react'
import { selectCurrentUser, updateUserAPI } from '@/redux/userSlice'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { toast } from 'react-toastify'

export default function PersonalInfo() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const fileInputRef = useRef(null)

  const [profileData, setProfileData] = useState({
    userName: '',
    email: '',
    address: '',
    avatar: ''
  })

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        userName: currentUser.userName || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        avatar: currentUser.avatar || ''
      })
    }
  }, [currentUser])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh!')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 2MB!')
      return
    }

    setIsUploadingAvatar(true)

    try {
      const uploadResult = await uploadToCloudinary(file)
      setProfileData((prev) => ({
        ...prev,
        avatar: uploadResult.url
      }))

      if (profileErrors.avatar) {
        setProfileErrors((prev) => ({
          ...prev,
          avatar: ''
        }))
      }

      toast.success('Tải lên ảnh đại diện thành công!')
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tải lên ảnh!')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const validateProfileForm = () => {
    const errors = {}

    if (!profileData.userName.trim()) {
      errors.userName = 'Tên đăng nhập không được để trống'
    }

    if (!profileData.email.trim()) {
      errors.email = 'Email không được để trống'
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email không hợp lệ'
    }

    if (!profileData.avatar || !profileData.avatar.trim()) {
      errors.avatar = 'Avatar là bắt buộc'
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsUpdatingProfile(true)

    const payload = {
      userName: profileData.userName.trim(),
      email: profileData.email.trim(),
      address: profileData.address.trim(),
      avatar: profileData.avatar || currentUser.avatar
    }

    try {
      await dispatch(updateUserAPI(payload)).unwrap()
      toast.success('Cập nhật thông tin thành công!')
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profileData.avatar || currentUser.avatar} alt={currentUser.fullName} />
            <AvatarFallback className="text-lg">
              {currentUser.fullName?.charAt(0) || currentUser.userName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Label className="text-sm font-medium">Ảnh đại diện *</Label>
            <div className="mt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
              >
                <Camera className="h-4 w-4" />
                {isUploadingAvatar ? 'Đang tải lên...' : 'Thay đổi ảnh đại diện'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="mt-1 text-sm text-gray-500">JPG, PNG tối đa 2MB</p>
              {profileErrors.avatar && <p className="mt-1 text-sm text-red-500">{profileErrors.avatar}</p>}
            </div>
          </div>
        </div>

        <Separator />

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userName">Tên đăng nhập *</Label>
              <Input
                id="userName"
                name="userName"
                value={profileData.userName}
                onChange={handleProfileChange}
                placeholder="Nhập tên đăng nhập"
              />
              {profileErrors.userName && <p className="text-sm text-red-500">{profileErrors.userName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Nhập email"
              />
              {profileErrors.email && <p className="text-sm text-red-500">{profileErrors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isUpdatingProfile} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
