import {
    registerCustomDevTools,
    createButton,
    createHeading,
    createInput,
    createDropdown,
    createToggle,
    createSlider,
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
                    cols: 12,
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
                createHeading("Commmunication", 12),
                createButton(
                    "Hi from your todays host: localhost",
                    () => alert("So you dared to click me in the devtools?!"),
                    6
                ),
                createButton(
                    "Log it baby one more time",
                    () => console.log("Oh yeah, thats it!"),
                    6
                ),
                createDropdown({
                    label: "Select something",
                    options: ["A", "B"],
                    onAction: (e) => console.log("Selection changed", e.value),
                    cols: 6
                }),
                createHeading("Manipulate page", 12),
                createButton(
                    "Set random background",
                    () => document.body.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16),
                    6
                ),
                createInput({
                    label: "Your name here",
                    type: "text",
                    onAction: (e) => alert(`So you are ${e.value}?\nNoted.`),
                    cols: 6
                }),
                createInput({
                    label: "Overwrite background color",
                    type: "color",
                    onAction: (e) => document.body.style.backgroundColor = e.value,
                    cols: 6
                }),
                createSlider({
                    label: "Page font size",
                    min: 10,
                    max: 30,
                    step: 1,
                    value: 14,
                    onAction: (e) => document.body.style.fontSize = `${e.value}px`,
                    cols: 6
                }),
                createToggle({
                    label: "Dark background",
                    checked: true,
                    onAction: (e) => {
                        document.body.style.background = e.value ? 'black' : 'white'
                        document.body.style.color = e.value ? 'white' : 'black'
                    },
                    cols: 6
                }),
                createHeading("Data Display", 12),
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
                    },
                    12
                ),
                // try to crash -> should log error
                { type: "test" }
            ]
        }
    ]
})
