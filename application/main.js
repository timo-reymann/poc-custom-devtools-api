import {
    registerCustomDevTools,
    createButton,
    createHeading,
    createInput,
    createDropdown,
    updateTable,
} from '@devtoolster/web-api'

registerCustomDevTools({
    tabs: [
        {
            label: "Table",
            elements: [
                {
                    id: "demo-table",
                    type: "table",
                    label: "User Data",
                    columns: ["Name", "Age", "City"],
                    rows: [
                        ["Alice", "28", "New York"],
                        ["Bob", "35", "London"],
                        ["Charlie", "42", "Berlin"]
                    ]
                }
            ]
        },
        {
            label: "Controls",
            elements: [
                createHeading("Commmunication"),
                createButton(
                    "Hi from your todays host: localhost",
                    () => alert("So you dared to click me in the devtools?!")
                ),
                createButton(
                    "Log it baby one more time",
                    () => console.log("Oh yeah, thats it!")
                ),
                createDropdown({
                    label: "Select something",
                    options: ["A", "B"],
                    onAction: (e) => console.log("Selection changed", e.value)
                }),
                createHeading("Manipulate page"),
                createButton(
                    "Set random background",
                    () => document.body.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16)
                ),
                createInput({
                    label: "Your name here",
                    type: "text",
                    onAction: (e) => alert(`So you are ${e.value}?\nNoted.`)
                }),
                createInput({
                    label: "Overwrite background color",
                    type: "color",
                    onAction: (e) => document.body.style.backgroundColor = e.value
                }),
                createHeading("Data Display"),
                createButton(
                    "Cycle table data",
                    () => {
                        const datasets = [
                            [
                                ["Alice", "28", "New York"],
                                ["Bob", "35", "London"],
                                ["Charlie", "42", "Berlin"]
                            ],
                            [
                                ["Dave", "31", "Paris"],
                                ["Eve", "29", "Tokyo"]
                            ],
                            []
                        ]
                        const idx = (window.tableCycleIdx || 0) % datasets.length
                        window.tableCycleIdx = idx + 1
                        updateTable("demo-table", datasets[idx])
                    }
                ),
                // try to crash -> should log error
                { type: "test" }
            ]
        }
    ]
})
