
var defaultSettings = {
    'hiveblog': false,
    'peakdcom': false,
    'ecencycom': false,
    'hivelistcom': false,
    'ctptalkcom': false
}

Object.keys(defaultSettings).forEach(k => {
    const key = k
    chrome.storage.sync.get(key, function(result) {
        console.log(`Value currently is ${key} ${result[key]}`)
        if (result[key]) {
            document.querySelector(`input#${k}`).checked = (result[key])
        } else {
            document.querySelector(`input#${k}`).checked = (defaultSettings[key])
        }
    })

    document.querySelector(`input#${k}`).onchange = (e) => {
        const key = k
        const value = e.target.checked
        var data = {}
        data[`${key}`]  = value

        chrome.storage.sync.set(data, function() {
            console.log('saved', key, data)
        });
    }
})


