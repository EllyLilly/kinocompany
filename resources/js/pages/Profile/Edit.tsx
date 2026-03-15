import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Header from '@/components/Header';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    };
}

export default function Edit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    const submit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        put('/profile', {
        onSuccess: () => {
            router.reload(); // ← перезагрузит данные пользователя
        }
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const deleteAvatar = () => {
    if (confirm('Удалить аватар?')) {
        router.delete('/profile/avatar', {
            onSuccess: () => {
                setPreview(null);
                setData('avatar', null);
                router.reload(); // ← перезагружает данные с сервера
                }
            });
        }
    };

    return (
        <>
            <Head title="Личный кабинет" />
            <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e]">
                <div className="container mx-auto px-6 py-8">
                    <Header showBackButton={true} />

                    <div className="max-w-2xl mx-auto mt-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                            <h1 className="text-3xl font-light text-white mb-8">Личный кабинет</h1>

                            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                                {/* Аватарка */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-medium overflow-hidden">
                                        {preview ? (
                                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <label className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                                            Загрузить фото
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>

                                        {(preview || user.avatar) && (
                                            <button
                                                type="button"
                                                onClick={deleteAvatar}
                                                className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                                            >
                                                Удалить
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Имя */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Имя</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Кнопки */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-light disabled:opacity-50"
                                    >
                                        Сохранить изменения
                                    </button>

                                    <Link
                                        href="/"
                                        className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                                    >
                                        Отмена
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
