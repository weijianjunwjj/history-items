<!--
 * @Author: weijianjun
 * @Date: 2023-01-29 09:33:16
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 16:03:08
 * @FilePath: \yadea-website\pages\index\all-models\index.vue
 * @Description: 全部车型
 * 
-->

<template>
  <div class="page-all-models">
    <div class="top-banner pos-rel flex-vc"></div>

    <main>
      <div class="menu flex-vc" :class="isFixedMenu && 'fix-menu'">
        <div class="menu-content full-w flex-sb align-center">
          <client-only>
            <a-tabs id="menu-content-list" v-model:activeKey="current" mode="horizontal" class="menu-content-list" @tab-click="onTabClick">
              <a-tab-pane v-for="item of seriesMenu" :key="item.name" :tab="item.name" class="fs-20-vw fs-max-20"> </a-tab-pane>
            </a-tabs>
          </client-only>

          <div class="menu-content-opts flex-1 flex-vc cur-point" @click="openSortDrawer">
            <img src="@/assets/images/all-models/sort.png" alt="" />
            <span class="ml-2-vw fs-20-vw fs-max-20">筛选</span>
          </div>
        </div>
      </div>
      <div id="topView" class="main-content">
        <template v-if="series.length">
          <div v-for="(item, index) of series" :id="`main-content-${index}`" :key="index" class="main-content-series">
            <template v-if="item.list.length">
              <div class="main-content-series-title">{{ item.name }}</div>
              <a-row class="main-content-series-list" :gutter="[40, 60]">
                <template v-for="(row, index) of item.list" :key="index">
                  <div v-for="(line, index2) of row" :key="index2" class="main-content-series-list">
                    <a-col :span="24">
                      <div class="main-content-series-mod flex-col align-center">
                        <img class="car-img" :src="line?.colorUrl || emptyImg" alt="没有图片" />

                        <div class="flex-col txt-c just-center car-decs-container">
                          <div class="car-name">{{ line.name }}</div>
                          <div v-if="line.desc1" class="car-desc opt65 mt-1-vw mb-7-vw">
                            {{ line.desc1 }}
                          </div>
                          <ClientOnly>
                            <div class="flex car-flex-container" :style="`height:${getH(row) || 'auto'}`">
                              <ColorButtonGroup class="color-btns">
                                <template v-if="line?.colorUrl && line?.vehicleVersion?.length">
                                  <template v-for="(colorItem, index) in line?.vehicleVersion[0]?.vehicleColor" :key="index">
                                    <ColorButtonItem
                                      :width="24"
                                      :height="24"
                                      :is-border="item?.colorUrl === colorItem?.pic?.data?.attributes?.url"
                                      :bg-color="colorItem?.productColor"
                                      @click-index="handleChangeColor(line, colorItem, $event)"
                                    >
                                    </ColorButtonItem>
                                  </template>
                                </template>
                              </ColorButtonGroup>
                              <MyButton
                                v-if="line.button1 && isHavePng(line.buttonUrl1)"
                                class-name="shop-mall fs-16-vw border-box car-buy-btn"
                                type="link"
                                @click="handleOpenCode(line.buttonUrl1)"
                              >
                                <div class="flex-c flex-end shop-mall-btn">
                                  <span class="shop-mall-txt fs-20-vw" style="color: #54514d">
                                    {{ line.button1 }}
                                  </span>
                                  <!-- <svg-icon name="right-arrow-blue" /> -->
                                </div>
                              </MyButton>
                              <MyButton v-else class-name="shop-mall fs-16-vw border-box car-buy-btn" type="link" :href="line.buttonUrl1">
                                <div class="flex-c flex-end shop-mall-btn">
                                  <span class="shop-mall-txt fs-20-vw" style="color: #54514d">
                                    {{ line.button1 }}
                                  </span>
                                  <!-- <svg-icon name="right-arrow-blue" /> -->
                                </div>
                              </MyButton>
                              <MyButton v-if="line.button2" class-name="learn-more fs-16 border-box" :href="line.buttonUrl2">
                                <span class="shop-mall-txt">{{ line.button2 }}</span>
                              </MyButton>
                            </div>
                          </ClientOnly>
                        </div>
                      </div>
                    </a-col>
                  </div>
                </template>
              </a-row>
            </template>
          </div>
        </template>
      </div>
    </main>
  </div>
  <client-only>
    <a-drawer v-model:visible="visible" class="page-all-models-drawer" style="color: red" title="筛选条件" placement="right">
      <template #closeIcon>
        <SvgIcon name="cha" class="svg-cha" />
      </template>

      <div class="content-item content-item-1">
        <div class="title">车型</div>
        <div class="btns">
          <MyButton :type="group1Sel.includes('btn1') ? 'primary' : 'border2'" shape="" class-name="mr-5-vw" @click="onSel('btn1', '电自')"
            >电自</MyButton
          >
          <MyButton
            :type="group1Sel.includes('btn2') ? 'primary' : 'border2'"
            shape=""
            :border="{ color: '#E9E9E9', width: '1px' }"
            color="#000"
            class-name="mr-5-vw"
            @click="onSel('btn2', '电轻摩')"
            >电轻摩</MyButton
          >

          <MyButton
            :type="group1Sel.includes('btn3') ? 'primary' : 'border2'"
            shape=""
            :border="{ color: '#E9E9E9', width: '1px' }"
            color="#000"
            @click="onSel('btn3', '电摩')"
            >电摩</MyButton
          >
        </div>
      </div>

      <template #footer>
        <div class="my-drawer-footer flex mtb-5-vw" style="flex-direction: row-reverse">
          <MyButton type="primary" class-name="ml-4-vw" @click="onSure">确定</MyButton>
          <MyButton type="border" :border="{ color: '#E9E9E9', width: '1px' }" color="#000" @click="onReset">重置</MyButton>
        </div>
      </template>
    </a-drawer>
  </client-only>
  <client-only>
    <a-modal v-model:visible="modalVisible" class="all-models-model" :footer="null" width="260px">
      <img :src="replaceImgUrl(codeImg)" alt="" style="" />
      <span>扫码识别, 在线商城</span>
    </a-modal>
  </client-only>
</template>

<script setup>
import { group1, group2, group3, mapping } from '@/configs/allModels'

// 打开二维码
const modalVisible = ref(false)
const codeImg = ref('')
const handleOpenCode = img => {
  modalVisible.value = true
  codeImg.value = img
}

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

function getH(row) {
  const isTwoLine = row.some(l => l?.vehicleVersion?.length && l?.vehicleVersion[0].vehicleColor?.length > 5)
  if (isTwoLine) {
    return `${getVW(73)}px`
  } else {
    return 'auto'
  }
}

const appStore = useAppStore()

const isFixedMenu = $ref(false)

const group1Sel = $ref([])
const group2Sel = $ref([])
const group3Sel = $ref([])
const selArr = $ref([])
const list0 = $ref([])
const anchorPointOffsetTopList = $ref([])

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

function onSure() {
  visible = false
  const vals = selArr.map(item => mapping[item])

  const type = vals[0] || null
  const $list0 = list0.map(item => item.list).flat(2)
  const list1 = $ref([...$list0])
  if ([type].every(item => item === null)) {
    list1 = $list0
  }

  if (type !== null) {
    list1 = list1?.filter(item => {
      return item.type?.length && item.type[0] === type
    })
  }

  if (list1.length !== 0) {
    list1 = sortClass2(list1, 'sort')
  }
  list1.forEach(item => {
    item.list = sort(item.list)
  })
  series = list1
}
function onReset() {
  selArr = []
  group1Sel = []
  group2Sel = []
  group3Sel = []
}

// 切换车身颜色
const handleChangeColor = (item, colorItem, e) => {
  const newUrl = item.vehicleVersion[0].vehicleColor[e].pic.data.attributes.url
  item.colorUrl = newUrl
}

var scrollFunc = function (e) {
  // 监听滚动动态设置顶部菜单标题高亮 start
  const menu = document.getElementById('topView')
  const fixMenuDom = document.querySelector('.fix-menu')
  let headerHeight = 0
  if (fixMenuDom) {
    headerHeight = getVW(85)
  } else {
    headerHeight = getVW(170)
  }

  if (anchorPointOffsetTopList.length === 0) return
  for (let index = 0; index < anchorPointOffsetTopList.length; index++) {
    // 当前已滑动的高度
    const customOffsetH = 0 - menu.getBoundingClientRect().top + getVW(20) + headerHeight
    // 高亮内容高度起点
    const upAnchorOffsetH = anchorPointOffsetTopList[index] - anchorPointOffsetTopList[0]
    // 高亮内容高度终点
    const downAnchorOffsetH = anchorPointOffsetTopList[index + 1] - anchorPointOffsetTopList[0]
    // 在对应内容区域内，设置顶部菜单标题高亮
    if (customOffsetH >= upAnchorOffsetH && customOffsetH <= downAnchorOffsetH) {
      const item = series[index]
      current = item.name
    } else if (index === anchorPointOffsetTopList.length - 1) {
      // 滚动到最后一个时，单独判断高度是否超出起点
      if (customOffsetH >= upAnchorOffsetH) {
        const item = series[index]
        current = item.name
      }
    }
  }
  // 监听滚动动态设置顶部菜单标题高亮 end

  e = e || window.event

  const dom = document.querySelector('.main-content')
  if (dom) {
    // console.log('window.screenTop', -document.body.getBoundingClientRect().top)
    // console.log(' dom.offsetTo', dom.getBoundingClientRect().top)
    if (-document.body.getBoundingClientRect().top >= dom.getBoundingClientRect().top) {
      isFixedMenu = true
    }
  }

  const showHeader = () => {
    isFixedMenu = false
    appStore.saveData({ isShowHeader: true })
  }
  const hideHeader = () => {
    appStore.saveData({ isShowHeader: false })
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
  isFixedMenu = true
  appStore.saveData({ isShowHeader: false })
  if (document) {
    let target = document.getElementById(`main-content-${index}`)
    const dom = document.querySelector('.fix-menu')
    let headerHeight = 0
    if (dom) {
      headerHeight = getVW(85)
    } else {
      headerHeight = getVW(170)
    }
    window.scrollTo({
      top: heightToTop(target) - headerHeight,
      behavior: 'smooth'
    })
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
      const $allData = allData.filter(item => item.list.length)
      const $series = clone($allData)
      $series.forEach(item => {
        item.list = sort(item.list)
      })
      console.log('$series :>> ', $series)
      series = $series
      console.log('series :>> ', series)
      list0 = series
      seriesMenu = series
    } catch (error) {
      onErr(error)
    }
  }
} catch (error) {
  onErr(error)
}

function sort(sourceList) {
  const list = []
  for (var i = 0; i < sourceList.length; i += 3) {
    list.push(sourceList.slice(i, i + 3))
  }
  return list
}

onMounted(() => {
  menus = appStore.carProCategories
  if (process.client) {
    if (document.addEventListener) {
      //firefox
      document.addEventListener('DOMMouseScroll', scrollFunc, false)
    }
    window.onmousewheel = document.onmousewheel = scrollFunc
    // 渲染完成后，获取对应每个标题的位移偏差值
    for (let index = 0; index < series.length; index++) {
      const dom = document.getElementById(`main-content-${index}`)
      const curScrollTop = dom.getBoundingClientRect().top
      anchorPointOffsetTopList.push(curScrollTop)
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    if (document.addEventListener) {
      //firefox
      document.removeEventListener('DOMMouseScroll', scrollFunc, false)
    }
    window.onmousewheel = document.onmousewheel = null
  }
})
</script>

<style lang="less">
.page-all-models {
  margin-top: @layout-header-height;

  .top-banner {
    width: 100%;
    height: 490pxvw;
    background: url(@/assets/images/all-models/top-banner.png) no-repeat;
    background-size: 100%;
    display: grid;

    & > section {
      // font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      color: #ffffff;
      margin-left: @header-pl;
      margin-top: -35pxvw;
    }
  }

  main {
    .menu {
      position: relative;
      transition: all 0.5s;

      &-content {
        position: relative;

        &-list {
          width: 100%;
          // font-family: Source Han Sans SC-Regular, Source Han Sans SC;
          font-weight: 400;
          color: #000000;
          background-color: #fff;

          // @media screen and (min-width: @max-media-width) {
          //   padding-top: 21px !important;
          //   padding-bottom: 21px !important;
          // }
        }

        &-opts {
          position: absolute;
          right: calc(calc(100vw - @layout-header-width) / 2);

          & > img {
            width: 20pxvw;
            max-width: 20px;
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
    }

    .main-content {
      margin-top: 80pxvw;

      &-series {
        margin-bottom: 60pxvw;
        width: 1400pxvw;
        margin-left: @header-pl;

        &-title {
          font-size: 42pxvw;
          // font-family: Source Han Sans SC-Medium, Source Han Sans SC;
          font-weight: 500;
          color: #000000;
          line-height: 49pxvw;
          margin-bottom: 40pxvw;
        }

        &-swiper {
          padding-left: @header-pl;
          padding-top: 20pxvw;
          padding-bottom: 20pxvw;
        }

        &-mod {
          width: 440pxvw;
          // height: 502pxvw;
          background: #f8f8f8;
          border-radius: 16px 16px 16px 16px;
          overflow: hidden;
          position: relative;
          padding-bottom: 30pxvw;

          // &:hover {
          //   box-shadow: 2px 4px 16px rgb(0 0 0 / 16%);
          //   transform: scale3d(1.01, 1.01, 1.01);
          // }

          &:hover .learn-more {
            display: block !important;
          }

          .car-img {
            display: inline-block;
            width: 100%;
            // height: 277pxvw;
            height: 12.427083vw;
            object-fit: contain;
            object-position: center;
            margin: 30pxvw auto 30pxvw;
          }

          .car-decs-container {
            width: 100%;
            padding: 0 40pxvw;
            text-align: left;

            .car-name {
              font-size: 18pxvw;
              // font-family: Source Han Sans SC-Medium, Source Han Sans SC;
              font-weight: 500;
              color: #000000;
            }

            .car-desc {
              font-size: 14pxvw;
              // font-family: Source Han Sans SC-Regular, Source Han Sans SC;
              font-weight: 400;
              color: #000000;
            }

            .car-flex-container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-top: 20pxvw;
              // height: 73.11pxvw;
              // overflow-x: auto;
              // overflow-y: scroll;
            }

            .button-group {
              width: 70%;
              height: 100%;
              overflow-y: scroll;
            }

            .car-buy-btn {
              width: 130pxvw;
              height: auto !important;
            }

            .learn-more {
              width: 169pxvw;
              height: 54pxvw;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: none;
            }
          }
        }
      }
    }
  }

  .ant-menu-horizontal > .ant-menu-item::after,
  .ant-menu-horizontal > .ant-menu-submenu::after {
    bottom: -21pxvw;

    @media screen and (min-width: @max-media-width) {
      bottom: -21px !important;
    }
  }

  .swiper-button-disabled {
    opacity: 0 !important;
  }
  .icon-right-arrow-blue {
    width: 16pxvw;
    height: 16pxvw;
  }

  .shop-mall-btn {
    margin-bottom: 5.62pxvw;
  }

  .main-content-series-list > .ant-col.ant-col-24 {
    padding-left: 17pxvw !important;
    padding-right: 17pxvw !important;
  }

  .ant-tabs > .ant-tabs-nav {
    margin: 0 !important;
  }
}

.all-models-model {
  .ant-modal-body {
    margin-top: 200pxvw;
    text-align: center;
    img {
      width: 180px;
      height: 180px;
      object-fit: cover;
      object-position: center;
    }

    span {
      color: #888;
      text-align: center;
      display: block;
      margin: 20pxvw 0 20pxvw;
    }
  }
}
</style>

<style lang="less">
.page-all-models {
  .ant-tabs-nav {
    padding-left: calc(@header-pl);
    margin: 0;
  }
  .ant-tabs-tab {
    .fs(20);
    .ptb(20);
  }
  .ant-tabs-tab-btn:focus {
    color: #000;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #ff5f00 !important;
  }
}

.page-all-models-drawer {
  .ant-drawer-content-wrapper {
    width: 600pxvw !important;
  }

  .content-item {
    font-size: 24pxvw;
    color: #000000;
    line-height: 28pxvw;

    .title {
      margin-top: 60pxvw;
      margin-bottom: 25pxvw;
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

  .ant-drawer-body {
    padding-top: 0;
    padding-left: 60pxvw;
  }

  .ant-drawer-title {
    font-size: 32pxvw;
    font-weight: bold;
    color: #000000;
    line-height: 39pxvw;

    @media screen and (min-width: @max-media-width) {
      font-size: 32px !important;
      line-height: 39px !important;
    }
  }

  .ant-drawer-header {
    padding: 80pxvw 60pxvw 40pxvw;
  }

  .ant-drawer-header-title {
    flex-direction: row-reverse;
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
