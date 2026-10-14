export const runDataMap = [
  {
    name: '运行状态',
    key: 'running',
    img: new URL('../assets/iot-device/running.png', import.meta.url).href,
    unit: '',
  },
  {
    name: '压力',
    key: 'pressure',
    img: new URL('../assets/iot-device/pressure.png', import.meta.url).href,
    unit: 'bar',
  },
  {
    name: '流量',
    key: 'flow',
    img: new URL('../assets/iot-device/flow.png', import.meta.url).href,
    unit: 'V',
  },
  {
    name: '电机温度',
    key: 'motorTempreture',
    img: new URL('../assets/iot-device/motorTempreture.png', import.meta.url)
      .href,
    unit: '℃',
  },
  {
    name: '工作温度',
    key: 'innerTempreture',
    img: new URL('../assets/iot-device/innerTemperture.png', import.meta.url)
      .href,
    unit: '℃',
  },
  {
    name: '外部温度',
    key: 'outerTempreture',
    img: new URL('../assets/iot-device/outerTempreture.png', import.meta.url)
      .href,
    unit: '℃',
  },
  {
    name: '加热温度',
    key: 'heatingTemperature',
    img: new URL(
      '../assets/iot-device/heartingTemperature.png',
      import.meta.url
    ).href,
    unit: '℃',
  },
  {
    name: '电压',
    key: 'vlotage',
    img: new URL('../assets/iot-device/vlotage.png', import.meta.url).href,
    unit: 'V',
  },
  {
    name: '电流',
    key: 'current',
    img: new URL('../assets/iot-device/current.png', import.meta.url).href,
    unit: 'A',
  },
  {
    name: '工作时长',
    key: 'workTime',
    img: new URL('../assets/iot-device/workTime.png', import.meta.url).href,
    unit: 'min',
  },
  {
    name: '累计时间',
    key: 'totalTime',
    img: new URL('../assets/iot-device/totalTime.png', import.meta.url).href,
    unit: 'h',
  },
]
