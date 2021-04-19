var flowid = 0;

chrome.runtime.onMessage.addListener(function (content, sender, response) {
    if (content.stopMakerFlow == 'stopMakerFlow') {
        chrome.storage.local.get(["default_domains"], function (result) {
            if (typeof result.default_domains != "undefined" && result.default_domains.length > 0) {
                stopMakerFlow(result.default_domains)
            }
        })
    }
});


chrome.runtime.onInstalled.addListener(function () {
    setDefaultDomains();
});

function setDefaultDomains() {
    defaultDomains = [
        'app.slack.com',
        'facebook.com',
        'instagram.com',
        'news.ycombinator.com',
        'reddit.com',
        'twitter.com',
        'web.whatsapp.com'
    ];
    chrome.storage.local.set({
        default_domains: defaultDomains
    });
}


chrome.storage.local.get(["default_domains"], function (result) {
    if (typeof result.default_domains != "undefined" && result.default_domains.length > 0) {
        if (navigator.userAgent.indexOf('Chrome') > -1) {

            chrome.windows.getAll(function (windows) {
                windows.forEach(function (eachWindow) {
                    if (eachWindow.type == "normal") {
                        chrome.tabs.getAllInWindow(eachWindow.id, function (tabs) {
                            for (var i = 0, tab; tab = tabs[i]; i++) {
                                if (tab.url) {
                                    var newDomain = new URL(tab.url);
                                    newDomain = newDomain.host;
                                    var alreadyUrl = result.default_domains.findIndex((x) => {
                                        return x == newDomain
                                    })

                                    if (alreadyUrl > -1) {
                                        chrome.tabs.reload(tab.id)
                                    }
                                }
                            }
                        });
                    }
                });
            });
        } else {
            var gettingAllTabs = browser.tabs.query({});

            gettingAllTabs.then((tabs) => {
                for (let tab of tabs) {
                    var newDomain = new URL(tab.url);
                    newDomain = newDomain.host;
                    var alreadyUrl = result.default_domains.findIndex((x) => {
                        return newDomain.indexOf(x) > -1
                    })
                    if (alreadyUrl > -1) {
                        chrome.tabs.reload(tab.id)
                    }
                }
            });
        }
    }
})

startCheckMakerFlow();
setInterval(() => {
    startCheckMakerFlow()
}, 5000)


function startCheckMakerFlow() {
    chrome.storage.local.get(["auth_token"], function (result) {
        if (typeof result.auth_token != "undefined" && result.auth_token != "") {
            auth_token = result.auth_token;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseURL.indexOf('/login') == -1) {

                        showAndHideOverlay(this.responseText)
                    } else {
                        chrome.runtime.sendMessage({
                            flowmode: 'no'
                        });
                    }
                }
            };
            xhttp.open("GET", apiBaseUrl + 'flow-mode/ongoing?api_token=' + auth_token, true);
            xhttp.send();
        }
    })
}


function showAndHideOverlay(response) {

    var onGoingFlow = false;
    if (response == '') {
        onGoingFlow = false;
        chrome.runtime.sendMessage({
            flowmode: 'no'
        });
        sendMessageToTabs()
    } else {
        onGoingFlow = JSON.parse(response);
        flowid = onGoingFlow.data.id;
        var relativeTime = moment.utc(onGoingFlow.data.start).fromNow()
        sendMessageToTabs(relativeTime)
    }

}


function sendMessageToTabs(show = false) {
    chrome.storage.local.get(["default_domains"], function (result) {
        if (typeof result.default_domains != "undefined" && result.default_domains.length > 0) {
            if (navigator.userAgent.indexOf('Chrome') > -1) {
                chrome.windows.getAll(function (windows) {
                    windows.forEach(function (eachWindow) {
                        if (eachWindow.type == "normal") {
                            chrome.tabs.getAllInWindow(eachWindow.id, function (tabs) {
                                for (var i = 0, tab; tab = tabs[i]; i++) {
                                    if (tab.url) {
                                        var newDomain = new URL(tab.url);
                                        newDomain = newDomain.host;
                                        var alreadyUrl = result.default_domains.findIndex((x) => {
                                            return x == newDomain
                                        })

                                        if (alreadyUrl > -1) {

                                            if (!show) {
                                                chrome.tabs.sendMessage(tab.id, {
                                                    flowmode: 'no'
                                                })
                                            } else {
                                                chrome.tabs.sendMessage(tab.id, {
                                                    flowmode: 'yes',
                                                    relativeTime: show
                                                })
                                                setTimeout(() => {
                                                    chrome.runtime.sendMessage({
                                                        showRelativeTime: show
                                                    })
                                                }, 300)
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
            } else {

                var gettingAllTabs = browser.tabs.query({});

                gettingAllTabs.then((tabs) => {
                    for (let tab of tabs) {
                        var newDomain = new URL(tab.url);
                        newDomain = newDomain.host;
                        var alreadyUrl = result.default_domains.findIndex((x) => {
                            return newDomain.indexOf(x) > -1
                        })
                        if (alreadyUrl > -1) {

                            if (!show) {
                                browser.tabs.sendMessage(tab.id, {
                                    flowmode: 'no'
                                })
                            } else {
                                browser.tabs.sendMessage(tab.id, {
                                    flowmode: 'yes',
                                    relativeTime: show
                                })
                            }
                        }
                    }
                });

            }
        }
    });
}


function stopMakerFlow(domainsArray = []) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            res = JSON.parse(this.responseText);

            if (navigator.userAgent.indexOf('Chrome') > -1) {
                chrome.windows.getAll(function (windows) {
                    windows.forEach(function (eachWindow) {
                        if (eachWindow.type == "normal") {
                            chrome.tabs.getAllInWindow(eachWindow.id, function (tabs) {
                                for (var i = 0, tab; tab = tabs[i]; i++) {
                                    if (tab.url) {
                                        var newDomain = new URL(tab.url);
                                        newDomain = newDomain.host;
                                        var alreadyUrl = domainsArray.findIndex((x) => {
                                            return x == newDomain
                                        })

                                        if (alreadyUrl > -1) {

                                            chrome.tabs.sendMessage(tab.id, {
                                                flowmode: 'no'
                                            })
                                        }
                                    }
                                }
                            });
                        }
                    });
                });

            } else {

                var gettingAllTabs = browser.tabs.query({});

                gettingAllTabs.then((tabs) => {
                    for (let tab of tabs) {

                        var newDomain = new URL(tab.url);
                        newDomain = newDomain.host;

                        var alreadyUrl = domainsArray.findIndex((x) => {
                            return newDomain.indexOf(x) > -1
                        })
                        console.log(alreadyUrl)
                        if (alreadyUrl > -1) {

                            chrome.tabs.sendMessage(tab.id, {
                                flowmode: 'no'
                            })
                        }
                    }
                });


            }
        }
    };
    xhttp.open("POST", apiBaseUrl + 'flow-mode/' + flowid + '/stop?api_token=' + auth_token, true);
    xhttp.send();
}
