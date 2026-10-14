<!--
 * @Author: weijianjun
 * @Date: 2022-12-13 10:00:59
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 12:05:33
 * @FilePath: \yadea-website\pages\index\index.vue
 * @Description: 首页
 * 
-->
<template>
  <div class="page-home">
    <template v-for="item of homePageData" :key="item.id">
      <component :is="item.name" :mod="item.mod" />
    </template>
  </div>
</template>

<script setup>
import qs from 'qs'
import SwiperWrapper from './components/swiper-wrapper/index.vue'
import LazySwiperOne from './components/swiper-one/index.vue'
import LazyswiperTwo from './components/swiper-two/index.vue'
import LazySwiperThree from './components/swiper-three/index.vue'
import LazyPictureModuleOne from './components/picture-module-one/index'
import LazyPictureModuleTwo from './components/picture-module-two/index'
import LazyDoublePictureOne from './components/double-picture-one/index'
import LazyDoublePictureTwo from './components/double-picture-two/index'
import LazyPictureModuleThree from './components/picture-module-three/index'

import _ from 'lodash'

const homePageSeo = ref({
  viewport: '',
  keywords: '',
  description: '',
  applicableDevice: ''
})

const mapping = {
  'swiper.swiper-wrapper': {
    name: SwiperWrapper,
    dataName: 'swiper',
    getBgImage(item) {
      if (item?.media?.data) return item?.media?.data?.attributes?.url
      return ''
    }
  },
  'swiper.swiper-slide1': {
    name: LazySwiperOne,
    dataName: 'swiper1',
    getBgImage(item) {
      if (item?.media?.data) return item.media?.data?.attributes?.url
      return ''
    }
  },
  'swiper.swiper-slide2': {
    name: LazyswiperTwo,
    dataName: 'swiper2',
    getBgImage(item) {
      if (item?.media?.data) return item?.media?.data?.attributes?.url
      return ''
    }
  },
  'swiper.swiper-slide3': {
    name: LazySwiperThree,
    dataName: 'swiper3',
    getBgImage(item) {
      if (item?.attributes?.picUrl?.data?.length) return item?.attributes?.picUrl?.data[0]?.attributes?.url
      return ''
    }
  },
  'picture.picture-module': {
    name: LazyPictureModuleOne,
    dataName: 'pictureModule',
    getBgImage(item) {
      if (item?.pic?.data?.length) return item?.pic?.data[0]?.attributes.url
      return ''
    }
  },
  'picture.picture-module2': {
    name: LazyPictureModuleTwo,
    dataName: 'pictureModule2',
    getBgImage(item) {
      if (item?.pic?.data?.length) return item?.pic?.data[0]?.attributes?.url
      return ''
    }
  },
  'picture.picture-module3': {
    name: LazyPictureModuleThree,
    dataName: 'pictureModule3',
    getBgImage(item) {
      if (item?.midPic?.data?.length) return item?.midPic?.data[0]?.attributes?.url
      return ''
    }
  },
  'picture.double-picture-module': {
    name: LazyDoublePictureOne,
    dataName: 'doublePictureModule',
    getBgImage(item) {
      if (item?.pic?.data?.length) return item?.pic?.data[0]?.attributes?.url
      return ''
    }
  },
  'picture.double-picture-module2': {
    name: LazyDoublePictureTwo,
    dataName: 'doublePictureModule2',
    getBgImage(item) {
      if (item?.pic?.data?.length) return item?.pic?.data[0]?.attributes?.url
      return ''
    }
  }
}

const { homePageApi, menuApi } = useApi()

const { useHomePageStore } = store
const homePageStore = useHomePageStore()
const homePageData = computed(() => {
  return homePageStore.data
})

let $homePageData = _.cloneDeep(homePageData.value)
if ($homePageData.length) {
  $homePageData.forEach(item => {
    item.show = false
  })
}
homePageStore.saveData({ count: 0, data: $homePageData })

async function init() {
  const { data: homepageModelData } = await homePageApi.getList()
  console.log(homepageModelData)
  setSeo(homepageModelData)
  const sourceData = homepageModelData.value?.data[0]
  if (!sourceData) return
  const mods = sourceData.attributes.modular
  const _homePageData = ref([])

  !(async function () {
    for (let mod of mods) {
      const compName = mod.__component
      const targetName = mapping[compName]
      if (!targetName) {
        continue //跳出循环
      }
      const { name, dataName, getBgImage } = targetName
      let data = mod[dataName]

      if (!data) {
        data = mod
      }
      if (data.category) {
        const categoryId = data.category?.data?.id
        const { data: GNData } = await menuApi.getCarProducts(categoryId)
        data = GNData.value.data.map(item => {
          return {
            ...item.attributes,
            bgImage: getBgImage(item)
          }
        })
      } else {
        if (data.length) {
          // 数组
          data.forEach(item => {
            item.bgImage = getBgImage(item)
          })
        } else {
          // 对象
          data.bgImage = getBgImage(data)
        }
      }

      _homePageData.value.push({
        id: mod.__component,
        name,
        mod: {
          ...mod,
          data
        }
      })
    }

    // 将首页数据存入store
    store.useHomePageStore().saveData({ data: _homePageData.value })
    await nextTick()
    store.useHomePageStore().saveData({ isShowFooter: true })
  })()
}

/*
 * 配置seo
 */
function setSeo(homepageModelData) {
  homePageSeo.value = homepageModelData.value.data[0].attributes.homepageSeo
  useHead({
    meta: [
      {
        name: 'viewport',
        content: homePageSeo.value.viewport
      },
      { name: 'keywords', content: homePageSeo.value.keywords },
      {
        name: 'description',
        content: homePageSeo.value.description
      },
      {
        name: 'applicableDevice',
        content: homePageSeo.value.applicableDevice
      }
    ]
  })
}

init()
</script>

<style lang="less" scoped>
:deep(.swiper-pagination-clickable .swiper-pagination-bullet) {
  cursor: pointer;
  margin: 0 8px;
  width: 64px;
  height: 2px;
  background: #ffffff;
  border-radius: 0px 0px 0px 0px;
  opacity: 0.4;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1 !important;
}
</style>
