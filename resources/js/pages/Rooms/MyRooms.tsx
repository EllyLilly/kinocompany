import React from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '@/components/Header';

interface Room {
    id: number;
    name: string;
    video_url: string;
    description: string | null;
    created_at: string;
}

interface Props {
    rooms: Room[];
}

export default function MyRooms({ rooms }: Props) {
    const handleDelete = (e: React.MouseEvent, roomId: number) => {
        e.preventDefault(); // чтобы не переходить по ссылке
        e.stopPropagation();

        if (confirm('Вы уверены, что хотите удалить комнату?')) {
            router.delete(`/rooms/${roomId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Комната удалится из списка автоматически
                    console.log('Комната удалена');
                }
            });
        }
    };

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
                            <div
                                key={room.id}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <Link
                                    href={`/rooms/${room.id}`}
                                    className="block p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white font-medium text-lg">{room.name}</h3>
                                            {room.description && (
                                                <p className="text-white/30 text-sm mt-1">{room.description}</p>
                                            )}
                                            <p className="text-white/50 text-sm mt-1">
                                                {new Date(room.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="text-white/30">→</span>
                                    </div>
                                </Link>
                                <div className="border-t border-white/10 px-4 py-2 flex justify-end">
                                    <button
                                        onClick={(e) => handleDelete(e, room.id)}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Удалить комнату
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
