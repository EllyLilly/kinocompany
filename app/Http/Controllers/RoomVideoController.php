<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoomVideoController extends Controller
{
    public function update(Request $request, Room $room)
    {
        // Проверка, что пользователь авторизован
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Валидация
        $request->validate([
            'video_url' => 'required|url'
        ]);

        // Извлечение video_id
        $videoId = Room::extractVideoIdFromUrl($request->video_url);

        // Обновление комнаты
        $room->video_url = $request->video_url;
        $room->video_id = $videoId;
        $room->save();

        // Возвра ответа
        return redirect()->back()->with([
            'success' => 'Видео сохранено',
            'video_id' => $videoId
        ]);
    }
}
