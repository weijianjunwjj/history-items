import { locInfoRecord } from '@/service/index'
import { checkLocation } from '@/js_sdk/wa-permission/permission'
// 定义一个 ref 来存储位置数据
export const location = ref({
  latitude: null,
  longitude: null,
})

// 定义一个定时器，用于定时更新定位
let locationTimer = null
const interval = 15000 // 每 15 秒获取一次位置，可根据需求调整

function showAuthLocationModal() {
  uni.showModal({
    title: 'Tip',
    content: 'To get your location, go to Settings and authorize',
    showCancel: false,
    confirmText: 'setting',
    success: ({ confirm, cancel }) => {
      if (confirm) {
        // 打开设置页面

        uni.getSystemInfo({
          success: (sys) => {
            console.log('sys.platform', sys.platform)
            if (sys.platform == 'ios') {
              plus.runtime.openURL('app-settings://')
            } else {
              var main:any = plus.android.runtimeMainActivity()
              var Intent:any = plus.android.importClass('android.content.Intent')
              var Uri:any = plus.android.importClass('android.net.Uri') // 引入 Uri 类
              // 构造 URI 对象，指向当前应用的包名
              var uri = Uri.fromParts('package', main.getPackageName(), null)
              var intent = new Intent('android.settings.APPLICATION_DETAILS_SETTINGS')
              intent.setData(uri) // 设置跳转到应用详情页
              // 为 Intent 添加新任务标志，确保页面可以正确打开
              intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
              try {
                main.startActivity(intent) // 尝试打开应用权限管理页面
              } catch (e) {
                console.error('无法跳转到应用详情权限管理页面', e)
                uni.showModal({
                  title: 'Jump failure',
                  content:
                    "Can't open the application permission management page, please go to the settings manually.",
                  showCancel: false,
                })
              }
            }
          },
        })
      }
    },
  })
}

async function checkMyLocation(getLocation=()=>{}) {
  const checkLocationStatus = await checkLocation()
  const mapping = {
    1: '已获得授权',
    0: '未获得授权',
    '-1': '被永久拒绝权限',
  }
  const authTxt=mapping[checkLocationStatus]
  console.error('checkLocationStatus', checkLocationStatus)
  console.error('authTxt--------', authTxt)
  if (checkLocationStatus == -1) {
    showAuthLocationModal()
  }else{
    getLocation()
  }
}

export async function startLocationTracking() {
  const token = uni.getStorageSync('token')
  // 默认15秒更新一次,调用时立即执行一次
  if (locationTimer || !token) return // 避免重复启动

  const getLocation = () => {
    uni.getLocation({
      type: 'wgs84',
      success: async (res) => {
        const { latitude, longitude } = res
        location.value = {
          latitude,
          longitude,
        }
        // console.log('实时定位：', location.value)
        locInfoRecord([longitude, latitude])
      },
      fail: (err) => {
        console.error('定位失败：', err)
        checkMyLocation(getLocation)
        // stopLocationTracking()
      },
    })
  }
  checkMyLocation(getLocation)
  locationTimer = setInterval(getLocation, interval)
}

// 停止定位
export function stopLocationTracking() {
  console.log('locationTimer', locationTimer)
  if (locationTimer) {
    clearInterval(locationTimer)
    locationTimer = null
  }
}
