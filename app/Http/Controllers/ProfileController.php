<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Routing\Controller as BaseController;


class ProfileController extends BaseController
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function edit()
    {
        return Inertia::render('Profile/Edit', [
            'user' => Auth::user()
        ]);
    }

    public function update(ProfileUpdateRequest $request)
    {
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

         DB::table('users')
        ->where('id', $userId)
        ->update($data);

    return redirect()->back()->with('success', 'Профиль обновлён');
    }
    public function deleteAvatar()
    {
        $userId = Auth::id();
        $user = Auth::user();

        if ($user->avatar) {
            Storage::delete($user->avatar);

            DB::table('users')
            ->where('id', $userId)
            ->update(['avatar' => null]);
        }

        return redirect()->back()->with('success', 'Аватар удалён');
    }
}
