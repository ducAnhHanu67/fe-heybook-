// src/pages/LiveChat.jsx
import { useEffect, useState } from 'react'
import { db, ref, onValue, push } from '@/firebase' // nếu bạn dùng Firebase
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const LiveChat = () => {
    const [messages, setMessages] = useState([])
    const [reply, setReply] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        const chatRef = ref(db, 'chats')
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const parsed = Object.entries(data).map(([id, val]) => ({ id, ...val }))
                setMessages(parsed.reverse())
            }
        })

        return () => unsubscribe()
    }, [])

    const sendReply = () => {
        if (!selectedUser || !reply.trim()) return

        const replyRef = ref(db, `chats/${selectedUser.id}/reply`)
        push(replyRef, {
            message: reply,
            sender: 'admin',
            createdAt: new Date().toISOString()
        })

        setReply('')
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* Danh sách người dùng chat */}
            <div className="col-span-1">
                <Card>
                    <CardHeader className="font-bold text-lg">Khách hàng nhắn đến</CardHeader>
                    <CardContent className="space-y-2 max-h-[75vh] overflow-auto">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`p-3 border rounded cursor-pointer ${selectedUser?.id === m.id ? 'bg-gray-100' : ''
                                    }`}
                                onClick={() => setSelectedUser(m)}
                            >
                                <div className="font-medium">{m.name || 'Ẩn danh'}</div>
                                <div className="text-xs text-gray-500">{m.phone}</div>
                                <div className="text-sm mt-1 line-clamp-2">{m.message}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Nội dung tin nhắn */}
            <div className="col-span-2">
                {selectedUser ? (
                    <Card className="h-full flex flex-col">
                        <CardHeader className="font-semibold">
                            Chat với: {selectedUser.name} – {selectedUser.phone}
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto space-y-2">
                            <div className="bg-gray-100 p-3 rounded">
                                <span className="block font-medium">Khách:</span>
                                <p>{selectedUser.message}</p>
                            </div>
                            {/* TODO: Show các phản hồi nếu đã push reply */}
                        </CardContent>
                        <div className="flex items-center gap-2 border-t p-4">
                            <Input
                                placeholder="Nhập phản hồi..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                            <Button onClick={sendReply}>Gửi</Button>
                        </div>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 italic">
                        Chọn 1 khách hàng để bắt đầu trò chuyện
                    </div>
                )}
            </div>
        </div>
    )
}

export default LiveChat
