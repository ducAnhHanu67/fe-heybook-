import { Routes, Route } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import SidebarDashboard from '@/layout/AdminLayout/SidebarDashboard'
import HeaderDashboard from '@/layout/AdminLayout/HeaderDashboard'
import Categories from './Categories/Categories'

export default function Dashboard() {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <SidebarDashboard />
      <SidebarInset>
        <div className="flex h-screen flex-col">
          {/* Header */}
          <HeaderDashboard />

          {/* Content */}
          <div className="flex w-full flex-1 flex-col bg-gray-100 p-4 md:px-4 md:py-1 md:pt-1.5">
            {/* Routes */}
            <Routes>
              <Route path="/categories/*" element={<Categories />} />
            </Routes>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
