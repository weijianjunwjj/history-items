<template>
    <n-layout style="height: 100%">
        <n-layout-header class="header" bordered>
            <AppLogo v-if="!app.mobile"/>
            <div class="header-plan">
                <Breadcrumb />
            </div>
            <div class="header-user">
                <UserSet/>
            </div>
        </n-layout-header>
        <n-layout has-sider style="height: calc(100% - 50px);">
            <Sidebar v-model:isOpen="compData.isOpen"/>
            <n-layout style="height: 100%">
                <n-el tag="div" class="layout-main">
                    <Tabs />
                    <BagMain/>
                </n-el>
            </n-layout>
        </n-layout>
    </n-layout>
    <div class="mobile-mask" v-show="compData.isOpen" @click="compData.handleMobileMask"></div>
</template>

<script lang="ts" setup>
import {reactive} from "vue"
import Breadcrumb from "@/layout/components/Breadcrumb.vue"
import UserSet from "@/layout/components/UserSet.vue"
import AppLogo from "@/layout/components/AppLogo.vue"
import Sidebar from "@/layout/sidebar/index.vue"
import Tabs from "@/layout/tabs/index.vue"
import BagMain from "@/layout/main/index.vue"
import appStore from "@/pinia/app"

const app = appStore()
const compData = reactive({
    isOpen: false,
    handleMobileMask() {
        compData.isOpen = !compData.isOpen
    },
})
</script>
<style lang="less" scoped>

.header {
    display: flex;
    height: 50px;

    &-plan {
        display: flex;
        align-items: center;
        padding-left: 10px;
    }

    &-user {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
    }
}

.layout-main {
    background-color: var(--action-color);
    height: 100%
}

.mobile {
    position: fixed;
    top: 0;
    left: -250px;
    bottom: 0;
    z-index: 3000;
    transition: left 0.3s ease-in;
}
</style>

