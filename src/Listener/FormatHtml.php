<?php

namespace Sijad\Editor\Listener;

use DirectoryIterator;
use Flarum\Event\ConfigureFormatter;
use Illuminate\Contracts\Events\Dispatcher;

class FormatHtml
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureFormatter::class, [$this, 'addHtmlSupport']);
    }

    public function addHtmlSupport(ConfigureFormatter $event)
    {
        $whitelistElements = [
            'blockquote',
            'code',
            'em',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'img',
            'li',
            'ol',
            'p',
            'sup',
            'sub',
            'strong',
            'strike',
            'ul',
            'br',
            'span',
            'u',
            // 'a'
        ];

        foreach ($whitelistElements as $element) {
            $event->configurator->HTMLElements->allowElement($element);
        }

        $aliasElements = [
            'b' => 'strong',
            'i' => 'em',
            's' => 'strike',
            'pre' => 'code',
            'a' => 'URL',
        ];

        foreach ($aliasElements as $element => $alias) {
            $event->configurator->HTMLElements->aliasElement($element, $alias);
        }

        $event->configurator->HTMLElements->aliasAttribute('a', 'href', 'url');

        $colorElements = [
            'em',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'li',
            'ol',
            'p',
            'sup',
            'sub',
            'strong',
            'strike',
            'ul',
            'span',
        ];

        foreach ($colorElements as $element) {
            $event->configurator->HTMLElements->allowUnsafeAttribute($element, 'style')
                ->filterChain->append('#regexp')->setRegexp(
                    '/(^color:\s?(#([\da-f]{3}){1,2}|rgb\((\s?\d{1,3}\s?,?){3}\)))|'.
                    '(^text\-align:\s?(center|right|left))/i'
                );
        }

        $event->configurator->plugins->load('HTMLEntities');;

        // $event->configurator->tags['URL']->attributes->add('style')->filterChain->append('#regexp')
        //     ->setRegexp(
        //         '/^color:\s+(#([\da-f]{3}){1,2}|rgb\((\s?\d{1,3}\s?,?){3}\))/i'
        //     );
    }
}
