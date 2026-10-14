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
            <n-form-item label="字典标识" path="dictSn">
                <n-input v-model:value="form.dictSn" placeholder="请输入字典标识" />
            </n-form-item>
            <n-form-item label="标签名称" path="label">
                <n-input v-model:value="form.label" placeholder="请输入字典标签名称" />
            </n-form-item>
            <n-form-item label="字典值" path="value">
                <n-input v-model:value="form.value" placeholder="请输入字典值" />
            </n-form-item>
            <n-form-item label="字典备注" path="remark">
                <n-input
                    v-model:value="form.remark"
                    placeholder="请输入备注"
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
import { configDictionary } from '@/api/system/dictionary';
import { dictTypeOptions } from './data.ts';

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
    dictSn: string;
    label: string;
    value: string;
    remark: string;
}>({
    id: undefined,
    dictSn: '',
    label: '',
    value: '',
    remark: ''
});
const rules = {
    dictSn: {
        required: true,
        trigger: ['blur'],
        message: '请输入字典标识'
    },
    label: {
        required: true,
        trigger: ['blur'],
        message: '请输入字典标签名称'
    },
    value: {
        required: true,
        trigger: ['blur'],
        message: '请输入字典值'
    },
    remark: {
        required: true,
        trigger: ['blur'],
        message: '请输入字典备注'
    }
};

const title = computed(() => (props.currentRow.id ? '编辑数据字典' : '新增数据字典'));
const confirmLoading = ref(false);
watch(
    () => props.visible,
    n => {
        if (n) {
            reset();
            form.value.id = props.currentRow.id;
            form.value.dictSn = props.currentRow.dictSn;
            form.value.label = props.currentRow.label;
            form.value.value = props.currentRow.value;
            form.value.remark = props.currentRow.remark;
        }
    }
);

function reset() {
    form.value = {
        id: undefined,
        dictSn: '',
        label: '',
        value: '',
        remark: ''
    };
    formRef.value?.restoreValidation();
}

function handleSubmit() {
    formRef.value?.validate(errors => {
        if (!errors) {
            confirmLoading.value = true;
            configDictionary({ ...form.value })
                .then(() => {
                    message.success(form.value.id ? '编辑成功' : '新增成功');
                    emit('confirm');
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        } else {
            message.error('请输入必填的内容');
        }
    });
}

function handleCancel() {
    emit('cancel');
}
</script>
