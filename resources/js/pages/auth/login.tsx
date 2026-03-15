import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/components/Header';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        post('/login');
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Вход" />
            <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
                {/* Фоновые шары */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Кнопка назад */}
                <div className="relative z-10 container mx-auto px-6 py-8">
                    <Link href="/" className="text-white/60 hover:text-white transition-colors">
                        ← На главную
                    </Link>
                    <Header />
                </div>

                {/* Центрированная форма */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-10">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <h2 className="text-3xl text-white font-light mb-2">Добро пожаловать</h2>
                        <p className="text-white/50 mb-8">Войдите в свой аккаунт</p>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-white/70 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                    placeholder="your@email.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Пароль */}
                            <div>
                                <label className="block text-white/70 text-sm mb-2">Пароль</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="w-4 h-4 bg-white/5 border border-white/20 rounded text-purple-500 focus:ring-purple-500/50"
                                    />
                                    <span className="text-white/70 text-sm">Запомнить меня</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-purple-400 hover:text-purple-300"
                                >
                                    Забыли пароль?
                                </Link>
                            </div>

                            {/* Кнопка входа */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-light disabled:opacity-50"
                            >
                                {processing ? 'Вход...' : 'Войти'}
                            </button>

                            {/* Ссылка на регистрацию */}
                            <p className="text-center text-white/50 text-sm">
                                Нет аккаунта?{' '}
                                <Link href="/register" className="text-purple-400 hover:text-purple-300">
                                    Зарегистрироваться
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
