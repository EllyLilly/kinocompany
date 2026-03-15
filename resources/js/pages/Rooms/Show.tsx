import React from 'react';
import { Link } from '@inertiajs/react';

interface Props {
    room: {
        id: number;
        name: string;
        video_url: string;
        description: string | null;
    };
}

export default function Show({ room }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
            {/* Фоновые шары */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-40 right-40 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

            {/* Кнопка "На главную" и копирование ссылки */}
            <div className="relative z-10 container mx-auto px-6 py-8">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-white/60 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10"
                    >
                        ← На главную
                    </Link>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Ссылка скопирована!');
                        }}
                        className="text-white/60 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10"
                    >
                        Копировать ссылку
                    </button>
                </div>
            </div>

            {/* Основной контент */}
            <div className="relative z-10 container mx-auto px-6 pb-16">
                {/* Заголовок комнаты */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-3">
                        {room.name}
                    </h1>
                    {room.description && (
                        <p className="text-white/50 text-lg">{room.description}</p>
                    )}
                </div>

                {/* Плеер и чат */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Видеоплеер */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden aspect-video">
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-white/30">
                                    Здесь будет плеер: {room.video_url}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Чат */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-4 h-[500px] flex flex-col">
                            <h2 className="text-white font-light text-xl mb-4 pb-2 border-b border-white/10">
                                Чат
                            </h2>

                            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                                <div className="text-white/50 text-sm text-center">
                                    Сообщения появятся здесь
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Введите сообщение..."
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
