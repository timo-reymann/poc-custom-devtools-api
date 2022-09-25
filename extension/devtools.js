const browserAPI = chrome || browser
const isDarkTheme = browserAPI.devtools.panels.themeName === "dark"

browserAPI.devtools.panels.create("Custom Dev-Tools",
    `panel/icons/settings-gears-${isDarkTheme ? "gray" : "black"}.png`,
    "panel/panel.html",
     (panel) => {
    }
)
