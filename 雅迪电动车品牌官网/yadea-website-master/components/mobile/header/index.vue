<!--
 * @Author: yqq
 * @Date: 2023-01-03 09:47:40
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-11 15:31:47
 * @FilePath: \website\components\mobile\header\index.vue
 * @Description: 
 * 
-->
<template>
  <header>
    <div class="header-container" :class="{ 'white-header': isScrollYMove || show }">
      <div class="logo-box" @click="handleShowDropDown">
        <SvgIcon v-if="show" name="close"></SvgIcon>
        <template v-else>
          <SvgIcon v-show="isShowWhiteHeader || isScrollYMove" name="classifyblack" />
          <SvgIcon v-show="!(isShowWhiteHeader || isScrollYMove)" name="classify" />
        </template>
      </div>
      <div class="yadea-box flex-hvc">
        <NuxtLink class="">
          <img :src="replaceImgUrl(imgLogo)" class="full" alt="logo" @click="handleClickGoIndex" />
        </NuxtLink>
      </div>
      <div class="yadea-shop" @mouseenter="handleEnterShopMall" @mouseleave="handleOutShopMall">
        <MobileButton class-name="shop-mall fs-16-vw border-box" type="primary">
          <div class="flex-hvc">
            <SvgIcon name="shopmall" class="shop-icon"></SvgIcon>
            <span class="ml-1 fs-12-mvw">商城</span>
          </div>
          <Transition name="showMall">
            <div v-if="showMall" class="show-mall-box">
              <div class="mall-link fs-12-mvw">
                <a href="/car-detail/shop/index.html">官方商城</a>
              </div>
              <div class="mall-link fs-12-mvw">
                <a
                  href="https://mall.jd.com/index-1000160101.html?cu=true&utm_source=www.catv1.com&utm_medium=tuiguang&utm_campaign=t_84122001_&utm_term=67361533163240aaa105d6e24ce6de39"
                  @click="hideMall"
                >
                  京东
                </a>
              </div>
              <div class="mall-link fs-12-mvw">
                <a
                  href="https://yadea.tmall.com/shop/view_shop.htm?user_number_id=2817130358&ali_trackid=2%3Amm_26534443_1954650123_110945750366%3A1678263078_018_567139338&union_lens=recoveryid%3A1678263078_018_567139338&bxsign=tbkNopySEA0Bm-GzQwyUK3vnl_o3y1lMpTxrJw9XAlTZGymXJdvXmoNnQyD-E8kNS1y_RTD_c1DM8bnwFIUMKzfIplOCistvAiebW-vPE0yDTNaJC5XSqmTojZrdivhVMct4_cSg9kctbKDTdoJJCy8Ow"
                  @click="hideMall"
                >
                  天猫
                </a>
              </div>
            </div>
          </Transition>
        </MobileButton>
      </div>
    </div>
    <Transition>
      <div v-if="show" class="header-dropdown-box">
        <div class="menu-box">
          <template v-for="(item, index) in mobileHeaderMenus" :key="item.id">
            <div class="menu-items">
              <div class="menu-items-title" @click="handleOpenMenuItems(item.id)">
                <span class="fs-12-mvw fw-500">{{ item.name }}</span>
                <SvgIcon name="down" color="#0000000" :class="menusShow === item.id && 'rotate-180'"></SvgIcon>
              </div>
              <Transition name="menus">
                <div v-if="menusShow === item.id">
                  <template v-for="(subItem, subIndex) in item.content" :key="subItem.id">
                    <div v-if="urlOfParamsMap[item.apis]" class="menu-items-drop">
                      <div v-if="index === 0 && subIndex === 0" class="menu-items-title" @click="handleGoAllModels">
                        <span class="fs-12-mvw">全部车型</span>
                        <SvgIcon name="down" color="#0000000"></SvgIcon>
                      </div>
                      <div class="menu-items-title" @click="handleOpenDropItems(item.apis, subItem.id)">
                        <span class="fs-12-mvw">{{ subItem.name }}</span>
                        <SvgIcon name="down" color="#0000000" :class="dropsShow === subItem.id && 'rotate-180'"></SvgIcon>
                      </div>
                      <Transition name="menus">
                        <div v-if="dropsShow === subItem.id" class="drop-detail">
                          <div v-if="threeMenus.length !== 0">
                            <template v-for="threeItem in threeMenus" :key="threeItem.id">
                              <div
                                v-if="threeItem.attributes.picUrl"
                                class="car-detail-box"
                                @click="handleGoCarDetail(threeItem.attributes.model_static)"
                              >
                                <!-- <div v-if="threeItem.attributes.licensingPolicy" class="need-driving-license">
                                  <SvgIcon name="drive"></SvgIcon>
                                  <span class="fs-12-mvw">需驾照</span>
                                </div> -->
                                <div class="car-image">
                                  <img :src="replaceImgUrl(threeItem.attributes.picUrl?.data[0]?.attributes.url)" alt="图片" />
                                </div>
                                <div class="car-info">
                                  <p class="fs-12-mvw">{{ threeItem.attributes.name }}</p>
                                  <span class="fs-12-mvw">{{ threeItem.attributes.desc1 }}</span>
                                </div>
                              </div>
                              <div v-else class="text-detail-box fs-14-mvw" @click="handleGoCarDetail(threeItem.attributes.model_static)">
                                <span>{{ threeItem.attributes.name }} 123</span>
                              </div>
                            </template>
                          </div>
                          <div v-else>加载中</div>
                        </div>
                      </Transition>
                    </div>
                    <div v-else class="menu-items-drop">
                      <div class="menu-items-title" @click="jump(subItem)">
                        <span class="fs-12-mvw">{{ subItem.name }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </Transition>
            </div>
          </template>
        </div>
        <div class="international">
          <SvgIcon name="vector"></SvgIcon>
          <a href="https://www.yadea.com/" class="fs-14-mvw" target="_blank">雅迪国际站</a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { getHeaderMenusFormat } from '@/utils'
import { message } from 'ant-design-vue'
const { menuApi, headerApi } = useApi()

const { useAppStore } = store
const appStore = useAppStore()
const isHomePage = ref(true)
const mobileHeaderMenus = ref([])

const showMall = $ref(false)

const handleEnterShopMall = () => {
  showMall = true
}

const hideMall = () => {
  showMall = false
}

const handleOutShopMall = () => {
  showMall = false
}

const handleClickGoIndex = () => {
  useRouter().push('/mob')
  show.value = false
}

// 获取菜单
const sourceMenus = computed(() => {
  return appStore.sourceMenus
})

const isShowWhiteHeader = computed(() => {
  return appStore.isShowWhiteHeader
})

// 是否是展开状态
const show = ref(false)

// 定义一级目录展开状态
const menusShow = ref(null)

// 定义二级目录展开状态
const dropsShow = ref(null)

// 点击面包屑
const handleShowDropDown = () => {
  show.value = !show.value
}

// 监听面包屑状态 改变body的overflow
watch(
  () => show.value,
  newVal => {
    if (process.client) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
        menusShow.value = null
        dropsShow.value = null
      }
    }
  },
  {
    deep: true
  }
)

// 前往全部车型
const handleGoAllModels = () => {
  const router = useRouter()
  router.push('/all-models')
  show.value = false
}
// 前往车型详情页
const handleGoCarDetail = url => {
  url ? (window.location.href = url) : (window.location.href = '#')
}

// 滚动条是否滚动
const isScrollYMove = ref(false)

// 监听滚动条是否滚动超过50 改变isScrollYMove
const changeIsScrollYMove = () => {
  window.scrollY >= 50 ? (isScrollYMove.value = true) : (isScrollYMove.value = false)
}

// 点击展开一级目录按钮
const handleOpenMenuItems = id => {
  if (menusShow.value !== null && menusShow.value === id) {
    menusShow.value = null
    dropsShow.value = null
    threeMenus.value = []
  } else {
    menusShow.value = id
    dropsShow.value = null
  }
}

// 定义三级目录数据
const threeMenus = ref([])

const urlOfParamsMap = {
  '/api/products': 'getCarProductByCid',
  '/api/life-products': 'getCarLifeByCid'
}

// 点击展开二级目录按钮
const handleOpenDropItems = async (url, id) => {
  if (dropsShow.value !== null && dropsShow.value === id) {
    dropsShow.value = null
    threeMenus.value = []
  } else {
    dropsShow.value = id
    try {
      const { data } = await menuApi[urlOfParamsMap[url]](id)
      threeMenus.value = data.value.data
    } catch (error) {
      if (process.client) {
        message.error('网络错误,请稍候重试')
      }
    }
  }
}

// logo
const imgLogo = ref('')

const init = async () => {
  headerApi.getHeader().then(({ data: headersData }) => {
    const _headersData = headersData.value
    if (_headersData) {
      imgLogo.value = getVal(_headersData, 'logo', 'url')
    }
  })
  if (!sourceMenus?.value?.length) {
    try {
      const res = await menuApi.getHeaderMenus()
      const { data } = res
      // setTimeout(() => {
      let fetchSourceMenus = data.value
      fetchSourceMenus = getHeaderMenusFormat(fetchSourceMenus)
      mobileHeaderMenus.value = fetchSourceMenus
      store.useAppStore().saveData({ sourceMenus: fetchSourceMenus })
      // }, 200);
    } catch (error) {
      onErr()
    }
  } else {
    mobileHeaderMenus.value = sourceMenus.value
  }
}

function jump(item) {
  const router = useRouter()
  const { name: title } = item
  console.log('item :>> ', item)
  if (item.aboutYadeaUrl) {
    router.push(`/mob${item.aboutYadeaUrl}?title=${title}`)
  }
  if (item.supportUrl) {
    router.push(`/mob${item.supportUrl}?title=${title}`)
  }
  if (item.url) {
    router.push(`/mob${item.url}?title=${title}`)
  }
  if (item.model_static) {
    item.model_static ? (window.location.href = item.model_static) : (window.location.href = '#')
  }
  show.value = false
}

// 获取logo图片
function getVal(data, mod, key) {
  return data.data[0].attributes[mod].data[0].attributes[key]
}

init()

const transparentHeaderRoutes = computed(() => {
  return appStore.transparentHeaderRoutes
})

onMounted(async () => {
  window.addEventListener('scroll', changeIsScrollYMove)
  const router = useRouter()
  watch(
    () => mobileHeaderMenus,
    _mobileHeaderMenus => {
      setTimeout(async () => {
        if (!_mobileHeaderMenus?.value) {
          try {
            const res = await menuApi.getHeaderMenus()
            const { data } = res

            watch(
              () => data,
              _data => {
                let fetchSourceMenus = _data.value
                fetchSourceMenus = getHeaderMenusFormat(fetchSourceMenus)
                mobileHeaderMenus.value = fetchSourceMenus
                store.useAppStore().saveData({ sourceMenus: fetchSourceMenus })
              }
            )
          } catch (error) {
            onErr()
          }
        }
      }, 1000)
    },
    {
      immediate: true,
      deep: true
    }
  )
  watch(
    () => router.currentRoute.value.path,

    newPath => {
      const isIncludes = transparentHeaderRoutes.value.includes(newPath)
      appStore.saveData({ isShowWhiteHeader: !isIncludes })
    },

    { immediate: true, deep: true }
  )
})

onUnmounted(() => {
  window.removeEventListener('scroll', changeIsScrollYMove)
})
</script>

<style lang="less" scoped>
.header-container {
  padding: 0 30px;
  height: 50mpxvw;
  line-height: 50mpxvw;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  .logo-box {
    float: left;

    svg {
      width: 24mpxvw;
      height: 24mpxvw;
    }
  }

  .yadea-box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    img {
      width: 21mpxvw;
      height: 21mpxvw;
    }
  }

  .yadea-shop {
    float: right;

    .shop-mall {
      width: 63mpxvw;
      height: 26mpxvw;
      position: relative;

      .shop-icon {
        width: 10mpxvw;
        height: 10mpxvw;
      }

      span {
        line-height: 1;
      }

      .show-mall-box {
        margin-top: 10mpxvw;
        width: 91mpxvw;
        height: 113mpxvw;
        background: #fff;
        border-radius: 6mpxvw 6mpxvw 6mpxvw 6mpxvw;
        padding: 0 6mpxvw;
        position: absolute;
        left: -14mpxvw;
        box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.14);
        .mall-link {
          height: 33%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #e9e9e9;
          color: #000;
          a {
            text-decoration: none;
            text-shadow: none;
          }
        }
      }
    }
  }
}

.white-header {
  background: #fff;
  // animation: bounce-in 0.3s;
}

.v-enter-active {
  animation: bounce-in linear 0.3s;
}

.v-leave-active {
  animation: bounce-in linear 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0.8;
    min-height: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    min-height: 100vh;
    height: 100%;
  }
}

.menus-enter-active {
  animation: menus-in ease-in-out 0.5s;
}

.menus-leave-active {
  animation: menus-in ease-in-out 0.5s reverse;
}

// @keyframes menus-in {
//   0% {
//     opacity: 0;
//     height: 0;
//   }

//   100% {
//     opacity: 1;
//     height: 100%;
//   }
// }

.shopMall-enter-active {
  animation: menus-in ease-in-out 0.5s;
}

.shopMall-leave-active {
  animation: menus-in ease-in-out 0.5s reverse;
}

@keyframes menus-in {
  0% {
    opacity: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    height: 100%;
  }
}

.header-dropdown-box {
  position: fixed;
  top: 50mpxvw;
  z-index: 99;
  background: #fff;
  padding-bottom: 150mpxvw;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  overflow: auto;
}

.header-dropdown-box {
  border-top: 1px solid #e9e9e9;

  .menu-box {
    .menu-items {
      margin: 0 15mpxvw;
      border-bottom: 1px solid #e9e9e9;

      .menu-items-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20mpxvw 0 20mpxvw;

        svg {
          width: 16mpxvw;
          height: 16mpxvw;
          transition: 0.5s;
        }
      }

      .menu-items-drop {
        padding: 0 0 0 15mpxvw;

        .menu-items-title {
          padding: 11mpxvw 0;
        }

        .drop-detail {
          overflow: hidden;
          margin-bottom: 20mpxvw;

          .car-detail-box {
            width: calc(50% - 5mpxvw);
            height: 160mpxvw;
            background: #f8f8f8;
            margin-top: 10mpxvw;
            padding: 10mpxvw;

            &:nth-of-type(even) {
              float: right;
            }

            &:nth-of-type(odd) {
              float: left;
            }

            &:nth-of-type(1),
            &:nth-of-type(2) {
              margin: 0;
            }

            .need-driving-license {
              // display: flex;
              display: none;
              flex-direction: row;
              align-items: center;
              line-height: 0;

              svg {
                width: 10mpxvw;
                height: 10mpxvw;
                margin-right: 2px;
              }
            }

            .car-image {
              text-align: center;

              img {
                width: 130mpxvw;
                height: 100mpxvw;
                object-fit: cover;
              }
            }

            .car-info {
              text-align: center;
              margin-top: 10mpxvw;

              p {
                margin: 0;
              }
            }
          }

          .text-detail-box {
            span {
              margin: 10mpxvw 0;
              display: inline-block;
            }
          }
        }
      }
    }
  }

  .international {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 30mpxvw 15mpxvw 0;

    svg {
      width: 16mpxvw;
      height: 16mpxvw;
      margin-right: 10px;
    }
  }
}
</style>
