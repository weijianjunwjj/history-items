<!--
 * @Author: weijianjun
 * @Date: 2023-01-03 21:30:27
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-24 13:56:18
 * @FilePath: \yadea-website\components\svg-icon\index.vue
 * @Description: 
 * 
-->

<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }" @click="onClick">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
const emit = defineEmits(['click'])
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  }
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name}`
  }
  return 'svg-icon'
})
const width = computed(() => {
  return props.size ? props.size + 'px' : 'auto'
})
const height = computed(() => {
  return props.size ? props.size + 'px' : 'auto'
})

function onClick() {
  emit('click')
}
</script>

<style lang="less">
.svg-icon {
  width: v-bind(width);
  height: v-bind(height);
  min-width: 12px;
  min-height: 12px;
  fill: currentColor;
  vertical-align: middle;
}
</style>
