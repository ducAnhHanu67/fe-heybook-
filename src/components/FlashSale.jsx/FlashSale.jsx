import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

//test

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price)
}

export default function FlashSale({ products = [] }) {

    const [countdown, setCountdown] = useState(5400) // 1.5h

    const calculateFinalPrice = (price, discount) => {
        return (price * (100 - discount)) / 100
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const hours = String(Math.floor(countdown / 3600)).padStart(2, '0')
    const minutes = String(Math.floor((countdown % 3600) / 60)).padStart(2, '0')
    const seconds = String(countdown % 60).padStart(2, '0')

    return (
        <div className="my-8 rounded-lg shadow-sm p-4 bg-[url('/flash_sale_background_image.webp')] bg-cover bg-no-repeat bg-center">
            {/* Header */}
            <div className="bg-white rounded-md px-4 py-2 mb-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <img
                        src="https://cdn1.fahasa.com/skin/frontend/ma_vanese/fahasa/images/flashsale/label-flashsale.svg?q="
                        alt="Flash Sale"
                        className="h-6 sm:h-8"
                    />
                    <span className="text-black font-medium text-sm sm:text-base">Kết thúc trong</span>
                    <div className="flex items-center gap-1">
                        <span className="bg-black text-white w-7 h-7 flex items-center justify-center rounded text-sm font-semibold">
                            {hours}
                        </span>
                        <span className="text-black font-semibold">:</span>
                        <span className="bg-black text-white w-7 h-7 flex items-center justify-center rounded text-sm font-semibold">
                            {minutes}
                        </span>
                        <span className="text-black font-semibold">:</span>
                        <span className="bg-black text-white w-7 h-7 flex items-center justify-center rounded text-sm font-semibold">
                            {seconds}
                        </span>
                    </div>
                </div>
                <a href="/flash-sale" className="text-blue-600 text-sm hover:underline flex items-center">
                    Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
                </a>
            </div>

            {/* Sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {products.map((product, index) => (
                    <div key={index} className="bg-white rounded shadow hover:shadow-md transition p-2 relative text-sm">
                        {product.badge && (
                            <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-1.5 py-[2px] rounded-sm font-semibold">
                                {product.badge}
                            </span>
                        )}
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-40 w-full object-contain mb-2"
                        />
                        <h3 className="text-sm font-medium line-clamp-2 leading-tight mb-1">
                            {product.name}
                        </h3>

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
        </div>
    )
}
