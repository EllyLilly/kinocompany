<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            // Поля для хранения состояния видео
            $table->float('current_time')->default(0)->after('description');
            $table->boolean('playing')->default(false)->after('current_time');
            $table->timestamp('last_state_update')->nullable()->after('playing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn(['current_time', 'playing', 'last_state_update']);
        });
    }
};
