/*
 * @Author: weijianjun
 * @Date: 2023-01-13 13:37:44
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 19:54:41
 * @FilePath: \website\middleware\checkDevice.global.ts
 * @Description: 全局路由-中间件
 *
 */
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import qs from 'qs'

export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to)
  console.log('to.name :>> ', to.name)
  const path0: string = to.path
  if (!to.name && !path0.endsWith('.html')) {
    return navigateTo('/error/404/')
  }

  const ops = { ...to.query, ...to.params }
  const query = `?` + qs.stringify(ops)

  const headers = useRequestHeaders()
  const name = String(to.name)
  let serverUserAgent = ''
  if (process.client) {
    serverUserAgent = navigator?.userAgent || ''
  } else {
    serverUserAgent = headers['user-agent'] || ''
  }
  const isMobilePath = name === 'index-mob' || name.startsWith('index-mob-')
  const isPCPath = !isMobilePath
  // console.log('isMobilePath :>> ', isMobilePath)
  const getIsMobile = (ua: string) => {
    return !!ua.match(/AppleWebKit.*Mobile.*/)
  }
  const isMobile = getIsMobile(serverUserAgent)
  // console.log('isMobile :>> ', isMobile)
  const isPC = !getIsMobile(serverUserAgent)

  if (isMobile) {
    setPageLayout('mobile')
  } else {
    setPageLayout('default')
  }
  if (!to.redirectedFrom) {
    let path = path0
    if (isMobile && isPCPath) {
      // 加上/mob 前缀
      path = '/mob' + path0
      // path = path.replaceAll('//', '/')
      return navigateTo(path + query)
    } else if (isPC && isMobilePath) {
      let path = path0
      // 去掉/mob 前缀
      const path1 = path
      path = path.replace('/mob', '/')
      path = path.replaceAll('//', '/')
      return navigateTo(path + query)
    } else {
      // 正常情况
      return navigateTo(path + query)
    }
  }
})
