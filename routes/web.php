<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;


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
Route::post('/rooms', [App\Http\Controllers\RoomController::class, 'store'])->name('rooms.store');

// просмотр комнаты (GET)
Route::get('/rooms/{room}', [App\Http\Controllers\RoomController::class, 'show'])->name('rooms.show');

Route::get('/my-rooms', [App\Http\Controllers\RoomController::class, 'myRooms'])->name('my-rooms');

require __DIR__.'/settings.php';
