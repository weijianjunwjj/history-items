<template>
  <router-view />
</template>

<script lang="ts" setup>
  import useGlobalAttr from '@/hooks/useGlobalAttr'

  // 把常用的属性挂载在window.$app上，供所有的vue文件使用
  // 构造类似于vue2的this概念，这么做也是为了简化开发，不用引这引那
  window.$app = useGlobalAttr()
  window.$env = import.meta.env.VITE_USER_NODE_ENV
  // 冻结$app里的第一层属性，不允许随便修改
  Object.freeze(window.$app)
  window.onbeforeunload = function (e) {
    // return 'window.onbeforeunload is triggered!'
  }
</script>
