<!--
 * @Author: yqq
 * @Date: 2023-01-03 09:50:13
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 17:27:30
 * @FilePath: \website\components\mobile\footer\index.vue
 * @Description: 
 * 
-->
<template>
  <footer class="footer-box">
    <div class="back-top txt-white fs-13-mvw">
      <span @click="handleBackTop">
        返回顶部
        <SvgIcon name="backtop" class="vector-w" />
      </span>
    </div>
    <div class="extension-box">
      <div class="extension-top">
        <div class="extension-top-left txt-white fs-12-mvw">联系我们</div>
        <div class="extension-top-right">
          <div class="fs-20-mvw fw-bold txt-red">
            <a href="#" class="fs-18-mvw fw-bold">400-900-1212</a>
          </div>
          <span class="txt-white fs-12-mvw">8:00-20:00,周一至周日</span>
        </div>
      </div>
    </div>
    <div class="link-box">
      <template v-for="item in menus" :key="item.id">
        <div class="link-item">
          <div class="link-item-title" @click="handleOpenLinkBox(item.id)">
            <span class="txt-white fs-12-mvw">{{ item.name }}</span>
            <SvgIcon :name="show === item.id ? 'shut' : 'open'" class="svg-social-media" />
          </div>
          <Transition>
            <div v-if="show === item.id" class="link-item-detail">
              <template v-for="subItem in item.content" :key="subItem.id">
                <div
                  v-if="urlOfParamsMap[item.apis]"
                  class="txt-white subItem-title fs-12-mvw"
                  @click="handleOpenDropItems(item.apis, subItem)"
                >
                  {{ subItem.name }}
                  <SvgIcon name="arrow-right-white" class="svg-social-media" :class="subItem.show && 'rotate-90'" />
                </div>
                <div v-else class="txt-white subItem-title fs-12-mvw" @click="handleGoDetail(subItem)">
                  {{ subItem.name }}
                </div>
                <Transition>
                  <div v-if="subItem.show" class="three-item-detail">
                    <template v-for="threeItem in threeMenus" :key="threeItem.id">
                      <div class="txt-white fs-12-mvw" @click="handleGoCarDetail(threeItem.attributes.model_static)">
                        {{ threeItem.attributes.name }}
                      </div>
                    </template>
                  </div>
                </Transition>
              </template>
            </div>
          </Transition>
        </div>
      </template>
    </div>
    <div class="extension-bottom-box">
      <div class="international">
        <SvgIcon name="vector-white" class="svg-vector"></SvgIcon>
        <a href="https://www.yadea.com/" target="_blank"><span class="fs-12-mvw txt-white">雅迪国际站</span></a>
      </div>
      <div class="extension-bottom">
        <a href="https://v.douyin.com/eWF9guG/"><SvgIcon name="dyf" class="svg-social-media" color="#ffffff" /></a>
        <SvgIcon name="kff" class="svg-social-media online-kf-id" color="#ffffff" />
        <div class="pos-rel" @mouseenter="handleEnterWC" @mouseleave="handleLeaveWC">
          <SvgIcon name="wechatf" class="svg-social-media" color="#ffffff" />
          <img v-show="showWC" class="wechat-img" src="@/assets/images/wx.jpg" alt="" />
        </div>
        <a href="https://m.weibo.cn/u/1940087542"><SvgIcon name="weibof" class="svg-social-media" color="#ffffff" /></a>
      </div>
    </div>
    <div class="record-box fs-12-mvw">
      © 2022 雅迪科技集团有限公司 All Rights Reserved
      <a class="c-aaa" target="_blank" href="https://beian.miit.gov.cn/">苏ICP备12080415号</a>
      <a class="c-aaa" target="_blank" href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32020502000068"
        ><img class="police-badge" src="https://osswebsite.yadea.com.cn/foot_icp_55db42dcdc.png" alt="" />苏公网安备 32020502000068号</a
      >
    </div>
  </footer>
</template>

<script setup>
import { message } from 'ant-design-vue'
const { menuApi } = useApi()
// 定义连接展开状态
const show = ref(null)
const menus = ref([])
// 点击打开连接按钮
const handleOpenLinkBox = id => {
  show.value !== null && show.value === id ? (show.value = null) : (show.value = id)
}

const threeMenus = $ref([])

const showWC = $ref(false)

const urlOfParamsMap = {
  '/api/products': 'getCarProductByCid',
  '/api/life-products': 'getCarLifeByCid'
}

// 点击展开二级目录按钮
const handleOpenDropItems = async (url, subItem) => {
  threeMenus = []
  if (subItem.show) {
    subItem.show = false
  } else {
    if (subItem.children) {
      threeMenus = subItem.children
    } else {
      try {
        const { data } = await menuApi[urlOfParamsMap[url]](subItem.id)
        threeMenus = data.value.data
      } catch (error) {
        console.log(error)
        if (process.client) {
          message.error('网络错误,请稍候重试')
        }
      }
      menus.value.forEach(item => {
        item.content.forEach(subItem => {
          subItem.show = false
        })
      })
      subItem.show = true
    }
  }
}

// 前往车型详情页
const handleGoCarDetail = url => {
  url ? (window.location.href = url) : (window.location.href = '#')
}

// 前往详情页
const handleGoDetail = subItem => {
  const router = useRouter()
  if (subItem.aboutYadeaUrl) {
    router.push(`/mob${subItem.aboutYadeaUrl}`)
  }
  if (subItem.supportUrl) {
    router.push(`/mob${subItem.supportUrl}`)
  }
  if (subItem.url) {
    router.push(`/mob${subItem.url}`)
  }
  if (subItem.model_static) {
    window.location.href = subItem.model_static
  }
}

// 返回顶部
const handleBackTop = () => {
  if (process.client) {
    let timer = setInterval(() => {
      let ispeed = Math.floor(-window.scrollY / 7)
      document.documentElement.scrollTop = document.body.scrollTop = window.scrollY + ispeed
      if (window.scrollY <= 100) {
        clearInterval(timer)
        window.scrollTo(0, 0)
      }
      // if (window.scrollY === 0) {
      // }
    }, 10)
  }
}

const { useAppStore } = store

const appStore = useAppStore()

function handleLeaveWC() {
  showWC = false
}
function handleEnterWC() {
  showWC = true
}

// 获取菜单
const sourceMenus = computed(() => {
  return appStore.sourceMenus
})
onMounted(async () => {
  const sourceMenusVal = sourceMenus.value
  if (sourceMenusVal.length) {
    try {
      const $menus = await getMenuContent(sourceMenusVal)
      menus.value = $menus
    } catch (err) {
      onErr()
      console.error(err)
    }
  } else {
    console.error('appStore.sourceMenus is null!')
  }
})
</script>

<style lang="less" scoped>
.footer-box {
  background: #000;
}
.back-top {
  width: 100%;
  background: #000;
  height: 60mpxvw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #333;

  svg {
    width: 16mpxvw;
    height: 16mpxvw;
  }
}

.extension-box {
  width: 100%;
  height: 100%;
  background: #000;
  border-bottom: 1px solid #333;
  padding: 24mpxvw 16mpxvw 24mpxvw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .extension-top {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;

    .extension-top-left {
      margin-top: 4px;
    }

    .extension-top-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .txt-red {
        color: #ff5f00 !important;
        margin: 0;

        a {
          color: #ff5f00 !important;
          margin: 0;
        }
      }
    }
  }

  .extension-bottom {
    svg {
      width: 24mpxvw;
      height: 24mpxvw;
      margin-right: 20mpxvw;
    }
  }
}

.wechat-img {
  display: inline-block;
  .m-w(68);
  .m-h(68);
  position: absolute;
  bottom: 40px;
  right: 0px;
}

.link-box {
  background: #000;

  .link-item {
    position: relative;
    // border-bottom: 1px solid #333;
    &::after {
      content: '';
      width: calc(100% - 30mpxvw);
      height: 1px;
      background: #333;
      display: inline-block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    // padding: 20mpxvw 0;

    .link-item-title {
      padding: 16mpxvw 16mpxvw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 100%;

      svg {
        width: 16mpxvw;
        height: 16mpxvw;
      }
    }

    .link-item-detail {
      display: flex;
      flex-direction: column;
      padding-bottom: 10mpxvw;
      .subItem-title {
        padding-top: 8mpxvw;
        padding-bottom: 8mpxvw;
        padding-left: 16mpxvw;
        padding-right: 16mpxvw;
        background: #222;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        &:last-of-type {
          padding-bottom: 8mpxvw;
        }
      }
      .svg-social-media {
        width: 16mpxvw;
        height: 16mpxvw;
      }
    }

    .three-item-detail {
      padding-top: 8mpxvw;
      padding-left: 20mpxvw;
      padding-right: 20mpxvw;
      background: #222;

      .txt-white {
        padding-bottom: 12mpxvw;
        opacity: 0.85;
      }
    }
  }
}

.record-box {
  padding: 60mpxvw 15mpxvw 22mpxvw;
  background: #000;
  color: #aaa;
}

.v-enter-active {
  animation: bounce-in ease-in-out 0.3s;
}

.v-leave-active {
  animation: bounce-in ease-in-out 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    height: 0;
  }
  100% {
    opacity: 1;
    height: 100%;
  }
}

.extension-bottom-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #000;
  padding: 23mpxvw 15mpxvw;
  // margin: 0 15mpxvw;
  border-bottom: 1px solid #333;

  .international {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    svg {
      width: 16mpxvw;
      height: 16mpxvw;
      margin-right: 10px;
    }
  }

  .extension-bottom {
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      width: 24mpxvw;
      height: 24mpxvw;
      margin-right: 20mpxvw;
    }
  }
}
</style>
