import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const DashboardMain = () => {
    const [orders, setOrders] = useState([])
    const [orderStats, setOrderStats] = useState({
        total: 7,
        success: 9,
        cancelled: 10,
        shipping: 11,
    })

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://begymofart.onrender.com/orders')
                const data = await response.json()
                setOrders(data)

                // Đếm trạng thái đơn hàng
                const stats = {
                    total: data.length,
                    success: data.filter((o) => o.status === 'SUCCESS').length,
                    cancelled: data.filter((o) => o.status === 'CANCELLED').length,
                    shipping: data.filter((o) => o.status === 'SHIPPING').length,
                }
                setOrderStats(stats)
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đơn hàng:', error)
            }
        }

        fetchOrders()
    }, [])

    const chartData = {
        labels: ['Success', 'Cancelled', 'Shipping'],
        datasets: [
            {
                data: [orderStats.success, orderStats.cancelled, orderStats.shipping],
                backgroundColor: ['#10b981', '#ef4444', '#facc15'],
                borderWidth: 1,
            },
        ],
    }

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-gray-500 text-sm">Tổng đơn hàng</h4>
                    <p className="text-xl font-bold text-gray-800">{orderStats.total}</p>
                </div>
                <div className="bg-green-100 rounded-lg shadow p-4">
                    <h4 className="text-green-700 text-sm">Thành công</h4>
                    <p className="text-xl font-bold text-green-700">{orderStats.success}</p>
                </div>
                <div className="bg-red-100 rounded-lg shadow p-4">
                    <h4 className="text-red-700 text-sm">Đã hủy</h4>
                    <p className="text-xl font-bold text-red-700">{orderStats.cancelled}</p>
                </div>
                <div className="bg-yellow-100 rounded-lg shadow p-4">
                    <h4 className="text-yellow-700 text-sm">Đang giao</h4>
                    <p className="text-xl font-bold text-yellow-700">{orderStats.shipping}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Tỉ lệ trạng thái đơn hàng</h3>
                    <Pie data={chartData} />
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Thống kê đơn hàng</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>Tổng đơn hàng: {orderStats.total}</li>
                        <li>Thành công: {orderStats.success}</li>
                        <li>Hủy: {orderStats.cancelled}</li>
                        <li>Đang giao: {orderStats.shipping}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DashboardMain
