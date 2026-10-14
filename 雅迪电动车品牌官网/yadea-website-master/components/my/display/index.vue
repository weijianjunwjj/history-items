<!--
 * @Author: yqq
 * @Date: 2023-01-08 09:59:41
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-08 10:43:15
 * @FilePath: \yadea-website\components\my\display\index.vue
 * @Description: 
 * 
-->
<template>
  <video
    v-if="isVideo"
    ref="myVideo"
    :autoplay="autoPlay"
    :poster="poster"
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
  <img v-else class="banner-img" :src="replaceImgUrl(url)" alt="图片" @click="onClick" />
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
  isPlay: {
    type: Boolean,
    default: false
  },
  autoPlay: {
    type: Boolean,
    default: false
  },
  poster: {
    type: String,
    default: ''
  }
})

const myVideo = ref()

const isVideo = ref(false)
const imgMap = {
  bng: true,
  jpg: true,
  png: true,
  tif: true,
  gif: true,
  raw: true,
  wmf: true,
  webp: true,
  avif: true,
  apng: true
}

const videoMap = {
  avi: true,
  wmv: true,
  mpeg: true,
  mp4: true,
  m4v: true,
  mov: true,
  asf: true,
  flv: true,
  f4v: true,
  rmvb: true
}

watch(
  () => props.url,
  newVal => {
    const splitArr = newVal.split('.')
    const suffix = splitArr[splitArr.length - 1]
    if (imgMap[suffix.toLowerCase()]) {
      isVideo.value = false
    } else if (videoMap[suffix]) {
      isVideo.value = true
    }
  },
  {
    deep: true,
    immediate: true
  }
)

async function play() {
  await nextTick()
  if (myVideo.value) {
    myVideo.value.play()
  } else {
    // console.error('myVideo.value is undefined')
  }
}
async function pause() {
  await nextTick()
  if (myVideo.value) {
    myVideo.value.load()
  } else {
    // console.error('myVideo.value is undefined')
  }
}

function onClick() {
  const href = props.href
  console.log('href :>> ', href)
  if (href) {
    window.open(href)
  }
}

watch(
  () => props.isPlay,
  async isPlay => {
    if (isPlay) {
      play()
    } else {
      pause()
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// onMounted(() => {
//   if (props.isPlay) {
//     play()
//   } else {
//     pause()
//   }
// })
</script>

<style lang="less" scoped>
.banner-video {
  width: 100%;
  height: 100%;
  // height: 100vh;
  object-fit: cover;
  object-position: center center;
  background-color: #000;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
</style>
