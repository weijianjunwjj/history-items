<!--
 * @Author: yqq
 * @Date: 2023-01-13 14:15:12
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 16:39:56
 * @FilePath: \yadea-website\components\color\button-item\index.vue
 * @Description: 
 * 
-->
<template>
  <button class="color-button" :class="isBorder && 'color-button-border'" :style="{ background: bgColor }" @click="handleClickBtn"></button>
</template>

<script setup>
const props = defineProps({
  bgColor: {
    type: String,
    default: '#d1d6e2'
  },
  width: {
    type: Number,
    default: 36
  },
  height: {
    type: Number,
    default: 36
  },
  borderColor: {
    type: String,
    default: '#ff5f00'
  },
  isBorder: {
    type: Boolean,
    default: false
  }
})

const width = computed(() => {
  return (props.width / 1920) * 100 + 'vw'
})

const height = computed(() => {
  return (props.height / 1920) * 100 + 'vw'
})
const emit = defineEmits(['clickIndex'])

const handleClickBtn = e => {
  const siblings = e.target.parentNode.children
  for (let index = 0; index < siblings.length; index++) {
    const element = siblings[index]
    element.classList.remove('color-button-border')
  }
  e.target.classList.add('color-button-border')
  const ele = e.target
  const selectIndex = [].indexOf.call(ele.parentNode.querySelectorAll(ele.tagName), ele)
  emit('clickIndex', selectIndex)
}
</script>

<style lang="less" scoped>
.color-button {
  border-radius: 100%;
  border: none;
  position: relative;
  width: v-bind(width);
  height: v-bind(height);
  max-width: 36px;
  max-height: 36px;
  box-shadow: inset 1px 1px 8px 0px rgba(0, 0, 0, 0.07);
}

.color-button {
  margin-left: 4pxvw;
  margin-right: 12pxvw;
  margin-top: 6pxvw;
  margin-bottom: 6pxvw;
}

.color-button-border {
  &::before {
    content: '';
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border: 1px solid #000;
    border-color: v-bind(borderColor);
    border-radius: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
  }
}
</style>
