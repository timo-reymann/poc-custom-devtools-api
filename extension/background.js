const browserAPI = chrome || browser
let connections = {}

/*
 * agent api -> content script -> background script -> dev tools
 */
browserAPI.runtime.onMessage.addListener(function(request, sender) {
    if (sender.tab) {
        const tabId = sender.tab.id
        if (tabId in connections) {
            connections[tabId].postMessage(request)
        } else {
            console.debug("[background-script] Tab not found in connection list.")
        }
    } else {
        console.warn("[background-script] Failed to send message: sender.tab not defined.")
    }
    return true
})


/*
 * agent api <- content script <- background script <- dev tools
 */
browserAPI.runtime.onConnect.addListener(function(port) {

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(function(request) {
        console.debug('[background-script] Forwarding message from dev tools to page', request)

        // Register initial connection
        if (request.name === 'init') {
            connections[request.tabId] = port

            port.onDisconnect.addListener(function() {
                delete connections[request.tabId]
            })

            return
        }

        // Otherwise, broadcast to agent
        browserAPI.tabs.sendMessage(request.tabId, {
            name: request.name,
            data: request.data
        })
    })

})

/*
    Propagate reloads to be able to simulate a open to page making sure the event is always fired
 */
browserAPI.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (tabId in connections && changeInfo.status === 'complete') {
        connections[tabId].postMessage({
            name: 'reloaded'
        })
    }
})
