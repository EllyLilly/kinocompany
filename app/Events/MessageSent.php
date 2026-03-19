<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class MessageSent implements ShouldBroadcastNow
{
        use Dispatchable, InteractsWithSockets;

    public $data;

    public function __construct(Message $message)
    {
        $this->data = [
            'id' => $message->id,
            'message' => $message->message,
            'sender_id' => $message->sender_id,
            'sender_name' => $message->sender->name,
            'sender_avatar' => $message->sender->avatar,
            'created_at' => $message->created_at,
            'room_id' => $message->room_id,
        ];
    }

    public function broadcastOn()
    {
        return new Channel('chat.' . $this->data['room_id']);
    }

    public function broadcastAs()
    {
        return 'message.sent';
    }

    public function broadcastWith()
    {
        return $this->data;
    }
}
