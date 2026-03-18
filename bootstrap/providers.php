<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use App\Providers\BroadcastServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    BroadcastServiceProvider::class,
];
