chrome.runtime.onMessage.addListener(function (content, sender, response) {
    if (content.flowmode == 'yes') {
        jQuery(window).scrollTop(0)
        var iframe;
        if ($('.maker-flow-iframe').length == 0) {
            iframe = $(`<iframe class="maker-flow-iframe" src='${chrome.runtime.getURL('overlay.html')}' scrolling='no'></iframe>`);
            $('body').append(iframe)
            iframe.bind('load', function () {
                var relativeTime = iframe.contents().find('.relative-time');
                relativeTime.text(content.relativeTime);
                relativeTime.show();
            })
        } else {
           iframe = $('.maker-flow-iframe');
            var relativeTime = iframe.contents().find('.relative-time');
            relativeTime.text(content.relativeTime);
            relativeTime.show();
        }


        chrome.runtime.sendMessage({showRelativeTime: content.relativeTime})

        iframe.addClass('show-maker-flow');

        setTimeout(() => {
            $('body').addClass('maker-flow-overflow-hidden');
            chrome.runtime.sendMessage({showRelativeTime: content.relativeTime})
        }, 100)

    }

    if (content.flowmode == 'no') {
        $('.maker-flow-iframe').removeClass('show-maker-flow');
        $('body').removeClass('maker-flow-overflow-hidden');
    }

});
