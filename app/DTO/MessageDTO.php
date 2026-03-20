<?php

namespace App\DTO;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageDTO
{
    public function __construct(
        public readonly int $sender_id,
        public readonly int $room_id,
        public readonly string $message,
    ) {}

    public static function fromRequest(Request $request, int $roomId): self
    {
        return new self(
            sender_id: Auth::id(),
            room_id: $roomId,
            message: $request->message,
        );
    }
}
