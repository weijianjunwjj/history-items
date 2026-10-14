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
            label-placement="top"
            label-width="auto"
            require-mark-placement="right-hanging"
        >
            <n-form-item label="通知类型" path="templateType">
                <!-- <n-select
                    v-model:value="form.templateType"
                    placeholder="请选择通知类型"
                    :options="templateTypeOptions"
                    clearable
                    style="width: 300px"
                /> -->

                <n-radio-group v-model:value="form.templateType" name="templateTypeRadiogroup">
                    <n-space>
                        <n-radio
                            :value="item.value"
                            v-for="(item, index) in templateTypeOptions"
                            :key="index"
                        >
                            {{ item.label }}
                        </n-radio>
                    </n-space>
                </n-radio-group>
            </n-form-item>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui';
import { configNotificatione } from '@/api/operate/message';
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
    templateType: string | null;
}>({
    id: undefined,
    templateType: ''
});
const rules = {
    templateType: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择通知类型'
    }
};

const title = computed(() => (props.currentRow.id ? '编辑消息模板' : '新增消息通知'));
const confirmLoading = ref(false);

watch(
    () => props.visible,
    n => {
        if (n) {
            reset();
            form.value.id = props.currentRow.id;
            form.value.templateType = props.currentRow.templateType
                ? String(props.currentRow.templateType)
                : null;
        }
    }
);

function reset() {
    form.value = {
        id: undefined,
        templateType: ''
    };
    formRef.value?.restoreValidation();
}

function handleSubmit() {
    formRef.value?.validate(errors => {
        if (!errors) {
            confirmLoading.value = true;
            configNotificatione({
                ...form.value,
                templateType: Number(form.value.templateType)
            })
                .then(() => {
                    message.success(form.value.id ? '编辑成功' : '新增成功');
                    emit('confirm');
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        }
    });
}

function handleCancel() {
    emit('cancel');
}
</script>
