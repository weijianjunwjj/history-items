<template>
  <div class="page cen">
    <header>
      <img :src="logo" style="width: 50%" alt="" />
      <div class="mt-10"> 您正在使用当前微信账号登录平台 </div>
    </header>
    <main class="flex-vc">
      <a-button
        class="w-b mt-6"
        type="primary"
        :disabled="isLock"
        @click="login"
        >授权登录</a-button
      >
      <a-button class="w-b mt-4" @click="logout">取消登录</a-button>
    </main>
    <footer style="color: #777777" class="mt-4 cen"
      >若无法登录，请先使用账号密码登录系统后在个人中心绑定微信账号</footer
    >
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
  import { getUserInfoByWX } from '@/api/user'
  import gzh from '@/assets/images/gzh.jpg'
  import useCommonStore from '@hx/packages/store'
  import { loginByWx } from '@/api/nologin'
  import { Modal } from '@arco-design/web-vue'
  import logo from '../../assets/images/logonew.png'

  document.title = '微信授权登录'

  const loading = ref(true)
  const isLock = ref(false)

  const commonStore = useCommonStore()
  const { appId } = commonStore
  const show = ref(false)
  const app = window.$app
  // 1.拿到code请求userinfo
  const route = useRoute()
  const { code, state } = route.query
  console.log('state', state)

  const past_time = state?.split('_')[1]

  function isExpired() {
    const now_time = Date.now()

    const seconds = (now_time - past_time) / 1000

    console.log('seconds', seconds)
    const _isExpired = seconds > 180
    if (_isExpired) {
      Modal.confirm({
        maskClosable: false,
        escToClose: false,
        simple: true,
        width: '80%',
        content: `二维码失效，请重新扫码`,
        hideCancel: true,
        onOk: () => {
          logout()
        },
      })
      // throw new Error('1')
    }

    return _isExpired
  }

  isExpired()

  // if(interval>)

  function login() {
    // 设置按钮不可点击（disable: false）
    if (isExpired()) {
      return
    }
    isLock.value = true
    // 执行耗时间的代码或事件请求等....

    // 等待事件执行完或者相应的间隔时间后，恢复按钮为可点击状态
    setTimeout(() => {
      isLock.value = false
    }, 2000)
    const go = (res: any) => {
      const { subscribe, unionId, openId } = res.data
      console.log('res', res)
      console.log('subscribe', subscribe)
      if (subscribe === false) {
        // 提示公众号二维码弹框
        show.value = true
      } else {
        const p = {
          unionId,
          openId,
          randomKey: state,
        }
        console.log('p', p)
        loginByWx(p)
          .then((res2) => {
            console.log('loginByWx-res', res2)
            Modal.confirm({
              maskClosable: false,
              escToClose: false,
              simple: true,
              width: '80%',
              content: `微信登录成功`,
              hideCancel: true,
              onOk: () => {
                logout()
              },
            })
          })
          .catch((err) => {
            console.error(err)
            Modal.warning({
              width: '80%',
              maskClosable: false,
              escToClose: false,
              hideCancel: true,
              content:
                '当前微信未绑定系统账号，请先使用账号密码登录系统后在个人中心绑定微信账号',
              onOk() {
                logout()
              },
            })
          })
      }
    }
    getUserInfoByWX({ code, state, appId })
      .then((res) => {
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

  onMounted(() => {
    loading.value = false
  })
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
