import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye } from 'lucide-react'
import { formatDate } from '@/utils/formatters'

export function ReadDialog({ user }) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'USER':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'CLIENT':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên'
      case 'USER':
        return 'Nhân viên'
      case 'CLIENT':
        return 'Khách hàng'
      default:
        return 'Không xác định'
    }
  }

  const getStatusBadgeColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 hover:bg-green-100'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>Chi tiết thông tin của người dùng trong hệ thống.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.userName} className="object-cover" />
              <AvatarFallback className="text-xl">
                {user.userName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-right font-medium">ID:</div>
            <div className="col-span-2">{user.id}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-right font-medium">Tên người dùng:</div>
            <div className="col-span-2 font-medium">{user.userName}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-right font-medium">Email:</div>
            <div className="col-span-2">{user.email}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-right font-medium">Địa chỉ:</div>
            <div className="col-span-2">{user.address || 'Chưa cập nhật'}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-right font-medium">Vai trò:</div>
            <div className="col-span-2">
              <Badge className={getRoleBadgeColor(user.role)}>{getRoleDisplayName(user.role)}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-right font-medium">Trạng thái:</div>
            <div className="col-span-2">
              <Badge className={getStatusBadgeColor(user.isActive)}>
                {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-right font-medium">Ngày tạo:</div>
            <div className="col-span-2">{formatDate(user.createdAt)}</div>
          </div>

          {user.updatedAt && (
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-right font-medium">Cập nhật lần cuối:</div>
              <div className="col-span-2">{formatDate(user.updatedAt)}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
