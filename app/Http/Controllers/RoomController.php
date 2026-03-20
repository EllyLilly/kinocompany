<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\DTO\RoomDTO;

class RoomController extends Controller
{
    // Создание комнаты
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'video_url' => 'required|url',
            'description' => 'nullable|string',
        ]);

        $dto = RoomDTO::fromRequest($request);

        $room = Room::create([
            'name' => $dto->name,
            'video_url' => $dto->video_url,
            'description' => $dto->description,
            'user_id' => $dto->user_id,
            'session_id' => $dto->session_id,
            'slug' => uniqid(),
            'video_id' => Room::extractVideoIdFromUrl($dto->video_url),
        ]);

        return redirect()->route('rooms.show', $room->id);
    }

    // Просмотр комнаты
    public function show(Room $room)
    {
        return Inertia::render('Rooms/Show', [
            'room' => $room,
            'roomId' => $room->id,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function myRooms()
    {
        if (Auth::check()) {
            $rooms = Room::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $rooms = Room::where('session_id', session()->getId())
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Rooms/MyRooms', [
            'rooms' => $rooms
        ]);
    }
}
