import { Star, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getTrendingProductsAPI, searchAndFilterProductsAPI, getFlashSaleProductsAPI, getProductsByCategoryAPI } from '@/apis'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery, clearSearchQuery, selectSearchQuery } from '@/redux/searchSlice'
import ProductFilter from '@/components/ProductFilter/ProductFilter'
import AddToCartButton from '@/components/AddToCartButton'
import BannerSlider from '@/components/Banner/BannerSlider'
import FlashSale from '@/components/FlashSale.jsx/FlashSale'
import SideBarMenu from '@/components/SideBarMenu/SideBarMenu'
import ProductSection from '@/components/ProductSection/ProductSection'

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
  const searchQuery = useSelector(selectSearchQuery)
  const [robotProducts, setRobotProducts] = useState([])
  const [handheldProducts, setHandheldProducts] = useState([])

  const robotBrands = [
    { label: 'Hãng Ecovacs', value: 'ecovacs' },
    { label: 'Hãng Roborock', value: 'roborock' },
    { label: 'Hãng Dreame', value: 'dreame' },
    { label: 'Hãng Xiaomi', value: 'xiaomi' },
    { label: 'Hãng khác', value: 'other' }
  ]

  const handheldBrands = [
    { label: 'Hãng Tineco', value: 'tineco' },
    { label: 'Hãng Dreame', value: 'dreame' },
    { label: 'Hãng Roborock', value: 'roborock' },
    { label: 'Hãng Xiaomi', value: 'xiaomi' }
  ]

  // Demo: products từ API hoặc mock
  const demoRobotProducts = [
    {
      id: 1,
      title: 'Robot hút bụi lau nhà Deebot X8 Pro omni',
      price: 20490000,
      originalPrice: 25000000,
      image: '/images/robot1.jpg'
    }
  ]

  const demoHandheldProducts = [
    {
      id: 1,
      title: 'Máy lau nhà cầm tay Tineco S9 Artist Steam',
      price: 16590000,
      originalPrice: 20000000,
      image: '/images/tineco.jpg'
    }
  ]

  const [flashProducts, setFlashProducts] = useState([])

  // Gọi API flash-sale khi load trang
  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await getFlashSaleProductsAPI()
        const mapped = res.data.map((item) => {
          const product = item.product
          const price = parseFloat(product.price)
          const discount = parseFloat(product.discount)
          const originalPrice =
            discount > 0 ? Math.round(price / (1 - discount / 100)) : price

          return {
            id: product.id,
            title: product.name,
            price: parseFloat(item.flashPrice), // giá flashSale
            originalPrice,
            discount,
            image: product.coverImageUrl || product.productImages?.[0]?.imageUrl || '',
            sold: Math.floor(Math.random() * 200) // giả lập số sold, bạn có thể sửa theo BE
          }
        })
        setFlashProducts(mapped)
      } catch (error) {
        console.error('Lỗi khi gọi API flash-sales:', error)
      }
    }

    fetchFlashSale()
  }, [])

  useEffect(() => {
    const fetchRobotProducts = async () => {
      const res = await getProductsByCategoryAPI(1, 10)

      setRobotProducts(res.data.map(p => ({
        id: p.id,
        title: p.name,
        price: parseFloat(p.price),
        originalPrice: p.discount > 0 ? p.price / (1 - p.discount / 100) : p.price,
        image: p.coverImageUrl || p.productImages?.[0]?.imageUrl || ''
      })))
      console.log(robotProducts, 'hehe');

    }
    fetchRobotProducts()
  }, [])

  // Máy hút bụi cầm tay
  useEffect(() => {
    const fetchHandheldProducts = async () => {
      const res = await getProductsByCategoryAPI(2, 5) // categoryId=2 => Handheld
      setHandheldProducts(res.data.map(p => ({
        id: p.id,
        title: p.name,
        price: parseFloat(p.price),
        originalPrice: p.discount > 0 ? p.price / (1 - p.discount / 100) : p.price,
        image: p.coverImageUrl || p.productImages?.[0]?.imageUrl || ''
      })))
    }
    fetchHandheldProducts()
  }, [])
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex gap-4 h-[340px]">
        <div className="w-1/4 flex-shrink-0 h-full">
          <SideBarMenu />
        </div>
        <div className="w-3/4 h-full">
          <BannerSlider />
        </div>
      </div>
      <FlashSale products={flashProducts} />
      <div className="container mx-auto px-4 py-2">
        {/* Section Robot hút bụi */}
        <ProductSection
          title="ROBOT HÚT BỤI"
          brands={robotBrands}
          products={robotProducts}
          viewAllLink="/category/robot"
        />

        {/* Section Máy hút bụi cầm tay */}
        <ProductSection
          title="MÁY HÚT BỤI CẦM TAY"
          brands={handheldBrands}
          products={handheldProducts}
          viewAllLink="/category/handheld"
        />
      </div>

    </div>
  )
}
