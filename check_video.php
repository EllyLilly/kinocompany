<?php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Room;

// Покажи последние 5 комнат
$rooms = Room::latest()->take(5)->get();

echo "ПОСЛЕДНИЕ КОМНАТЫ:\n";
echo "==================\n\n";

foreach ($rooms as $room) {
    echo "ID: " . $room->id . "\n";
    echo "Название: " . $room->name . "\n";
    echo "Video URL: " . ($room->video_url ?: 'NULL') . "\n";
    echo "Video ID: " . ($room->video_id ?: 'NULL') . "\n";
    echo str_repeat('-', 50) . "\n\n";
}
