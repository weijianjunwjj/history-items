<route lang="json5">
{
style: {
navigationBarTitleText: '登录',
'app-plus': {
titleNView: false,
popGesture: 'none',
},
enablePullDownRefresh: false,
},
}
</route>

<template>
  <view class="loginContainer">
    <view class="bannerIconInfo">
      <image alt="" class="bannerLoginImg" src="/static/images/login/loginbanner.png"/>
      <p class="bannerDesc">It's got everything you could ever want</p>
    </view>
    <view style="flex: 1"></view>

    <view class="loginBtnContentBox">
      <wd-button v-for="(loginBtn, index) in loginBtns" :key="index"
                 :custom-class="`googleBtn ${mapping[loginBtn.providerName].class}`"
                 block @click="onLoginEvent(loginBtn)">
        <image :src="loginBtn.icon" class="loginbtnIcon"/>
        <span class="txt-l">Log in with {{ mapping[loginBtn.providerName].btnText }}</span>
      </wd-button>
    </view>

    <view class="loginBottomTips">
      By clicking 'Log In', you agree to our terms. You can learn how
      we process your data in our privacy policy and cookies policy
    </view>
  </view>
</template>

<script lang="ts" setup>
import {getLoginInfo, login} from '@/service/login/login'
import {useToast} from 'wot-design-uni'
import {useNimStore, useUserStore} from '@/store'
import qs from 'qs'
import {updateFileUrlPre} from '@/utils/utils'
// import { initNIM } from '@/utils/nim'
import {NimInstance} from "@/utils/nimInstance";
import {startLocationTracking} from '@/utils/locationService'
import db from "@/utils/sqlite";

const nim = new NimInstance()
const toast = useToast()
const loginBtns = ref([])
const {updateUserInfo} = useUserInfo()
const onLoginEvent = async (item) => {
  uni.showLoading({
    title: 'loading',
    mask: true,
  })
  updateFileUrlPre()
  if (item.providerName === 'google') {
    uni.login({
      provider: item.providerName,
      success: function (loginRes) {
        // 登录成功
        uni.getUserInfo({
          provider: item.providerName,
          success: async function (info) {
            // 获取用户信息成功, info.authResult保存用户信息
            const userInfo: any = info.userInfo
            console.log('info', info)
            console.error('info.userInfo------------', info.userInfo)
            const params = {
              providerName: item.providerName,
              loginType: 3, //1 code 登录， 2 token 登录 3 用户信息登录
              user: {
                id: userInfo.openid, //第三方系统用户id(openId,或者id)
                nickName: userInfo.nickName, //昵称
                name: userInfo.nickName, //姓名
                email: userInfo.email, //邮箱
              },
            }
            console.error('谷歌登录成功！')
            handleLogin(params)
          },
          fail: (fail) => {
            uni.hideLoading()
            console.error(fail)
          },
        })
      },
      fail: function (err) {
        console.error(err)
        uni.hideLoading()
        // 登录授权失败
        // err.code是错误码
      },
    })
  } else {
    uni.hideLoading()
    plus.runtime.openWeb(item.authUrl)
    // uni.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(item.authUrl) })
  }
}

const handleLogin = (params) => {
  login(params)
    .then((res) => {
      const data: any = res.data
      const userStore = useUserStore()
      userStore.setUserInfo({...data.userInfo})
      uni.setStorageSync('token', data.token)

      // 初始化聊天sdk
      nim.NIMInstance = null
      provide('$nim', null)
      nim.initListen(() => {
        console.log('=========')
        provideFunc()
        console.log('=========')

      })

      uni.hideLoading()
      updateUserInfo()
      startLocationTracking()
      if (data?.userInfo?.profileStatus == 1) {
        uni.reLaunch({
          url: '/pages/basicInformation/basicInformation',
        })
      } else {
        uni.switchTab({
          url: '/pages/index/index',
        })
      }
    })
    .catch(() => {
      uni.hideLoading()
    })
}

const mapping = {
  google: {
    class: 'googleBtn',
    btnText: 'Google',
  },
  x: {
    class: 'twittleBtn',
    btnText: 'Twittle',
  },
}
const provideFunc = () => {
  useNimStore().setInstance(nim.NIMInstance)
  console.log(33333,nim.NIMInstance)
  nim.checkLoginStatusFunc('Network error, please restart the app')
  db.getAllList(useNimStore().instance);
  console.log("db执行完毕");
  return provide('$nim', nim.NIMInstance)
}
// 获取用户信息成功, info.authResult保存用户信息
// const userInfo: any = info.userInfo

onShow(() => {
  setTimeout(function () {
    var args = plus.runtime.arguments
    if (args) {
      // 去除协议部分并只保留查询参数
      const queryString = args.split('?')[1]
      // 解析成对象
      const obj = qs.parse(queryString)
      console.log('obj', obj)
      const {state, code} = obj
      const params = {
        providerName: state,
        loginType: 1, //1 code 登录， 2 token 登录 3 用户信息登录
        code,
      }
      if (code && state) {
        handleLogin(params)
      }
    }
  }, 10)
})

onMounted(async () => {
  const {data} = await getLoginInfo()
  loginBtns.value = data as []
})
</script>

<style lang="scss" scoped>
@import './login.scss';
</style>
