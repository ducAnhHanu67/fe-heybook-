import { useCallback, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAllOrdersAdminAPI } from '@/apis'
import ViewOrderDialog from './Dialog/ViewOrderDialog'
import UpdateOrderStatusDialog from './Dialog/UpdateOrderStatusDialog'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@/utils/constant'
import { Search, Eye, Edit } from 'lucide-react'
import { formatPriceWithCurrency, formatDate } from '@/utils/formatters'

// Custom hook debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function Orders() {
  const [orders, setOrders] = useState({ data: [], count: 0 })
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE)

  const totalPages = Math.ceil(orders.count / DEFAULT_ITEMS_PER_PAGE)

  // Debounce search input
  const debouncedSearchTerm = useDebounce(searchInput, 500)

  const fetchOrders = useCallback(async (page, search = '') => {
    setLoading(true)
    try {
      const filters = search ? { search } : {}
      const data = await getAllOrdersAdminAPI(page, DEFAULT_ITEMS_PER_PAGE, filters)
      setOrders(data)
    } catch {
      // Handle error silently or show toast notification
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchOrders(1, '')
  }, [fetchOrders])

  // Handle debounced search - reset to page 1 when searching
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setCurrentPage(1)
      fetchOrders(1, debouncedSearchTerm.trim())
    } else {
      // When search is cleared, fetch all orders on page 1
      setCurrentPage(1)
      fetchOrders(1, '')
    }
  }, [debouncedSearchTerm, fetchOrders])

  // Reset to page 1 if current page exceeds total pages after data fetch
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
      fetchOrders(1, debouncedSearchTerm.trim())
    }
  }, [currentPage, totalPages, debouncedSearchTerm, fetchOrders])

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchOrders(page, debouncedSearchTerm.trim())
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', label: 'Chờ xử lý' },
      CONFIRMED: { variant: 'default', label: 'Đã xác nhận' },
      PROCESSING: { variant: 'default', label: 'Đang xử lý' },
      SHIPPED: { variant: 'default', label: 'Đã gửi' },
      DELIVERED: { variant: 'default', label: 'Đã giao' },
      CANCELLED: { variant: 'destructive', label: 'Đã hủy' },
      RETURNED: { variant: 'destructive', label: 'Đã trả' }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', label: 'Chờ thanh toán' },
      PAID: { variant: 'default', label: 'Đã thanh toán' },
      FAILED: { variant: 'destructive', label: 'Thất bại' },
      REFUNDED: { variant: 'destructive', label: 'Đã hoàn tiền' }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="mt-4 flex items-center justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                    1
                  </PaginationLink>
                </PaginationItem>
                {startPage > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  }

  return (
    <div className="mt-1 flex flex-1 flex-col">
      <div className="flex-1 rounded-2xl border border-gray-300 bg-white p-3 pb-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mt-2 flex items-center justify-center">
          <h1 className="text-2xl font-semibold">QUẢN LÝ ĐƠN HÀNG</h1>
        </div>

        <div className="mx-8">
          <div className="mt-2 flex justify-between">
            {/* Search */}
            <div className="relative w-1/4">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                className="border-gray-300 pl-10"
                placeholder="Tìm kiếm theo mã đơn hàng, email..."
                onChange={handleSearchChange}
                value={searchInput}
              />
            </div>
            {/* Stats */}
            <div className="text-sm text-gray-600">Tổng cộng: {orders.count} đơn hàng</div>
          </div>

          {/* Orders Table */}
          <div className="mt-3 rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 hover:bg-gray-200">
                  <TableHead className="rounded-tl-md">Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-[90px] rounded-tr-md">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">
                      Không có đơn hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.data.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.recipientName}</div>
                          <div className="text-sm text-gray-600">{order.recipientEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPriceWithCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <ViewOrderDialog orderId={order.id}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </ViewOrderDialog>
                          <UpdateOrderStatusDialog
                            orderId={order.id}
                            currentStatus={order.status}
                            onRefresh={fetchOrders}
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </UpdateOrderStatusDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>
      </div>
    </div>
  )
}
