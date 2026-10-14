<!--
 * @Author: yqq
 * @Date: 2023-01-13 14:15:12
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 16:08:46
 * @FilePath: \yadea-website\components\mobile\color\button-item\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="color-button" :class="isBorder && 'color-button-border'" :style="{ background: bgColor }" @click.stop="handleClickBtn"></div>
</template>

<script setup>
defineProps({
  bgColor: {
    type: String,
    default: '#d1d6e2'
  },
  // width: {
  //   type: Number,
  //   default: 36
  // },
  // height: {
  //   type: Number,
  //   default: 36
  // },
  borderColor: {
    type: String,
    default: '#ff5f00'
  },
  isBorder: {
    type: Boolean,
    default: false
  }
})

// const width = computed(() => {
//   return props.width + 'px'
// })

// const height = computed(() => {
//   return props.height + 'px'
// })
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
  width: 16mpxvw;
  height: 16mpxvw;
  box-shadow: inset 1px 1px 1px 0px rgba(0, 0, 0, 0.25);
}

.color-button {
  margin-left: 4mpxvw;
  margin-right: 12mpxvw;
  // margin-top: 6mpxvw;
  margin-bottom: 12mpxvw;
}

.color-button-border {
  &::before {
    content: '';
    width: calc(16mpxvw + 4px);
    height: calc(16mpxvw + 4px);
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
