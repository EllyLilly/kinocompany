<?php

return [

    'default' => env('BROADCAST_CONNECTION', 'null'),

    'connections' => [

        'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'app_id' => env('PUSHER_APP_ID'),
        'options' => [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'host' => 'api-' . env('PUSHER_APP_CLUSTER') . '.pusher.com',
            'port' => 443,
            'scheme' => 'https',
            'encrypted' => true,
            'useTLS' => true,
            'curl_options' => [
                CURLOPT_SSL_VERIFYPEER => false,
                ],
            ],
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
