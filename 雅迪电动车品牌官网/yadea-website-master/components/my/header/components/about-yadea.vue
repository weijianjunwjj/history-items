<!--
 * @Author: weijianjun
 * @Date: 2023-01-09 14:55:20
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-02 21:27:03
 * @FilePath: \yadea-website\components\my\header\components\about-yadea.vue
 * @Description: 
 * 
-->

<template>
  <div class="about-yadea">
    <section class="fs-16-vw fs-max-16 about-yadea-items pt-4 txt-c">
      <div v-for="(item, index) of menus" :key="index" class="about-yadea-item" @click="onClick(item.aboutYadeaUrl)">
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
    console.log('newValue--- :>> ', newValue)
    setTimeout(() => {
      if (newValue?.length) {
        props.updateHeight()
      } else {
        appStore.getHeaderMenus()
        callback()
      }
    }, 500)
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
    const dom = document.querySelector('.header-menu-item-5')
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

function onClick(url) {
  props.hideMask()
  if (url) useRouter().push(url)
}

onMounted(async () => {
  await nextTick()
  callback()

  window.addEventListener('resize', callback)
})

// console.error('menus :>> ', menus)
</script>

<style lang="less" scoped>
.about-yadea {
  position: relative;

  .about-yadea-items {
    width: 100%;
    position: relative;
    left: v-bind(left);
    transform: translateX(calc(-50% + v-bind(titleWidth) / 2));

    .about-yadea-item {
      // width: v-bind(titleWidth);
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
