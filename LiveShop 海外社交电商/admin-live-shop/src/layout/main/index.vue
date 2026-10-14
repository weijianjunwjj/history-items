<template>
    <div class="main bag-scroll">
        <router-view  v-slot="{ Component }" v-if="isRoad">
            <transition
                mode="out-in"
                :enter-active-class="enterActiveClass"
                :leave-active-class="leaveActiveClass"
            >
                <keep-alive v-if="app.userSetting.keepAlive" :max="30" :include="caches">
                    <component :is="Component"/>
                </keep-alive>
                <component v-else :is="Component"/>
            </transition>
        </router-view>
    </div>
</template>
<script setup lang="ts">
import {computed, inject, nextTick, ref} from "vue"
import appStore from "@/pinia/app"
import {animations} from "@/config/map"
import NProgress from "nprogress"

const app = appStore()
const $mitt: any = inject("$mitt")
const isRoad = ref(true)
const caches = computed(() => {
    // 缓存生效需要再页面中定义组件的name
    return (app.allMenus.filter((item) => item.keepAlive)).map((item: any) => item.name)
})
$mitt.on("onReload", () => {
    if (!NProgress.status) {
        NProgress.start()
        isRoad.value = false
        nextTick(() => {
            isRoad.value = true
            NProgress.done()
        })
    }
})
const enterActiveClass = computed(() => {
    let item = animations.find((item) => app.userSetting.animation === item.value)
    return [item.prefix, item.value].join(" ")
})
const leaveActiveClass = computed(() => {
    let item = animations.find((item) => app.userSetting.animation === item.value)
    return [item.prefix, item.out].join(" ")
})
</script>
<style lang="less" scoped>
.main{
    padding: 8px;
    overflow-y: scroll;
    height: calc(100% - 40px);
}
</style>
