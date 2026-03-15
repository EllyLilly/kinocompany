<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        // Список диалогов с последним сообщением
        $users = User::where('id', '!=', Auth::id())
            ->with(['messages' => function($q) {
                $q->where('receiver_id', Auth::id())
                  ->orWhere('sender_id', Auth::id())
                  ->latest();
            }])
            ->get();

        return Inertia::render('Messages/Index', [
            'users' => $users,
            'unreadCount' => Message::where('receiver_id', Auth::id())
                ->where('is_read', false)
                ->count()
        ]);
    }

    public function show(User $user)
    {
        // Помечаем сообщения как прочитанные
        Message::where('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::where(function($q) use ($user) {
                $q->where('sender_id', Auth::id())
                  ->where('receiver_id', $user->id);
            })->orWhere(function($q) use ($user) {
                $q->where('sender_id', $user->id)
                  ->where('receiver_id', Auth::id());
            })->orderBy('created_at')->get();

        return Inertia::render('Messages/Show', [
            'user' => $user,
            'messages' => $messages
        ]);
    }

    public function store(Request $request, User $user)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'message' => $request->message
        ]);

        return redirect()->back();
    }
}
