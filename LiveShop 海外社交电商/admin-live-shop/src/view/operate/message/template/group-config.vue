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
        style="width: 550px"
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
            <n-form-item label="消息名称" path="name">
                <n-input
                    v-model:value="form.name"
                    placeholder="请输入消息名称"
                    clearable
                    style="width: 300px"
                />
            </n-form-item>

            <n-form-item label="消息类型" path="type">
                <n-select
                    v-model:value="form.type"
                    placeholder="请选择消息类型"
                    :options="templateTypeOptions"
                    clearable
                    style="width: 300px"
                />
            </n-form-item>

            <n-form-item label="消息内容" path="content">
                <n-input
                    v-model:value="form.content"
                    placeholder="请输入消息内容"
                    clearable
                    type="textarea"
                    maxlength="500"
                    show-count
                    style="width: 300px"
                    :autosize="{
                        minRows: 6,
                        maxRows: 10
                    }"
                />
            </n-form-item>

            <n-form-item label=" ">
                <n-space>
                    <n-checkbox v-model:checked="checkedvalue1" checked-value="1">
                        站内通知</n-checkbox
                    >
                    <n-checkbox v-model:checked="checkedvalue2" checked-value="2">
                        站外通知</n-checkbox
                    >
                </n-space>
            </n-form-item>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui';
import { configMessageTemplate } from '@/api/operate/message';
import { templateTypeOptions } from './data.ts';

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
    id: any;
    name: string;
    type: string | null;
    content: string;
}>({
    id: undefined,
    name: '',
    type: '',
    content: ''
});
const rules = {
    name: {
        required: true,
        trigger: ['blur'],
        message: '请输入消息名称'
    },
    type: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择消息类型'
    },
    content: {
        required: true,
        trigger: ['blur'],
        message: '请输入消息内容'
    }
};

const title = computed(() => (props.currentRow.id ? '编辑消息' : '新增消息'));
const confirmLoading = ref(false);
const checkedvalue1 = ref<any>(false);
const checkedvalue2 = ref<any>(false);

watch(
    () => props.visible,
    n => {
        if (n) {
            reset();
            form.value.id = props.currentRow.id;
            form.value.name = props.currentRow.name;
            form.value.type = props.currentRow.type ? String(props.currentRow.type) : null;
            form.value.content = props.currentRow.content;
            props.currentRow.gayType?.split(',').forEach(v => {
                if (v === '1') {
                    checkedvalue1.value = '1';
                } else if (v === '2') {
                    checkedvalue2.value = '2';
                }
            });
        }
    }
);

function reset() {
    form.value = {
        id: undefined,
        name: '',
        type: '',
        content: ''
    };
    checkedvalue1.value = false;
    checkedvalue2.value = false;
    formRef.value?.restoreValidation();
}

function handleSubmit() {
    formRef.value?.validate(errors => {
        if (!errors) {
            confirmLoading.value = true;
            configMessageTemplate({
                ...form.value,
                gayType: [
                    checkedvalue1.value ? checkedvalue1.value : '',
                    checkedvalue2.value ? checkedvalue2.value : ''
                ].filter(item => item !== ''),
                type: Number(form.value.type)
            })
                .then(() => {
                    message.success(form.value.id ? '编辑成功' : '新增成功');
                    emit('confirm');
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        } else {
            message.error('请输入必填信息');
        }
    });
}

function handleCancel() {
    emit('cancel');
}
</script>
