/*
 * @Author: weijianjun
 * @Date: 2023-03-06 16:01:59
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 16:02:07
 * @FilePath: \yadea-website\global.d.ts
 * @Description:
 *
 */
export {} // 这个必须有，将文件转化为模块

declare global {
  interface Window {
    $isGenerate: boolean
  }
}
