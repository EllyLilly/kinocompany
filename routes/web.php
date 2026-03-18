<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomVideoController;
use Illuminate\Support\Facades\Log;

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

// МАРШРУТ ДЛЯ ВИДЕО
Route::middleware(['auth'])->post('/rooms/{room}/video', [RoomVideoController::class, 'update'])->name('rooms.video.update');


Route::middleware(['auth'])->post('/rooms/{room}/control', [App\Http\Controllers\VideoControlController::class, '__invoke'])->name('rooms.control');

Route::get('/test-broadcast', function() {
    try {
        require_once base_path('vendor/autoload.php');

        $pusher = new Pusher\Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
            config('broadcasting.connections.pusher.options')
        );

        $result = $pusher->trigger('room.16', 'test-event', ['message' => 'Hello from Laravel']);

        return response()->json([
            'success' => true,
            'result' => $result
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware('auth');

Route::get('/test-event', function() {
    try {
        event(new \App\Events\VideoControl(16, 'test', 0, 1));
        return 'Event dispatched!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
})->middleware('auth');

Route::get('/rooms/{room}/state', App\Http\Controllers\RoomStateController::class)->name('rooms.state');

require __DIR__.'/settings.php';
