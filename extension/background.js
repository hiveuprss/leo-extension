
// TODO: clean up data (merge lists into 1 dict)

var sitesToRedirect = [
    'hive.blog',
    'peakd.com',
    'ecency.com',
    'hivelist.com',
    'ctptalk.com'
]

var defaultSettings = {
    'hiveblog': false,
    'peakdcom': false,
    'ecencycom': false,
    'hivelistcom': false,
    'ctptalkcom': false
}

var requestFilterUrls = [
    '*://hive.blog/*',
    '*://peakd.com/*',
    '*://ecency.com/*',
    '*://hivelist.io/*',
    '*://ctptalk.com/*'
]

var currentSettings = {
    'hiveblog': false,
    'peakdcom': false,
    'ecencycom': false,
    'hivelistcom': false,
    'ctptalkcom': false
}



function shouldRedirect(host) {
    if (!sitesToRedirect.includes(host)) {
        return false
    }

    const settingsKey = host.replace('.','')

    if (Object.keys(currentSettings).includes(settingsKey) && currentSettings[settingsKey]) {
        return currentSettings[settingsKey]
    } else {
        return defaultSettings[settingsKey]
    }
}

function redirectListener(requestDetails) {

    var targetUrl = new URL(requestDetails.url)
    if (shouldRedirect(targetUrl.host)) {
        console.log(`LeoHelper: Redirecting ${targetUrl.host} to LeoFinance.io...`)
        return {
            redirectUrl: `${targetUrl.protocol}//leofinance.io${targetUrl.pathname}`
        };
    }
    return
}


function syncSettings() {

    let keys = Object.keys(defaultSettings)

    chrome.storage.sync.get(keys, function(result) {
        Object.entries(result).forEach(
            ([k,v]) => {
                currentSettings[k] = v
            }
        )
    })
}


// on settings change, update settings
chrome.storage.onChanged.addListener(function (changes){
    syncSettings()
})


// on startup, sync settings from storage and add listener
syncSettings()

chrome.webRequest.onBeforeRequest.addListener(
    // callback
    redirectListener,
    // filter
    {urls:requestFilterUrls, types:['main_frame','sub_frame']},
    //  extraInfoSpec
    ['blocking']
)
