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

const createButton = (elementDescriptor) => {
    const actionButton = document.createElement("button")
    actionButton.textContent = elementDescriptor.label
    actionButton.addEventListener("click", () => sendMessage(`event:${elementDescriptor.id}:action`))
    return actionButton;
}

const createInput = (elementDescriptor) => {
    // create input
    const inputField = document.createElement("input")
    inputField.placeholder = elementDescriptor.label
    inputField.type = elementDescriptor.inputType || "text"
    inputField.addEventListener("keyup", e => {
        if (e.key === "Enter") {
            submitButton.click()
        }
    })

    // create button to submit
    const submitButton = document.createElement("button")
    submitButton.classList.add("devtools--submit-button")
    submitButton.innerText = "Submit"
    submitButton.addEventListener("click", () => {
        sendMessage(`event:${elementDescriptor.id}:action`, {
            value: inputField.value || ""
        })
        inputField.value = ""
    })

    return [inputField, submitButton]
}

const createHeading = (elementDescriptor) => {
    const heading = document.createElement("h1")
    heading.innerText = elementDescriptor.label
    heading.id = elementDescriptor.id
    return heading;
}

const createDropdown = (elementDescriptor) => {
    const select = document.createElement("select")
    const options = elementDescriptor.options.map(o => `<option value="${o}">${o}</option>`)
    select.innerHTML = `<option selected disabled>${elementDescriptor.label}</option>`
    select.innerHTML += options.join("\n")
    select.addEventListener("change", e => sendMessage(`event:${elementDescriptor.id}:action`, {
        value: select.value || ""
    }))
    return select
}

/**
 * Register element with descriptor
 * @param elementDescriptor {{type:string,label:string,id:string,inputType:string?}}
 */
const registerElement = (elementDescriptor) => {
    switch (elementDescriptor.type) {
        case "button":
            appendToDevToolsHost(createButton(elementDescriptor))
            break

        case "input":
            appendToDevToolsHost(...createInput(elementDescriptor))
            break

        case "dropdown":
            appendToDevToolsHost(createDropdown(elementDescriptor))
            break

        case "heading":
            appendToDevToolsHost(createHeading(elementDescriptor))
            break

        default:
            sendError(`Unsupported element type ${elementDescriptor.type}`)
            break
    }
}

/**
 * Reset UI state and treat as opened again
 */
const resetState = () => {
    devtoolsHost.innerHTML = ""
}

const handleEvent = (e) => {
    switch (e.name) {
        case "registerElement":
            registerElement(e.data)
            break

        case "devtools:agent:ready":
            resetState()
            break

        case "reloaded":
            resetState()
            sendOpen()
            break

        default:
            sendError(`Unsupported event name ${e.name}`)
            break
    }
}

backgroundPageConnection.onMessage.addListener(e => handleEvent(e))
