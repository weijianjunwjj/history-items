<template>
  <div id="map-container" class="full"> </div>
</template>

<script setup>
  const { TMap } = window
  const route = useRoute()
  const { latitude, longitude } = route.query
  // 定义map
  const map = ref()
  // 定义信息窗口
  const infoWindow = ref()

  const initMap = () => {
    const container = document.getElementById('map-container')

    map.value = new TMap.Map(container, {
      // 地图的中心地理坐标。
      center: new TMap.LatLng(latitude, longitude),
      zoom: 17.2, // 设置地图缩放级别
    })

    const position = new window.TMap.LatLng(latitude, longitude)
    // eslint-disable-next-line no-new
    new window.TMap.MultiMarker({
      id: 'map-container',
      map: map.value,
      styles: {
        marker: new window.TMap.MarkerStyle({
          width: 25,
          height: 35,
          anchor: { x: 16, y: 32 },
          src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
        }),
      },
      geometries: [
        {
          id: 'demo',
          styleId: 'marker',
          position,
          properties: {
            title: 'marker',
          },
        },
      ],
    })

    const { address } = route.query

    // 初始化infoWindow
    infoWindow.value = new window.TMap.InfoWindow({
      map: map.value,
      position,
      offset: { x: -2, y: -36 }, // 设置信息窗相对position偏移像素
      content: `
        <div class="info-window-box">
             地址：${address}
        </div>`,
    })
    // infoWindow.value.close() // 初始关闭信息窗关闭
  }

  onMounted(() => {
    initMap()
  })
</script>

<style lang="less" scoped>
  :deep(.info-window-box) {
    // width: 150px;
    // padding: 10px;
  }
</style>
