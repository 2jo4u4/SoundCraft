import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  manifest: ({ browser }) => ({
    name: "__MSG_appName__",
    description: "__MSG_appDesc__",
    default_locale: "en",
    permissions: ["activeTab", "storage"],
    icons: {
      32: "icons/ctrl-32.png",
      64: "icons/ctrl-64.png",
      128: "icons/ctrl-128.png",
    },
    action: {
      default_icon: "icons/ctrl-32.png",
      default_title: "__MSG_appName__",
    },
    ...(browser === "firefox"
      ? {
          browser_specific_settings: {
            gecko: {
              id: "soundcraft-eq@jay.addons.mozilla.org",
              strict_min_version: "140.0",
              data_collection_permissions: {
                required: ["none"],
              },
            },
          },
        }
      : {}),
  }),
});
