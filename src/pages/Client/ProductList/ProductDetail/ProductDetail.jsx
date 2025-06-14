import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductByIdAPI } from '@/apis'

import { Star, Minus, Plus, ShoppingCart, Truck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductByIdAPI(id)
      setProduct(data)
    }
    fetchProduct()
  }, [id])
  console.log(product)

  return (
    <div className="mx-auto max-w-7xl bg-gray-50 p-4">
      <div className="grid grid-cols-1 gap-8 rounded-lg bg-white p-6 shadow-sm lg:grid-cols-2">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative">
            <img
              src="/book-cover.png"
              alt="Hồ Điệp Va Kinh Ngư"
              width={400}
              height={600}
              className="w-full rounded-lg shadow-lg"
            />
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 rounded-md bg-orange-500 px-3 py-1 text-sm font-bold text-white">
              FHSSBDT5
              <br />
              <span className="text-lg">GIẢM 12%</span>
              <br />
              <span className="text-xs">Tối Đa 30k Cho Đơn 119k</span>
            </div>
            {/* Fahasa.com watermark */}
            <div className="absolute top-4 right-4 rounded bg-red-600 px-2 py-1 text-xs text-white">
              Fahasa.com
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {/* {product?.map((thumb, index) => (
              <div
                key={index}
                className={`relative h-20 w-16 cursor-pointer rounded border-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={product.coverImageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="rounded object-cover"
                />
              </div>
            ))} */}
            <div className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-sm font-bold text-white">
              +8
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1 border-red-600 text-red-600 hover:bg-red-50">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Thêm vào giỏ hàng
            </Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700">Mua ngay</Button>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-4">
          {/* Title and Badge */}
          <div className="flex items-start gap-2">
            <Badge className="bg-orange-500 text-white">Xu hướng</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Hồ Điệp Va Kinh Ngư</h1>
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Nhà cung cấp:</span>
              <span className="ml-2 text-blue-600">Đinh Tị</span>
            </div>
            <div>
              <span className="text-gray-600">Tác giả:</span>
              <span className="ml-2">Tuệ Kiên</span>
            </div>
            <div>
              <span className="text-gray-600">Nhà xuất bản:</span>
              <span className="ml-2">Văn Học</span>
            </div>
            <div>
              <span className="text-gray-600">Hình thức bìa:</span>
              <span className="ml-2">Bìa Mềm</span>
            </div>
          </div>

          {/* Rating and Sales */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-gray-300" />
              ))}
              <span className="ml-1 text-sm text-orange-500">(0 đánh giá)</span>
            </div>
            <span className="text-sm text-gray-600">Đã bán 799</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-red-600">111.600 ₫</span>
            <span className="text-gray-400 line-through">155.000 ₫</span>
            <Badge className="bg-red-600 text-white">-28%</Badge>
          </div>

          {/* Stock Info */}
          <div className="rounded bg-blue-50 px-3 py-2 text-sm text-blue-700">72 nhà sách còn hàng</div>

          {/* Shipping Info */}
          <div className="space-y-3 rounded-lg border p-4">
            <h3 className="font-semibold">Thông tin vận chuyển</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Giao hàng đến Phường Bến Nghé, Quận 1, Hồ Chí Minh</span>
              <Button variant="link" className="p-0 text-blue-600">
                Thay đổi
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">Giao hàng tiêu chuẩn</div>
                <div className="text-sm text-gray-600">Dự kiến giao Thứ hai - 02/06</div>
              </div>
            </div>
          </div>

          {/* Promotions */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">Ưu đãi liên quan</span>
              <Button variant="link" className="p-0 text-blue-600">
                Xem thêm
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-xs text-orange-600">%</span>
                </div>
                <span className="text-xs">Mã giảm 10k - to...</span>
              </div>
              <div className="flex items-center gap-2 rounded border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-xs text-orange-600">%</span>
                </div>
                <span className="text-xs">Mã giảm 20k - to...</span>
              </div>
              <div className="flex items-center gap-2 rounded border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs">Home credit: giá...</span>
              </div>
              <div className="flex items-center gap-2 rounded border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-xs text-blue-600">Z</span>
                </div>
                <span className="text-xs">Zalopay: giảm 15...</span>
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  )
}
