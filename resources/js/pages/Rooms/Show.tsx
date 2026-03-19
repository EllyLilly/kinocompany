import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '@/components/Header';
import echo from '@/echo';
import RoomChat from '@/components/RoomChat';

interface Props {
    room: {
        id: number;
        name: string;
        video_url: string | null;
        video_id: string | null;
        description: string | null;
        user_id: number | null;
    };
    auth: {
        user: {
            id: number;
            name: string;
        } | null;
    };
    csrf_token: string;
}

export default function Show({ room, auth, csrf_token }: Props) {

    const [wasExternallyPaused] = useState(false);
    const seekDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const [videoUrl, setVideoUrl] = useState(room.video_url || '');
    const [isEditing, setIsEditing] = useState(!room.video_id);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [chatPosition, setChatPosition] = useState<'side' | 'bottom'>('side');
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [prevTime, setPrevTime] = useState(0);
    const [chatKey, setChatKey] = useState(0);

    const playerRef = useRef<HTMLIFrameElement>(null);
    const chatChannelRef = useRef<any>(null);
    const syncTimeoutRef = useRef<any>(null);

    const isRutube = room.video_id && room.video_id.length > 20;
    const isVk = room.video_id && room.video_id.includes('_');
    const isOwner = auth.user?.id === room.user_id;

    const playVideo = () => {
        if (!playerRef.current || !isPlayerReady) return;

        try {
            if (isRutube) {
                playerRef.current.contentWindow?.postMessage(
                    JSON.stringify({ type: 'player:play', data: {} }),
                    'https://rutube.ru'
                );
            } else if (isVk) {
                playerRef.current.contentWindow?.postMessage(
                    JSON.stringify({ type: 'play', data: {} }),
                    '*'
                );
            }
        } catch (error) {
            console.error('Error playing video:', error);
        }
    };

    const pauseVideo = () => {
        if (!playerRef.current || !isPlayerReady) return;

        try {
            if (isRutube) {
                playerRef.current.contentWindow?.postMessage(
                    JSON.stringify({ type: 'player:pause', data: {} }),
                    'https://rutube.ru'
                );
            } else if (isVk) {
                playerRef.current.contentWindow?.postMessage(
                    JSON.stringify({ type: 'pause', data: {} }),
                    '*'
                );
            }
        } catch (error) {
            console.error('Error pausing video:', error);
        }
    };

    const seekVideo = (time: number) => {
        if (!playerRef.current || !isPlayerReady) return;

        try {
            if (isRutube) {
                playerRef.current.contentWindow?.postMessage(
                    JSON.stringify({
                        type: 'player:setCurrentTime',
                        data: { time: time }
                    }),
                    'https://rutube.ru'
                );
            } else if (isVk) {
                playerRef.current.contentWindow?.postMessage(
                    JSON.stringify({ type: 'seek', time: time }),
                    '*'
                );
            }
        } catch (error) {
            console.error('Error seeking video:', error);
        }
    };

    const sendVideoControl = (action: 'play' | 'pause' | 'seek' | 'sync_request', time?: number) => {
        if (!auth.user) return;
        if (isSyncing && action !== 'sync_request') return;



                fetch(`/rooms/${room.id}/control`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token,
            },
            credentials: 'include',
            body: JSON.stringify({
                action: action,
                currentTime: time !== undefined ? time : currentTime
            })
});
    };

    useEffect(() => {
        if (!isPlayerReady || !room.id) return;

        fetch(`/rooms/${room.id}/state`)
            .then(res => res.json())
            .then(state => {
                if (state.current_time > 1) {
                    seekVideo(state.current_time);
                }

                setTimeout(() => {
                    if (state.playing) {
                        playVideo();
                    } else {
                        pauseVideo();
                    }
                }, 500);
            })
            .catch(err => console.error('Error fetching room state:', err));
    }, [isPlayerReady, room.id]);

    useEffect(() => {
        if (!room.id) return;

        let isSubscribed = true;

        const channel = echo.channel(`room.${room.id}`);

        channel.listen('.video.control', (e: any) => {
            if (e.action === 'sync_request') {
                if (currentTime > 0) {
                    sendVideoControl('play', currentTime);
                }
                return;
            }



            setIsSyncing(true);
            if (e.action === 'play') {


                if (Math.abs(currentTime - e.currentTime) > 3) {
                    seekVideo(e.currentTime);
                    setTimeout(() => playVideo(), 300);
                } else {
                    playVideo();
                }
            } else if (e.action === 'pause') {

                pauseVideo();
            // Принудительная синхронизация времени после паузы
                setTimeout(() => {
                    fetch(`/rooms/${room.id}/state`)
                        .then(res => res.json())
                        .then(state => {
                            seekVideo(state.current_time);
                        });
                }, 100);


            } else if (e.action === 'seek') {
                seekVideo(e.currentTime);
            }

            setTimeout(() => setIsSyncing(false), 1200);
        });

        return () => {
            if (isSubscribed) {
                channel.stopListening('.video.control');
                echo.leaveChannel(`room.${room.id}`);
            }
        };
    }, [room.id, currentTime, sendVideoControl, playVideo, pauseVideo, seekVideo]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            let data;
            try {
                data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            } catch (err) {
                return;
            }

            if (!data || !data.type) return;

            if (data.type === 'player:ready') {
                setIsPlayerReady(true);
            }

            if (data.type === 'player:currentTime' && data.data) {
                const newTime = data.data.currentTime || data.data.time;
                setCurrentTime(newTime);

                const timeDiff = Math.abs(newTime - prevTime);
                if (timeDiff > 2.5 && !isSyncing && auth.user && prevTime > 0) {
                    if (seekDebounceRef.current) {
                        clearTimeout(seekDebounceRef.current);
                    }

                    seekDebounceRef.current = setTimeout(() => {
                        sendVideoControl('seek', newTime);
                        setIsSyncing(true);
                        setTimeout(() => setIsSyncing(false), 1000);
                    }, 400);
                }

                setPrevTime(newTime);
            }

            if (data.type === 'player:changeState' && data.data) {
                const isPlaying = data.data.isPlaying;
                const status = data.data.status;

                // Если это хозяин и не синхронизация - отправляем команду
                if (isOwner && !isSyncing && auth.user) {
                    if (isPlaying === true || status === 'playing') {
                        sendVideoControl('play', currentTime);
                    } else if (isPlaying === false || status === 'pause') {
                        sendVideoControl('pause', currentTime);
                    }
                }
            }

            if (data.type === 'player:playStart' && !isSyncing && auth.user) {
                sendVideoControl('play', currentTime);
            }

            if (data.type === 'player:seeking') {
                setIsSyncing(true);
            }

            if (data.type === 'player:seeked') {
                if (!isSyncing && auth.user) {
                    sendVideoControl('seek', currentTime);
                }
                setTimeout(() => setIsSyncing(false), 800);
            }

            if (data.type === 'seek') {
                if (!isSyncing && auth.user) {
                    sendVideoControl('seek', data.time || currentTime);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
            if (seekDebounceRef.current) {
                clearTimeout(seekDebounceRef.current);
            }
        };
    }, [isSyncing, auth.user, currentTime, sendVideoControl, prevTime, wasExternallyPaused]);

    // ==================== ПЕРИОДИЧЕСКАЯ СИНХРОНИЗАЦИЯ ====================
useEffect(() => {
    if (!isPlayerReady || !room.id) return;

    const interval = setInterval(() => {
        fetch(`/rooms/${room.id}/state`)
            .then(res => res.json())
            .then(state => {
                const diff = Math.abs(currentTime - state.current_time);

                // Если рассинхрон больше 3 секунд
                if (diff > 3 && !isSyncing) {
                    console.log(`🔄 Рассинхрон ${diff}с, исправляю`);
                    seekVideo(state.current_time);

                    setTimeout(() => {
                        if (state.playing) {
                            playVideo();
                        } else {
                            pauseVideo();
                        }
                    }, 200);
                }
            })
            .catch(err => console.error('Sync check error:', err));
    }, 10000); // Каждые 10 секунд

    return () => clearInterval(interval);
}, [isPlayerReady, room.id, currentTime, isSyncing]);


    const handleSubmitVideo = (e: React.SyntheticEvent) => {
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

                                    {isOwner && (
                <button
                    onClick={() => {
                        if (confirm('Вы уверены, что хотите удалить комнату? Все сообщения будут потеряны.')) {
                            router.delete(`/rooms/${room.id}`, {
                                onSuccess: () => {
                                    router.visit('/');
                                }
                            });
                        }
                    }}
                    className="text-white/60 hover:text-red-400 transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10"
                >
                    Удалить комнату
                </button>
            )}

                        {!auth.user && (
                            <span className="text-white/50 text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                Войдите чтобы управлять
                            </span>
                        )}
                    </div>
                </div>
            <Header />
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

                {/* FLEX КОНТЕЙНЕР */}
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
                                            ref={playerRef}
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

                            {/* Индикатор синхронизации */}
                            {isSyncing && (
                                <div className="bg-green-500/20 text-green-400 text-xs text-center py-1">
                                    Синхронизация...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Чат */}
    <div className={`${chatPosition === 'side' ? 'lg:w-1/4' : 'w-full lg:w-[80%] mx-auto'}`}>
    <div className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col overflow-hidden ${chatPosition === 'side' ? 'h-[600px]' : 'h-[400px]'}`}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 flex-shrink-0">
    <h2 className="text-white font-light text-xl">Чат</h2>
    {isOwner && (
    <button
        onClick={() => {
            if (confirm('Очистить историю чата?')) {
                router.delete(`/rooms/${room.id}/chat/clear`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {

                setChatKey(prev => prev + 1);
                        }
                    });
                }
                    }}
        className="text-white/50 hover:text-red-400 transition-colors"
        title="Очистить чат"
    >
        🗑️
    </button>
    )}
</div>

                                    <div className="flex-1 min-h-0">
            <RoomChat
                key={chatKey}
                roomId={room.id}
                auth={auth}
                csrf_token={csrf_token}
            />
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
);
}



