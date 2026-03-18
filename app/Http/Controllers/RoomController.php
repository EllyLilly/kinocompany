<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    // Создание комнаты
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'video_url' => 'required|url',
        'description' => 'nullable|string',
    ]);

    $validated['slug'] = uniqid();

    if (Auth::check()) {
        $validated['user_id'] = Auth::id();
    }

    // Извлечение ID
    $validated['video_id'] = Room::extractVideoIdFromUrl($validated['video_url']);

    $room = Room::create($validated);

    return redirect()->route('rooms.show', $room->id);
}

    // Просмотр комнаты
    public function show(Room $room)
    {
        return Inertia::render('Rooms/Show', [
        'room' => $room,
        'roomId' => $room->id,
        ]);
    }

        public function myRooms()
    {
        return Inertia::render('Rooms/MyRooms');
    }
}
