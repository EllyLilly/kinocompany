import React, { useState, useEffect, useRef } from 'react';
import echo from '@/echo';

interface Props {
    roomId: number;
    auth: any;
    csrf_token: string;
}

export default function RoomChat({ roomId, auth, csrf_token }: Props) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Загрузка сообщений
    useEffect(() => {
        fetch(`/rooms/${roomId}/messages`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
                setLoading(false);
            });
    }, [roomId]);

    // Подписка на новые сообщения

    useEffect(() => {

        console.log('🎯 useEffect запущен, roomId:', roomId);
        console.log('🔍 window.Echo существует?', !!window.Echo);
        console.log('📡 Канал:', `chat.${roomId}`);

     console.log('📡 МОНТИРУЕМСЯ: подписка на канал room.' + roomId);

    if (!roomId) {
        console.log('❌ Нет roomId');
        return;
    }

    console.log('📡 Подключаемся к каналу room.' + roomId);
    const channel = echo.channel(`chat.${roomId}`);

    channel.listen('.message.sent', (e: any) => {
        console.log('🔥 ПОЛУЧЕНО В REALTIME:', e);
        setMessages(prev => [...prev, e]);
    });

    channel.listen('.chat.cleared', () => {
    console.log('🧹 Чат очищен');
    setMessages([]);
});

    return () => {
        console.log('💀 РАЗМОНТИРОВАНИЕ: отписка от room.' + roomId);
        channel.stopListening('.message.sent');
        echo.leaveChannel(`chat.${roomId}`);
    };
}, [roomId]);

    // Скролл вниз
    useEffect(() => {
        console.log('Скролл вниз, сообщений:', messages.length);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !auth.user) return;

        setSending(true);
        const response = await fetch(`/rooms/${roomId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token,
            },
            credentials: 'include',
            body: JSON.stringify({ message: newMessage }),
        });

        if (response.ok) {
            const newMsg = await response.json();
            console.log('Отправлено, ждём realtime...');
            setNewMessage('');
        }
        setSending(false);
    };

        console.log('Рендер сообщений, количество:', messages.length);

    return (
        <div className="flex flex-col h-full">
        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.2) transparent'
        }}>
            {messages.map((msg, index) => (
                <div key={`${msg.id}-${index}`} className={`flex ${msg.sender_id === auth.user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-start gap-2 max-w-[80%]">
                        {msg.sender_id !== auth.user?.id && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 overflow-hidden">
                                {msg.sender_avatar ? (
                                    <img src={`/storage/${msg.sender_avatar}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                                        {msg.sender_name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        )}
                        <div
                            className={`rounded-2xl px-3 py-2 ${
                                msg.sender_id === auth.user?.id
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white/10 text-white'
                            }`}
                        >
                            {msg.sender_id !== auth.user?.id && (
                                <div className="text-xs text-white/50 mb-1">{msg.sender_name}</div>
                            )}
                            <div className="text-sm break-words">{msg.message}</div>
                            <div className="text-[10px] text-white/40 text-right mt-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Форма */}
        {auth.user ? (
            <form onSubmit={sendMessage} className="flex-shrink-0 border-t border-white/10 px-6 py-4 w-full">
    <div className="flex items-center gap-2 w-full">
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-w-0 px-4 py-2.5 bg-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/15 transition-colors text-sm"
            placeholder="Сообщение..."
        />
        <button
            type="submit"
            disabled={sending}
            className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
        >
            {sending ? '⋯' : '→'}
        </button>
    </div>
</form>
        ) : (
            <div className="border-t border-white/10 px-6 py-4 text-center text-white/50 text-sm">
                <a href="/login" className="text-purple-400 hover:text-purple-300">Войдите</a> чтобы писать
            </div>
        )}
    </div>

);
}
