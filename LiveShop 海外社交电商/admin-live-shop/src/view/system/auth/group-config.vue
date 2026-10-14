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
      <n-form-item label="组名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入"/>
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
import {FormInst, useMessage} from 'naive-ui'
import {configGroup} from '@/api/system/auth'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentRow: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const form = ref<{ id: string; name: string; description: string; rules: any[] }>({
  id: undefined,
  name: '',
  description: '',
  rules: []
})
const rules = {
  name: {
    required: true,
    trigger: ['blur'],
    message: '请输入组名称'
  }
}
const title = computed(() => (props.currentRow.id ? '编辑权限组' : '新增权限组'))
const confirmLoading = ref(false)
watch(
    () => props.visible,
    n => {
      if (n) {
        reset()
        form.value.id = props.currentRow.id
        form.value.name = props.currentRow.name
        form.value.description = props.currentRow.description
      }
    }
)

function reset() {
  form.value = {
    id: undefined,
    name: '',
    description: '',
    rules: []
  }
  formRef.value?.restoreValidation()
}

function handleSubmit() {
  formRef.value?.validate(errors => {
    if (!errors) {
      // message.success('验证成功')
      confirmLoading.value = true
      configGroup({...form.value})
          .then(() => {
            message.success(form.value.id ? '新增成功' : '编辑成功')
            emit('confirm')
          })
          .finally(() => {
            confirmLoading.value = false
          })
    } else {
      message.error('验证失败')
    }
  })
}

function handleCancel() {
  emit('cancel')
}
</script>

