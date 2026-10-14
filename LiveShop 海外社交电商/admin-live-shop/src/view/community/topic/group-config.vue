<template>
    <n-modal
        :show="visible"
        preset="dialog"
        transform-origin="mouse"
        :title="title"
        positive-text="保存"
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
            <n-form-item label="话题名称" path="name">
                <n-input
                    v-model:value="form.name"
                    placeholder="请输入话题名称"
                    clearable
                    maxlength="120"
                />
            </n-form-item>
            <n-form-item label="话题热度:" v-if="currentRow.id">
                <p>{{ currentRow.heat }}</p>
            </n-form-item>
            <n-form-item label="话题添加人:" v-if="currentRow.id">
                <p>{{ currentRow.nickname }}</p>
            </n-form-item>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui';
import { configTopic } from '@/api/community/topic';

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
}>({
    id: undefined,
    name: ''
});
const rules = {
    name: {
        required: true,
        trigger: ['blur'],
        message: '请输入话题名称'
    }
};

const title = computed(() => (props.currentRow.id ? '修改话题' : '新增话题'));
const confirmLoading = ref(false);
const currentRow = ref({});
watch(
    () => props.visible,
    n => {
        if (n) {
            reset();
            form.value.id = props.currentRow.id;
            form.value.name = props.currentRow.name;
            currentRow.value = props.currentRow;
        }
    }
);

function reset() {
    form.value = {
        id: undefined,
        name: ''
    };
    formRef.value?.restoreValidation();
}

function handleSubmit() {
    formRef.value?.validate(errors => {
        if (!errors) {
            confirmLoading.value = true;
            configTopic({ ...form.value })
                .then(() => {
                    message.success(form.value.id ? '新增成功' : '编辑成功');
                    emit('confirm');
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        } else {
            message.error('请输入必填项');
        }
    });
}

function handleCancel() {
    emit('cancel');
}
</script>
