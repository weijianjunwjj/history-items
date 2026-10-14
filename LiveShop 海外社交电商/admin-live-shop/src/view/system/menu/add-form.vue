<template>
    <n-form-item v-if="fMenuName" label="上级菜单" path="">
        <n-tag type="info">
            {{ fMenuName }}
        </n-tag>
    </n-form-item>
    <n-form-item label="菜单名称" path="title">
        <n-input v-model:value="formItem.title"/>
    </n-form-item>
    <n-form-item label="菜单鉴权" path="permission">
        <n-checkbox :checked-value="1" :unchecked-value="0" v-model:checked="formItem.auth" size="large">
            需要登录
        </n-checkbox>
        <n-checkbox :checked-value="1" :unchecked-value="0" v-model:checked="formItem.permission" size="large">
            访问鉴权
        </n-checkbox>
        <n-checkbox :checked-value="1" :unchecked-value="0" v-model:checked="formItem.log" size="large">
            记录日志
        </n-checkbox>
        <n-checkbox :checked-value="1" :unchecked-value="0" v-model:checked="formItem.show" size="large">
            显示与否
        </n-checkbox>
    </n-form-item>
    <n-form-item label="菜单类型" path="level">
        <n-radio-group name="level" v-model:value="formItem.level" size="large" disabled>
            <n-radio :value="1">顶级菜单</n-radio>
            <n-radio :value="2">二级菜单</n-radio>
            <n-radio :value="3">页内按钮</n-radio>
        </n-radio-group>
    </n-form-item>
    <n-form-item label="请求方式" path="method">
        <n-radio-group name="method" v-model:value="formItem.method" size="large">
            <n-radio :value="1">GET</n-radio>
            <n-radio :value="2">POST</n-radio>
            <n-radio :value="3">PUT</n-radio>
            <n-radio :value="4">DELETE</n-radio>
        </n-radio-group>
    </n-form-item>
    <n-form-item label="菜单图标" path="icon">
        <icon-choose v-model:value="formItem.icon"  />
    </n-form-item>
    <n-form-item label="后端类库" path="url">
        <n-input-group>
            <n-input v-model:value="formItem.url"/>
        </n-input-group>
    </n-form-item>
    <n-form-item label="前端路由" path="router">
        <n-input v-model:value="formItem.router"/>
    </n-form-item>
    <n-form-item label="前端组件" path="component">
        <n-input v-model:value="formItem.component"/>
    </n-form-item>
    <n-form-item label="菜单排序" path="sort">
        <n-input-number :max="1000" :min="0" v-model:value="formItem.sort" clearable/>
    </n-form-item>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue"
import IconChoose from "@/view/components/icon-choose/index.vue"

const props = defineProps({
    formItem: {
        type: Object,
        required: true
    },
    fMenuName: {
        type: String
    }
})
const emits = defineEmits(["update:formItem"])
// 直接监听 props.formItem
watch(
  () => props.formItem,  // 监听 props.formItem 的变化
  (newValue) => {
    emits("update:formItem", newValue)
  },
  { deep: true }  // 如果 formItem 是对象并且希望深度监听其变化
)

</script>
