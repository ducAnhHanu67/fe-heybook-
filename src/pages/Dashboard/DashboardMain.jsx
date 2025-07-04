import React, { useEffect, useState } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const DashboardMain = () => {
    const [orders, setOrders] = useState([])
    const [orderStats, setOrderStats] = useState({
        total: 10,
        success: 20,
        cancelled: 10,
        revenue: 200000,
    })

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://begymofart.onrender.com/orders')
                const data = await response.json()
                setOrders(data)

                const now = new Date()
                const currentMonth = now.getMonth()
                const currentYear = now.getFullYear()

                const monthlyOrders = data.filter((o) => {
                    const orderDate = new Date(o.createdAt)
                    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
                })

                const stats = {
                    total: monthlyOrders.length,
                    success: monthlyOrders.filter((o) => o.status === 'SUCCESS').length,
                    cancelled: monthlyOrders.filter((o) => o.status === 'CANCELLED').length,
                    revenue: monthlyOrders
                        .filter((o) => o.status === 'SUCCESS')
                        .reduce((sum, o) => sum + (o.totalAmount || o.price || 0), 0),
                }

                setOrderStats(stats)
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đơn hàng:', error)
            }
        }

        fetchOrders()
    }, [])

    const barChartData = {
        labels: ['Tổng đơn', 'Thành công', 'Đã hủy'],
        datasets: [
            {
                label: 'Thống kê tháng này',
                data: [orderStats.total, orderStats.success, orderStats.cancelled],
                backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
            },
        ],
    }

    const pieChartData = {
        labels: ['Thành công', 'Đã hủy'],
        datasets: [
            {
                data: [orderStats.success, orderStats.cancelled],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 1,
            },
        ],
    }

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-gray-500 text-sm">Tổng đơn hàng tháng</h4>
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
                <div className="bg-blue-100 rounded-lg shadow p-4">
                    <h4 className="text-blue-700 text-sm">Doanh thu tháng</h4>
                    <p className="text-xl font-bold text-blue-700">
                        {orderStats.revenue.toLocaleString('vi-VN')} đ
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Biểu đồ cột bên trái */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Thống kê đơn hàng</h3>
                    <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>

                {/* Biểu đồ tròn bên phải */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Tỉ lệ trạng thái đơn hàng</h3>
                    <Pie data={pieChartData} />
                </div>
            </div>
        </div>
    )
}

export default DashboardMain
