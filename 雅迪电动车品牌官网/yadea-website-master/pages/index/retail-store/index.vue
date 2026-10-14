<!--
 * @Author: weijianjun
 * @Date: 2023-02-04 18:19:45
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 13:36:33
 * @FilePath: \yadea-website\pages\index\retail-store\index.vue
 * @Description: 门店查询
 * 
-->

<template>
  <div class="page-retail-store page-pt">
    <div id="map-box" class="full"></div>

    <client-only>
      <div class="fix-search">
        <div class="title">{{ title }}</div>

        <div class="search-area">
          <a-space class="pl-35 flex-c">
            <a-select v-model:value="state.province" placeholder="请选择省" class="my-sel my-sel1" :options="provinces"> </a-select>
            <a-select
              v-model:value="state.secondCity"
              placeholder="请选择市"
              class="my-sel my-sel2"
              :options="cities"
              @change="onCitySelChange"
            >
            </a-select>

            <!-- <a-input v-model:value="state.cityName" placeholder="请输入城市名" class="my-search" @pressEnter="query">
              <template #prefix>
                <img class="icon-search" src="@/assets/images/icon-search.png" alt="" />
              </template>
            </a-input> -->

            <MyButton type="primary" shape="" class-name="my-btn " @click="query">查询</MyButton>
          </a-space>

          <a-divider class="mt-10-i mb-0" />

          <div class="list-box full-w pos-rel">
            <div class="list full-w pl-35">
              <client-only>
                <a-spin class="list-box-sping pos-center-h" :spinning="loading" />
              </client-only>
              <div v-for="(item, index) of list" :key="index" class="list-item flex-c full-w" @click="onLocate(item, index)">
                <div :id="`icon-${index}`" class="pos-rel flex-hvc">
                  <img :src="item.icon" alt="" />
                  <div class="index">{{ index + 1 }}</div>
                </div>
                <div class="list-item-right flex-col just-center full-w">
                  <div class="ptb-9">
                    <div class="list-item-title">{{ item.title }}</div>
                    <div class="list-item-desc">{{ item.desc }}</div>
                  </div>
                  <a-divider class="m0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script setup>
import { usePCS } from '../../../configs/PCS'
import icon1 from '@/assets/images/retail-store/icon1.png'
import env from '@/env/envData'

useHead({
  meta: [
    { name: 'keywords', content: '雅迪门店查询' },
    {
      name: 'description',
      content: '本页面为大家提供雅迪服务网点查询,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const PCS = usePCS(2)
const map = shallowRef(null)
const AMap = $ref()
const state = reactive({
  province: '320000',
  secondCity: '320200',
  cityName: null
})

const list = $ref([])
const markers = $ref([])
const marker = $ref()
const infoWindow = $ref()
const loading = $ref(false)

const provinces = PCS

const cities = computed(() => {
  state.secondCity = null
  if (state.province) {
    return PCS.find(_ => _.value === state.province)?.children || []
  } else {
    return []
  }
})

function onCitySelChange(value) {
  const name = cities.value.find(item => item.value === value)?.label
  if (name) {
    query(name)
  }
}

function onLocate(item, index) {
  const { location } = item
  const lng = location.split(',')[0]
  const lat = location.split(',')[1]
  // / 点标记显示内容，HTML要素字符串
  var markerContent = document.getElementById(`icon-${index}`).innerHTML
  marker = new AMap.Marker({
    position: new AMap.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    // 将 html 传给 content
    content: markerContent,
    title: item.name
  })

  AMap.Event.addListener(marker, 'click', function () {
    infoWindow.open(map.value, marker.getPosition())
  })

  // 将创建的点标记添加到已有的地图实例：
  // removeMarkers()
  map.value.add(marker)
  markers.push(marker)
  map.value.setZoomAndCenter(15, [Number(lng), lat]) //同时设置地图层级与中心点
  map.value.panBy(150, 0)
  setTimeout(() => {
    openInfo(item, { lng, lat })
  }, 0)
}

//在指定位置打开信息窗体
function openInfo(item, { lng, lat }) {
  //构建信息窗体中显示的内容
  var info = []
  info.push(`<div class='content-window-card'>
    <div class="content-window-card-title">${item.name}</div>
    <div class="content-window-card-line"></div>
    <div class='content-window-card-desc'>${item.desc}</div>
    </div>`)

  infoWindow = new AMap.InfoWindow({
    content: info.join(''), //使用默认信息窗体框样式，显示信息内容
    offset: new AMap.Pixel(16, -5)
  })

  // console.error('map.value.getCenter() :>> ', map.value.getCenter());
  infoWindow.open(map.value, [lng, lat])
}

async function previewCity(list) {
  removeMarkers()
  closeInfo()
  await nextTick()
  console.log('list :>> ', list)

  list.forEach((item, index) => {
    setTimeout(() => {
      addMarker(item, index)
    }, 20)
  })

  setTimeout(() => {
    if (!list?.length) {
      return
    }
    const { location } = list[0]
    const lng = location.split(',')[0]
    const lat = location.split(',')[1]
    console.log('lng :>> ', lng)
    console.log('lat :>> ', lat)
    map.value.setZoomAndCenter(10, [Number(lng), lat]) //同时设置地图层级与中心点
  }, 100)
}

function addMarker(item, index) {
  const { location } = item
  const lng = location.split(',')[0]
  const lat = location.split(',')[1]
  // / 点标记显示内容，HTML要素字符串
  var markerContent = document.getElementById(`icon-${index}`).innerHTML
  marker = new AMap.Marker({
    position: new AMap.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    // 将 html 传给 content
    content: markerContent,
    title: item.name
  })

  AMap.Event.addListener(marker, 'click', function () {
    console.log('click')
    openInfo(item, { lng, lat })
  })

  // 将创建的点标记添加到已有的地图实例：
  map.value.add(marker)
  markers.push(marker)
}

function closeInfo() {
  infoWindow?.close()
}

function removeMarkers() {
  map.value.remove(markers)
  markers = []
}

async function query(cityName) {
  console.log('cities :>> ', cities)
  console.log('cities.value :>> ', cities.value)
  console.log('state.secondCity :>> ', state.secondCity)
  const _cityName = cities.value.find(item => item.value == state.secondCity)?.label?.replace('市', '')
  const name = cityName
  console.log('name :>> ', name)
  if (name) {
    loading = true
    try {
      const { data } = await useFetch(`/api/queryShop?keywords=雅迪&city=${name}`)
      // const { data } = await useFetch(`${env.VITE_API_URL}/api/queryShop?keywords=雅迪&city=${name}`)
      console.log('data :>> ', data)
      let val
      if (is('string', data.value)) {
        val = JSON.parse(data.value)
      } else {
        val = data.value
      }
      const arr = val?.pois || []
      const $list = arr.map(item => {
        const { name, pname, cityname, adname, address, photos } = item
        const ad = pname + cityname + adname + address
        return {
          ...item,
          icon: icon1,
          title: name,
          desc: ad
        }
        // icon: photos?.length? photos[0]?.url :emptyImg,
      })
      list = $list
      // 预览
      previewCity(list)
      loading = false
    } catch (error) {
      loading = false
    }
  }
}

function initMap() {
  AMap = window.AMap
  map.value = new AMap.Map('map-box', {
    zoom: 9,
    center: [120.301663, 31.574729] //默认无锡
  })

  map.value.on('complete', async res => {
    // 查询门店接口
    query('无锡')
  })
}

const title = $ref('')

onMounted(async () => {
  initMap()
  setTimeout(() => {
    state.secondCity = '320200'
  }, 100)
  const qt = useRoute().query.title
  console.log('qt :>> ', qt)
  title = qt || '查找门店'
})

onUnmounted(() => {
  sessionStorage.removeItem('retail-store-myTitle')
})
</script>

<style lang="less">
.page-retail-store {
  @pl: 35pxvw;

  .list-box-sping {
    margin-top: 100px;
  }

  .amap-info-content {
    padding: 20px;
  }

  .amap-info-outer,
  .amap-menu-outer {
    box-shadow: none !important;
    border: 1px solid #ff5f00 !important;
  }

  .content-window-card {
    &-title {
      font-size: 21px;
      font-weight: 500;
      color: #111111;
    }

    &-line {
      height: 1px;
      background: #e9e9e9;
      margin: 20px 0;
    }

    &-desc {
      font-size: 16px;
      font-weight: 500;
      color: #757575;
    }
  }

  .pl-35 {
    .pl(35);
  }

  .index {
    position: absolute;
    font-size: 14px;
    font-weight: 500;
    color: #ff5f00;
    top: 4px !important;
    left: 50%;
    transform: translateX(-50%);
  }

  #map-box {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: @page-h;
  }

  .fix-search {
    position: absolute;
    top: calc(@layout-header-height + 40pxvw);
    left: 123pxvw;
    width: 700pxvw;
    height: calc(@page-h - 80pxvw);
    background: #ffffff;
    z-index: 10;
    margin: auto;
    overflow: hidden;

    .title {
      .mt(48);
      .ml(35);
      .mb(39);
      .fs(40);
      font-weight: bold;
      color: #111111;
    }

    .search-area {
      .my-sel {
        .w(240);
        .h(44);
        opacity: 0.4;
      }

      .my-btn {
        .w(115);
        .h(44);
      }
    }
  }

  .list {
    height: 63.5185vh;
    overflow-y: scroll;

    &-item {
      .pl(38);

      & > img {
        .w(32);
        .h(38);
      }

      &-right {
        .pl(26);
      }

      &-title {
        .fs(24);
        font-weight: 500;
        color: #111111;
      }

      &-desc {
        .fs(16);
        font-weight: 500;
        color: #757575;
      }
    }
  }

  .my-search {
    .w(205);
    .h(44);
    border-radius: 4px;
    opacity: 0.4;
    border: 1px solid #000;
  }

  .space-1 > .ant-space-item {
    width: 100%;
  }

  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 100%;
  }

  .ant-select-selection-item {
    ._flex-c;
    overflow: hidden;
  }

  .my-sel-common {
    position: absolute;
    top: -13px;
    background: #fff;
    // padding: 0 10px;
    height: 18px;
    width: 24px;
    .txt-c;
  }

  .my-sel1 .ant-select-selector {
    &:before {
      content: '省';
      .my-sel-common;
    }
  }

  .my-sel2 .ant-select-selector {
    &:before {
      content: '市';
      .my-sel-common;
    }
  }

  .ant-select {
    border: 1px solid #000;
  }

  .ant-select-selection-placeholder {
    height: 100%;
    line-height: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    opacity: 1;
  }
}
</style>
