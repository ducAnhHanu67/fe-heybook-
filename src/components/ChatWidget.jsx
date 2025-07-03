// src/components/ChatWidget.jsx
import { useEffect, useState } from 'react'
import { db, ref, push, set } from '@/firebase'
import { onValue } from 'firebase/database';


const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([]);
    const [chatStarted, setChatStarted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    })

    useEffect(() => {
        if (formData.phone) {
            const msgRef = ref(db, `chats/${formData.phone}/messages`);
            const unsubscribe = onValue(msgRef, (snapshot) => {
                const data = snapshot.val();
                const list = data ? Object.values(data) : [];
                setMessages(list);
            });

            return () => unsubscribe();
        }
    }, [formData.phone]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.service || !formData.message) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        const conversationId = formData.phone; // sử dụng số điện thoại làm ID hội thoại
        const conversationRef = ref(db, `chats/${conversationId}`);

        const metadata = {
            ...formData,
            createdAt: new Date().toISOString()
        };

        // Lưu metadata nếu chưa có
        set(ref(db, `chats/${conversationId}/metadata`), metadata);

        // Thêm message
        const msgRef = ref(db, `chats/${conversationId}/messages`);
        push(msgRef, {
            sender: "user",
            content: formData.message,
            timestamp: new Date().toISOString()
        }).then(() => {
            setChatStarted(true);     // ✅ Chuyển sang màn hình hội thoại
            setFormData(prev => ({ ...prev, message: '' }));
        }).catch(err => {
            console.error("Gửi thất bại:", err);
            alert("Không thể gửi tin nhắn.");
        });
    };



    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 bg-white rounded shadow-lg border border-gray-300 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-semibold">Hỗ trợ trực tuyến</h2>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setChatStarted(false);
                            }}
                            className="text-red-500 text-xl"
                        >
                            ×
                        </button>
                    </div>

                    {!chatStarted ? (
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
                    ) : (
                        <>
                            {/* ✅ Lịch sử tin nhắn */}
                            <div className="h-60 overflow-y-auto border p-2 rounded bg-gray-50 text-sm mb-2">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`mb-2 ${msg.sender === 'user' ? 'text-right text-blue-600' : 'text-left text-green-600'}`}
                                    >
                                        <div className="inline-block max-w-[70%] p-2 rounded bg-white border border-gray-200">
                                            <p className="mb-1">{msg.content}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ✅ Gửi tin nhắn mới */}
                            <form onSubmit={handleSubmit} className="flex gap-1">
                                <input
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Nhập nội dung..."
                                    className="flex-1 border px-2 py-1 rounded text-sm"
                                />
                                <button
                                    type="submit"
                                    className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
                                >
                                    Gửi
                                </button>
                            </form>
                        </>
                    )}
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
    );

}

export default ChatWidget
