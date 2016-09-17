<?php

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Bus\Dispatcher as BusDispatcher;
use Sijad\Editor\Listener;

return function (Dispatcher $events, BusDispatcher $bus) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\FormatHtml::class);
    // $bus->pipeThrough(['Sijad\Editor\Validate']);
};
