<template>
  <div class="device-map-box">
    <a-spin :loading="loading">
      <div id="tx_map_d" class="map"></div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { getIotDeviceList, getDevice } from '@/api/iot-device/index.ts'
  import { runDataMap } from '@/utils/iot-device.ts'

  const loading = ref(false)

  const iotDeviceList = ref([])

  const selectStyleId = (item) => {
    const { status, maintenanceRecords, faultRecords } = item
    if (faultRecords.length !== 0) {
      return 'red'
    }
    if (maintenanceRecords.length !== 0) {
      return 'orange'
    }
    if (status === 2) {
      return 'grey'
    }
    if (status === 1) {
      return 'blue'
    }
    if (status === 0) {
      return 'green'
    }
    return 'grey'
  }

  const resGetIotDeviceList = async () => {
    loading.value = true
    try {
      const { data } = await getIotDeviceList({
        pageNum: 1,
        pageSize: 10000,
      })
      // iotDeviceList.value = [...data.items]
      data.items.forEach((item) => {
        if (item.latitude && item.longitude) {
          iotDeviceList.value.push({
            id: item.id, // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
            styleId: selectStyleId(item), // 指定样式id
            position: new window.TMap.LatLng(
              parseFloat(item.latitude),
              parseFloat(item.longitude)
            ), // 点标记坐标位置
          })
        }
      })
      loading.value = false
      initMap()
      addClick()
    } catch (error) {
      console.log(error)
    }
  }

  // 定义map
  const map = ref()
  // 定义marker
  const marker = ref()
  // 定义信息窗口
  const infoWindow = ref()
  // 地图初始化
  const initMap = () => {
    // 定义地图中心点坐标
    const center = new window.TMap.LatLng(31.502268, 120.368039)
    // 定义map变量，调用 TMap.Map() 构造函数创建地图
    map.value = new window.TMap.Map(document.getElementById('tx_map_d'), {
      center, // 设置地图中心点坐标
      zoom: 17.2, // 设置地图缩放级别
      // pitch: 43.5, // 设置俯仰角
      rotation: 45, // 设置地图旋转角度
    })
    map.value.setViewMode('2D')

    // 创建并初始化MultiMarker
    marker.value = new window.TMap.MultiMarker({
      map: map.value, // 指定地图容器
      // 样式定义
      styles: {
        // 创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
        blue: new window.TMap.MarkerStyle({
          width: 50, // 点标记样式宽度（像素）
          height: 50, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/blue.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        red: new window.TMap.MarkerStyle({
          width: 50, // 点标记样式宽度（像素）
          height: 50, // 点标记样式高度（像素）
          src: new URL('../../../../assets/iot-device/red.png', import.meta.url)
            .href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        green: new window.TMap.MarkerStyle({
          width: 50, // 点标记样式宽度（像素）
          height: 50, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/green.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        grey: new window.TMap.MarkerStyle({
          width: 50, // 点标记样式宽度（像素）
          height: 50, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/grey.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        orange: new window.TMap.MarkerStyle({
          width: 50, // 点标记样式宽度（像素）
          height: 50, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/orange.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        // 创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
        blueDouble: new window.TMap.MarkerStyle({
          width: 70, // 点标记样式宽度（像素）
          height: 70, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/blue.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        redDouble: new window.TMap.MarkerStyle({
          width: 70, // 点标记样式宽度（像素）
          height: 70, // 点标记样式高度（像素）
          src: new URL('../../../../assets/iot-device/red.png', import.meta.url)
            .href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        greenDouble: new window.TMap.MarkerStyle({
          width: 70, // 点标记样式宽度（像素）
          height: 70, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/green.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        greyDouble: new window.TMap.MarkerStyle({
          width: 70, // 点标记样式宽度（像素）
          height: 70, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/grey.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
        orangeDouble: new window.TMap.MarkerStyle({
          width: 70, // 点标记样式宽度（像素）
          height: 70, // 点标记样式高度（像素）
          src: new URL(
            '../../../../assets/iot-device/orange.png',
            import.meta.url
          ).href, // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: { x: 16, y: 32 },
        }),
      },
      // 点标记数据数组
      geometries: iotDeviceList.value,
    })

    // 初始化infoWindow
    infoWindow.value = new window.TMap.InfoWindow({
      map: map.value,
      position: new window.TMap.LatLng(31.502268, 120.368039),
      offset: { x: 10, y: -32 }, // 设置信息窗相对position偏移像素
    })
    infoWindow.value.close() // 初始关闭信息窗关闭
  }

  // marker点击事件
  const eventClick = async (evt) => {
    const { data } = await getDevice({
      deviceId: evt.geometry.id,
    })
    map.value.setCenter(evt.geometry.position)

    // 设置infoWindow
    infoWindow.value.open() // 打开信息窗
    infoWindow.value.setPosition(evt.geometry.position) // 设置信息窗位置
    infoWindow.value.setContent(
      `
        <div class="info-window-box">
          <div class="device-top">
            <div class="left">
              <div class="title" title="${data.productName}">
                设备名称: ${data.productName}
              </div>
              <div class="model" title="${data.sn}">设备SN号: ${data.sn}</div>
            </div>
            <div class="right">
              <image
                width="60"
                src="${data.deviceImage}"
              />
            </div>
          </div>
          <div class="status">
            <div v-if="true" class="left">
              设备状态: 
              <span class="normal">
                <image
                  width="15"
                  src="${
                    // eslint-disable-next-line no-nested-ternary
                    data.status === 0
                      ? new URL(
                          '../../../../assets/iot-device/runnormal.png',
                          import.meta.url
                        ).href
                      : data.status === 1
                      ? new URL(
                          '../../../../assets/iot-device/runonline.png',
                          import.meta.url
                        ).href
                      : new URL(
                          '../../../../assets/iot-device/runoff.png',
                          import.meta.url
                        ).href
                  }"
                />
                ${
                  // eslint-disable-next-line no-nested-ternary
                  data.status === 0
                    ? '设备正常'
                    : data.status === 1
                    ? '设备在线'
                    : '设备离线'
                }
              </span>
              <span class="right-span">
                ${
                  data.warnFlag !== 0
                    ? `
                      <image
                        width="15"
                        src="${
                          new URL(
                            '../../../../assets/iot-device/weixiu.png',
                            import.meta.url
                          ).href
                        }"
                      />
                      故障维修
                      `
                    : ''
                }
                ${
                  data.repairFlag !== 0
                    ? `
                      <image
                        width="15"
                        src="${
                          new URL(
                            '../../../../assets/iot-device/baoyang.png',
                            import.meta.url
                          ).href
                        }"
                      />
                      维保提醒
                      `
                    : ''
                }
              </span>
            </div>
            <div class="right" onClick="window.location.href='runing-log?id=${
              evt.geometry.id
            }'">查看详情>></div>
          </div>
          <div class="device-data">
            ${Object.entries(data.deviceData)
              .map((item) => {
                return runDataMap
                  .map((rItem) => {
                    return item[0] === rItem.key
                      ? `<div class="device-data-item">
                        <div class="top">
                          <img src=${rItem.img} width="15" />
                          <span>${rItem.name}</span>
                        </div>
                        <div class="data">
                          ${item[1]}
                          ${rItem.unit}
                        </div>
                      </div>
                    `
                      : ``
                  })
                  .join('')
              })
              .join('')}
          </div>
          <div class="time">数据更新: ${data.deviceData.updateTime || ''}</div>
        </div>
      `
    ) // 设置信息窗内容
  }

  // 为marker添加点击事件
  const addClick = () => {
    marker.value.on('click', eventClick)
  }

  // 移除marker点击事件
  const removeClick = () => {
    marker.value.off('click', eventClick)
  }

  onMounted(() => {
    resGetIotDeviceList()
  })

  onUnmounted(() => {
    // 移除marker点击事件
    removeClick()
    // 销毁地图
    map.value.destroy()
  })
</script>

<style lang="less" scoped>
  .device-map-box {
    padding: 20px;
    height: calc(100vh - 60px);
  }

  #tx_map_d {
    height: 100%;
  }

  :deep(.clusterBubble) {
    border-radius: 50%;
    color: #fff;
    font-weight: 500;
    text-align: center;
    opacity: 0.88;
    background-image: linear-gradient(139deg, #4294ff 0%, #295bff 100%);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0px;
    left: 0px;
  }

  :deep(.info-window-box) {
    width: 360px;
    padding: 10px;

    .device-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 60px;

      .left {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: flex-start;
        text-align: left;

        .title {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 600;
          width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .model {
          color: #646464;
          width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .status {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      width: 100%;

      .left {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .normal {
          color: #4b7902;
        }

        .offline {
          color: #7f7f7f;
        }

        .running {
          color: #1890ff;
        }

        span {
          margin-left: 5px;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .right-span {
          color: #e0001b;

          img {
            margin-left: 10px;
          }
        }
      }

      .right {
        margin-left: 20px;
        color: #019bff;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .device-data {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      background-color: #f5f7fb;
      padding: 0 10px 10px;
      border-radius: 5px;

      .device-data-item {
        width: 100px;
        padding: 10px 10px 5px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 2px 2px 2px #ccc;
        margin-right: 10px;
        margin-top: 10px;

        &:nth-of-type(3n) {
          margin-right: 0;
        }

        .top {
          margin-bottom: 10px;
          text-align: left;

          img {
            vertical-align: middle;
          }
          span {
            font-size: 12px;
            line-height: 14px;
            color: #a09fb0;
          }
        }

        .data {
          text-align: left;
          font-weight: 600;
        }
      }
    }

    .time {
      text-align: left;
      font-size: 12px;
      color: #adb0af;
      margin-top: 10px;
    }
  }
  .arco-spin {
    width: 100%;
  }
</style>
