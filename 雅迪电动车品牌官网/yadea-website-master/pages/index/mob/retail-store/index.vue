<!--
 * @Author: weijianjun
 * @Date: 2023-02-22 13:59:23
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 16:02:14
 * @FilePath: \website\pages\index\mob\retail-store\index.vue
 * @Description: 
 * 
-->

<template>
  <div class="m-page-retail-store m-page-pt">
    <div class="search-box">
      <div class="title fw-500">{{ title }}</div>
      <div class="mb-3-mvw">
        <a-select v-model:value="state.province" placeholder="请选择省" class="my-sel my-sel1" :options="provinces"> </a-select>
        <a-select
          v-model:value="state.secondCity"
          placeholder="请选择市"
          class="my-sel my-sel2"
          :options="cities"
          @change="onCitySelChange"
        >
        </a-select>
      </div>

      <div class="mb-6-mvw flex-c">
        <!-- <a-input v-model:value="state.cityName" placeholder="请输入城市名" class="my-search mr-2-mvw-i">
          <template #prefix>
            <img class="icon-search" src="@/assets/images/icon-search.png" alt="" />
          </template>
        </a-input> -->

        <MobileButton type="primary" class="query-btn" shape="" @click="query">查询</MobileButton>
      </div>
    </div>
    <div id="map-box" class="full"></div>

    <div class="pl-35 full-w">
      <div class="list full-w">
        <div v-for="(item, index) of list" :key="index" class="list-item flex-c full-w" @click="onLocate(item, index)">
          <div :id="`icon-${index}`" class="pos-rel flex-hvc">
            <img style="width: 6.4vw; height: 7.733333vw" :src="item.icon" alt="" />
            <div class="index">{{ index + 1 }}</div>
          </div>
          <div class="list-item-right flex-col just-center full-w">
            <div class="ptb-9">
              <div class="list-item-title mb-1-mvw">{{ item.title }}</div>
              <div class="list-item-desc">{{ item.desc }}</div>
            </div>
            <a-divider class="m0" />
          </div>
        </div>
      </div>
    </div>

    <footer class="plr-4-mvw">
      <div class="mb-3 mt-6 txt-c fs-13-mvw">了解“一键救援”，点击立即前往</div>
      <MobileButton type="primary" shape="" style="width: 100%" class-name="one-click-rescue mb-8 fs-14-i-mvw">一键救援</MobileButton>
    </footer>
  </div>
</template>

<script setup>
import icon1 from '@/assets/images/retail-store/icon1.png'
import { usePCS } from '@/configs/PCS'
useHead({
  meta: [
    { name: 'keywords', content: '雅迪门店查询' },
    {
      name: 'description',
      content: '本页面为大家提供雅迪服务网点查询,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const map = shallowRef(null)

const PCS = usePCS(2)
const AMap = $ref()
const provinces = PCS
const list = $ref([])
const markers = $ref([])
const marker = $ref()
const infoWindow = $ref()
const state = reactive({
  province: '320000',
  secondCity: '320200',
  cityName: null
})

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

  map.value.setZoomAndCenter(10, [lng, lat])
  // map.value.setFitView([marker])
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
    offset: new AMap.Pixel(55, -25)
  })

  // console.error('map.value.getCenter() :>> ', map.value.getCenter());
  infoWindow.open(map.value, [lng, lat])
}

function removeMarkers() {
  map.value.remove(markers)
  markers = []
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

async function query(cityName) {
  const name = cityName || state.cityName
  if (name) {
    const { data } = await useFetch(`/api/queryShop?keywords=雅迪&city=${name}`)
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
    previewCity(list)
  }
}

function initMap() {
  AMap = window.AMap
  map.value = new AMap.Map('map-box', {
    zoom: 11,
    center: [120.301663, 31.574729] //默认无锡
  })

  map.value.on('complete', async () => {
    // TODO
    query('无锡')
  })
}
const title = $ref('')
onMounted(() => {
  initMap()
  setTimeout(() => {
    state.secondCity = '320200'
  }, 100)
  const qt = useRoute().query.title
  console.log('qt :>> ', qt)
  title = qt || '查找门店'
})

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.m-page-retail-store {
  @pl: 35pxvw;

  .pl-35 {
    .pl(35);
  }
  .one-click-rescue {
    height: 50mpxvw;
  }

  .ant-select {
    border: 1px solid #000;
    border-radius: 4px;
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 0;
    border-radius: 4px;
  }

  .icon-search {
    display: inline-block;
    .m-w(20);
    .m-h(20);
  }

  .icon-marke {
    display: inline-block;
    .m-w(25);
    .m-h(28);
  }

  .content-window-card {
    width: 60vw;
    &-title {
      font-size: 14mpxvw;
      font-weight: 500;
      color: #111111;
    }

    &-line {
      height: 1px;
      background: #e9e9e9;
      margin: 20px 0;
    }

    &-desc {
      font-size: 12mpxvw;
      font-weight: 500;
      color: #757575;
    }
  }

  .index {
    .pos-center-h;
    .m-fs(10);
    font-weight: 500;
    color: #ff5f00;
    top: 4mpxvw !important;
    left: 50%;
    transform: translateX(-50%);
  }

  #map-box {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 350mpxvw;
  }

  .search-box {
    .m-pl(20);
    .m-pr(25);

    .title {
      .m-fs(24);
      .m-mt(30);
      .m-mb(27);
    }
  }

  .list {
    &-item {
      .pl(38);

      img {
        .m-w(24);
        .m-h(29);
      }

      &-right {
        .m-pl(20);
      }

      &-title {
        .m-fs(14);
        font-weight: 500;
        color: #111111;
      }

      &-desc {
        .m-fs(12);
        font-weight: 500;
        color: #757575;
      }
    }
  }

  .my-search {
    .m-w(233);
    .m-h(37);
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
    overflow: visible;
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

  .my-sel {
    .m-w(160);
    .m-h(37);
    opacity: 0.4;
  }

  .my-btn {
    .m-w(160);
    .m-h(37);
  }

  .query-btn {
    height: 37mpxvw !important;
  }

  .my-sel1 {
    margin-right: 10mpxvw !important;

    .ant-select-selector {
      &:before {
        content: '省';
        .my-sel-common;
      }
    }
  }

  .my-sel2 .ant-select-selector {
    &:before {
      content: '市';
      .my-sel-common;
    }
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
