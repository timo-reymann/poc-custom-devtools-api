const devtoolsHost = document.querySelector("#custom-devtools-host")

/**
 * Append nodes bundled together in a row
 * @param nodes {Node}
 */
const appendToDevToolsHost = (...nodes) => {
    const wrapper = document.createElement("div")
    wrapper.classList.add("devtools--row")
    nodes.forEach(node => wrapper.append(node))
    devtoolsHost.append(wrapper)
}

/**
 * Register element with descriptor
 * @param elementDescriptor {{type:string,label:string,id:string}}
 */
const registerElement = (elementDescriptor) => {
    switch (elementDescriptor.type) {
        case "button":
            const actionButton = document.createElement("button")
            actionButton.textContent = elementDescriptor.label
            actionButton.addEventListener("click", () => sendMessage(`event:${elementDescriptor.id}:action`))
            appendToDevToolsHost(actionButton)
            break

        case "input":
            // create input
            const inputField = document.createElement("input")
            inputField.placeholder = elementDescriptor.label

            // create button to submit
            const submitButton = document.createElement("button")
            submitButton.innerText = "Submit"
            submitButton.addEventListener("click", () => {
                sendMessage(`event:${elementDescriptor.id}:action`, {
                    value: inputField.value || "bla"
                })
                inputField.value = ""
            })
            appendToDevToolsHost(inputField, submitButton)
            break

        default:
            console.warn(`Unsupported element type ${elementDescriptor.type}`)
            break
    }
}

/**
 * Reset UI state and treat as opened again
 */
const resetUI = () => {
    sendOpen()
    devtoolsHost.innerHTML = ""
}

const handleEvent = (e) => {
    switch (e.name) {
        case "registerElement":
            registerElement(e.data)
            break

        case "reloaded":
            resetUI()
            break

        default:
            console.warn("Unknown event", e)
            break
    }
}

backgroundPageConnection.onMessage.addListener(e => handleEvent(e))
