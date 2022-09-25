const browserAPI = chrome || browser

browserAPI.devtools.panels.create("Custom Dev-Tools",
    "panel/settings-gears.png",
    "panel/panel.html",
     (panel) => {
    }
)
