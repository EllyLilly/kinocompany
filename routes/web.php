<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomVideoController; // <-- ДОБАВЬ ЭТО

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('user.profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('user.profile.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar'])->name('user.avatar.delete');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/{user}', [MessageController::class, 'show'])->name('messages.show');
    Route::post('/messages/{user}', [MessageController::class, 'store'])->name('messages.store');
});

// создание комнаты (POST)
Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');

// просмотр комнаты (GET)
Route::get('/rooms/{room}', [RoomController::class, 'show'])->name('rooms.show');

Route::get('/my-rooms', [RoomController::class, 'myRooms'])->name('my-rooms');

// НОВЫЙ МАРШРУТ ДЛЯ ВИДЕО - БЕЗ SANCTUM, ПРОСТО AUTH
Route::middleware(['auth'])->post('/rooms/{room}/video', [RoomVideoController::class, 'update'])->name('rooms.video.update');

require __DIR__.'/settings.php';
