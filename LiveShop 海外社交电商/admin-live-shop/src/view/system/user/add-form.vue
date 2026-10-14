<template>
    <n-form-item label="用户账号" path="username">
        <n-input v-model:value="formItem.username" />
    </n-form-item>
    <n-form-item label="用户昵称" path="nickname">
        <n-input v-model:value="formItem.nickname" />
    </n-form-item>
    <n-form-item label="用户密码" path="password">
        <n-input v-model:value="formItem.password" type="password" />
        <!-- show-password-on="click" -->
    </n-form-item>
    <n-form-item label="权限组" path="group_id">
        <n-checkbox-group v-model:value="formItem.group_id">
            <n-space item-style="display: flex;">
                <n-checkbox
                    v-for="group in groupList.info"
                    :key="group.id"
                    :value="group.id + ''"
                    :label="group.name"
                />
            </n-space>
        </n-checkbox-group>
    </n-form-item>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
    formItem: {
        type: Object,
        required: true
    },
    groupList: {
        type: Object,
        required: true
    }
});
const emits = defineEmits(['update:formItem']);
const formItem = ref(props.formItem);

watch(formItem, () => {
    emits('update:formItem', formItem.value);
});
</script>
