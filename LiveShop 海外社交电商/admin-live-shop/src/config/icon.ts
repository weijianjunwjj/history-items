import type {App} from "vue"
import {h} from "vue"
import {NIcon} from "naive-ui"
import * as ionicons5 from "@vicons/ionicons5"
import * as antd from "@vicons/antd"

function renderIcon(iconName: string) {
    iconName=iconName.toString()
    if (iconName?.startsWith("ionicons5-")) {
        const iconKey = iconName.replace("ionicons5-", "")
        for (const [key, component] of Object.entries(ionicons5)) {
            if (iconKey === key) {
                return () => h(NIcon, null, {default: () => h(component)})
            }
        }
    }
    if (iconName?.startsWith("antd-")) {
        const iconKey = iconName.replace("antd-", "")
        for (const [key, component] of Object.entries(antd)) {
            if (iconKey === key) {
                return () => h(NIcon, null, {default: () => h(component)})
            }
        }
    }
}

const setupIcons = (app: App) => {
    for (const [key, component] of Object.entries(ionicons5)) {
        app.component("ionicons5-" + key, component)
    }
    for (const [key, component] of Object.entries(antd)) {
        app.component("antd-" + key, component)
    }
}

export default setupIcons
export {
    renderIcon
}
