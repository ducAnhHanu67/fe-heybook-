// src/components/ChatWidget.jsx
import { useState } from 'react'
import { db, ref, push } from '@/firebase'


const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate đơn giản
        if (!formData.name || !formData.phone || !formData.service || !formData.message) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc.')
            return
        }

        const chatData = {
            ...formData,
            createdAt: new Date().toISOString()
        }

        // Gửi vào node "chats"
        const chatRef = ref(db, 'chats')
        push(chatRef, chatData)
            .then(() => {
                alert('Tin nhắn đã được gửi. Hỗ trợ viên sẽ phản hồi sớm!')
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    message: ''
                })
                setIsOpen(false)
            })
            .catch((err) => {
                console.error('Lỗi gửi tin nhắn:', err)
                alert('Gửi thất bại. Vui lòng thử lại.')
            })
    }


    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 bg-white rounded shadow-lg border border-gray-300 p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-semibold">Hỗ trợ trực tuyến</h2>
                        <button onClick={() => setIsOpen(false)} className="text-red-500 text-xl">×</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nhập tên của bạn *"
                            required
                            className="w-full border px-2 py-1 rounded"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            className="w-full border px-2 py-1 rounded"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Nhập số điện thoại của bạn *"
                            required
                            className="w-full border px-2 py-1 rounded"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <select
                            name="service"
                            className="w-full border px-2 py-1 rounded"
                            required
                            value={formData.service}
                            onChange={handleChange}
                        >
                            <option value="">--- Chọn 1 dịch vụ hỗ trợ ---</option>
                            <option value="order">Hỗ trợ đặt hàng</option>
                            <option value="payment">Thanh toán</option>
                            <option value="shipping">Giao hàng</option>
                            <option value="other">Khác</option>
                        </select>
                        <textarea
                            name="message"
                            placeholder="Tin nhắn..."
                            className="w-full border px-2 py-1 rounded"
                            rows={3}
                            value={formData.message}
                            onChange={handleChange}
                        />
                        <button
                            type="submit"
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 w-full"
                        >
                            BẮT ĐẦU TRÒ CHUYỆN
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600"
                    title="Chat hỗ trợ"
                >
                    💬
                </button>
            )}
        </div>
    )
}

export default ChatWidget
