<template>
    <n-modal
        :show="visible"
        preset="dialog"
        transform-origin="mouse"
        :title="title"
        positive-text="确认"
        negative-text="取消"
        @positive-click="handleSubmit"
        @negative-click="handleCancel"
        @close="handleCancel"
        style="width: 680px"
        :negative-button-props="{ size: 'medium' }"
        :positive-button-props="{ size: 'medium', loading: confirmLoading }"
    >
        <n-form
            style="margin-top: 18px"
            ref="formRef"
            :model="form"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
        >
            <n-form-item label="频道名称" path="channelName">
                <n-input v-model:value="form.channelName" placeholder="请输入" />
            </n-form-item>
            <n-form-item label="频道标识" path="channelFlag">
                <n-input v-model:value="form.channelFlag" placeholder="请输入" />
            </n-form-item>
            <n-form-item label="组描述" path="description">
                <n-input
                    v-model:value="form.description"
                    placeholder="请输入"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                        maxRows: 5
                    }"
                />
            </n-form-item>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui';
import { configGroup } from '@/api/system/auth';

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
const formRef = ref<FormInst | null>(null);
const form = ref<{
    id: string;
    channelName: string;
    channelFlag: string;
    description: string;
    rules: any[];
}>({
    id: undefined,
    channelName: '',
    channelFlag: '',
    description: '',
    rules: []
});
const rules = {
    channelName: {
        required: true,
        trigger: ['blur'],
        message: '请输入组名称'
    }
};
const title = computed(() => (props.currentRow.id ? '编辑频道' : '新增频道'));
const confirmLoading = ref(false);
watch(
    () => props.visible,
    n => {
        if (n) {
            reset();
            form.value.id = props.currentRow.id;
            form.value.description = props.currentRow.description;
        }
    }
);

function reset() {
    form.value = {
        id: undefined,
        channelName: '',
        channelFlag: '',
        description: '',
        rules: []
    };
    formRef.value?.restoreValidation();
}

function handleSubmit() {
    formRef.value?.validate(errors => {
        if (!errors) {
            // message.success('验证成功')
            confirmLoading.value = true;
            configGroup({ ...form.value })
                .then(() => {
                    message.success(form.value.id ? '新增成功' : '编辑成功');
                    emit('confirm');
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        } else {
            message.error('验证失败');
        }
    });
}

function handleCancel() {
    emit('cancel');
}
</script>
