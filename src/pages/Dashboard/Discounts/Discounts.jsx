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

  // Mock data - replace with API call
  useEffect(() => {
    const allMockDiscounts = [
      {
        id: 1,
        code: 'SUMMER2024',
        name: 'Giảm giá mùa hè',
        description: 'Mã giảm giá đặc biệt cho mùa hè 2024',
        type: 'PERCENTAGE',
        value: 20.0,
        minOrderAmount: 100000.0,
        maxDiscountAmount: 50000.0,
        usageLimit: 100,
        usedCount: 25,
        startDate: '2024-06-01T00:00',
        endDate: '2024-08-31T23:59',
        isActive: true,
        createdAt: '2024-05-15',
        updatedAt: '2024-05-15'
      },
      {
        id: 2,
        code: 'NEWUSER50',
        name: 'Khách hàng mới',
        description: 'Ưu đãi đặc biệt cho khách hàng mới',
        type: 'FIXED_AMOUNT',
        value: 50000.0,
        minOrderAmount: 200000.0,
        maxDiscountAmount: 50000.0,
        usageLimit: 200,
        usedCount: 150,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 3,
        code: 'EXPIRED10',
        name: 'Mã đã hết hạn',
        description: 'Mã giảm giá đã hết hạn sử dụng',
        type: 'PERCENTAGE',
        value: 10.0,
        minOrderAmount: 50000.0,
        maxDiscountAmount: 30000.0,
        usageLimit: 50,
        usedCount: 45,
        startDate: '2024-01-01',
        endDate: '2024-05-31',
        isActive: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-05-31'
      },
      {
        id: 4,
        code: 'AUTUMN2024',
        name: 'Giảm giá mùa thu',
        description: 'Mã giảm giá đặc biệt cho mùa thu 2024',
        type: 'PERCENTAGE',
        value: 15.0,
        minOrderAmount: 150000.0,
        maxDiscountAmount: 40000.0,
        usageLimit: 80,
        usedCount: 30,
        startDate: '2024-09-01',
        endDate: '2024-11-30',
        isActive: true,
        createdAt: '2024-08-15',
        updatedAt: '2024-08-15'
      },
      {
        id: 5,
        code: 'WINTER2024',
        name: 'Giảm giá mùa đông',
        description: 'Mã giảm giá đặc biệt cho mùa đông 2024',
        type: 'FIXED_AMOUNT',
        value: 75000.0,
        minOrderAmount: 300000.0,
        maxDiscountAmount: 75000.0,
        usageLimit: 150,
        usedCount: 60,
        startDate: '2024-12-01',
        endDate: '2025-02-28',
        isActive: true,
        createdAt: '2024-11-15',
        updatedAt: '2024-11-15'
      },
      {
        id: 6,
        code: 'SPRING2025',
        name: 'Giảm giá mùa xuân',
        description: 'Mã giảm giá đặc biệt cho mùa xuân 2025',
        type: 'PERCENTAGE',
        value: 25.0,
        minOrderAmount: 120000.0,
        maxDiscountAmount: 60000.0,
        usageLimit: 120,
        usedCount: 45,
        startDate: '2025-03-01',
        endDate: '2025-05-31',
        isActive: true,
        createdAt: '2025-02-15',
        updatedAt: '2025-02-15'
      },
      {
        id: 7,
        code: 'FLASH50',
        name: 'Flash Sale',
        description: 'Mã giảm giá flash sale trong thời gian ngắn',
        type: 'FIXED_AMOUNT',
        value: 100000.0,
        minOrderAmount: 500000.0,
        maxDiscountAmount: 100000.0,
        usageLimit: 50,
        usedCount: 40,
        startDate: '2024-06-15',
        endDate: '2024-06-20',
        isActive: false,
        createdAt: '2024-06-14',
        updatedAt: '2024-06-20'
      },
      {
        id: 8,
        code: 'LOYAL30',
        name: 'Khách hàng thân thiết',
        description: 'Ưu đãi dành cho khách hàng thân thiết',
        type: 'PERCENTAGE',
        value: 30.0,
        minOrderAmount: 250000.0,
        maxDiscountAmount: 80000.0,
        usageLimit: 100,
        usedCount: 75,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 9,
        code: 'BIRTHDAY20',
        name: 'Sinh nhật',
        description: 'Mã giảm giá sinh nhật đặc biệt',
        type: 'PERCENTAGE',
        value: 20.0,
        minOrderAmount: 100000.0,
        maxDiscountAmount: 50000.0,
        usageLimit: 365,
        usedCount: 120,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 10,
        code: 'WEEKEND15',
        name: 'Cuối tuần',
        description: 'Giảm giá cuối tuần hàng tuần',
        type: 'PERCENTAGE',
        value: 15.0,
        minOrderAmount: 80000.0,
        maxDiscountAmount: 35000.0,
        usageLimit: 200,
        usedCount: 150,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 11,
        code: 'STUDENT25',
        name: 'Sinh viên',
        description: 'Ưu đãi đặc biệt dành cho sinh viên',
        type: 'PERCENTAGE',
        value: 25.0,
        minOrderAmount: 70000.0,
        maxDiscountAmount: 40000.0,
        usageLimit: 300,
        usedCount: 180,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 12,
        code: 'BULK100',
        name: 'Mua số lượng lớn',
        description: 'Giảm giá khi mua số lượng lớn',
        type: 'FIXED_AMOUNT',
        value: 150000.0,
        minOrderAmount: 1000000.0,
        maxDiscountAmount: 150000.0,
        usageLimit: 30,
        usedCount: 15,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 13,
        code: 'HOLIDAY40',
        name: 'Ngày lễ',
        description: 'Mã giảm giá các ngày lễ đặc biệt',
        type: 'PERCENTAGE',
        value: 40.0,
        minOrderAmount: 200000.0,
        maxDiscountAmount: 100000.0,
        usageLimit: 100,
        usedCount: 85,
        startDate: '2024-04-30',
        endDate: '2024-05-03',
        isActive: false,
        createdAt: '2024-04-25',
        updatedAt: '2024-05-03'
      },
      {
        id: 14,
        code: 'FIRSTORDER',
        name: 'Đơn hàng đầu tiên',
        description: 'Ưu đãi cho đơn hàng đầu tiên',
        type: 'FIXED_AMOUNT',
        value: 30000.0,
        minOrderAmount: 100000.0,
        maxDiscountAmount: 30000.0,
        usageLimit: 500,
        usedCount: 320,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 15,
        code: 'COMBO50',
        name: 'Combo đặc biệt',
        description: 'Giảm giá khi mua combo sản phẩm',
        type: 'PERCENTAGE',
        value: 50.0,
        minOrderAmount: 400000.0,
        maxDiscountAmount: 120000.0,
        usageLimit: 60,
        usedCount: 45,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        isActive: true,
        createdAt: '2024-05-25',
        updatedAt: '2024-05-25'
      }
    ]

    // Simulate pagination
    const startIndex = (Number(currentPage) - 1) * DEFAULT_ITEMS_PER_PAGE
    const endIndex = startIndex + DEFAULT_ITEMS_PER_PAGE
    const paginatedDiscounts = allMockDiscounts.slice(startIndex, endIndex)

    setDiscounts(paginatedDiscounts)
    setTotalCount(allMockDiscounts.length)
    setLoading(false)
  }, [currentPage])

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
      return `${discount.value.toLocaleString('vi-VN')}đ`
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
          // Refresh data
          setCreateDialogOpen(false)
        }}
      />

      <UpdateDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        discount={selectedDiscount}
        onSuccess={() => {
          // Refresh data
          setUpdateDialogOpen(false)
          setSelectedDiscount(null)
        }}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        discount={selectedDiscount}
        onSuccess={() => {
          // Refresh data
          setDeleteDialogOpen(false)
          setSelectedDiscount(null)
        }}
      />

      <ReadDialog open={readDialogOpen} onOpenChange={setReadDialogOpen} discount={selectedDiscount} />
    </div>
  )
}
