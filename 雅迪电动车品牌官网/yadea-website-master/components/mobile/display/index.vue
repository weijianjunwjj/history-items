<!--
 * @Author: yqq
 * @Date: 2023-01-08 09:59:41
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-17 13:52:24
 * @FilePath: \yadea-website\components\mobile\display\index.vue
 * @Description: 
 * 
-->
<template>
  <video
    v-if="isVideo"
    autoplay="true"
    muted
    preload
    loop
    class="banner-video"
    x5-video-player-fullscreen="true"
    x5-playsinline
    playsinline
    webkit-playsinline
  >
    <source :src="replaceImgUrl(url)" type="video/mp4" />
  </video>
  <img v-else class="banner-img" :src="replaceImgUrl(pic)" alt="图片" @click="onClick" />
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
  },
  pic: {
    type: String,
    default: ''
  }
})

const isVideo = ref(false)

const isSafari = store.useIsSafari().$state.isSafari
const isMobile = store.useIsSafari().$state.isMobile

function onClick() {
  const href = props.href
  console.log('href :>> ', href)
  if (href) {
    window.open(href)
  }
}

onMounted(async () => {
  await nextTick()
  isMobile && isSafari && props.url ? (isVideo.value = true) : (isVideo.value = false)
})
</script>

<style lang="less" scoped>
.banner-video {
  width: 100%;
  height: 100%;
  // height: 100vh;
  object-fit: cover;
  object-position: center center;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
</style>
