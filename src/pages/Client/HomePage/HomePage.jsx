import { Star, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { searchAndFilterProductsAPI } from '@/apis'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery, clearSearchQuery, selectSearchQuery } from '@/redux/searchSlice'
import ProductFilter from '@/components/ProductFilter/ProductFilter'
import AddToCartButton from '@/components/AddToCartButton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import BannerSlider from '@/components/Banner/BannerSlider'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState({ data: [], count: 0 })
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})
  const searchQuery = useSelector(selectSearchQuery)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const totalPages = Math.ceil(products.count / itemsPerPage)

  useEffect(() => {
    const urlFilters = {}
    for (const [key, value] of searchParams.entries()) {
      if (value && key !== 'search') {
        urlFilters[key] = value
      }
    }
    setFilters(urlFilters)
  }, [searchParams])

  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl !== searchQuery) {
      if (searchFromUrl) {
        dispatch(setSearchQuery(searchFromUrl))
      } else {
        dispatch(clearSearchQuery())
      }
    }
  }, [searchParams, searchQuery, dispatch])

  const fetchProducts = useCallback(
    async (filterParams = {}, page = 1) => {
      setLoading(true)
      try {
        const searchFilters = {
          ...filterParams,
          page,
          itemsPerPage
        }

        if (searchQuery && searchQuery.trim()) {
          searchFilters.search = searchQuery.trim()
        }

        const data = await searchAndFilterProductsAPI(searchFilters)
        setProducts(data)
      } catch {
        setProducts({ data: [], count: 0 })
      } finally {
        setLoading(false)
      }
    },
    [searchQuery]
  )

  useEffect(() => {
    fetchProducts(filters, currentPage)
  }, [filters, currentPage, fetchProducts])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)

    const params = new URLSearchParams(searchParams)

    const filtersToKeep = ['search']
    const paramsToDelete = []
    for (const [key] of params.entries()) {
      if (!filtersToKeep.includes(key)) {
        paramsToDelete.push(key)
      }
    }
    paramsToDelete.forEach((key) => params.delete(key))

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, value)
      }
    })

    setSearchParams(params)
  }

  const handleClearFilters = () => {
    setFilters({})
    setCurrentPage(1)

    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearchParams({ search: searchParam })
    } else {
      setSearchParams({})
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const calculateFinalPrice = (price, discount) => {
    return (price * (100 - discount)) / 100
  }

  const trendingProducts = [
    {
      title: "Boxset Manga - Silver Spoon: Tập 1 - 15",
      price: 690000,
      originalPrice: 726000,
      discount: 4,
      sold: 176,
      badge: "Xu hướng",
      image: "https://cdn1.fahasa.com/media/catalog/product/d/o/doraemon-movie-story-mau_doraemon-nobita-va-cuoc-phieu-luu-vao-the-gioi-trong-tranh_bia.jpg",
    },
    {
      title: "Doraemon Movie Story - Nobita Và Cuộc Phiêu Lưu",
      price: 33250,
      originalPrice: 35000,
      discount: 5,
      sold: 53,
      badge: "Mới",
      image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8935325011559.jpg",
    },
    {
      title: "Ba Lô Fancy Bestie Forever - Clever Hippo BH1234/PINK",
      price: 815150,
      originalPrice: 959000,
      discount: 15,
      sold: 21,
      image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8935337532110.jpg",
    },
    {
      title: "Bộ Thẻ Sưu Tập - Card Collection Thám Tử Lừng Danh Conan",
      price: 58500,
      originalPrice: 69000,
      discount: 15,
      sold: 18,
      badge: "Mới",
      image: "https://cdn1.fahasa.com/media/catalog/product/c/h/chttldcn.jpg",
    },
    {
      title: "English Grammar In Use With Answer",
      price: 337000,
      originalPrice: 375000,
      discount: 10,
      sold: 6,
      badge: "Mới",
      image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9781009826464.jpg",
    },
    {
      title: "Boxset Manga - Silver Spoon: Tập 1 - 15",
      price: 690000,
      originalPrice: 726000,
      discount: 4,
      sold: 176,
      badge: "Xu hướng",
      image: "https://cdn1.fahasa.com/media/catalog/product/d/o/doraemon-movie-story-mau_doraemon-nobita-va-cuoc-phieu-luu-vao-the-gioi-trong-tranh_bia.jpg",
    },
    {
      title: "Doraemon Movie Story - Nobita Và Cuộc Phiêu Lưu",
      price: 33250,
      originalPrice: 35000,
      discount: 5,
      sold: 53,
      badge: "Mới",
      image: "https://cdn1.fahasa.com/media/catalog/product/d/o/doraemon-movie-story-mau_doraemon-nobita-va-cuoc-phieu-luu-vao-the-gioi-trong-tranh_bia.jpg",
    },
    {
      title: "Ba Lô Fancy Bestie Forever - Clever Hippo BH1234/PINK",
      price: 815150,
      originalPrice: 959000,
      discount: 15,
      sold: 21,
      image: "https://cdn1.fahasa.com/media/catalog/product/d/o/doraemon-movie-story-mau_doraemon-nobita-va-cuoc-phieu-luu-vao-the-gioi-trong-tranh_bia.jpg",
    },
    {
      title: "Bộ Thẻ Sưu Tập - Card Collection Thám Tử Lừng Danh Conan",
      price: 58500,
      originalPrice: 69000,
      discount: 15,
      sold: 18,
      badge: "Mới",
      image: "https://cdn1.fahasa.com/media/catalog/product/d/o/doraemon-movie-story-mau_doraemon-nobita-va-cuoc-phieu-luu-vao-the-gioi-trong-tranh_bia.jpg",
    },
    {
      title: "English Grammar In Use With Answer",
      price: 337000,
      originalPrice: 375000,
      discount: 10,
      sold: 6,
      badge: "Mới",
      image: "https://cdn1.fahasa.com/media/catalog/product/d/o/doraemon-movie-story-mau_doraemon-nobita-va-cuoc-phieu-luu-vao-the-gioi-trong-tranh_bia.jpg",
    }
    // Add more items if needed
  ];

  return (
    <div className="container mx-auto px-4 py-2">

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Loading State */}
        <BannerSlider></BannerSlider>

        {/* Trending */}

        <section className=" bg-white rounded-lg shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2 bg-pink-50 px-4 py-6">
            <img src="https://cdn1.fahasa.com/media/wysiwyg/icon-menu/icon_dealhot_new.png" alt="trending" className="w-6 h-6" />
            Xu Hướng Mua Sắm
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 py-4">
            {trendingProducts.map((product, idx) => (
              <div key={idx} className="bg-white  p-2  hover:shadow-md transition">
                <div className="relative">
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-1 py-0.5 rounded-sm">
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-[190px] h-[190px] object-cover mx-auto rounded"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium line-clamp-2">{product.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold " style={{ color: '#c92127' }}>
                    {formatPrice(calculateFinalPrice(product.price, product.discount))}đ
                  </span>
                  {product.discount > 0 && (
                    <Badge
                      className="px-2 py-1 text-xs text-white font-bold"
                      style={{ backgroundColor: '#c92127', color: '#ffffff' }}
                    >
                      -{Math.floor(product.discount)}%
                    </Badge>
                  )}
                </div>
                <div className="text-gray-400 text-sm line-through">{product.originalPrice.toLocaleString()} đ</div>
                <div className="mt-1 bg-red-100 h-4 rounded text-center text-xs text-red-700">
                  Đã bán {product.sold}
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

    </div>
  )
}
