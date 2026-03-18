<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Room;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('room.{roomId}', function ($user, $roomId) {
    // Разрешение доступа всем авторизованным пользователям
    return (int) $user->id > 0;
});
