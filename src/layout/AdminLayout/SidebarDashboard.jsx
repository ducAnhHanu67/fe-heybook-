import { Home, BookText, ChartBarStacked, BookCopy, Package, TicketPercent, Truck, Users, MessageSquare } from 'lucide-react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAdminAccess } from '@/hooks/useAdminAccess'

// Menu items with permissions
const getMenuItems = (permissions) =>
  [
    {
      title: 'Trang chủ',
      url: '/dashboard',
      icon: Home,
      permission: null // Always visible
    },
    {
      title: 'Quản lý danh mục',
      url: '/dashboard/categories',
      icon: ChartBarStacked,
      permission: 'canManageCategories'
    },
    {
      title: 'Quản lý thể loại sách',
      url: '/dashboard/book-genres',
      icon: BookCopy,
      permission: 'canManageBookGenres'
    },
    {
      title: 'Quản lý hãng',
      url: '/dashboard/brands',
      icon: BookCopy,
      permission: 'canManageBookGenres'
    },
    {
      title: 'Quản lý sản phẩm',
      url: '/dashboard/products',
      icon: Package,
      permission: 'canManageProducts'
    },
    {
      title: 'Quản lý mã giảm giá',
      url: '/dashboard/discounts',
      icon: TicketPercent,
      permission: 'canManageDiscounts'
    },
    {
      title: 'Quản lý đơn hàng',
      url: '/dashboard/orders',
      icon: Truck,
      permission: 'canManageOrders'
    },
    {
      title: 'Quản lý người dùng',
      url: '/dashboard/users',
      icon: Users,
      permission: 'canManageUsers'
    },
    {
      title: 'Chat hỗ trợ',
      url: '/dashboard/livechat',
      icon: MessageSquare
    }
  ].filter((item) => !item.permission || permissions[item.permission])

export default function SidebarDashboard() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const permissions = useAdminAccess()

  const items = getMenuItems(permissions)

  return (
    <Sidebar collapsible="icon" className="border-gray-300 bg-white">
      <SidebarHeader className={cn('items-center bg-white', isCollapsed ? 'h-11 justify-center' : 'pl-3')}>
        <div
          className={cn(
            'bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center rounded-lg',
            isCollapsed ? 'size-8' : 'mr-1 size-10'
          )}
        >
          <BookText className={isCollapsed ? 'size-4' : 'size-5'} />
        </div>
        <div className={cn('grid text-left text-sm leading-tight', isCollapsed && 'hidden')}>
          <button className="truncate text-xl font-semibold">RoboticWorld</button>
          <span className="truncate text-xs">Trang quản lý</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 gap-3 text-base font-medium">
                    <Link to={item.url}>
                      <item.icon className="!size-5 h-10 w-10" strokeWidth="1.8" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
