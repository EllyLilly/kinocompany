import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '@/components/Header';

interface User {
    id: number;
    name: string;
}

interface Message {
    id: number;
    sender_id: number;
    message: string;
    created_at: string;
}

interface Props {
    user: User;
    messages: Message[];
}

export default function MessagesShow({ user, messages }: Props) {
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        router.post(`/messages/${user.id}`, {
            message: newMessage
        }, {
            onSuccess: () => setNewMessage('')
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e]">
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/messages" className="text-white/60 hover:text-white">
                        ← Назад
                    </Link>
                    <Header />
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                    <h2 className="text-2xl font-light text-white mb-4">Чат с {user.name}</h2>

                    <div className="h-[500px] overflow-y-auto mb-4 space-y-2">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`p-3 rounded-xl max-w-[70%] ${
                                    msg.sender_id === user.id
                                        ? 'bg-white/10 text-white' // сообщение от собеседника
                                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto' // моё сообщение
                                }`}
                            >
                                {msg.message}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Введите сообщение..."
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                            Отправить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
