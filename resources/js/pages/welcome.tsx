import { Head, Link, usePage, router } from '@inertiajs/react';
import { login, register } from '@/routes';
import Header from '@/components/Header';
import { useState } from 'react';

interface Room {
    id: number;
    name: string;
    video_url: string;
    created_at: string;
}


export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        video_url: '',
        description: ''
    });

    const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    router.post('/rooms', form, {
        onSuccess: (page) => {
            // Сохраняем комнату в localStorage
            const newRoom = page.props.room as Room;
            const saved = localStorage.getItem('myRooms');
            const rooms = saved ? JSON.parse(saved) : [];
            rooms.unshift(newRoom); // добавляем в начало
            localStorage.setItem('myRooms', JSON.stringify(rooms.slice(0, 10))); // храним последние 10

            setShowModal(false);
        }
    });
};

    return (
        <>
            <Head title="КиноКомпания" />
            <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
                <Header />
                {/* Анимированные фоновые шары */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-40 right-40 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                {/* Кнопки входа в правом верхнем углу (только для неавторизованных) */}
                    <div className="relative z-10 container mx-auto px-6 py-8">
                        <div className="flex justify-end gap-4">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={login()}
                                        className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                                    >
                                        Войти
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                                        >
                                            Регистрация
                                        </Link>
                                    )}
                                </>
                            )}

                    </div>

                    {/* Центральный контент */}
                    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                        {/* Заголовок */}
                        <h1 className="text-6xl md:text-8xl font-light mb-6 text-white relative">
                            <span className="inline-block transform hover:scale-105 transition-transform duration-300" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 200, letterSpacing: '-0.02em' }}>
                                КиноКомпания
                            </span>
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 blur-2xl"></div>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/70 mb-16 max-w-2xl font-light leading-relaxed">
                            Смотри видео с друзьями в режиме реального времени
                        </p>

                        {/* Кнопка создания комнаты */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="group relative px-8 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 text-white text-lg font-light transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/30"
                        >
                            <span className="relative z-10">Создать комнату</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                        </button>
                    </div>
                </div>

                {/* Модальное окно с формой */}
                {showModal && (
                    <>
                        {/* Затемнение фона */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setShowModal(false)}
                        />

                        {/* Центрированное модальное окно */}
                        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <h2 className="text-2xl text-white font-light mb-6">Создать комнату</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Название комнаты"
                                        value={form.name}
                                        onChange={(e) => setForm({...form, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                        required
                                    />

                                    <input
                                        type="url"
                                        placeholder="Ссылка на Rutube"
                                        value={form.video_url}
                                        onChange={(e) => setForm({...form, video_url: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                        required
                                    />

                                    <textarea
                                        placeholder="Описание (необязательно)"
                                        value={form.description}
                                        onChange={(e) => setForm({...form, description: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                        rows={2}
                                    />

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-light"
                                        >
                                            Создать
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-light"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
