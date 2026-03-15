import React from 'react';
import { Link } from '@inertiajs/react';
import Header from '@/components/Header';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    users: User[];
    unreadCount: number;
}

export default function MessagesIndex({ users, unreadCount }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e]">
            <div className="container mx-auto px-6 py-8">
                {/* Header по всей ширине с правой и левой частями */}
                <Header showBackButton={true} />

                {/* Заголовок страницы */}
                <h1 className="text-3xl font-light text-white mt-8 mb-6">Сообщения</h1>

                {/* Список пользователей */}
                {users.length === 0 ? (
                    <div className="text-center text-white/50 py-12">
                        <p className="text-lg">У вас пока нет сообщений</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {users.map(user => (
                            <Link
                                key={user.id}
                                href={`/messages/${user.id}`}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{user.name}</h3>
                                        <p className="text-white/50 text-sm">{user.email}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
