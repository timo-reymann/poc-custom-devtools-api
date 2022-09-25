const browserAPI = browser || chrome

// Set theme to panel to style according to theme selected
const theme = browserAPI.devtools.panels.themeName
document.body.classList.add(`theme-${theme}`)

// Create runtime connection for events
const backgroundPageConnection = browserAPI.runtime.connect({
    name: 'panel'
})

// init messaging connection
backgroundPageConnection.postMessage({
    name: 'init',
    tabId: browserAPI.devtools.inspectedWindow.tabId
})

/**
 * Send open event for devtools in the currently inspected window
 */
const sendOpen = () => {
    backgroundPageConnection.postMessage({
        name: 'devtools:open',
        tabId: browserAPI.devtools.inspectedWindow.tabId
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
        tabId: browserAPI.devtools.inspectedWindow.tabId,
        data
    })
}
