<?php

namespace App\DTO;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoomDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $video_url,
        public readonly ?string $description = null,
        public readonly ?int $user_id = null,
        public readonly ?string $session_id = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->name,
            video_url: $request->video_url,
            description: $request->description,
            user_id: Auth::check() ? Auth::id() : null,
            session_id: session()->getId(),
        );
    }
}
