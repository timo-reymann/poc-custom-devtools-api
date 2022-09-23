/**
 * Send event to dev tools
 * @param name {string} Name of the event
 * @param data {Object|null} Payload of the event, can be omitted
 */
const sendEvent = (name, data) => {
    window.postMessage({
        source: "custom-devtools-agent",
        name: name,
        data: data || {}
    })
}

/**
 * Contains all event listeners for dev tools
 */
let listeners = {}

/**
 * Register element with dev tools
 * @param descriptor {{label : string, onAction: Function?, id: string}} Descriptor of the element to add
 */
const registerElement = (descriptor) => {
    if (descriptor.onAction) {
        listeners[`event:${descriptor.id}:action`] = descriptor.onAction
        delete descriptor.onAction
    }
    sendEvent("registerElement", descriptor)
}

/**
 * Create UUID v4
 */
const uuidv4 = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
)

/**
 * Create new button
 * @param label {string} Label for the button
 * @param onAction {Function} What should happen on click
 * @returns {{onAction, id: *, label, type: string}}
 */
const createButton = (label, onAction) => {
    return {
        id: uuidv4(),
        type: "button",
        label,
        onAction
    }
}

/**
 * Create input field with submit button
 * @param label {string} Label for input field
 * @param onAction {Function} What should happen when submit is clicked
 * @returns {{onAction, id: *, label, type: string}}
 */
const createInput = (label, onAction) => {
    return {
        id: uuidv4(),
        type: "input",
        label,
        onAction
    }
}

/**
 * Find listener for specific event. If none is found returns null
 * @param event
 * @returns {null|*}
 */
const findListener = (event) => {
    if (Object.keys(listeners).includes(event.name)) {
        return listeners[event.name]
    }

    return null
}

/**
 * Register custom dev tools is your entrypoint for defining your dev tools.
 *
 * It is only evaluated if the dev tools are actually opened and otherwise just sits there ready to use.
 * @param devTools {{elementDescriptors : []}} Dev tools description
 */
const registerCustomDevTools = (devTools) => {
    const elementDescriptors = devTools.elementDescriptors

    window.addEventListener("message", (e) => {
        if (e.source !== window || !e.data || e.data.source !== "custom-devtools-devtools") {
            return
        }

        const event = e.data
        switch (event.name) {
            case "devtools:open":
                if (elementDescriptors) {
                    elementDescriptors.forEach(descriptor => registerElement(descriptor))
                }
                break

            default:
                const listener = findListener(event)
                if (listener == null) {
                    console.warn("Unknown event", event)
                } else {
                    listener(event.data)
                }
                break
        }
    })
}
