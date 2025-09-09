import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductByIdAPI, checkUserReviewAPI, addToCartAPI } from '@/apis'
import AddToCartButton from '@/components/AddToCartButton'
import ReviewForm from '@/components/ReviewForm'
import ReviewList from '@/components/ReviewList'
import RatingStats from '@/components/RatingStats'
import { formatPriceWithCurrency } from '@/utils/formatters'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/userSlice'

import { Star, Minus, Plus, Truck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-toastify'
import { useAuthCheck } from '@/hooks/useAuthGuard'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/main'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { checkAuth } = useAuthCheck({
    message: 'Vui lòng đăng nhập để mua hàng!'
  })
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [userReview, setUserReview] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [totalReviews, setTotalReviews] = useState(0)

  const currentUser = useSelector(selectCurrentUser)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))
  const resetQuantity = () => setQuantity(1)

  const paynowMutation = useMutation({
    mutationFn: (data) => addToCartAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
      setQuantity(1)
      navigate('/cart')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng!')
    }
  })

  const handleBuyNow = () => {
    // Kiểm tra đăng nhập trước khi mua ngay
    checkAuth(() => {
      paynowMutation.mutate({
        productId: product.id,
        quantity
      })
    })
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await getProductByIdAPI(id)
        setProduct(data)
      } catch {
        // console.error('Error fetching product:', error)
        toast.error('Không thể tải thông tin sản phẩm!')
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchProduct()
    }
  }, [id])

  // Fetch user review if logged in
  useEffect(() => {
    const fetchUserReview = async () => {
      if (currentUser && id) {
        try {
          const response = await checkUserReviewAPI(id)
          setUserReview(response.data)
        } catch {
          // User hasn't reviewed this product yet
          setUserReview(null)
        }
      }
    }
    fetchUserReview()
  }, [currentUser, id])

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    // Refresh user review
    if (currentUser) {
      checkUserReviewAPI(id)
        .then((response) => {
          setUserReview(response.data)
        })
        .catch(() => {
          setUserReview(null)
        })
    }
  }

  const handleWriteReview = () => {
    checkAuth(() => {
      setShowReviewForm(true)
    })
  }

  const handleReviewsUpdate = (count) => {
    setTotalReviews(count)
  }

  const handleUserReviewDeleted = () => {
    // Khi user xóa đánh giá của chính mình, reset userReview
    setUserReview(null)
    setTotalReviews((prev) => prev - 1)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl bg-gray-50 p-4">
        <div className="animate-pulse rounded-lg bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-96 rounded-lg bg-gray-200"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              <div className="h-6 w-1/3 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy sản phẩm</h2>
          <p className="mt-2 text-gray-600">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        </div>
      </div>
    )
  }

  const finalPrice = (product.price * (100 - product.discount)) / 100

  return (
    <div className="mx-auto max-w-7xl bg-gray-50 p-4">
      <div className="grid grid-cols-1 gap-8 rounded-lg bg-white p-6 shadow-sm lg:grid-cols-20 lg:gap-x-[20px]" >
        {/*  Column 1 - Images */}
        <div className="space-y-4 col-span-6 ">
          {/* Main Image */}
          <div className="relative">
            <img
              src={product.coverImageUrl || '/book-cover.png'}
              alt={product.name}
              width={400}
              height={700}
              className="w-full rounded-lg shadow-lg"
            />
            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 rounded-md bg-orange-500 px-3 py-1 text-sm font-bold text-white">
                <span className="text-lg">GIẢM {product.discount}%</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {product.productImages && product.productImages.length > 0 ? (
              product.productImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-20 w-16 cursor-pointer rounded border-2 border-gray-200"
                >
                  <img
                    src={image.imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full rounded object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex h-20 w-16 items-center justify-center rounded bg-gray-200 text-sm text-gray-500">
                No Images
              </div>
            )}
          </div>


        </div>
        {/* Column 2 - Product Details */}
        <div className="space-y-4 col-span-9" >
          {/* Title and Badge */}
          <div className="flex items-start gap-2">
            {product.discount > 0 && <Badge className="bg-orange-500 text-white">Giảm giá</Badge>}
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          </div>


          {/* Rating and Sales */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(product.avgRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
              <span className="ml-1 text-sm text-orange-500">({product.totalReviews || 0} đánh giá)</span>
            </div>
            <span className="text-sm text-gray-600">Đã bán 799</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.discount > 0 ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatPriceWithCurrency((product.price * (100 - product.discount)) / 100)}
                </span>
                <span className="text-gray-400 line-through">{formatPriceWithCurrency(product.price)}</span>
                {product.discount > 0 && (
                  <Badge
                    className="px-2 py-1 text-xs text-white font-bold"
                    style={{ backgroundColor: '#c92127', color: '#ffffff' }}
                  >
                    -{Math.floor(product.discount)}%
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPriceWithCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="rounded bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
          </div>

          {/* Product Highlights */}
          {product.highlights?.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Đặc điểm nổi bật</h3>
              <ul className="text-[14px] font-light text-[#555] leading-relaxed">
                {product.highlights.map((h) => (
                  <li key={h.id} className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>{h.key}: {h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}



          {/* Product Dimensions */}
          {product.dimension && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Kích thước: </span>
              <span className="text-gray-600">{product.dimension}</span>
            </div>
          )}


          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Số lượng:</span>
            <div className="flex items-center rounded border">
              <Button variant="ghost" size="sm" onClick={decrementQuantity} className="h-8 w-8 p-0">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[3rem] px-4 py-1 text-center">{quantity}</span>
              <Button variant="ghost" size="sm" onClick={incrementQuantity} className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {product && (
              <AddToCartButton
                product={{
                  id: product.id,
                  ...product
                }}
                quantity={quantity}
                variant="outline"
                size="default"
                className="w-36 border-red-600 text-red-600 hover:bg-red-50"
                showQuantitySelector={false}
                onAddToCartSuccess={resetQuantity}
              />
            )}
            <Button className="w-36 bg-red-600 hover:bg-red-700" onClick={handleBuyNow}>
              Mua ngay
            </Button>
          </div>
        </div>

        {/* Column 3 - Commitments */}
        <div className="space-y-4 col-span-5">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Roboticworld cam kết:</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Chỉ bán hàng mới chính hãng, full Vat',
                'Đổi mới 15-30 ngày miễn phí',
                'Bảo trì, bảo dưỡng trọn đời',
                'Nói không với hàng giả, hàng nhái',
                'Hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái',
                'Freeship toàn quốc',
                'Bảo hành tại nhà'
              ].map((text, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-red-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z" />
                  </svg>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Parameter Section */}
      <div className="mx-auto mt-8 max-w-7xl bg-gray-50 p-4">
        <div className="grid gap-8 lg:grid-cols-10">
          {/* Left Column  */}
          <div className="lg:col-span-6">

          </div>

          {/* Right Column  */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
              {/* Header */}
              <h2 className="bg-gray-100 px-4 py-3 text-base font-semibold border-b text-center">
                Thông số kỹ thuật
              </h2>

              {/* Table */}
              <table className="w-full text-sm text-gray-700">
                <tbody>
                  <tr className="border-b">
                    <td className="w-1/3 px-4 py-2 text-gray-500">Hãng sản xuất</td>
                    <td className="px-4 py-2">Ecovacs</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-500">Tên sản phẩm</td>
                    <td className="px-4 py-2 font-medium text-blue-600">
                      Deebot X9 Pro omni
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-500">Lực hút</td>
                    <td className="px-4 py-2">16.600 Pa</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-500">Dung lượng pin</td>
                    <td className="px-4 py-2">6.400 mAh</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-500">Thời gian sạc</td>
                    <td className="px-4 py-2">3h</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-500">Sạc nhanh</td>
                    <td className="px-4 py-2">Có</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-500">Độ ồn</td>
                    <td className="px-4 py-2">64 dB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-500 align-top">Thời gian hoạt động</td>
                    <td className="px-4 py-2 space-y-1">
                      <p>- Thời gian làm việc trên sàn cứng - chế độ im lặng (quét): 252 phút</p>
                      <p>- Thời gian làm việc trên sàn cứng - chế độ tiêu chuẩn (quét): 196 phút</p>
                      <p>- Thời gian làm việc trên sàn …</p>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Nút xem thêm */}
              <div className="border-t bg-white">
                <button className="w-full py-2 text-center text-sm font-medium text-yellow-600 hover:text-yellow-700">
                  Xem thêm
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}
