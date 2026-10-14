<template>
    <n-layout-sider v-if="app.userSetting.layoutName !== 'mt' || app.mobile" bordered show-trigger collapse-mode="width"
        :collapsed-width="64" :width="240" :native-scrollbar="false" :collapsed="app.collapsed"
        :class="[app.mobile ? 'mobile' : null]" :style="{ left: compData.styleLeft }"
        @collapse="compData.handleCollapse" @expand="app.collapsed = false">
        <n-menu :collapsed-width="64" :collapsed-icon-size="22" :icon-size="18" key-field="id" label-field="title"
            v-model:value="compData.value" :options="app.allMenus" :expanded-keys="compData.expandedKeys"
            @update:value="compData.handleSelect" @update:expanded-keys="compData.handleUpdateExpandedKeys" />
    </n-layout-sider>
</template>
<script lang="ts" setup>
import { computed, reactive, watch } from "vue"
import appStore from "@/pinia/app"
import { useRouter } from "vue-router"
import { getObjectPath, reBuildIcon, removeElements } from "@/utils/utils"
import cloneDeep from "lodash/cloneDeep.js"
import { storeToRefs } from 'pinia';


interface Props {
    isOpen: boolean
}
const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const app = appStore()
const router = useRouter()
const updateExpandedKeys = () => {
    const paths = getObjectPath({ arr: app.treeMenus, id: app.currentRouter.meta.id })
    if (paths !== undefined) {
        compData.expandedKeys = paths.map((item: any) => item.id)
    } else {
        compData.expandedKeys = []
    }
}

const compData = reactive({
    expandedKeys: <any>[],
    styleLeft: computed(() => {
        return app.mobile ? props.isOpen ? 0 : "-250px" : 0
    }),
    allMenus: <any>[],
    handleSelect (key: any, item: any) {
        router.push(item.router)
    },
    handleUpdateExpandedKeys (keys: string[]) {
        compData.expandedKeys = keys
    },
    handleCollapse () {
        app.collapsed = true
    },
    value: null
})

watch(() => router.currentRoute.value.path, () => {
    updateExpandedKeys()
    if (router.currentRoute.value.meta.show) {
        compData.value = app.currentRouter.meta.id
    } else {
        compData.value = null
    }
}, { immediate: true, deep: true })

const updateMenu = () => {
    const m = cloneDeep(app.treeMenus)
    removeElements(m)

    let allMenus = computed(() => m.filter(item =>
        item.show == 1 && ((item.children && item.children.length > 0) || item.component != "")
    ))
    // compData.allMenus = reBuildIcon(allMenus.value)
    app.allMenus=reBuildIcon(allMenus.value)
}

// watch(app.userSetting, () => {
//     updateMenu()
// }, {
//     immediate: true,
//     deep: true
// })

const { treeMenus } = storeToRefs(app);
watch(() => treeMenus.value, () => {
    updateMenu();
}, {
    deep: true,
    immediate: true
});




</script>
