import { defineConfig } from 'wxt';

// WXT derives `background.service_worker` (Chrome) vs `background.scripts` (Firefox)
// and `devtools_page` from the entrypoints per target — no manual per-browser manifest.
export default defineConfig({
  // Force MV3 on both targets (WXT defaults Firefox to MV2). Firefox MV3 gets
  // `background.scripts`; Chrome MV3 gets `background.service_worker`.
  manifestVersion: 3,
  modules: ['@wxt-dev/module-svelte'],
  manifest: ({ browser }) => ({
    name: 'Custom Dev-Tools',
    description: 'Extension for custom dev tools',
    version: '1.0',
    icons: {
      '128': 'icons/settings-gears-gray.png',
    },
    permissions: ['scripting', 'activeTab'],
    host_permissions: ['http://*/*', 'https://*/*'],
    // Firefox MV3 requires an add-on ID; keep it out of the Chrome manifest.
    ...(browser === 'firefox'
      ? {
          browser_specific_settings: {
            gecko: {
              id: 'custom-devtools@poc.example',
              strict_min_version: '109.0',
            },
          },
        }
      : {}),
  }),
});
