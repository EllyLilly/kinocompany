<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VideoControl implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $roomId;
    public $action;
    public $currentTime;
    public $userId;

    public function __construct($roomId, $action, $currentTime = 0, $userId = null)
    {
        $this->roomId = $roomId;
        $this->action = $action;
        $this->currentTime = $currentTime;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new Channel('room.' . $this->roomId);
    }

    public function broadcastAs()
    {
        return 'video.control';
    }
}
