const browserAPI = browser || chrome
/*
 * agent ->content script -> background script -> dev tools
 */
window.addEventListener('message', function(event) {
    // Only accept messages from same frame
    if (event.source !== window) {
        return
    }

    const message = event.data

    // Only accept messages of correct format (our messages)
    if (typeof message !== 'object' || message === null ||
        message.source !== 'custom-devtools-agent') {
        return
    }

    console.debug("Forwarding message from agent to dev tools",event.data)
    browserAPI.runtime.sendMessage(message)
})


/*
 * agent <- content script <- background script <- dev tools
 */
chrome.runtime.onMessage.addListener(function(request) {
    console.debug("Got message from dev tools", request)
    request.source = 'custom-devtools-devtools'
    window.postMessage(request, '*')
})
