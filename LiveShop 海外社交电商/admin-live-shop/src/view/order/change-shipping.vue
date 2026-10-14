<template>
    <n-modal
        :show="visible"
        preset="dialog"
        transform-origin="center"
        title="物流信息"
        positive-text="确定"
        negative-text="取消"
        :show-icon="false"
        :negative-button-props="{ size: 'medium' }"
        :positive-button-props="{ size: 'medium' }"
        @positive-click="handleshippintSubmit"
        @negative-click="handleshippintCancel"
        @close="handleshippintCancel"
    >
        <n-form
            style="margin-top: 20px"
            ref="shippintFormRef"
            :model="shippintForm"
            :rules="shippintRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
        >
            <n-form-item label="物流单号" path="shippingSn">
                <n-input
                    v-model:value="shippintForm.shippingSn"
                    placeholder="请输入物流单号"
                    clearable
                />
            </n-form-item>
            <n-form-item label="物流状态" path="shippingStatus">
                <n-select
                    v-model:value="shippintForm.shippingStatus"
                    placeholder="请选择物流状态"
                    :options="shippintOptions"
                    clearable
                />
            </n-form-item>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui';
import { changeShippintStatus } from '@/api/order-manage/order';

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
const shippintFormRef = ref<FormInst | null>(null);
const shippintForm = ref<{ id: number; shippingStatus: string; shippingSn: string }>({
    id: undefined!,
    shippingStatus: '',
    shippingSn: ''
});

const shippintRules = {
    shippingStatus: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择物流状态'
    }
};

const shippintOptions = [
    {
        label: '待发货',
        value: '1'
    },
    {
        label: '已发货',
        value: '2'
    },
    {
        label: '已完成',
        value: '3'
    }
];

watch(
    () => props.visible,
    n => {
        if (n) {
            reset();
            shippintForm.value.id = props.currentRow.id;
            shippintForm.value.shippingSn = props.currentRow.shippingSn;
            shippintForm.value.shippingStatus =
                props.currentRow.shippingStatus == 0
                    ? null!
                    : String(props.currentRow.shippingStatus);
        }
    }
);

function reset() {
    shippintForm.value = {
        id: undefined!,
        shippingStatus: '',
        shippingSn: ''
    };
    shippintFormRef.value?.restoreValidation();
}

function handleshippintSubmit() {
    shippintFormRef.value?.validate(errors => {
        if (!errors) {
            changeShippintStatus({
                ...shippintForm.value,
                shippingStatus: Number(...shippintForm.value.shippingStatus)
            }).then(() => {
                message.success('物流信息更新成功');
                emit('confirm');
            });
        }
    });
}

function handleshippintCancel() {
    emit('cancel');
}
</script>

<style lang="less" scoped>
.shippintModelHead {
    font-size: 14px;
    margin: 20px 0;
    span {
        margin-left: 10px;
        color: #2080f0;
    }
}
</style>
