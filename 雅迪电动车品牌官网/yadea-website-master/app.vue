<!--
 * @Author: weijianjun
 * @Date: 2022-11-28 15:59:29
 * @LastEditors: miaoyuxuan
 * @LastEditTime: 2023-03-08 18:57:30
 * @FilePath: /yadea-website/app.vue
 * @Description: 
 * 
-->
<script setup>
const { greyApi } = useApi()
const bgc = ref('#f0f2f5')

const isGrey = ref(false)

try {
  const { data } = await greyApi.getIsGrey()
  isGrey.value = data.value.data.attributes.status
  if (isGrey.value) {
    if (process.client) {
      document.body.classList.add('allPageGrey')
    }
  } else {
    if (process.client) {
      document.body.classList.remove('allPageGrey')
    }
  }
  // watch(
  //   () => data,
  //   newValue => {
  //     console.log(newValue)
  //     isGrey.value = newValue.value.data.attributes.status
  //   },
  //   {
  //     deep: true
  //   }
  // )
} catch (error) {
  isGrey.value = false
}

onBeforeMount(() => {
  const env = import.meta.env
  const isGenerate = env.VITE_API_ENV_JSON != undefined
  window.$isGenerate = isGenerate
})

onMounted(async () => {
  await nextTick()
  bgc.value = ''
})
</script>

<!-- <script src="https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=V3GBZ-WISL5-XCVIW-QZIZG-DRRLF-BLBQF"></script> -->
<script>
import { uDesk } from '@/composables/uDesk.client'
if (process.client) {
  uDesk()
}
</script>
<template>
  <div id="root" :class="isGrey && 'grey'">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style lang="less">
@import '@/assets/styles/index.less';
html,
body,
#__nuxt {
  width: 100% !important;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  overflow: overlay;
}

#root {
  height: 100vh;
  margin: 0;
  padding: 0;
  background: v-bind(bgc);
}

.grey,
.allPageGrey {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}

* {
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(147, 147, 153, 0.5);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
