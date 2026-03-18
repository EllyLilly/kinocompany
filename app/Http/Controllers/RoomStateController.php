<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RoomStateController extends Controller
{
    public function __invoke(Room $room)
    {
        $time = $room->current_time;

        // Если видео играет - добавляем прошедшее время
        if ($room->playing && $room->last_state_update) {
            $secondsPassed = Carbon::parse($room->last_state_update)->diffInSeconds(now());
            $time += $secondsPassed;
        }

        return response()->json([
            'current_time' => $time,
            'playing' => $room->playing,
            'last_updated' => $room->last_state_update,
        ]);
    }
}
