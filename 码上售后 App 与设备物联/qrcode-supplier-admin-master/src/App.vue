<template>
  <!-- 一级路由 -->
  <a-spin :loading="loading" class="global-spin">
    <router-view />
  </a-spin>
</template>

<script lang="ts" setup>
  import useGlobalAttr from '@/hooks/useGlobalAttr'
  import { useUserStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import { addObjAttr } from '@hx/packages/utils/untils'
  // 把常用的属性挂载在window.$app上，供所有的vue文件使用
  // 构造类似于vue2的this概念，这么做也是为了简化开发，不用引这引那
  const _app = useGlobalAttr()
  window.$app = _app
  Object.freeze(_app)
  // window.SITE_CONFIG = {}
  // addObjAttr(import.meta.env, window.SITE_CONFIG)

  // 冻结$app里的第一层属性，不允许随便修改
  window.onbeforeunload = function (e) {
    // return 'window.onbeforeunload is triggered!'
  }
  const userStore = useUserStore()
  const { loading } = storeToRefs(userStore)
</script>

<style lang="less" scoped>
  .arco-spin {
    width: 100%;
    height: 100vh;
    display: block !important;
  }
  .arco-spin-icon {
    font-size: 30px;
  }
  :deep(.btn-common) {
    .arco-btn {
      padding: 2px;
    }

    .arco-btn-icon {
      margin-right: 2px !important;
    }

    .arco-space-item {
      margin-right: 2px !important;

      .arco-space {
        .arco-space-item {
          margin-right: 0 !important;
        }
      }
    }
  }
</style>
