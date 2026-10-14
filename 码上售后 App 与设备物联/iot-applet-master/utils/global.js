export const state = {
  status: [
    {
      state: 0,
      label: 'green',
      color: '#14DA2F',
      text: '运行正常',
      icon_path: '/images/home-page/run.png'
    },
    {
      state: 1,
      label: 'blue',
      color: '#3670FF',
      text: '设备在线',
      icon_path: '/images/home-page/sign.png'
    },
    {
      state: 2,
      label: 'grey',
      color: '#9092A6',
      text: '设备离线',
      icon_path: '/images/home-page/offline.png'
    },
  ],
  warn: [
    {
      state: 1,
      label: 'orange',
      color: '#F78E16',
      text: '需要维保',
      icon_path: '/images/home-page/maintain.png'
    },
  ],
  repair: [
    {
      state: 1,
      label: 'red',
      color: '#FF4E33',
      text: '故障报警',
      icon_path: '/images/home-page/repair.png'
    }
  ]

}


export const device_info = [
  {
    key: 'workTime',
    name: '运行时间',
    unit: ''
  },
  {
    key: 'current',
    name: '电流',
    unit: 'A'
  },
  {
    key: 'voltage',
    name: '电压',
    unit: 'V'
  },
  {
    key: 'pressure',
    name: '压力',
    unit: 'bar'
  },
  {
    key: 'innerTempreture',
    name: '工作温度',
    unit: '°C'
  },
  {
    key: 'heatingTemperature',
    name: '加热温度',
    unit: '°C'
  },
  {
    key: 'voltage',
    name: '流量',
    unit: 'V'
  },
  {
    key: 'totalTime',
    name: '累计时间',
    unit: 'h'
  },
  {
    key: 'waterUsage',
    name: '用水量',
    unit: 'm³'
  },

  
]

export const deviceType = [
  { label: '全部设备', value: '' },
  { label: '运行中', value: 1, type: 'status', },
  { label: '离线', value: 2, type: 'status' },
  { label: '需保养', value: 1, type: 'warnFlag' },
  { label: '故障', value: 1, type: 'repairFlag' },
]


