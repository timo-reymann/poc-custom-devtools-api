const browserAPI = chrome || browser

// Set theme to panel to style according to theme selected
const theme = browserAPI.devtools.panels.themeName
document.body.classList.add(`theme-${theme}`)

// Create runtime connection for events
const backgroundPageConnection = browserAPI.runtime.connect({
    name: 'panel'
})

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

// init messaging connection
sendMessage("init")

/**
 * Send open event for devtools in the currently inspected window
 */
const sendOpen = () => {
    sendMessage("devtools:open")
}

const sendError = (message) => {
    sendMessage("devtools:error", message)
}

// signal for hosted page
sendOpen()
