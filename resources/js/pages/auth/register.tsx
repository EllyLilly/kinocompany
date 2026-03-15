import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/components/Header';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        post('/register');
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <>
            <Head title="Регистрация" />
            <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden flex items-center justify-center">
                {/* Фоновые шары */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Кнопка назад - вне формы, сверху слева */}
                <div className="absolute top-8 left-8 z-20">
                    <Link href="/" className="text-white/60 hover:text-white transition-colors">
                        ← На главную
                    </Link>
                    <Header />
                </div>

                {/* Центрированная форма */}
                <div className="w-full max-w-md z-10">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <h2 className="text-3xl text-white font-light mb-2">Создать аккаунт</h2>
                        <p className="text-white/50 mb-6">Присоединяйтесь к КиноКомпании</p>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Имя и Email в одной строке */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Имя</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                        placeholder="Ваше имя"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                        placeholder="your@email.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Поля пароля в две колонки */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Пароль */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Пароль</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Подтверждение пароля */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Подтвердите пароль</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                                        >
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Кнопка регистрации */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-light disabled:opacity-50 mt-2"
                            >
                                {processing ? 'Регистрация...' : 'Зарегистрироваться'}
                            </button>

                            {/* Ссылка на вход */}
                            <p className="text-center text-white/50 text-sm">
                                Уже есть аккаунт?{' '}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300">
                                    Войти
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
