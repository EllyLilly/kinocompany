import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import Header from '@/components/Header';

interface Room {
    id: number;
    name: string;
    video_url: string;
    created_at: string;
}

export default function MyRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
    const saved = localStorage.getItem('myRooms');
    if (saved) {
        // Не вызываем setState напрямую в эффекте
        const loadedRooms = JSON.parse(saved);
        setRooms(loadedRooms);
    }
}, []); // Пустой массив зависимостей — эффект выполнится только один раз при монтировании

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e]">
            <div className="container mx-auto px-6 py-8">
                <Header showBackButton={true} />

                <h1 className="text-3xl font-light text-white mt-8 mb-6">Мои комнаты</h1>

                {rooms.length === 0 ? (
                    <div className="text-center text-white/50 py-12">
                        <p className="text-lg mb-4">У вас пока нет созданных комнат</p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
                        >
                            Создать комнату
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {rooms.map(room => (
                            <Link
                                key={room.id}
                                href={`/rooms/${room.id}`}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-medium text-lg">{room.name}</h3>
                                        <p className="text-white/50 text-sm mt-1">
                                            {new Date(room.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-white/30">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
