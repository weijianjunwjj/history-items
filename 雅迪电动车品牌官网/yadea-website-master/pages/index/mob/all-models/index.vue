<!--
 * @Author: weijianjun
 * @Date: 2023-01-29 09:33:16
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 16:09:57
 * @FilePath: \yadea-website\pages\index\mob\all-models\index.vue
 * @Description: 全部车型
 * 
-->

<template>
  <div class="m-page-all-models">
    <mobile-banner title=" " :img="banner" />

    <main>
      <client-only>
        <div class="menu flex-vc" :class="isFixedMenu && 'fix-menu'">
          <div class="menu-content full-w flex-sb align-center">
            <div class="ul-list">
              <a-tabs
                id="menu-content-list"
                v-model:activeKey="current"
                mode="horizontal"
                class="menu-content-list"
                @tab-click="onTabClick"
              >
                <a-tab-pane v-for="item of seriesMenu" :key="item.name" :tab="item.name" class="fs-12-mvw"> </a-tab-pane>
              </a-tabs>
            </div>

            <div class="menu-content-opts flex-1 flex-vc cur-point" @click="openSortDrawer">
              <img src="@/assets/images/all-models/sort.png" alt="" />
              <span class="ml-2-vw fs-12-mvw">筛选</span>
            </div>
          </div>
        </div>
        <div v-if="series?.length" class="main-content">
          <div v-for="(item, index) of series" :id="`main-content-${index}`" :key="index" class="main-content-series">
            <template v-if="item.list.length">
              <div class="main-content-series-title">{{ item.name }}</div>
              <swiper
                class="main-content-series-swiper"
                :modules="modules"
                :navigation="{
                  enabled: true,
                  prevEl: `#banner-models-prev-${index}`,
                  nextEl: `#banner-models-next-${index}`
                }"
                slides-per-view="1.3"
                :space-between="15"
                :loop="false"
                :speed="900"
              >
                <swiper-slide v-for="(row, index) of item.list" :key="index">
                  <div class="main-content-series-mod flex-col">
                    <img class="car-img" :src="row?.colorUrl || emptyImg" alt="没有图片" @click="handleGoDetail(row.model_static)" />

                    <div class="car-descs flex-col just-center">
                      <div class="car-name">{{ row.name }}</div>
                      <div class="car-desc opt65 mb-3-mvw">{{ row.desc1 }}</div>
                    </div>
                    <div class="car-btns" :style="`height:${getH(item.list)}`">
                      <MobileColorButtonGroup class="flex">
                        <template v-if="row?.colorUrl && row?.vehicleVersion?.length">
                          <template v-for="(colorItem, index) in row?.vehicleVersion[0]?.vehicleColor" :key="index">
                            <MobileColorButtonItem
                              :is-border="item?.colorUrl === colorItem?.pic?.data?.attributes?.url"
                              :bg-color="colorItem?.productColor"
                              @click-index="handleChangeColor(row, colorItem, $event)"
                            >
                            </MobileColorButtonItem>
                          </template>
                        </template>
                      </MobileColorButtonGroup>
                      <MobileButton
                        v-if="!row.mobileButtonUrl1 && isHavePng(row.buttonUrl1)"
                        class-name="shop-mall fs-16-vw border-box"
                        type="link"
                        @click="handleOpenCode(row.buttonUrl1)"
                      >
                        <div class="flex-hvc" style="line-height: 1.2">
                          <span class="fs-12-mvw" style="color: #54514d">{{ row.button1 }}</span>
                        </div>
                      </MobileButton>
                      <MobileButton
                        v-else-if="!row.mobileButtonUrl1 && !isHavePng(row.buttonUrl1)"
                        class-name="shop-mall fs-16-vw border-box"
                        :href="row.buttonUrl1"
                        type="link"
                        @click="handleOpenCode(row.buttonUrl1)"
                      >
                        <div class="flex-hvc" style="line-height: 1.2">
                          <span class="fs-12-mvw" style="color: #54514d">{{ row.button1 }}</span>
                        </div>
                      </MobileButton>
                      <MobileButton v-else class-name="shop-mall fs-16-vw border-box" type="link" :href="row.mobileButtonUrl1">
                        <div class="flex-hvc" style="line-height: 1.2">
                          <span class="fs-12-mvw" style="color: #54514d">{{ row.button1 }}</span>
                        </div>
                      </MobileButton>
                    </div>
                  </div>
                </swiper-slide>
                <div :id="`banner-models-prev-${index}`" class="models-swiper-btn models-prev flex-hvc">
                  <div class="div-bgimg"></div>
                </div>
                <div :id="`banner-models-next-${index}`" class="models-swiper-btn models-next flex-hvc">
                  <div class="div-bgimg"></div>
                </div>
              </swiper>
            </template>
          </div>
        </div>
      </client-only>
    </main>
  </div>

  <client-only>
    <a-drawer v-model:visible="visible" class="m-page-all-models-drawer" style="color: red" title="筛选条件" placement="right">
      <template #closeIcon>
        <SvgIcon name="cha" class="svg-cha" />
      </template>

      <div class="content-item content-item-1">
        <div class="title">车型</div>
        <div class="btns">
          <MobileButton
            id="btn1"
            :type="group1Sel.includes('btn1') ? 'primary' : 'border2'"
            shape=""
            class-name="mr-2-mvw mb-2-mvw"
            @click="onSel('btn1', '电自')"
            >电自</MobileButton
          >
          <MobileButton
            id="btn2"
            :type="group1Sel.includes('btn2') ? 'primary' : 'border2'"
            shape=""
            class-name="mr-2-mvw"
            :border="{ color: '#E9E9E9', width: '1px' }"
            color="#000"
            @click="onSel('btn2', '电轻摩')"
            >电轻摩</MobileButton
          >
          <MobileButton
            id="btn3"
            :type="group1Sel.includes('btn3') ? 'primary' : 'border2'"
            shape=""
            :border="{ color: '#E9E9E9', width: '1px' }"
            color="#000"
            @click="onSel('btn3', '电摩')"
            >电摩</MobileButton
          >
        </div>
      </div>

      <template #footer>
        <div class="my-drawer-footer flex mtb-4-mvw" style="flex-direction: row-reverse">
          <MobileButton type="primary" class-name="ml-2-mvw" @click="onSure">确定</MobileButton>
          <MobileButton type="border2" :border="{ color: '#E9E9E9', width: '1px' }" color="#000" @click="onReset">重置 </MobileButton>
        </div>
      </template>
    </a-drawer>
  </client-only>
  <client-only>
    <a-modal v-model:visible="modalVisible" class="mobile-all-models-model" :footer="null" :width="320">
      <img :src="replaceImgUrl(codeImg)" alt="" />
      <span>扫码识别, 在线商城</span>
    </a-modal>
  </client-only>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import banner from '@/assets/images/mobile/all-models/banner.png'
import { group1, group2, group3, mapping } from '@/configs/allModels'

const modules = [Pagination, Navigation]
const { useAppStore } = store
const menus = $ref([])
const current = $ref('')
const visible = $ref(false)
const { menuApi } = useApi()
const series = $ref([
  {
    name: '',
    list: [{}]
  }
])
const seriesMenu = $ref([
  {
    name: '',
    list: [{}]
  }
])
const selArr = $ref([])
const list0 = $ref([])

const appStore = useAppStore()

const isFixedMenu = $ref(false)

const group1Sel = $ref([])
const group2Sel = $ref([])
const group3Sel = $ref([])

// 打开二维码
const modalVisible = ref(false)
const codeImg = ref('')
const handleOpenCode = img => {
  modalVisible.value = true
  codeImg.value = img
}

// 前往车型详情页
const handleGoDetail = url => {
  url ? (window.location.href = url) : (window.location.href = '#')
}

// 切换车身颜色
const handleChangeColor = (item, colorItem, e) => {
  const newUrl = item.vehicleVersion[0].vehicleColor[e].pic.data.attributes.url
  item.colorUrl = newUrl
}

function getH(list) {
  const isTwoLine = list.some(row => {
    const vehicleVersion = row?.vehicleVersion || []
    const vehicleColor = vehicleVersion?.length ? vehicleVersion[0].vehicleColor : []
    return vehicleColor.length > 5
  })

  if (isTwoLine) {
    return `${getMVW(64)}px`
  } else {
    return '36px'
  }
}

function onSure() {
  visible = false
  const vals = selArr.map(item => mapping[item])

  const type = vals[0] || null
  const $list0 = list0.map(item => item.list).flat()
  const list1 = $ref([...$list0])
  if ([type].every(item => item === null)) {
    list1 = $list0
  }

  if (type !== null) {
    list1 = list1.filter(item => {
      return item.type?.length && item.type[0] === type
    })
  }
  list1 = sortClass2(list1, 'sort')
  series = list1
}
function onReset() {
  selArr = []
  group1Sel = []
  group2Sel = []
  group3Sel = []
}

const showHeader = () => {
  isFixedMenu = false
  appStore.saveData({ isShowHeader: true })
}
const hideHeader = () => {
  appStore.saveData({ isShowHeader: false })
}

function scrollFunc(e) {
  e = e || window.event
  const dom = document.querySelector('.main-content')
  if (dom) {
    // console.log('window.screenTop', -document.body.getBoundingClientRect().top)
    // console.log(' dom.offsetTo', dom.getBoundingClientRect().top)
    if (-document.body.getBoundingClientRect().top >= dom.getBoundingClientRect().top) {
      isFixedMenu = true
    }
  }

  if (e.wheelDelta) {
    //第一步：先判断浏览器IE，谷歌滑轮事件
    if (e.wheelDelta > 0) {
      //当滑轮向上滚动时
      // console.log('滑轮向上滚动')
      showHeader()
    }
    if (e.wheelDelta < 0) {
      //当滑轮向下滚动时
      // console.log('滑轮向下滚动')
      hideHeader()
    }
  } else if (e.detail) {
    //Firefox滑轮事件
    if (e.detail > 0) {
      //当滑轮向上滚动时
      showHeader()
      // console.log('滑轮向上滚动')
    }
    if (e.detail < 0) {
      //当滑轮向下滚动时
      // console.log('滑轮向下滚动')
      hideHeader()
    }
  }
}

function onTabClick(name) {
  current = name.toString()
  const index = seriesMenu.findIndex(item => item.name === name)
  // isFixedMenu = true
  // appStore.saveData({ isShowHeader: false })
  if (document) {
    let target = document.getElementById(`main-content-${index}`)
    const dom = document.querySelector('.fix-menu')
    let headerHeight = 0
    if (dom) {
      headerHeight = getVW(150)
    } else {
      headerHeight = getVW(300)
    }
    window.scrollTo({
      top: heightToTop(target) - headerHeight,
      behavior: 'smooth'
    })
  }
}

function onSel(id, value) {
  try {
    if (selArr.includes(id)) {
      // 点击已选中的按钮取消选择
      if (group1Sel.includes(id)) {
        group1Sel = group1Sel?.filter(item => item !== id)
      }
    } else {
      // 同组只保留一个按钮
      if (group1.includes(id)) {
        group1Sel = [id]
      }
    }
    selArr = [...group1Sel]
  } catch (error) {
    console.error(error)
  }
}

function heightToTop(ele) {
  //ele为指定跳转到该位置的DOM节点
  if (document) {
    let root = document.body
    let height = 0
    do {
      height += ele.offsetTop
      ele = ele.offsetParent
    } while (ele !== root)
    return height
  }
}

function showDrawer() {
  visible = true
}

function openSortDrawer() {
  showDrawer()
}

try {
  const { data } = await menuApi.getCarProCategories()

  const allSeries = data.value.data.map(_ => {
    return {
      id: _.id,
      name: _.attributes.name
    }
  })
  // const options = {
  //   licensingPolicy: '需驾照'
  //   // endurance: '40-60km',
  //   // speed: '0-25km/h'
  // }
  const allPromise = allSeries.map(({ id }) => menuApi.getCarProductByCid(id))

  let allData = await Promise.all(allPromise)
  allData = allData.map(_ => _.data)
  const callback = () => {
    if (allData.some(_ => _.value === null)) {
      setTimeout(() => {
        callback()
      }, 0)
    } else {
      init()
    }
  }
  callback()

  function init() {
    try {
      allData = allData.map((_, index) => {
        const name = allSeries[index].name
        return {
          name,
          list: _.value?.data?.length
            ? _.value.data.map(__ => {
                const vehicleVersion = __?.attributes?.vehicleVersion
                const colorUrl =
                  vehicleVersion?.length && vehicleVersion[0].vehicleColor?.length
                    ? vehicleVersion[0]?.vehicleColor[0]?.pic?.data?.attributes?.url
                    : ''
                return { ...__.attributes, id: __.id, colorUrl, sort: name }
              })
            : []
        }
      })

      series = allData.filter(item => item.list.length)
      list0 = series
      seriesMenu = series
    } catch (error) {
      onErr(error)
    }
  }
} catch (error) {
  onErr(error)
}
var startx, starty

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
  // var angx = endx - startx;
  var angy = endy - starty
  // alert(`starty- ${starty}`)
  // alert(`endy- ${endy}`)
  if (angy > 0) {
    result = 2
  } else {
    result = 1
  }

  return result
}

const startY = $ref(0)
const endY = $ref(0)

onMounted(() => {
  menus = appStore.carProCategories
  // window.addEventListener('scroll', scrollFunc)
  //手指接触屏幕
  // document.addEventListener("touchstart", function (e) {
  //   startY = e.touches[0].pageY;
  // }, false);
  // //手指离开屏幕
  // document.addEventListener("touchend", function (e) {
  //   endY = e.changedTouches[0].pageY;
  //   if ( startY - endY > 0) {
  //     // alert('向下')
  //     hideHeader()
  //   } else {
  //     // alert('向上')
  //     showHeader()
  //   }
  // }, false);
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollFunc)
})

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.m-page-all-models {
  overflow-x: hidden;

  main {
    .menu {
      position: relative;
      transition: all 0.5s;

      &-content {
        position: relative;
        border-bottom: 1px solid #f0f0f0;
        box-shadow: none;
        position: relative;
        height: 43px;

        &::after {
          position: absolute;
          top: 0;
          right: 30%;
          display: block;
          content: '';
          width: 11vw;
          height: 37px;
          background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
        }
        .ul-list {
          width: 70%;
          overflow-x: scroll;
          overflow-y: hidden;
          padding: 0;

          &::-webkit-scrollbar {
            height: 3px;
          }

          &::-webkit-scrollbar-thumb {
            background-color: rgb(147, 147, 153, 0.5);
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
          }
        }

        &-list {
          padding-left: 5.333333vw;
          font-weight: 400;
          color: #000000;
          border: 0;

          .m-fs(12);

          .ant-menu-item {
            padding-top: 18mpxvw;
            padding-bottom: 18mpxvw;
            padding-left: 10px;
            padding-right: 10px;
          }

          .ant-menu-overflow-item-rest {
            display: none;
          }
        }

        &-opts {
          position: absolute;
          right: 33mpxvw;

          & > img {
            width: 13mpxvw;
          }

          & > span {
          }
        }
      }
    }

    .fix-menu {
      width: 100%;
      position: fixed;
      top: 0;
      z-index: 999;
      transition: all 0.5s;
      background-color: #fff;
    }

    .main-content {
      margin-top: 30mpxvw;
      &-series {
        margin-bottom: 24mpxvw;

        &-title {
          padding-left: @m-header-pl;
          .m-fs(16);
          font-weight: 500;
          .m-mb(16);
        }

        &-swiper {
          padding-left: @m-header-pl;
        }

        &-mod {
          .m-w(254);
          // height: 74vw;
          background: #f8f8f8;
          border-radius: 6px 6px 6px 6px;
          overflow: hidden;

          .car-img {
            display: inline-block;
            .m-w(254);
            height: 160mpxvw;
            object-fit: contain;
            margin: 16mpxvw auto 16mpxvw;
          }

          .car-descs {
            padding: 0 16mpxvw;
          }

          .car-name {
            .m-fs(16);
            font-weight: 500;
            color: #000000;
          }

          .car-desc {
            .m-fs(12);
            font-weight: 400;
            color: #000000;
            .m-mt(4);
          }

          .car-btns {
            width: 100%;
            padding: 0 16mpxvw;
            display: flex;
            align-items: flex-start;
            padding-bottom: 4vw;
            .button-group {
              width: 65%;
              float: left;
              align-items: center;
            }

            .ant-btn {
              float: right;
              // margin-top: 3mpxvw;
              width: 70mpxvw;
              height: auto !important;
            }
          }
        }
      }
    }
  }

  .swiper-button-disabled {
    opacity: 0 !important;
  }

  .models-swiper-btn {
    display: none;
    .m-w(24);
    .m-h(24);
    .div-bgimg {
      display: inline-block;
      width: 12mpxvw;
      height: 12mpxvw;
    }
  }

  .ant-tabs-top > .ant-tabs-nav,
  .ant-tabs-bottom > .ant-tabs-nav,
  .ant-tabs-top > div > .ant-tabs-nav,
  .ant-tabs-bottom > div > .ant-tabs-nav {
    margin: 0 !important;
  }

  .ant-tabs-nav::before {
    display: none;
  }

  .icon-right-arrow-blue {
    width: 10mpxvw;
    height: 10mpxvw;
  }
}

.mobile-all-models-model {
  .ant-modal-body {
    margin-top: 200mpxvw;
    padding-top: 50mpxvw;
    text-align: center;
    img {
      width: 180mpxvw;
      height: 180mpxvw;
      object-fit: cover;
      object-position: center;
    }

    span {
      color: #888;
      text-align: center;
      display: block;
      margin: 20mpxvw 0 20mpxvw;
    }
  }
}
</style>

<style lang="less">
.m-page-all-models-drawer {
  .ant-drawer-content-wrapper {
    width: 79.4667vw !important;
  }

  .ant-drawer-title {
    .m-fs(20);
    font-weight: bold;
    color: #000000;
  }

  .ant-drawer-body {
    padding-top: 0;
    padding-left: 60pxvw;
  }

  .ant-drawer-header {
    padding: 40mpxvw 24mpxvw 24mpxvw;
  }

  .ant-drawer-header-title {
    flex-direction: row-reverse;
  }

  .content-item {
    font-size: 12mpxvw;
    color: #000000;

    .title {
      padding-top: 24mpxvw;
      padding-bottom: 16mpxvw;
    }

    .btns {
      margin-bottom: 56pxvw;
    }

    &-1 {
      font-weight: bold;
    }

    &-2 {
      font-weight: 500;
    }

    &-3 {
      font-weight: bold;
    }
  }

  .ant-drawer-footer {
    padding: 0;
  }

  .my-drawer-footer {
    margin-right: 60pxvw;
  }

  .svg-cha {
    width: 30pxvw;
    max-width: 30px;
    height: 30pxvw;
    max-height: 30px;
  }
}
</style>
