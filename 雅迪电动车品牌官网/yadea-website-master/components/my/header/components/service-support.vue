<!--
 * @Author: weijianjun
 * @Date: 2023-01-09 16:28:11
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-02 21:30:25
 * @FilePath: \yadea-website\components\my\header\components\service-support.vue
 * @Description: 
 * 
-->

<template>
  <div class="service-support">
    <section class="fs-16-vw fs-max-16 service-support-items pt-4 txt-c">
      <div v-for="(item, index) of menus" :key="index" class="service-support-item" @click="onClick(item.supportUrl, item)">
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

function onClick(url, item) {
  props.hideMask()
  if (url) {
    const { name: title } = item
    url = title ? url + `?title=${title}` : url
    useRouter().push(url)
  }
}

const left = ref(0)

const { useAppStore } = store

const appStore = useAppStore()

const menus = computed(() => {
  return appStore.menus?.length ? appStore.menus[props.index].content : appStore.menus
})

watch(
  menus,
  (newValue, oldValue) => {
    if (newValue?.length) {
      props.updateHeight()
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const titleWidth = ref(0)

const callback = () => {
  if (process.client) {
    const dom = document.querySelector('.header-menu-item-4')
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
.service-support {
  // left: calc(v-bind(left) - 12.25vw);
  position: relative;

  .service-support-items {
    width: 100%;
    position: relative;
    left: v-bind(left);
    transform: translateX(calc(-50% + v-bind(titleWidth) / 2));

    .service-support-item {
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

  // padding-left: 1.5625vw;
}
</style>
