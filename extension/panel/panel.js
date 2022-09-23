// Set theme to panel to style according to theme selected
const theme = chrome.devtools.panels.themeName
document.body.classList.add(`theme-${theme}`)

// Create runtime connection for events
const backgroundPageConnection = chrome.runtime.connect({
    name: 'panel'
})

// init messaging connection
backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
})

/**
 * Send open event for devtools in the currently inspected window
 */
const sendOpen = () => {
    backgroundPageConnection.postMessage({
        name: 'devtools:open',
        tabId: chrome.devtools.inspectedWindow.tabId
    })
}

// signal for hosted page
sendOpen()

/**
 * Send message to agent
 * @param name {string} Name of the event
 * @param data {Object|undefined=} Payload
 */
const sendMessage = (name, data) => {
    backgroundPageConnection.postMessage({
        name: name,
        tabId: chrome.devtools.inspectedWindow.tabId,
        data
    })
}
