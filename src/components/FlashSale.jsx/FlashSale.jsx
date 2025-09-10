import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price)
}

export default function FlashDeal({ products = [] }) {
    const [timeLeft, setTimeLeft] = useState(8 * 24 * 60 * 60) // giả định còn 8 ngày

    // Đếm ngược
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Tách ra ngày - giờ - phút - giây
    const days = Math.floor(timeLeft / (24 * 3600))
    const hours = Math.floor((timeLeft % (24 * 3600)) / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60

    return (
        <div className="relative border-[2px] border-dashed border-[#de1818] p-4 my-4 mt-12">
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center">
                <h2 className="text-xl font-bold text-white bg-red-600 px-6 py-2 rounded-lg">
                    DEAL CHỚP NHOÁNG
                </h2>
                <a className="mt-2 text-blue-500 hover:underline" href="/flash-sale">
                    Xem tất cả »
                </a>
            </div>


            <div className="grid grid-cols-5 gap-4 mt-12">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-md p-2 flex flex-col items-center text-center"
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            className="h-40 object-contain mb-2"
                        />
                        <p
                            className="font-medium text-[#222] text-[14px] h-6 leading-5 overflow-hidden block"
                        >
                            {product.title}
                        </p>
                        <p className="font-bold text-[#de1818] text-[16px] mr-[5px]">
                            {formatPrice(product.price)} VNĐ
                        </p>
                        <div className="w-full bg-gray-200 h-3 rounded-full my-1">
                            <div
                                className="bg-orange-500 h-3 rounded-full text-xs text-white flex items-center justify-center"
                                style={{ width: `${Math.min(product.sold, 100)}%` }}
                            >
                                Đã bán {product.sold}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs mr-2">Thời gian còn lại:</span>

                            <div className="flex items-center space-x-2">
                                <div className="flex flex-col items-center">
                                    <b className="bg-black text-white rounded px-2 py-1 text-[10px] ">
                                        {days}
                                    </b>
                                    <span className="text-[11px]">Ngày</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <b className="bg-black text-white rounded px-2 py-1 text-[10px]">
                                        {hours.toString().padStart(2, '0')}
                                    </b>
                                    <span className="text-[11px]">Giờ</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <b className="bg-black text-white rounded px-2 py-1 text-[10px]">
                                        {minutes.toString().padStart(2, '0')}
                                    </b>
                                    <span className="text-[11px]">Phút</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <b className="bg-black text-white rounded px-2 py-1 text-[10px]">
                                        {seconds.toString().padStart(2, '0')}
                                    </b>
                                    <span className="text-[11px]">Giây</span>
                                </div>
                            </div>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    )
}
