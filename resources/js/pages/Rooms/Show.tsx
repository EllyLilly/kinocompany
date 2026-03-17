import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '@/components/Header';

interface Props {
    room: {
        id: number;
        name: string;
        video_url: string | null;
        video_id: string | null;
        description: string | null;
    };
}

export default function Show({ room }: Props) {
    const [videoUrl, setVideoUrl] = useState(room.video_url || '');
    const [isEditing, setIsEditing] = useState(!room.video_id);
    const [loading, setLoading] = useState(false);

    // Состояние для currentTime (скрытое)
    const [currentTime, setCurrentTime] = useState(0);
    // Состояние для расположения чата
    const [chatPosition, setChatPosition] = useState<'side' | 'bottom'>('side');

    const playerRef = useRef<HTMLIFrameElement>(null);

    const handleSubmitVideo = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post(`/rooms/${room.id}/video`, {
            video_url: videoUrl
        }, {
            onSuccess: () => {
                setIsEditing(false);
                setLoading(false);
            },
            onError: () => {
                alert('Ошибка при сохранении видео');
                setLoading(false);
            }
        });
    };

    // Слушаем события от плееров для получения currentTime
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data || typeof event.data !== 'object') return;

            // Для Rutube
            if (event.data.type === 'player:state' && event.data.data) {
                setCurrentTime(event.data.data.currentTime);
            }

            // Для VK
            if (event.data.type === 'timeupdate') {
                setCurrentTime(event.data.currentTime);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Определяем тип видео
    const isRutube = room.video_id && room.video_id.length > 20;
    const isVk = room.video_id && room.video_id.includes('_');

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
            {/* Фоновые шары */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-40 right-40 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

            {/* Верхняя панель */}
            <div className="relative z-10 container mx-auto px-6 py-8">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-white/60 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10"
                    >
                        ← На главную
                    </Link>

                    <div className="flex items-center gap-3">
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
                <Header showBackButton={true} />
            </div>

            {/* Основной контент - ВСЁ ВНУТРИ ОДНОГО КОНТЕЙНЕРА */}
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

                {/* Кнопка переключения расположения чата */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setChatPosition(prev => prev === 'side' ? 'bottom' : 'side')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center gap-2 text-sm"
                    >
                        {chatPosition === 'side' ? 'Чат вниз' : 'Чат сбоку'}
                        <span className="text-lg">{chatPosition === 'side' ? '↓' : '→'}</span>
                    </button>


                </div>

                {/* FLEX КОНТЕЙНЕР - всегда flex, меняется только направление */}
<div className={`w-full flex gap-6 ${chatPosition === 'side' ? 'flex-col lg:flex-row' : 'flex-col'}`}>
    {/* Плеер */}
    <div className={`${chatPosition === 'side' ? 'lg:w-3/4' : 'w-full lg:w-[80%] mx-auto'}`}>
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            <div className="aspect-video">
                {!room.video_id ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        <p className="text-white/50 mb-4 text-center">
                            В этой комнате ещё нет видео
                        </p>

                        {isEditing ? (
                            <form onSubmit={handleSubmitVideo} className="w-full max-w-md">
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://rutube.ru/video/... или https://vk.com/video..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors mb-3"
                                    required
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {loading ? 'Сохранение...' : 'Сохранить'}
                                    </button>
                                    {room.video_url && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
                                        >
                                            Отмена
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
                            >
                                Добавить видео
                            </button>
                        )}
                    </div>
                ) : (
                    isRutube ? (
                        <iframe
                            src={`https://rutube.ru/play/embed/${room.video_id}`}
                            frameBorder="0"
                            allow="clipboard-write; autoplay; fullscreen"
                            allowFullScreen
                            width="100%"
                            height="100%"
                            className="w-full h-full"
                            title="video player"
                        />
                    ) : (
                        <iframe
                            ref={playerRef}
                            src={`https://vk.com/video_ext.php?oid=${room.video_id.split('_')[0]}&id=${room.video_id.split('_')[1]}&hd=2`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                            allowFullScreen
                            width="100%"
                            height="100%"
                            className="w-full h-full"
                            title="video player"
                        />
                    )
                )}
            </div>
        </div>
    </div>

    {/* Чат */}
    <div className={`${chatPosition === 'side' ? 'lg:w-1/4' : 'w-full lg:w-[80%] mx-auto'}`}>
        <div className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-4 flex flex-col ${chatPosition === 'side' ? 'h-[600px]' : 'h-[400px]'}`}>
            <h2 className="text-white font-light text-xl mb-4 pb-2 border-b border-white/10">
                Чат
            </h2>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                <div className="text-white/50 text-sm text-center">
                    Сообщения появятся после добавления WebSockets
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
