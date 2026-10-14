<!--
 * @Author: weijianjun
 * @Date: 2023-02-04 15:16:07
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-06 14:37:04
 * @FilePath: \website\components\my\header\components\cycling-technology.vue
 * @Description: 骑行科技
 * 
-->

<template>
  <div class="cycling-technology">
    <section class="cycling-technology-box fs-16-vw fs-max-16 pt-4">
      <div v-for="(item, index) in menus" :key="item.id" class="cycling-technology-title">
        <span @click="handleGoCarDetail(item.model_static)">{{ item.name }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  updateHeight: {
    type: Function,
    default: () => {}
  },
  hideMask: {
    type: Function,
    default: () => {}
  }
})

const handleGoCarDetail = url => {
  if (process.client) {
    url ? (window.location.href = url) : (window.location.href = '#')
  }
}

const { useAppStore } = store

const appStore = useAppStore()

const menus = computed(() => {
  return appStore.menus?.length ? appStore.menus[props.index].content : appStore.menus
})

function init() {}

watch(
  menus,
  newValue => {
    if (newValue?.length) {
      props.updateHeight()
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const left = ref(0)
const titleWidth = ref(0)
const callback = () => {
  if (process.client) {
    const dom = document.querySelector('.header-menu-item-2')
    const width = dom.offsetWidth
    if (dom) {
      const offsetLeft = dom.getBoundingClientRect().left
      left.value = offsetLeft + 'px'
      titleWidth.value = width + 'px'
    } else {
      setTimeout(() => {
        callback()
      }, 0)
    }
  }
}

onMounted(async () => {
  await nextTick()
  callback()

  window.addEventListener('resize', callback)
})
</script>

<style lang="less" scoped>
.cycling-technology {
  position: relative;

  .cycling-technology-box {
    position: relative;
    left: v-bind(left);
    text-align: center;
    transform: translateX(calc(-50% + v-bind(titleWidth) / 2));

    .cycling-technology-title {
      color: #000;
      position: relative;
      text-align: center;
      margin-right: 20pxvw;
      display: inline-block;
      left: 0;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin: 0 20pxvw;
      padding-bottom: 15pxvw;

      &:hover {
        border-bottom: 3px solid #ff5f00;

        span,
        span:hover {
          color: #ff5f00;
          text-decoration: none !important;
        }
      }

      // &:hover {
      //   span {
      //     color: #ff5f00;
      //   }
      //   padding-bottom: 17pxvw;
      //   border-bottom: 2px solid #ff5f00;
      // }

      &:last-of-type {
        margin-right: 0;
      }

      .cycling-technology-subItems {
        position: absolute;
        // width: 200pxvw;
        // transform: translateX(calc(-50% + v-bind(titleWidth) / 2));

        .cycling-technology-subItem {
          font-size: 14pxvw;
          opacity: 0.65;
          padding-top: 10pxvw;
          margin-right: 20pxvw;
          width: 180pxvw;
          text-align: center;
          cursor: pointer;
          display: block;
          &:last-of-type {
            margin-right: 0;
          }

          //&:hover {
          //  color: #ff5f00;
          //  border-bottom: 3px solid #ff5f00;
          //  padding-bottom: 17pxvw;
          //}
        }
      }
    }
  }

  li {
    list-style: none;
  }
  &-menu1-item {
    position: relative;
  }
  &-menu1-title:hover {
    color: @orange;
  }

  &-menu2 {
    position: absolute;
    width: 200%;
    text-align: left !important;
    top: 0;
    &-item {
      margin-bottom: 16pxvw;
      cursor: pointer;
      &:hover {
        color: #ff5f00;
      }
    }
  }
}
</style>
