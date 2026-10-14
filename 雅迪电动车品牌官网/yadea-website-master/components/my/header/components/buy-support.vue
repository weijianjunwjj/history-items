<!--
 * @Author: weijianjun
 * @Date: 2023-02-04 14:24:20
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 10:48:31
 * @FilePath: \yadea-website\components\my\header\components\buy-support.vue
 * @Description: 购买支持
 * 
-->

<template>
  <div ref="myRef" class="buy-support">
    <section class="fs-16-vw buy-support-items fs-max-16 pt-4 txt-c">
      <div v-for="(item, index) of menus" :key="index" class="buy-support-item" @click="onClick(item.url, item)">
        <a>{{ item.name }}</a>
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

const { useAppStore } = store

const appStore = useAppStore()

const menus = computed(() => {
  return appStore.menus?.length ? appStore.menus[props.index].content : appStore.menus
})

watch(
  menus,
  (newValue, oldValue) => {
    // console.log('newValue--- :>> ', newValue)
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
const myRef = ref()
const titleWidth = ref(0)
const callback = () => {
  if (process.client) {
    const dom = document.querySelector('.header-menu-item-3')
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

function onClick(url, item) {
  props.hideMask()
  if (url) {
    const { name: title } = item
    url = title ? url + `?title=${title}` : url
    useRouter().push(url)
  }
}

onMounted(async () => {
  await nextTick()
  callback()

  window.addEventListener('resize', callback)
})

// console.error('menus :>> ', menus)
</script>

<style lang="less" scoped>
.buy-support {
  position: relative;

  .buy-support-items {
    width: 100%;
    // padding-top: 100%;
    position: relative;
    left: v-bind(left);
    transform: translateX(calc(-50% + v-bind(titleWidth) / 2));

    .buy-support-item {
      display: inline-block;
      padding-bottom: 15pxvw;
      border-bottom: 3px solid transparent;
      margin: 0 20pxvw;
      &:hover {
        border-bottom: 3px solid #ff5f00;
        a,
        a:hover {
          color: #ff5f00;
          text-decoration: none !important;
        }
      }
    }
  }

  .mb-5 {
    cursor: pointer;
  }
}
</style>

<style lang="less" scoped></style>
