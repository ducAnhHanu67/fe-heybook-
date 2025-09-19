import { Star, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getTrendingProductsAPI, searchAndFilterProductsAPI, getFlashSaleProductsAPI, getProductsByCategoryAPI, getBrandsByCategoryAPI } from '@/apis'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectSearchQuery } from '@/redux/searchSlice'
import BannerSlider from '@/components/Banner/BannerSlider'
import FlashSale from '@/components/FlashSale.jsx/FlashSale'
import SideBarMenu from '@/components/SideBarMenu/SideBarMenu'
import ProductSection from '@/components/ProductSection/ProductSection'


export default function HomePage() {
  const searchQuery = useSelector(selectSearchQuery)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [categoryBrands, setCategoryBrands] = useState({})
  const [flashProducts, setFlashProducts] = useState([])

  const categories = [
    { id: 1, title: "ROBOT HÚT BỤI" },
    { id: 2, title: "MÁY HÚT BỤI CẦM TAY" },
    { id: 3, title: "ROBOT LAU KÍNH (WINBOT)" },
    { id: 4, title: "THIẾT BỊ GIA DỤNG" },
    { id: 5, title: "TIVI, ÂM THANH" },
    { id: 6, title: "THIẾT BỊ SỨC KHỎE" },
    { id: 7, title: "PHỤ KIỆN" }
  ]

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
            price: parseFloat(item.flashPrice),
            originalPrice,
            discount,
            image: product.coverImageUrl || product.productImages?.[0]?.imageUrl || '',
            sold: Math.floor(Math.random() * 200)
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
    const fetchAllCategories = async () => {
      const results = {}
      for (const cat of categories) {
        try {
          const res = await getProductsByCategoryAPI(cat.id, 10)
          results[cat.id] = res.data.map((p) => ({
            id: p.id,
            label: p.id,
            title: p.name,
            price: parseFloat(p.price),
            originalPrice: p.discount > 0 ? p.price / (1 - p.discount / 100) : p.price,
            image: p.coverImageUrl || p.productImages?.[0]?.imageUrl || ''
          }))
        } catch (err) {
          results[cat.id] = []
        }
      }
      setCategoryProducts(results)
    }
    fetchAllCategories()
  }, [])
  useEffect(() => {
    const fetchAllBrands = async () => {
      const results = {}
      for (const cat of categories) {
        try {
          const res = await getBrandsByCategoryAPI(cat.id)
          results[cat.id] = res.data.map((p) => ({
            label: p.name,
            value: p.id,
          }))
          console.log(results, 'ress');

        } catch (err) {
          results[cat.id] = []
        }
      }
      setCategoryBrands(results)
    }
    fetchAllBrands()
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
        {categories.map((cat) => (
          <ProductSection
            key={cat.id}
            title={cat.title}
            products={categoryProducts[cat.id] || []}
            viewAllLink={`/category/${cat.id}`}
            brands={
              categoryBrands[cat.id] && categoryBrands[cat.id].length > 0
                ? categoryBrands[cat.id]
                : [{ label: "Hãng khác", value: "other" }]
            }
          />
        ))}
      </div>

    </div>
  )
}
