<!--
 * @Author: yqq
 * @Date: 2023-01-28 14:19:16
 * @LastEditors: yqq
 * @LastEditTime: 2023-02-07 15:29:01
 * @FilePath: \yadea-website\pages\index\about-yadea\components\time-corridor.vue
 * @Description: 
 * 
-->
<template>
  <div class="time-corridor-box">
    <div ref="yearsBox" class="years-box" @mousedown="handleDown" @mouseup="handleUp" @mouseleave="handelLeave">
      <template v-for="item in mod" :key="item.id">
        <div class="years-items">
          <div ref="yearsText" class="year-text fs-42-vw fw-500 txt-white">{{ item.years }}</div>
          <template v-for="subItem in item.value" :key="subItem.id">
            <div class="years-item">
              <div class="txt-white fs-24-vw fw-500 mt-5-vw">{{ subItem.attributes.developMonth }}月</div>
              <div class="txt-white fs-20-vw mt-3-vw">{{ subItem.attributes.content }}</div>
              <img :src="replaceImgUrl(subItem.picUrl)" alt="图片" />
            </div>
          </template>
        </div>
      </template>
    </div>
    <div ref="yearsPageBox" class="years-page-box">
      <template v-for="(item, index) in mod" :key="item.id">
        <div
          :class="yearsPageBoxIndex === index && 'years-page-item-active'"
          class="years-page-item txt-white fs-20-vw fw-500"
          @click="handleClickYearsPage(index)"
        >
          {{ item.years }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mod: {
    type: Array,
    default: () => []
  }
})
// 定义元素ref
const yearsBox = ref()
const yearsPageBox = ref()
const yearsText = ref()
const disX = $ref(0)
const left = $ref(0)
const starX = $ref(0)
const oLfet = $ref(0)
const yearsPageLeftArr = $ref([])
const yearsPageBoxIndex = $ref(0)
const firstYearTextLeft = $ref(0)
const yearsPageLeftValueArr = $ref([])

const handelLeave = () => {
  if (yearsBox.value.getBoundingClientRect().left > oLfet) {
    yearsBox.value.style.left = oLfet + 'px'
  }
  if (
    yearsBox.value.getBoundingClientRect().left + yearsBox.value.getBoundingClientRect().width <
    document.documentElement.clientHeight / 2
  ) {
    yearsBox.value.style.left = -yearsBox.value.getBoundingClientRect().width + document.documentElement.clientHeight + 'px'
  }
  yearsBox.value.removeEventListener('mousemove', yearsBoxMouseMove)
}
// 鼠标按下事件
const handleDown = e => {
  e = event || window.event
  // 手指按下时的坐标
  starX = e.touches ? e.touches[0].clientX : e.clientX
  // 手指相对于拖动元素左上角的位置
  disX = starX - yearsBox.value.offsetLeft
  yearsBox.value.addEventListener('mousemove', yearsBoxMouseMove)
}

// 鼠标抬起事件
const handleUp = () => {
  if (yearsBox.value.getBoundingClientRect().left > oLfet) {
    yearsBox.value.style.left = oLfet + 'px'
  }
  if (
    yearsBox.value.getBoundingClientRect().left + yearsBox.value.getBoundingClientRect().width <
    document.documentElement.clientHeight / 2
  ) {
    yearsBox.value.style.left = -yearsBox.value.getBoundingClientRect().width + document.documentElement.clientHeight + 'px'
  }
  yearsBox.value.removeEventListener('mousemove', yearsBoxMouseMove)
}

// 鼠标移动事件
const yearsBoxMouseMove = e => {
  e.preventDefault()
  e.stopPropagation()
  e = event || window.event
  left = (e.touches ? e.touches[0].clientX : e.clientX) - disX
  yearsBox.value.style.left = left + 'px'
  yearsPageLeftArr.forEach((item, index) => {
    if (item.getBoundingClientRect().left <= firstYearTextLeft) {
      yearsPageBoxIndex = index
    }
  })
}

// 页码点击事件
const handleClickYearsPage = index => {
  yearsPageBoxIndex = index
  if (index == 0) {
    yearsBox.value.style.left = firstYearTextLeft + 'px'
  } else {
    let lval = 0
    for (let i = 1; i <= index; i++) {
      lval += yearsPageLeftValueArr[i - 1]
    }
    yearsBox.value.style.left = firstYearTextLeft - lval + 'px'
  }
}

onMounted(async () => {
  await nextTick()
  oLfet = yearsBox.value.getBoundingClientRect().left
  yearsPageLeftArr = []
  const yearTextArr = document.querySelectorAll('.year-text')
  for (let j = 0; j < yearTextArr.length; j++) {
    const element = yearTextArr[j]
    yearsPageLeftArr.push(element)
    yearsPageLeftValueArr.push(element.parentNode.getBoundingClientRect().width)
  }
  firstYearTextLeft = yearsPageLeftArr[0].getBoundingClientRect().left
})
</script>

<style lang="less" scoped>
.time-corridor-box {
  position: relative;
  height: 700pxvw;
  width: 100%;
  overflow: hidden;
  .years-box {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    left: 260pxvw;

    .years-items {
      position: relative;
      display: flex;
      flex-direction: row;
      height: 435pxvw;
      padding-top: 79pxvw;

      &::before {
        content: '';
        width: 6pxvw;
        height: 26pxvw;
        position: absolute;
        top: 50pxvw;
        left: 0;
        background: #fff;
      }
      &::after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 76pxvw;
        left: 0;
        background: #fff;
      }

      .year-text {
        position: absolute;
        top: -10pxvw;
        left: 0;
        user-select: none;
      }
      .years-item {
        width: 330pxvw;
        height: 356pxvw;
        margin-right: 64pxvw;
        position: relative;

        img {
          width: 330pxvw;
          height: 186pxvw;
          object-fit: cover;
          object-position: center center;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }

  .years-page-box {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 998pxvw;
    margin: 0 auto;
    border-bottom: 2px solid #fff;
    margin-top: 100pxvw;

    .years-page-item {
      padding: 10pxvw 25pxvw;
      height: 50pxvw;
    }

    .years-page-item-active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
