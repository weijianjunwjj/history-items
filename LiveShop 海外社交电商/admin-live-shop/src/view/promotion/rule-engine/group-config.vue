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
      <n-form-item label="规则名称" path="name">
        <n-input
          v-model:value="form.name"
          placeholder="请输入规则名称"
          clearable
          style="width: 300px"
        />
      </n-form-item>

      <!--      <n-form-item label="规则类型" path="rule">-->
      <!--        <n-select-->
      <!--            v-model:value="form.rule"-->
      <!--            placeholder="请选择规则类型"-->
      <!--            :options="integralRuleOptions"-->
      <!--            clearable-->
      <!--            style="width: 300px"-->
      <!--        />-->
      <!--      </n-form-item>-->

      <n-form-item label="应用场景" path="scene">
        <n-select
          v-model:value="form.scene"
          placeholder="请选择应用场景"
          :options="applySceneOptions"
          clearable
          style="width: 300px"
          @update:value="handleApplySceneUpdateValue"
        />
      </n-form-item>

      <template v-if="form.scene">
        <n-form-item label="积分规则" path="defaultRule">
          <div class="flex-c" style="flex-wrap: wrap">
            <n-row style="align-items: baseline">
              每日前
              <n-form-item label="" path="counts">
                <n-input-number
                  v-model:value="form.counts"
                  placeholder="请输入数字"
                  :maxlength="5"
                  :min="0"
                  :max="99999"
                  :show-button="false"
                  clearable
                  style="width: 110px; margin: 0 5px"
                />
              </n-form-item>
              次{{ sceneObjectKeys[form.scene] }}，每次{{ ruleTypeCustomText() }}
              <n-form-item label="" path="integral">
                <n-input-number
                  v-model:value="form.integral"
                  placeholder="请输入数字"
                  :maxlength="5"
                  :min="0"
                  :max="99999"
                  :show-button="false"
                  clearable
                  style="width: 110px; margin: 0 5px"
                />
              </n-form-item>
              积分；
              <p>
                每日{{ sceneObjectKeys[form.scene] }}积分获取上限为：<n-tag type="info">{{
                  parseInt(form.integral || 0) * parseInt(form.counts || 0)
                }}</n-tag>
              </p>
            </n-row>
          </div>
        </n-form-item>
      </template>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { FormInst, FormItemRule, useMessage } from 'naive-ui';
import { configSceneRule } from '@/api/promotion/rule';
import { applySceneOptions, integralRuleOptions, sceneObjectKeys } from './data.ts';

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
  rule: string | null;
  scene: string | null;
  counts: number;
  integral: number;
}>({
  id: undefined,
  name: '',
  rule: '',
  scene: '',
  counts: 0,
  integral: 0
});
const rules = {
  defaultRule: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      return true;
    }
  },
  name: {
    required: true,
    trigger: ['blur'],
    message: '请输入积分规则名称'
  },
  rule: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择积分规则类型'
  },
  scene: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择应用场景'
  },
  counts: {
    required: true,
    trigger: ['blur'],
    type: 'number',
    message: '请输入次数'
  },
  integral: {
    required: true,
    trigger: ['blur'],
    type: 'number',
    message: '请输入积分'
  }
};

const title = computed(() => (props.currentRow.id ? '编辑规则' : '新增规则'));
const confirmLoading = ref(false);

function handleApplySceneUpdateValue(e: any) {}

watch(
  () => props.visible,
  n => {
    if (n) {
      reset();
      form.value.id = props.currentRow.id;
      form.value.name = props.currentRow.name;
      form.value.rule = props.currentRow.rule ? String(props.currentRow.rule) : null;
      form.value.scene = props.currentRow.scene ? String(props.currentRow.scene) : null;
      form.value.counts = props.currentRow.counts;
      form.value.integral = props.currentRow.integral;
    }
  }
);

function ruleTypeCustomText() {
  if (form.value.rule == '1') {
    return '获取';
  } else if (form.value.rule == '2') {
    return '消耗';
  }
  return '获取';
}

function reset() {
  form.value = {
    id: undefined,
    name: '',
    rule: '1',
    scene: '',
    counts: null!,
    integral: 0
  };
  formRef.value?.restoreValidation();
}

function handleSubmit() {
  formRef.value?.validate(errors => {
    if (!errors) {
      confirmLoading.value = true;
      configSceneRule({
        ...form.value,
        rule: Number(form.value.rule),
        scene: Number(form.value.scene)
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
