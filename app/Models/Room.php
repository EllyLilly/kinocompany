<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'video_url',
        'video_id',
        'description',
        'user_id',
        'is_active',
        'current_time',
        'playing',
        'last_state_update',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Метод для извлечения video_id
    public static function extractVideoIdFromUrl(string $url): ?string
    {
        // Rutube
        $rutubePattern = '/rutube\.ru\/video\/([a-zA-Z0-9_-]+)/';
        if (preg_match($rutubePattern, $url, $matches)) {
            return $matches[1];
        }

        // VK и VK Video - ищем паттерн video-XXXXXX_YYYYYYY в любом домене
        $vkPattern = '/(?:vk\.com|vkvideo\.ru)\/video([-0-9_]+)/';
        if (preg_match($vkPattern, $url, $matches)) {
            return $matches[1];
        }

        return null;
    }
}

