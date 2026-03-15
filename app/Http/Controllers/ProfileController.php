<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class ProfileController extends Controller
{

    public function edit()
    {
        // Проверка на авторизацию
        if (!Auth::check()) {
            return redirect('/login');
        }

        return Inertia::render('Profile/Edit', [
            'user' => Auth::user()
        ]);
    }

    public function update(Request $request)
    {
        // Проверка авторизации
        if (!Auth::check()) {
            return redirect('/login');
        }

        $userId = Auth::id();
         $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $userId,
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
        'name' => $request->name,
        'email' => $request->email,
        ];

        // Обработка аватарки
        if ($request->hasFile('avatar')) {
            // Удаляем старую аватарку
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }

            // Сохраняем новую
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        //прямой запрос к БД (prepared statements)
        DB::table('users')
        ->where('id', $userId)
        ->update($data);

        return redirect()->back()->with('success', 'Профиль обновлён');
    }

    public function deleteAvatar()
{
    if (!Auth::check()) {
        return redirect('/login');
    }

    $user = Auth::user();

    if ($user->avatar) {
        Storage::delete($user->avatar);

        DB::table('users')
            ->where('id', $user->id)
            ->update(['avatar' => null]);
    }

    return redirect()->back()->with('success', 'Аватар удалён');
}
}
