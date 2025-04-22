import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
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
import { getCategoriesAPI } from '@/apis'
import { CreateDialog } from './Dialog/CreateDialog'
import { ReadDialog } from './Dialog/ReadDialog'
import { UpdateDialog } from './Dialog/UpdateDialog'
import { DeleteDialog } from './Dialog/DeleteDialog'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@/utils/constant'
import { Loader2, Search } from 'lucide-react'

export default function Categories() {
  const location = useLocation()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading, isLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const URL = '/dashboard/categories'
  const totalPages = Math.ceil(categories.count / DEFAULT_ITEMS_PER_PAGE)
  const query = new URLSearchParams(location.search)
  const currentPage = query.get('page') || DEFAULT_PAGE

  const fetchCategories = async (page) => {
    if (page !== undefined && page === '1' && currentPage !== '1') {
      navigate(`${location.pathname}?page=1`)
    } else {
      page = currentPage
    }
    const searchPath = `?page=${page}&search=${searchTerm}`
    const data = await getCategoriesAPI(searchPath)
    setCategories(data)
    isLoading(false)
  }

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  const searchCategory = (e) => {
    setSearchTerm(e.target.value)
    query.set('page', '1')
    navigate(`${location.pathname}?${query.toString()}`)
  }

  return (
    <div className="mt-1 flex flex-1 flex-col">
      <div className="flex-1 rounded-2xl border border-gray-300 bg-white p-3 pb-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mt-1.5 flex items-center justify-center">
          <h1 className="text-2xl font-semibold">QUẢN LÝ DANH MỤC</h1>
        </div>

        {loading ? (
          // Loading
          <div className="mt-6 flex items-center justify-center p-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          // Content
          <div className="mx-8">
            <div className="mt-2 flex">
              {/* Search */}
              <div className="relative w-1/4">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  className="pl-10"
                  placeholder="Tìm kiếm..."
                  onChange={(e) => searchCategory(e)}
                />
              </div>
              {/* Create */}
              <CreateDialog getCategories={fetchCategories} />
            </div>

            {/* Categories */}
            <div className="mt-3 rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200 hover:bg-gray-200">
                    <TableHead className="rounded-tl-md">STT</TableHead>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead className="w-[50px]">Xem</TableHead>
                    <TableHead className="w-[50px]">Sửa</TableHead>
                    <TableHead className="w-[50px] rounded-tr-md">
                      Xóa
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.data.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell className="px-3 font-medium">
                        {(Number(currentPage) - 1) * DEFAULT_ITEMS_PER_PAGE +
                          index +
                          1}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>

                      {/* Read */}
                      <TableCell className="flex items-center justify-center">
                        <ReadDialog category={category} />
                      </TableCell>

                      {/* Update */}
                      <TableCell>
                        <UpdateDialog
                          category={category}
                          getCategories={fetchCategories}
                        />
                      </TableCell>

                      {/* Delete */}
                      <TableCell>
                        <DeleteDialog
                          categoryId={category.id}
                          getCategories={fetchCategories}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {categories.count > 11 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  {/* Pagination Previous */}
                  <PaginationItem>
                    <Link
                      to={`${URL}?page=${Math.max(1, Number(currentPage) - 1)}`}
                    >
                      <PaginationPrevious />
                    </Link>
                  </PaginationItem>

                  {/* Pagination Number */}
                  {Array.from(
                    { length: Math.min(totalPages - 1, 6) },
                    (_, index) => (
                      <PaginationItem key={index}>
                        <Link className="" to={`${URL}?page=${index + 1}`}>
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
                    )
                  )}
                  {totalPages > 7 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem key={totalPages}>
                    <Link className="" to={`${URL}?page=${totalPages}`}>
                      <PaginationLink
                        isActive={query.get('page') === String(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </Link>
                  </PaginationItem>

                  {/* Pagination Next */}
                  <PaginationItem>
                    <Link
                      to={`${URL}?page=${Math.min(totalPages, Number(currentPage) + 1)}`}
                    >
                      <PaginationNext />
                    </Link>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
