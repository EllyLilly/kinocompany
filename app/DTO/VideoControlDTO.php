<?php

namespace App\DTO;

class VideoControlDTO
{
    public function __construct(
        public readonly int $roomId,
        public readonly string $action,
        public readonly float $currentTime,
        public readonly ?int $userId = null,
    ) {}

    public function toArray(): array
    {
        return [
            'action' => $this->action,
            'currentTime' => $this->currentTime,
            'userId' => $this->userId,
            'roomId' => $this->roomId,
        ];
    }
}
