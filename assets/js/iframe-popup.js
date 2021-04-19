chrome.runtime.onMessage.addListener(function (content, sender, response) {
    if (content.showRelativeTime) {

        $('.relative-time').text(content.showRelativeTime);
        $('.relative-time').show();
    }


});


$(function () {
    // body...

    $(document).on('click', '.stop-maker-flow', function () {

        chrome.runtime.sendMessage({'stopMakerFlow': 'stopMakerFlow'})

    });


})
