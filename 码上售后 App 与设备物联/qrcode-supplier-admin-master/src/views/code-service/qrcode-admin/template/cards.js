import { urlToBase64 } from '@hx/packages/utils'
import repair from './assets/repair.png'
import record from './assets/record.png'
import guide from './assets/guide.png'
import drawing from './assets/drawing.png'
import problems from './assets/problems.png'
import instructions from './assets/instructions.png'

const array = [
  {
    id: '工单报修',
    text: '工单报修',
    desc: '提交报修工单',
    url: '/pages/repair/index',
    icon: repair,
    enabled: true,
  },
  {
    id: '报修记录',
    text: '报修记录',
    desc: '跟踪全部报修记录',
    url: '/pages/record/index',
    icon: record,
    enabled: true,
    showAdd: true,
  },
  {
    id: '使用指南',
    url: '/pages/knowledge/index',
    text: '使用指南',
    icon: guide,
    desc: '设备使用及维护教程',
    enabled: true,
  },
  {
    id: '设备图纸',
    text: '设备图纸',
    desc: '设备相关技术文件',
    icon: drawing,
    url: '/pages/drawings/index',
    enabled: true,
  },
  {
    id: '常见问题',
    text: '常见问题',
    desc: '常见问题模块',
    icon: '',
    url: '/pages/problems/index',
    enabled: true,
  },
  {
    id: '说明书',
    text: '说明书',
    desc: '说明书模块',
    icon: '',
    url: '/pages/instructions/index',
    enabled: false,
  },
]

const get_urlToBase64 = async () => {
  array[4].icon = await urlToBase64(problems)
  array[5].icon = await urlToBase64(instructions)
}

get_urlToBase64()

export default array
