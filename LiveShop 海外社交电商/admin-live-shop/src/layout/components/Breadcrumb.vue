<template>
    <n-breadcrumb>
        <div class="flex-c">
            <n-breadcrumb-item v-for="(item) in paths" :key="item.id">
                <template v-if="item.icon">
                    <div class="flex-c">
                        <component  style="width: 18px; height: 18px;margin-right: 3px;"
                            :is="item.icon"></component> 
                            <span > {{ item.title }}</span>
                    </div>
                </template>
                <template v-else>
                    {{ item.title }}
                </template>
            </n-breadcrumb-item>
        </div>
    </n-breadcrumb>
</template>
<script setup lang="ts">
import { computed } from "vue"
import appPinia from "@/pinia/app"

// 定义类型接口
interface BreadcrumbItem {
    id: string | number;
    title: string;
    icon?: any;
}

const appStore = appPinia()
// 将paths指定为BreadcrumbItem数组类型
const paths = computed<BreadcrumbItem[]>(() => appStore.paths)
</script>
