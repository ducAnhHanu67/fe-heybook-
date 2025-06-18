import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import CreateDialog from './Dialog/CreateDialog'
import UpdateDialog from './Dialog/UpdateDialog'
import DeleteDialog from './Dialog/DeleteDialog'
import ReadDialog from './Dialog/ReadDialog'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@/utils/constant'
import { getCouponsAPI } from '@/apis'

export default function Discounts() {
  const location = useLocation()

  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [readDialogOpen, setReadDialogOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState(null)

  // Pagination
  const query = new URLSearchParams(location.search)
  const currentPage = query.get('page') || DEFAULT_PAGE
  const totalPages = Math.ceil(totalCount / DEFAULT_ITEMS_PER_PAGE)

  // Fetch discounts data
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true)
        const searchPath = `?page=${currentPage}&limit=${DEFAULT_ITEMS_PER_PAGE}`
        const response = await getCouponsAPI(searchPath)

        setDiscounts(response.coupons || [])
        setTotalCount(response.totalItems || 0)
      } catch {
        setDiscounts([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscounts()
  }, [currentPage])

  // Refetch data function
  const refetchDiscounts = async () => {
    try {
      setLoading(true)
      const searchPath = `?page=${currentPage}&limit=${DEFAULT_ITEMS_PER_PAGE}`
      const response = await getCouponsAPI(searchPath)

      setDiscounts(response.coupons || [])
      setTotalCount(response.totalItems || 0)
    } catch {
      setDiscounts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCreateDialogOpen(true)
  }

  const handleEdit = (discount) => {
    setSelectedDiscount(discount)
    setUpdateDialogOpen(true)
  }

  const handleDelete = (discount) => {
    setSelectedDiscount(discount)
    setDeleteDialogOpen(true)
  }

  const handleView = (discount) => {
    setSelectedDiscount(discount)
    setReadDialogOpen(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDiscountDisplay = (discount) => {
    if (discount.type === 'PERCENTAGE') {
      return `${discount.value}%`
    } else {
      const value = typeof discount.value === 'string' ? parseFloat(discount.value) : discount.value
      return `${value.toLocaleString('vi-VN')}₫`
    }
  }

  const getStatusBadge = (discount) => {
    if (!discount.isActive) {
      return <Badge variant="secondary">Tạm dừng</Badge>
    }

    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    if (now < startDate) {
      return <Badge variant="outline">Chưa bắt đầu</Badge>
    }
    if (now > endDate) {
      return <Badge variant="destructive">Đã hết hạn</Badge>
    }
    return <Badge variant="default">Đang hoạt động</Badge>
  }

  return (
    <div className="mt-1 flex flex-1 flex-col">
      <div className="flex-1 rounded-2xl border border-gray-300 bg-white p-3 pb-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mt-2 flex items-center justify-center">
          <h1 className="text-2xl font-semibold">QUẢN LÝ MÃ GIẢM GIÁ</h1>
        </div>

        {/* Content */}
        <div className="mx-8">
          <div className="mt-2 flex justify-end">
            {/* Create */}
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm mã giảm giá
            </Button>
          </div>

          {/* Table */}
          <div className="mt-3 rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 hover:bg-gray-200">
                  <TableHead className="rounded-tl-md">Mã giảm giá</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Đã dùng/Giới hạn</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="rounded-tr-md text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center">
                      Không tìm thấy mã giảm giá nào
                    </TableCell>
                  </TableRow>
                ) : (
                  discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div className="font-mono font-semibold text-blue-600">{discount.code}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{discount.name}</div>
                        <div className="text-muted-foreground line-clamp-1 text-sm">
                          {discount.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {discount.type === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">{getDiscountDisplay(discount)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium">{discount.usedCount}</span>
                          <span className="text-muted-foreground">/{discount.usageLimit}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                          <div
                            className="h-1.5 rounded-full bg-blue-600"
                            style={{
                              width: `${Math.min((discount.usedCount / discount.usageLimit) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(discount.startDate)}</div>
                          <div className="text-muted-foreground">đến {formatDate(discount.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(discount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(discount)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(discount)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(discount)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalCount > DEFAULT_ITEMS_PER_PAGE && (
            <Pagination className="mt-5">
              <PaginationContent>
                {/* Pagination Previous */}
                <PaginationItem>
                  <Link to={`${location.pathname}?page=${Math.max(1, Number(currentPage) - 1)}`}>
                    <PaginationPrevious />
                  </Link>
                </PaginationItem>

                {/* Pagination Number */}
                {Array.from({ length: Math.min(totalPages - 1, 6) }, (_, index) => (
                  <PaginationItem key={index}>
                    <Link to={`${location.pathname}?page=${index + 1}`}>
                      <PaginationLink
                        isActive={
                          query.get('page') === String(index + 1) ||
                          (query.get('page') === null && index === 0)
                        }
                      >
                        {index + 1}
                      </PaginationLink>
                    </Link>
                  </PaginationItem>
                ))}
                {totalPages > 7 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {totalPages > 1 && (
                  <PaginationItem key={totalPages}>
                    <Link to={`${location.pathname}?page=${totalPages}`}>
                      <PaginationLink isActive={query.get('page') === String(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </Link>
                  </PaginationItem>
                )}

                {/* Pagination Next */}
                <PaginationItem>
                  <Link to={`${location.pathname}?page=${Math.min(totalPages, Number(currentPage) + 1)}`}>
                    <PaginationNext />
                  </Link>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          refetchDiscounts()
          setCreateDialogOpen(false)
        }}
      />

      <UpdateDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        discount={selectedDiscount}
        onSuccess={() => {
          refetchDiscounts()
          setUpdateDialogOpen(false)
          setSelectedDiscount(null)
        }}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        discount={selectedDiscount}
        onSuccess={() => {
          refetchDiscounts()
          setDeleteDialogOpen(false)
          setSelectedDiscount(null)
        }}
      />

      <ReadDialog open={readDialogOpen} onOpenChange={setReadDialogOpen} discount={selectedDiscount} />
    </div>
  )
}
