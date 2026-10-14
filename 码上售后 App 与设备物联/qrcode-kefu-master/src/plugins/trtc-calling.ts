import TRTCCalling from 'trtc-calling-js'
import tim from './tim'

const options = {
  SDKAppID: (window as any)?.genTestUserSig('')?.SDKAppID, // 接入时需要将0替换为您的云通信应用的 SDKAppID
  tim,
}

const trtcCalling = new TRTCCalling(options)
// 4 无日志级别
trtcCalling.setLogLevel(4)

export default trtcCalling
