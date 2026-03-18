<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Events\VideoControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Pusher\Pusher;

class VideoControlController extends Controller
{
    public function __invoke(Request $request, $roomId)
    {
        $request->validate([
            'action' => 'required|in:play,pause,seek,sync_request',
            'currentTime' => 'nullable|numeric'
        ]);

        $room = Room::findOrFail($roomId);

        // Сохранение состояние в БД
        $room->current_time = $request->currentTime ?? $room->current_time;
        $room->playing = $request->action === 'play' ? true : ($request->action === 'pause' ? false : $room->playing);
        $room->last_state_update = now();
        $room->save();

        // Отправка всем кроме отправителя
        $pusher = new Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
            config('broadcasting.connections.pusher.options')
        );

        $pusher->trigger('room.' . $roomId, 'video.control', [
            'action' => $request->action,
            'currentTime' => $request->currentTime ?? 0,
            'userId' => Auth::id(),
            'roomId' => $roomId
        ]);

        return redirect()->back();
    }
}
