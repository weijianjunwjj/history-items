<template>
    <n-modal
        :loading="loading"
        :show="visible"
        preset="dialog"
        transform-origin="mouse"
        title="设置权限"
        positive-text="确认"
        negative-text="取消"
        @positive-click="handleSubmit"
        @negative-click="handleCancel"
        @close="handleCancel"
        style="width: 680px"
        :negative-button-props="{ size: 'medium' }"
        :positive-button-props="{ size: 'medium', loading: confirmLoading }"
    >
        <n-scrollbar style="max-height: 600px; min-height: 200px">
            <n-tree
                block-line
                cascade
                checkable
                show-line
                default-expand-all
                label-field="title"
                check-on-click
                :selectable="false"
                :data="data"
                :checked-keys="checkedKeys"
                @update:checked-keys="handleCheckedKeys"
            />
        </n-scrollbar>
    </n-modal>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { getRuleList, editRule } from '@/api/system/auth';
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    currentRow: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits();
const message = useMessage();
const data = ref([]);
const checkedKeys = ref([]);
const confirmLoading = ref(false);
const loading = ref(false);
watch(
    () => props.visible,
    async n => {
        if (n) {
            try {
                loading.value = true;
                reset();
                const res = await getRuleList({ group_id: props.currentRow.id });
                // setId(res.data.list);
                data.value = res.data.list;
                await nextTick();
                checkedKeys.value = res.data.rules;
                loading.value = false;
            } catch (error) {}
        }
    }
);

function setId(list: any, start = 1) {
    return list.reduce((id: any, item: any) => {
        item.cid = id++;
        return Array.isArray(item.children) ? setId(item.children, id) : id;
    }, start);
}

function reset() {
    checkedKeys.value = [];
}

function handleCheckedKeys(params) {
    checkedKeys.value = params;
}

function isNum(val) {
    return !isNaN(val);
}

async function handleSubmit() {
    try {
        confirmLoading.value = true;
        const rules: string[] = checkedKeys.value.filter(item => !isNum(item));
        await editRule({
            ...props.currentRow,
            rules
        });
        message.success('设置成功');
        confirmLoading.value = false;
        emit('confirm');
    } catch (error) {}
}
function handleCancel() {
    emit('update:visible', false);
}
</script>
