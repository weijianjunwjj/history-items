<template>
    <n-empty description="你什么也找不到">
        <template #extra>
            <n-button size="small" @click="back">
                看看别的
            </n-button>
        </template>
    </n-empty>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

// 获取 router 实例
const router = useRouter()

// 定义 back 函数来调用 router.back()
const back = () => {
    router.back()
}

</script>