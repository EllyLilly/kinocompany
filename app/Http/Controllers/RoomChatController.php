<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\DTO\MessageDTO;

class RoomChatController extends Controller
{
    public function index(Room $room)
    {
        $messages = Message::where('room_id', $room->id)
            ->with('sender')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json($messages);
    }

    public function store(Request $request, Room $room)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $dto = MessageDTO::fromRequest($request, $room->id);

        $message = Message::create([
            'sender_id' => $dto->sender_id,
            'room_id' => $dto->room_id,
            'message' => $dto->message,
            'is_read' => false,
        ]);

        $message->load('sender');

        Log::info('Broadcasting message', [
            'room_id' => $room->id,
            'channel' => 'chat.' . $room->id,
            'event' => 'message.sent',
            'message_id' => $message->id
        ]);

        broadcast(new MessageSent($message));

        return response()->json($message);
    }
}
