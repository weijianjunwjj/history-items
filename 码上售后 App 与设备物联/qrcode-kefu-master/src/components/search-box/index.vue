<template>
  <a-card hoverable class="work-order-search-box" :bordered="false">
    <a-row>
      <a-col :flex="1">
        <a-form
          ref="formRef"
          :model="modelValue"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="right"
        >
          <a-row :gutter="16">
            <template v-for="item in formItems" :key="item.field">
              <a-col v-if="!item.isHidden" v-bind="colLayout">
                <a-form-item
                  :field="item.field"
                  :label="item.label"
                  :rules="item.rules"
                  :validate-trigger="item.trigger"
                >
                  <template v-if="item.type === 'input'">
                    <a-input
                      allow-clear
                      :model-value="modelValue[`${item.field}`]"
                      :placeholder="item.placeholder"
                      @update:model-value="
                        handleValueChange($event, item.field)
                      "
                    />
                  </template>
                  <template v-if="item.type === 'password'">
                    <a-input-password
                      allow-clear
                      :model-value="modelValue[`${item.field}`]"
                      :placeholder="item.placeholder"
                      @update:model-value="
                        handleValueChange($event, item.field)
                      "
                    />
                  </template>
                  <template v-if="item.type === 'select'">
                    <a-select
                      allow-clear
                      :model-value="modelValue[`${item.field}`]"
                      :options="item.options"
                      :placeholder="item.placeholder"
                      @update:model-value="
                        handleValueChange($event, item.field)
                      "
                    />
                  </template>
                  <template v-if="item.type === 'datepicker'">
                    <a-range-picker
                      allow-clear
                      :model-value="modelValue[`${item.field}`]"
                      style="width: 100%"
                      @update:model-value="
                        handleValueChange($event, item.field)
                      "
                    />
                  </template>
                  <template v-if="item.type === 'datepicker-showTime'">
                    <a-range-picker
                      show-time
                      allow-clear
                      :model-value="modelValue[`${item.field}`]"
                      style="width: 100%"
                      @update:model-value="
                        handleValueChange($event, item.field)
                      "
                    />
                  </template>
                </a-form-item>
              </a-col>
            </template>
          </a-row>
        </a-form>
      </a-col>
      <slot name="right"></slot>
    </a-row>
    <slot name="bottom"></slot>
  </a-card>
</template>

<script lang="ts" setup>
  import { defineProps, PropType } from 'vue'
  import { IFormItem } from './types'

  // 父组件传递的值
  const props = defineProps({
    formItems: {
      type: Array as PropType<IFormItem[]>,
      default: () => [],
    },
    colLayout: {
      type: Object,
      default: () => ({
        xl: 8, // >1920 4个
        lg: 8,
        md: 12,
        sm: 24,
        xs: 24,
      }),
    },
    modelValue: {
      type: Object,
      required: true,
    },
  })

  const formRef = ref()
  const formValidate = async () => {
    const isAdopt = await formRef.value.validate()
    return isAdopt
  }

  const reset = () => {
    formRef.value.resetFields()
  }

  defineExpose({
    formValidate,
    reset,
  })

  const emit = defineEmits(['update:modelValue'])
  const handleValueChange = (value: any, field: string) => {
    emit('update:modelValue', { ...props.modelValue, [field]: value })
  }
</script>

<style lang="less" scoped></style>
