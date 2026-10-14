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
      <n-form-item label="充值档位名称" path="gearName">
        <n-input
          v-model:value="form.gearName"
          placeholder="请输入档位名称"
          style="width: 250px"
          :maxlength="30"
        />
      </n-form-item>
      <n-form-item label="金币数量" path="coinNum">
        <n-input-number
          v-model:value="form.coinNum"
          :show-button="false"
          placeholder="请输入金币数量"
          :maxlength="9"
          style="width: 250px"
          :min="0"
          :max="999999"
        />
      </n-form-item>
      <n-form-item label="充值金额" path="amount">
        <n-input-number
          v-model:value="form.amount"
          placeholder="请输入充值金额"
          :maxlength="9"
          :show-button="false"
          style="width: 250px"
          :min="0"
          :max="999999"
        >
          <!-- <template #prefix> $ </template> -->
        </n-input-number>
      </n-form-item>
      <n-form-item label="额外赠送金币比例" path="giftRatio">
        <n-input-number
          v-model:value="form.giftRatio"
          placeholder="请输入额外赠送金币比例"
          :show-button="false"
          :precision="0"
          style="width: 250px"
          :min="0"
          :max="100"
        >
          <template #suffix> %</template>
        </n-input-number>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui';
import { configRecharge } from '@/api/promotion/recharge';

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
  gearName: string;
  coinNum: number | string;
  giftRatio: number | string;
  amount: number | string;
}>({
  id: undefined,
  gearName: '',
  coinNum: 0,
  giftRatio: 0,
  amount: 0
});
const rules = {
  gearName: {
    required: true,
    trigger: ['blur'],
    message: '请输入档位名称'
  },
  coinNum: {
    required: true,
    trigger: ['blur'],
    type: 'number',
    message: '请输入金币数量'
  },
  amount: {
    required: true,
    trigger: ['blur'],
    type: 'number',
    message: '请输入充值金额'
  },
  giftRatio: {
    required: true,
    trigger: ['blur'],
    type: 'number',
    message: '请输入额外赠送金币比例'
  }
};
const title = computed(() => (props.currentRow.id ? '编辑档位' : '新增档位'));
const confirmLoading = ref(false);
watch(
  () => props.visible,
  n => {
    if (n) {
      reset();
      form.value.id = props.currentRow.id;
      form.value.gearName = props.currentRow.gearName;
      form.value.coinNum = props.currentRow.coinNum;
      form.value.amount = props.currentRow.amount;
      form.value.giftRatio = props.currentRow.giftRatio;
    }
  }
);

function reset() {
  form.value = {
    id: undefined,
    gearName: '',
    coinNum: '',
    giftRatio: '',
    amount: ''
  };
  formRef.value?.restoreValidation();
}

function handleSubmit() {
  formRef.value?.validate(errors => {
    if (!errors) {
      confirmLoading.value = true;
      configRecharge({ ...form.value })
        .then(() => {
          message.success(form.value.id ? '编辑成功' : '新增成功');
          emit('confirm');
        })
        .finally(() => {
          confirmLoading.value = false;
        });
    } else {
      message.error('请按要求填写内容');
    }
  });
}

function handleCancel() {
  emit('cancel');
}
</script>
