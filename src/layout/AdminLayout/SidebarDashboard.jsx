import { Home, BookText, ChartBarStacked, BookCopy, Package, TicketPercent, Truck, Users } from 'lucide-react'
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

// Menu items.
const items = [
  {
    title: 'Trang chủ',
    url: '/dashboard',
    icon: Home
  },
  {
    title: 'Quản lý danh mục',
    url: '/dashboard/categories',
    icon: ChartBarStacked
  },
  {
    title: 'Quản lý thể loại sách',
    url: '/dashboard/book-genres',
    icon: BookCopy
  },
  {
    title: 'Quản lý sản phẩm',
    url: '/dashboard/products',
    icon: Package
  },
  {
    title: 'Quản lý mã giảm giá',
    url: '/dashboard/discounts',
    icon: TicketPercent
  },
  {
    title: 'Quản lý đơn hàng',
    url: '/dashboard/discounts',
    icon: Truck
  },
  {
    title: 'Quản lý người dùng',
    url: '/dashboard/discounts',
    icon: Users
  }
]

export default function SidebarDashboard() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

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
          <button className="truncate text-xl font-semibold">HeyBook</button>
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
