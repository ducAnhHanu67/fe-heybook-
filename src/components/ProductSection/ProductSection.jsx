import { useNavigate } from 'react-router-dom'

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price)
}

export default function ProductSection({ title, brands = [], products = [], viewAllLink = '#' }) {
    const navigate = useNavigate()

    return (
        <div className="mt-8 bg-[#f8f8f8] p-4 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <button
                    onClick={() => navigate(viewAllLink)}
                    className="text-sm text-blue-500 hover:underline"
                >
                    Xem tất cả »
                </button>
            </div>

            {/* Brand filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {brands.map((b) => (
                    <button
                        key={b.value}
                        onClick={() => navigate(`/brand/${b.value}`)} // điều hướng sang trang brand
                        className="px-3 py-1 border rounded-full text-sm hover:bg-gray-200"
                    >
                        {b.label}
                    </button>
                ))}
            </div>

            {/* Product list */}
            <div className="grid grid-cols-5 gap-4">
                {products.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => navigate(`/product/${p.id}`)}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col"
                    >
                        <img src={p.image} alt={p.title} className="h-40 object-contain mb-2" />
                        <h3 className="text-sm font-medium line-clamp-2 mb-1">{p.title}</h3>
                        <p className="text-red-600 font-bold">{formatPrice(p.price)} VNĐ</p>
                        {p.originalPrice && (
                            <p className="text-xs line-through text-gray-500">
                                {formatPrice(p.originalPrice)} VNĐ
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
