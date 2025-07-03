// src/pages/LiveChat.jsx
import { useEffect, useState } from 'react';
import { db, ref, onValue, push } from '@/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const LiveChat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');

    // ✅ Lấy danh sách khách hàng đã nhắn tin
    useEffect(() => {
        const chatRef = ref(db, 'chats');
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...val.metadata,
                }));
                setUsers(parsed.reverse());
            }
        });

        return () => unsubscribe();
    }, []);

    // ✅ Lắng nghe tin nhắn của khách hàng đang chọn
    useEffect(() => {
        if (selectedUser?.phone) {
            const msgRef = ref(db, `chats/${selectedUser.phone}/messages`);
            const unsubscribe = onValue(msgRef, (snapshot) => {
                const data = snapshot.val();
                const list = data ? Object.values(data) : [];
                setMessages(list);
            });

            return () => unsubscribe();
        } else {
            setMessages([]);
        }
    }, [selectedUser]);

    // ✅ Gửi phản hồi
    const sendReply = () => {
        if (!reply.trim() || !selectedUser?.phone) return;

        const msgRef = ref(db, `chats/${selectedUser.phone}/messages`);
        push(msgRef, {
            sender: 'admin',
            content: reply.trim(),
            timestamp: new Date().toISOString(),
        }).then(() => {
            setReply('');
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* Danh sách người dùng chat */}
            <div className="col-span-1">
                <Card>
                    <CardHeader className="font-bold text-lg">Khách hàng nhắn đến</CardHeader>
                    <CardContent className="space-y-2 max-h-[75vh] overflow-auto">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className={`p-3 border rounded cursor-pointer ${selectedUser?.id === u.id ? 'bg-gray-100' : ''}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <div className="font-medium">{u.name || 'Ẩn danh'}</div>
                                <div className="text-xs text-gray-500">{u.phone}</div>
                                <div className="text-sm mt-1 line-clamp-2">{u.message || '...'}</div>
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
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`p-2 rounded w-fit max-w-[70%] ${msg.sender === 'admin'
                                            ? 'ml-auto bg-blue-100 text-right'
                                            : 'mr-auto bg-gray-100'
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))}
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
    );
};

export default LiveChat;
