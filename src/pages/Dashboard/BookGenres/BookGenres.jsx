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
import { getBookGenresAPI } from '@/apis'
import { CreateDialog } from './Dialog/CreateDialog'
import ReadDialog from './Dialog/ReadDialog'
import UpdateDialog from './Dialog/UpdateDialog'
import DeleteDialog from './Dialog/DeleteDialog'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@/utils/constant'
import { Loader2, Search } from 'lucide-react'

export default function BookGenres() {
  const location = useLocation()
  const navigate = useNavigate()

  const [bookGenres, setBookGenres] = useState({ data: [], count: 0 })
  const [loading, isLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const totalPages = Math.ceil(bookGenres.count / DEFAULT_ITEMS_PER_PAGE)
  const query = new URLSearchParams(location.search)
  const currentPage = query.get('page') || DEFAULT_PAGE

  const fetchBookGenres = async (page = currentPage, search = searchTerm) => {
    const searchPath =
      search === '' ? `?page=${page}` : `?page=${page}&search=${search}`
    const data = await getBookGenresAPI(searchPath)
    setBookGenres(data)
    isLoading(false)
  }

  useEffect(() => {
    fetchBookGenres()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  const searchCategory = (e) => {
    setSearchTerm(e.target.value)
    navigate(`${location.pathname}?page=1`)
  }

  const fetchDataAfterCreateOrUpdate = () => {
    if (currentPage !== '1') {
      navigate(`${location.pathname}?page=1`)
    } else {
      fetchBookGenres()
    }
  }

  const fetchDataAfterDelete = () => {
    if (bookGenres.data.length === 1) {
      navigate(`${location.pathname}?page=1`)
    } else {
      fetchBookGenres()
    }
  }

  return (
    <div className="mt-1 flex flex-1 flex-col">
      <div className="flex-1 rounded-2xl border border-gray-300 bg-white p-3 pb-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mt-2 flex items-center justify-center">
          <h1 className="text-2xl font-semibold">QUẢN LÝ THỂ LOẠI SÁCH</h1>
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
                  className="border-gray-300 pl-10"
                  placeholder="Tìm kiếm..."
                  onChange={(e) => searchCategory(e)}
                />
              </div>
              {/* Create */}
              <CreateDialog fetchData={fetchDataAfterCreateOrUpdate} />
            </div>

            {/* Categories */}
            <div className="mt-3 rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200 hover:bg-gray-200">
                    <TableHead className="rounded-tl-md">STT</TableHead>
                    <TableHead>Tên thể loại</TableHead>
                    <TableHead className="w-[45px]">Xem</TableHead>
                    <TableHead className="w-[45px]">Sửa</TableHead>
                    <TableHead className="w-[50px] rounded-tr-md">
                      Xóa
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookGenres.data.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-3 font-medium">
                        {(Number(currentPage) - 1) * DEFAULT_ITEMS_PER_PAGE +
                          index +
                          1}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>

                      {/* Read */}
                      <TableCell>
                        <ReadDialog bookGenre={item} />
                      </TableCell>

                      {/* Update */}
                      <TableCell>
                        <UpdateDialog
                          bookGenre={item}
                          fetchData={fetchDataAfterCreateOrUpdate}
                        />
                      </TableCell>

                      {/* Delete */}
                      <TableCell>
                        <DeleteDialog
                          bookGenreId={item.id}
                          fetchData={fetchDataAfterDelete}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {bookGenres.count > 10 && (
              <Pagination className="mt-5">
                <PaginationContent>
                  {/* Pagination Previous */}
                  <PaginationItem>
                    <Link
                      to={`${location.pathname}?page=${Math.max(1, Number(currentPage) - 1)}`}
                    >
                      <PaginationPrevious />
                    </Link>
                  </PaginationItem>

                  {/* Pagination Number */}
                  {Array.from(
                    { length: Math.min(totalPages - 1, 6) },
                    (_, index) => (
                      <PaginationItem key={index}>
                        <Link
                          className=""
                          to={`${location.pathname}?page=${index + 1}`}
                        >
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
                    <Link
                      className=""
                      to={`${location.pathname}?page=${totalPages}`}
                    >
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
                      to={`${location.pathname}?page=${Math.min(totalPages, Number(currentPage) + 1)}`}
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
