const defaultIcon =
  'https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiJ03Z83SS.png'

const WorkOrder = `https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiKs8uiBg8.png`
const repairRecord = `https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiKnE9U47U.png`
const studyVideo = `https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiKmmbpFbM.png`
const devicePaper = `https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiKrorij5c.png`
const commonProlem = `https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiKpPEYmv2.png`
const talkService = `https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiKpAE5gXY.png`

const array = [
  {
    id: '填维修工单',
    url: '/pages/repair/index',
    text: '填维修工单',
    desc: '需拍摄图片/视频提交录音等',
    icon1: WorkOrder,
    icon2: defaultIcon,
    enabled: true,
  },
  {
    id: '查报修记录',
    url: '/pages/record/index',
    text: '查报修记录',
    desc: '记录每一次报修熟知设备情况',
    icon1: repairRecord,
    icon2: defaultIcon,
    enabled: true,
  },
  {
    id: '学教学视频',
    url: '/pages/knowledge/index',
    text: '学教学视频',
    desc: '查看设备使用、维护视频',
    icon1: studyVideo,
    icon2: defaultIcon,
    enabled: true,
  },
  {
    id: '看设备图纸',
    url: '/pages/drawings/index',
    text: '看设备图纸',
    desc: '查设备相关技术参数、文件等',
    icon1: devicePaper,
    icon2: defaultIcon,
    enabled: true,
  },
  {
    id: '解决常见问题',
    url: '/pages/problems/index',
    text: '解决常见问题',
    desc: '设备常见问题解决方法',
    icon1: commonProlem,
    icon2: defaultIcon,
    enabled: true,
  },
  // {
  //   id: '评价报修服务',
  //   text: '评价报修服务',
  //   desc: '写下您的宝贵意见',
  //   icon1: talkService,
  //   icon2: defaultIcon,
  //   enabled: false,
  // },
]

export default array
