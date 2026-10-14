<!--
 * @Author: yqq
 * @Date: 2023-01-02 14:06:51
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-07 15:58:33
 * @FilePath: \website\pages\index\mob\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="mobile-page-home">
    <template v-for="item of homePageData" :key="item.mod.__component">
      <component :is="item.name" :mod="item.mod" />
    </template>
  </div>
</template>

<script setup>
import qs from 'qs'
import SwiperWrapper from './components/swiper-wrapper'
import LazySwiperOne from './components/swiper-one'
import LazySwiperTwo from './components/swiper-two'
import LazySwiperThree from './components/swiper-three'
import LazyDoublePictureOne from './components/double-picture-one'
import LazyDoublePictureTwo from './components/double-picture-two'
import LazyPictureModuleOne from './components/picture-module-one'
import LazyPictureModuleTwo from './components/picture-module-two'
import LazyPictureModuleThree from './components/picture-module-three'

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
      if (item.media?.data) return item.media?.data?.attributes?.url
      return ''
    },
    getMobilePic(item) {
      if (item.mobilePic?.data) return item.mobilePic?.data?.attributes?.url
      return ''
    },
    getMobileVideo(item) {
      if (item.mobileVideo?.data) return item.mobileVideo?.data?.attributes?.url
      return ''
    }
  },
  'swiper.swiper-slide1': {
    name: LazySwiperOne,
    dataName: 'swiper1',
    getBgImage(item) {
      if (item.media?.data) return item.media?.data?.attributes?.url
      return ''
    },
    getMobilePic(item) {
      if (item.mobilePic?.data) return item.mobilePic?.data?.attributes?.url
      return ''
    },
    getMobileVideo(item) {
      if (item.mobileVideo?.data) return item.mobileVideo?.data?.attributes?.url
      return ''
    }
  },
  'swiper.swiper-slide2': {
    name: LazySwiperTwo,
    dataName: 'swiper2',
    getBgImage(item) {
      if (item.media?.data) return item.media?.data?.attributes?.url
      return ''
    },
    getMobilePic(item) {
      if (item.mobilePic?.data) return item.mobilePic?.data?.attributes?.url
      return ''
    },
    getMobileVideo(item) {
      if (item.mobileVideo?.data) return item.mobileVideo?.data?.attributes?.url
      return ''
    }
  },
  'swiper.swiper-slide3': {
    name: LazySwiperThree,
    dataName: 'swiper3',
    getBgImage(item) {
      if (item.attributes.picUrl.data) return item.attributes.picUrl.data[0].attributes.url
      return ''
    },
    getMobilePic() {
      return ''
    },
    getMobileVideo() {
      return ''
    }
  },
  'picture.picture-module': {
    name: LazyPictureModuleOne,
    dataName: 'pictureModule',
    getBgImage(item) {
      if (item.pic.data) return item.pic.data[0].attributes.url
      return ''
    },
    getMobilePic() {
      return ''
    },
    getMobileVideo() {
      return ''
    }
  },
  'picture.picture-module2': {
    name: LazyPictureModuleTwo,
    dataName: 'pictureModule2',
    getBgImage(item) {
      if (item.pic.data) return item.pic.data[0].attributes.url
      return ''
    },
    getMobilePic() {
      return ''
    },
    getMobileVideo() {
      return ''
    }
  },
  'picture.picture-module3': {
    name: LazyPictureModuleThree,
    dataName: 'pictureModule3',
    getBgImage(item) {
      if (item.midPic.data) return item.midPic.data[0].attributes.url
      return ''
    },
    getMobilePic() {
      return ''
    },
    getMobileVideo() {
      return ''
    }
  },
  'picture.double-picture-module': {
    name: LazyDoublePictureOne,
    dataName: 'doublePictureModule',
    getBgImage(item) {
      if (item?.pic?.data) return item.pic.data[0].attributes.url
      return ''
    },
    getMobilePic() {
      return ''
    },
    getMobileVideo() {
      return ''
    }
  },
  'picture.double-picture-module2': {
    name: LazyDoublePictureTwo,
    dataName: 'doublePictureModule2',
    getBgImage(item) {
      if (item?.pic?.data) return item.pic.data[0].attributes.url
      return ''
    },
    getMobilePic() {
      return ''
    },
    getMobileVideo() {
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

async function init() {
  const { data: homepageModelData } = await homePageApi.getMobList()
  console.log('homepageModelData :>> ', homepageModelData)
  setSeo(homepageModelData)

  // // setTimeout(async () => {
  const sourceData = homepageModelData?.value?.data[0]
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
      const { name, dataName, getBgImage, getMobilePic, getMobileVideo } = targetName
      let data = mod[dataName]

      if (!data) {
        data = mod
      }
      if (data.category) {
        const categoryId = data.category?.data?.id
        const { data: GNData } = await menuApi.getCarProducts(categoryId)
        data = GNData.value.data.map(item => {
          // item.attributes
          return {
            ...item.attributes,
            bgImage: getBgImage(item),
            bgMobilePic: getMobilePic(item) || '',
            bgMobileVideo: getMobileVideo(item) || ''
          }
        })
      } else {
        if (data.length) {
          // 数组
          data.forEach(item => {
            item.bgImage = getBgImage(item)
            item.bgMobilePic = getMobilePic(item) || ''
            item.bgMobileVideo = getMobileVideo(item) || ''
          })
        } else {
          // 对象
          data.bgImage = getBgImage(data)
          data.bgMobilePic = getMobilePic(data) || ''
          data.bgMobileVideo = getMobileVideo(data) || ''
        }
      }

      _homePageData.value.push({
        name,
        mod: {
          ...mod,
          data
        }
      })
    }

    _homePageData.value[0].show = true
    console.log(_homePageData)
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
  console.log('homepageModelData.value :>> ', homepageModelData.value)
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

const appName = ref('')
init()
onMounted(() => {
  const userAgent = navigator?.userAgent
  appName.value = userAgent
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent)) {
    store.useIsSafari().saveData({ isMobile: true })
    if (/Safari/i.test(navigator.userAgent) && /iPhone/i.test(userAgent)) {
      store.useIsSafari().saveData({ isSafari: true })
    } else {
      store.useIsSafari().saveData({ isSafari: false })
    }
  } else {
    store.useIsSafari().saveData({ isMobile: false })
  }
})

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less" scoped>
:deep(.swiper-pagination-clickable .swiper-pagination-bullet) {
  cursor: pointer;
  margin: 0 4px;
  width: 32px;
  height: 2px;
  background: #ffffff;
  border-radius: 0px 0px 0px 0px;
  opacity: 0.4;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1 !important;
}
</style>
