<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Pusher\Pusher;
use Illuminate\Support\Facades\Config;

class ChatClearController extends Controller
{
    public function __invoke(Room $room)
    {
        if (Auth::id() !== $room->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        Message::where('room_id', $room->id)->delete();

        try {
            // Прямой вызов Pusher
            $pusher = new Pusher(
                Config::get('broadcasting.connections.pusher.key'),
                Config::get('broadcasting.connections.pusher.secret'),
                Config::get('broadcasting.connections.pusher.app_id'),
                Config::get('broadcasting.connections.pusher.options')
            );

            $pusher->trigger('chat.' . $room->id, 'chat.cleared', []);
            Log::info('Chat cleared event sent via direct Pusher', ['room_id' => $room->id]);

        } catch (\Exception $e) {
            Log::error('Chat cleared event failed', ['error' => $e->getMessage()]);
        }

        return redirect()->back();
    }
}
