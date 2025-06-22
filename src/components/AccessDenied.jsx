import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AccessDenied = ({
  title = 'Truy cập bị từ chối',
  message = 'Bạn không có quyền truy cập tính năng này.',
  description = 'Chỉ có Quản trị viên mới có thể truy cập tính năng này. Vui lòng liên hệ với quản trị viên nếu bạn cần quyền truy cập.'
}) => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">{message}</p>
          <p className="text-sm text-gray-500">{description}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccessDenied
