<template>
  <wd-swiper
      v-if="bannerImgUrlArr.length > 0"
      :list="bannerImgUrlArr" 
      autoplay 
      :indicator="{ type: 'dots-bar' }" 
      @click="handleAdClick"
    ></wd-swiper>
    <!-- height="300rpx"
        imageMode="widthFix" -->
</template>
  
<script lang="ts" setup>
  import { getAdvertisementLocation } from '@/service/adv/adv'
  import { getUrl } from '@/utils/utils'

  const props = defineProps({
    adId: {
      type: String,
      default: ''
    }
  })

  const bannerImgUrlArr = ref([])
  const getAdverSement = () => {
    bannerImgUrlArr.value = []
    getAdvertisementLocation({ locationId: props.adId }).then((res: any) => {
      res.data.forEach((item) => {
        bannerImgUrlArr.value.push({
          "value": getUrl(item.picture),
          "type": "image",
          "openType": item.openType,
          "jumpUrl": item.jumpUrl
        })
      })
    })
  }
  const handleAdClick = ({index, item}) => {
    if (item.openType == 4) {
      // Tab页
      uni.switchTab({ url: "/pages" + item.jumpUrl })
    }
    if (item.openType == 3) {
      // webview
      uni.navigateTo({ url: '/pages/webview/webview?url=' + item.jumpUrl })
    }
    if (item.openType == 2) {
      // 页面
      uni.navigateTo({ url: "/pages" + item.jumpUrl })
    }
  }

  getAdverSement()
</script>
  
  <style lang="scss">
  
  </style>
  