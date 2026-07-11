// Registers the "Custom Dev-Tools" panel and picks its icon to match the DevTools theme.
const isDarkTheme = browser.devtools.panels.themeName === 'dark';

browser.devtools.panels.create(
  'Custom Dev-Tools',
  `/icons/settings-gears-${isDarkTheme ? 'gray' : 'black'}.png`,
  '/panel.html',
);
