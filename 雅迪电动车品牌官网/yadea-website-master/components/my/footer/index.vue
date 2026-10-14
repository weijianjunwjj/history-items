<!--
 * @Author: yqq
 * @Date: 2022-12-16 15:21:21
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 13:39:49
 * @FilePath: \website\components\my\footer\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- 尾部 -->
  <div class="page-footer">
    <div class="page-footer-top">
      <div class="footer-top-wrap">
        <div class="footer-top-left">
          <div class="test-drive" @click="goBookingRide">
            <img src="@/assets/images/footer/test-drive.png" alt="图片" />
            <span>预约试驾</span>
          </div>
          <div class="car-contrast" @click="goModelContrast">
            <img src="@/assets/images/footer/car-contrast.png" alt="图片" />
            <span>车型对比</span>
          </div>
          <div class="online-service online-kf-id">
            <img src="@/assets/images/footer/online-service.png" alt="图片" />
            <span>在线客服</span>
          </div>
        </div>
        <div class="footer-top-right">
          <div class="contact-phone">400-900-1212</div>
          <div class="contact-time">8:00-20:00,周一至周日</div>
        </div>
      </div>
    </div>
    <div class="page-footer-middle">
      <div class="link-box">
        <div class="link-box-left">
          <template v-for="item of menus" :key="item.id">
            <dl class="footer-middle-item">
              <template v-if="!item.children">
                <dt>{{ item.name }}</dt>
                <template v-if="item.content">
                  <dd v-for="item2 of item.content" :key="item2.name">
                    <span v-if="urlOfParamsMap[item.apis]" @click="handleOpenSubMenu(item2, item.apis)">
                      {{ item2.name }}
                      <SvgIcon name="arrow-right-white" class="arrow-svg" :class="item2.show && 'rotate-90'"></SvgIcon>
                      <!-- <SvgIcon name="arrow-top-white" class="arrow-svg"></SvgIcon> -->
                    </span>
                    <span v-else @click="jump(item2)">
                      {{ item2.name }}
                    </span>
                    <Transition>
                      <div v-if="item2.show" class="link-item-detail">
                        <template v-for="threeItem in threeMenus" :key="threeItem.id">
                          <span class="txt-white fs-14-mvw opt65 mt-3-vw" @click="handleGoCarDetail(threeItem.attributes.model_static)">
                            {{ threeItem.attributes.name }}
                          </span>
                        </template>
                      </div>
                    </Transition>
                  </dd>
                </template>
              </template>
              <!-- <template v-else>
                <dt>{{ item.name }}</dt>
                <template v-for="item3 in item.content" :key="item3.name">
                  <dd>
                    <span v-if="urlOfParamsMap[item.apis]" @click="handleOpenSubMenu(item3, item.apis)">
                      {{ item3.name }}
                      <SvgIcon name="arrow-right-white" class="arrow-svg"></SvgIcon>
                    </span>
                    <span v-else @click="jump(item3)">
                      {{ item3.name }}
                    </span>
                    <Transition>
                      <div v-if="item3.show" class="link-item-detail">
                        <template v-for="threeItem in threeMenus" :key="threeItem.id">
                          <span class="txt-white fs-14-mvw opt65 mt-3-vw" @click="handleGoCarDetail(threeItem.attributes.model_static)">
                            {{ threeItem.attributes.name }}
                          </span>
                        </template>
                      </div>
                    </Transition>
                  </dd>
                </template>
                <dt>{{ item.children.name }}</dt>
                <template v-for="item3 in item.children.content" :key="item3.name">
                  <dd>
                    <span @click="handleOpenSubMenu(item3, item.children.apis)">
                      {{ item3.name }}
                      <SvgIcon name="arrow-right-white" class="arrow-svg" :class="item3.show && 'rotate-90'"></SvgIcon>
                    </span>
                    <Transition>
                      <div v-if="item3.show" class="link-item-detail">
                        <template v-for="threeItem in threeMenus" :key="threeItem.id">
                          <span class="txt-white fs-14-mvw opt65 mt-3-vw" @click="handleGoCarDetail(threeItem.attributes.model_static)">
                            {{ threeItem.attributes.name }}
                          </span>
                        </template>
                      </div>
                    </Transition>
                  </dd>
                </template>
              </template> -->
            </dl>
          </template>
        </div>

        <dl class="footer-middle-item">
          <dt class="vector-box">
            <a href="https://www.yadea.com/" target="_blank">
              <SvgIcon name="vector-white" class="vector-w" />
              <span>雅迪国际站</span>
            </a>
          </dt>
        </dl>
      </div>
      <div class="back-top">
        <span @click="handleBackTop">
          <span>返回顶部</span>
          <SvgIcon name="arrow-top" size="18" class="ml-2" />
        </span>
      </div>
    </div>
    <div class="page-footer-bottom">
      <div class="footer-bottom-left">
        © 2022 雅迪科技集团有限公司 All Rights Reserved&nbsp;<a class="c-888" target="_blank" href="https://beian.miit.gov.cn/"
          >苏ICP备12080415号</a
        >&nbsp;
        <a class="c-888" target="_blank" href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32020502000068"
          ><img class="police-badge" src="https://osswebsite.yadea.com.cn/foot_icp_55db42dcdc.png" alt="" />苏公网安备 32020502000068号</a
        >
      </div>
      <div class="footer-bottom-right">
        <div class="footer-bottom-right-box" @mouseenter="footerModalEnter(0)" @mouseleave="footerModalOut">
          <SvgIcon name="dy" class="svg-social-media" />
          <div v-show="footerModalIndex === 0" class="footer-bottom-right-modal">
            <img src="@/assets/images/dy.png" alt="" />
          </div>
        </div>
        <div class="footer-bottom-right-box" @mouseenter="footerModalEnter(1)" @mouseleave="footerModalOut">
          <SvgIcon name="kf" class="svg-social-media" />
          <div v-show="footerModalIndex === 1" class="footer-bottom-right-modal">
            <img src="@/assets/images/kf.png" alt="" />
          </div>
        </div>
        <div class="footer-bottom-right-box" @mouseenter="footerModalEnter(2)" @mouseleave="footerModalOut">
          <SvgIcon name="wechat" class="svg-social-media" />
          <div v-show="footerModalIndex === 2" class="footer-bottom-right-modal">
            <img src="@/assets/images/wx.jpg" alt="" />
          </div>
        </div>
        <div class="footer-bottom-right-box" @mouseenter="footerModalEnter(3)" @mouseleave="footerModalOut">
          <SvgIcon name="weibo" class="svg-social-media" />
          <div v-show="footerModalIndex === 3" class="footer-bottom-right-modal">
            <img src="@/assets/images/wb.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMenuContent } from '@/utils'
import { message } from 'ant-design-vue'

const { menuApi } = useApi()

const { useAppStore } = store

const appStore = useAppStore()

const sourceMenus = computed(() => {
  return appStore.sourceMenus
})

const footerModalIndex = $ref(null)

const menus = ref([])
const threeMenus = ref([])

// 前往车型详情页
const handleGoCarDetail = url => {
  url ? (window.location.href = url) : (window.location.href = '#')
}

// 返回顶部
const handleBackTop = () => {
  let timer = setInterval(() => {
    let ispeed = Math.floor(-window.scrollY / 7)
    document.documentElement.scrollTop = document.body.scrollTop = window.scrollY + ispeed
    if (window.scrollY === 0) {
      clearInterval(timer)
    }
  }, 10)
}

const jump = item => {
  const router = useRouter()

  if (item.aboutYadeaUrl) {
    router.push(item.aboutYadeaUrl)
  }
  if (item.supportUrl) {
    router.push(item.supportUrl)
  }
  if (item.url) {
    router.push(item.url)
  }
  if (item.model_static) {
    window.location.href = item.model_static
  }
}

// 前往车型对比
const goModelContrast = () => {
  useRouter().push('/model-contrast')
  props.hideMask()
}

// 前往预约骑行
const goBookingRide = () => {
  useRouter().push('/booking-ride')
  props.hideMask()
}

// 前往在线客服
// const goOnlineService = () => {
//   window.location.href = 'https://yadea.udesk.cn/im_client/?web_plugin_id=94631'
// }

const urlOfParamsMap = {
  '/api/products': 'getCarProductByCid',
  '/api/life-products': 'getCarLifeByCid'
}

function footerModalEnter(index) {
  footerModalIndex = index
}
function footerModalOut() {
  footerModalIndex = null
}

// 展开子菜单
const handleOpenSubMenu = async (detail, api) => {
  threeMenus.value = []
  if (detail.show) {
    detail.show = false
  } else {
    menus.value.forEach(item => {
      item.content.forEach(subItem => {
        if (subItem.id !== detail.id) {
          subItem.show = false
        }
      })
      item.children &&
        item.children.content.forEach(subItem => {
          if (subItem.id !== detail.id) {
            subItem.show = false
          }
        })
    })
    try {
      if (detail.children) {
        threeMenus.value = detail.children
      } else {
        const { data } = await menuApi[urlOfParamsMap[api]](detail.id)
        detail.children = data.value.data
        threeMenus.value = data.value.data
      }
    } catch (error) {
      if (process.client) {
        message.error('网络错误,请稍候重试')
      }
    }
    detail.show = true
  }
}

onMounted(async () => {
  const sourceMenusVal = sourceMenus.value
  if (sourceMenusVal.length) {
    try {
      const $sourceMenus = await getMenuContent(sourceMenusVal)
      menus.value = clone($sourceMenus)
      // menus.value[2].children = menus.value[1]
      // menus.value.splice(1, 1)
      appStore.saveData({ sourceMenus: $sourceMenus })
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
.page-footer {
  width: 100%;
  background-color: #222222;
  color: #ffffff;
  box-sizing: border-box;

  .page-footer-top {
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .footer-top-wrap {
      width: 1400pxvw;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 10pxvw 0 20pxvw;

      .footer-top-left {
        display: flex;
        flex-direction: row;
        align-items: center;

        .test-drive,
        .car-contrast,
        .online-service {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 75pxvw 0 90pxvw;
          position: relative;
          font-size: 18pxvw;
          line-height: 21px;
          cursor: pointer;

          img {
            width: 70pxvw;
            height: 70pxvw;
          }
          span {
            line-height: 30pxvw;
          }

          &::after {
            content: '';
            width: 1px;
            height: 45pxvw;
            background: #d9d9d9;
            opacity: 0.2;
            position: absolute;
            right: 0;
            top: 45%;
          }
        }

        .test-drive {
          padding-left: 0;
        }

        .car-contrast {
          padding-right: 90pxvw;
        }

        .online-service {
          padding-right: 0;
          padding-left: 60pxvw;
          &::after {
            display: none;
          }
        }
      }

      .footer-top-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .contact-phone {
          font-size: 32pxvw;
          font-weight: bold;
          color: #ff5f00;
          font-family: DINPro-Bold;
        }

        .contact-time {
          // letter-spacing: 1px;
          font-size: 1vw;
          // margin-top: 10px;
        }
      }
    }
  }
  .page-footer-middle {
    width: 1400pxvw;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin: 0 auto;

    .link-box {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;

      .link-box-left {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 1000pxvw;
        dl {
          margin-bottom: 0;
        }
      }

      .footer-middle-item {
        @footer-font-size: 14px;
        // margin-right: 30px;
        dt {
          margin-top: 20pxvw;
          margin-bottom: 30pxvw;
          font-size: 20pxvw;
          line-height: 25pxvw;
          width: 180pxvw;

          &:nth-of-type(2) {
            margin-top: 17pxvw;
          }

          a {
            color: #ffffff;
            text-decoration: none;
            display: flex;
            flex-direction: row;
            align-items: center;

            .vector-w {
              width: 20pxvw;
              height: 20pxvw;
              margin-right: 20pxvw;
            }
          }
        }

        .vector-box {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
        }

        .cycling-life {
          margin-top: 35pxvw;
        }

        dd {
          margin: 0;
          padding-bottom: 16pxvw;

          span {
            color: #fff;
            text-decoration: none;
            font-size: 16pxvw;
            line-height: 21pxvw;
            display: flex;
            flex-direction: row;
            align-items: center;
            opacity: 0.85;
            cursor: pointer;

            .arrow-svg {
              width: 16pxvw;
              height: 16pxvw;
            }
          }
        }
      }
    }

    .back-top {
      display: flex;
      margin-top: 20pxvw;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 15pxvw;
      cursor: pointer;

      .svg-back-top {
        margin-left: 2pxvw;
      }

      span {
        font-size: 14pxvw;
        color: #ffffff;
        line-height: 16px;
      }
    }
  }

  .page-footer-bottom {
    display: flex;
    width: 1400pxvw;
    margin: 0 auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16pxvw 0 24pxvw;

    .footer-bottom-left {
      font-size: 14pxvw;
      color: #888888;
      line-height: 16px;
    }

    .footer-bottom-right {
      position: relative;
      display: flex;
      .svg-social-media {
        width: 40pxvw;
        height: 40pxvw;
        margin-left: 30pxvw;
      }
    }
  }

  .footer-bottom-right-modal {
    position: absolute;
    width: calc(150 / 1920 * 100vw);
    height: calc(150 / 1920 * 100vw);
    border: 1px solid #000;
    border-radius: 4px;
    top: calc(-155 / 1920 * 100vw);
    img {
      width: 100%;
    }
  }
}
</style>
