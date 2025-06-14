import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getProductsAPI } from '@/apis'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState({ data: [], count: 0 })
  console.log(products)

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductsAPI()
      setProducts(data)
    }
    fetchProduct()
  }, [])

  return (
    <div className="container mx-auto px-30 py-8 pl-100">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products?.data?.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
          >
            {/* product Cover */}
            <div className="relative p-2">
              {/* {product.isNew && (
                <Badge className="absolute top-2 left-2 z-10 bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">
                  Mới
                </Badge>
              )} */}
              <div className="relative">
                <img className="object-cover" src={product.coverImageUrl} alt="Ảnh sản phẩm" />
              </div>
            </div>

            {/* product Details */}
            <div className="p-4 pt-0">
              <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-900">
                {product.name}
              </h3>

              {/* Pricing */}
              <div className="mb-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(product.price - (product.price * product.discount) / 100)}đ
                  </span>
                  <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                    -{formatPrice(product.discount)}%
                  </Badge>
                </div>
                <div className="text-sm text-gray-400 line-through">{formatPrice(product.price)} đ</div>
              </div>

              {/* Star Rating */}
              <StarRating rating={product.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
