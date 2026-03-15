import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface HeaderProps {
    showBackButton?: boolean;
}

export default function Header({ showBackButton = false }: HeaderProps) {
    const { auth } = usePage().props;
    const [unreadCount] = useState(0);

    const firstLetter = auth.user?.name?.charAt(0).toUpperCase() || '?';

    const logout = () => {
        router.post('/logout');
    };

    useEffect(() => {
        if (auth.user) {
            // Здесь будет запрос за количеством непрочитанных
        }
    }, [auth.user]);

    if (!auth.user) {
        return null;
    }

    return (
        <div className="flex items-center justify-between w-full">
            {/* Левая часть — кнопка "На главную" */}
            {showBackButton && (
                <Link
                    href="/"
                    className="text-white/60 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10 inline-flex items-center"
                >
                    ← На главную
                </Link>
            )}

            {/* Правая часть — кружки */}
            <div className="flex items-center gap-4 ml-auto mt-6 mr-6">
                {/* Мои комнаты */}
                <Link href="/my-rooms" className="group relative">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        🎬
                    </div>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Мои комнаты
                    </span>
                </Link>

                {/* Сообщения */}
                <Link href="/messages" className="group relative">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        💬
                    </div>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Сообщения
                    </span>
                </Link>

                {/* Профиль */}
                <Link href="/profile" className="group relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium hover:scale-110 transition-transform overflow-hidden">
                        {auth.user?.avatar ? (
                            <img
                                src={`/storage/${auth.user.avatar}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            firstLetter
                        )}
                    </div>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Личный кабинет
                    </span>
                </Link>

                <button
                    onClick={logout}
                    className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}
