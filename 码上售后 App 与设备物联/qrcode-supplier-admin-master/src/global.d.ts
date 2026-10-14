
export {} // 这个必须有，将文件转化为模块

declare global {
  interface Window {
    $app: any
    tim: any
    TIM: any
    trtcCalling: any
    TRTCCalling: any
    $env: any
    SITE_CONFIG: any
  },

}
