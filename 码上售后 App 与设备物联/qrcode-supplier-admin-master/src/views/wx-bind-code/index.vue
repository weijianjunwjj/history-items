<template>
  <div class="page cen">
    <header>
      <img :src="logo" style="width: 50%" alt="" />
      <div class="mt-10"> 您正在使用当前微信账号绑定 </div>
    </header>
    <main class="flex-vc">
      <a-button
        class="w-b mt-6"
        type="primary"
        :disabled="isLock"
        @click="binding"
        >授权绑定</a-button
      >
      <a-button class="w-b mt-4" @click="logout">取消绑定</a-button>
    </main>
    <!-- <footer style="color: #777777" class="mt-4 cen"
      >若无法登录，请先使用账号密码登录系统后在个人中心绑定微信账号</footer
    > -->
  </div>
  <a-modal
    v-model:visible="show"
    width="80%"
    :footer="false"
    title="请关注公众号再绑定"
    class="modal_wx"
  >
    <div class="flex-hvc">
      <img class="img" :src="gzh" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  // import Dialog from 'vant/es/dialog/index'
  import { getUserInfoByWX, WXBindSys } from '@/api/user'
  import gzh from '@/assets/images/gzh.jpg'
  import { Modal } from '@arco-design/web-vue'
  import useCommonStore from '@hx/packages/store'
  import logo from '../../assets/images/logonew.png'

  document.title = '微信账号绑定'
  const commonStore = useCommonStore()
  const { appId } = commonStore
  const show = ref(false)
  const app = window.$app
  // 1.拿到code请求userinfo
  const route = useRoute()
  const { code, state } = route.query
  const isLock = ref(false)
  console.log('app', app)

  console.log('state', state)

  function binding() {
    isLock.value = true
    setTimeout(() => {
      isLock.value = false
    }, 2000)
    const userId = state?.split('_')[0]
    const enterpriseId = state?.split('_')[1]

    const go = (res: any) => {
      console.log('res111', res)
      const { subscribe, unionId, openId } = res.data
      console.log('subscribe', subscribe)
      if (subscribe) {
        // 已订阅
        const p = {
          userId,
          enterpriseId,
          unionId,
          openId,
        }
        WXBindSys(p)
          .then((_res) => {
            console.log('_res', _res)
            Modal.success({
              width: '80%',
              content: `微信绑定成功`,
              hideCancel: true,
              onOk: () => {
                logout()
              },
            })
          })
          .catch((err) => {
            console.log('err', err)
            Modal.error({
              width: '80%',
              content: err.data.msg,
              hideCancel: true,
              onOk: () => {
                logout()
              },
            })
          })
      } else {
        // 提示公众号二维码弹框
        show.value = true
      }
    }
    getUserInfoByWX({
      code,
      state,
      appId,
    })
      .then((res: any) => {
        go(res)
      })
      .catch((err) => {
        console.log('err', err)
        if (err.status === 200 && err.data.code !== 500) {
          go(err)
        }
      })
  }

  function logout() {
    // eslint-disable-next-line no-undef
    console.log('WeixinJSBridge', WeixinJSBridge)
    // eslint-disable-next-line no-undef
    WeixinJSBridge.call('closeWindow')
  }
</script>

<style lang="less" scoped>
  .page {
    padding-top: 100px;
    .w-b {
      width: 80%;
    }
    footer {
      padding: 0 20%;
    }
  }
  .img {
    width: 200px;
    height: 200px;
  }
</style>

<style lang="less">
  .modal_wx {
    .arco-modal-body {
    }
  }
</style>
