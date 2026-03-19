<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoomDeleteController extends Controller
{
    public function __invoke(Room $room)
    {
        // Проверяем права на удаление
        if (Auth::check()) {
            if ($room->user_id !== Auth::id()) {
                return redirect()->back()->with('error', 'У вас нет прав на удаление этой комнаты');
            }
        } else {
            if ($room->session_id !== session()->getId()) {
                return redirect()->back()->with('error', 'У вас нет прав на удаление этой комнаты');
            }
        }

        $room->delete();

        return redirect('/')->with('success', 'Комната удалена');
    }
}
