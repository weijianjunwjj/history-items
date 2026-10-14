/*
 * @Author: weijianjun
 * @Date: 2022-12-13 10:22:13
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-07 08:58:04
 * @FilePath: \yadea-website\utils\index.ts
 * @Description:
 *
 */

import { is } from '~~/composables/common'

export function isMobile(userAgent: string) {
  return !!userAgent.match(/AppleWebKit.*Mobile.*/)
}

export function getHeaderMenusFormat($sourceMenus: { data: { attributes: { name: string; api: string }; id: number }[] }) {
  try {
    let apiList: any[] = []

    const apiList0 = [
      '/api/product-categories',
      '/api/life-categories',
      '/api/technology-categories',
      '/api/purchase-supports',
      '/api/service-supports',
      '/api/about-yadeas'
    ]

    const apiListJSON = [
      '/json/product-category.json',
      '/json/life-category.json',
      '/json/technology-category.json',
      '/json/purchase-support.json',
      '/json/service-support.json',
      '/json/about-yadea.json'
    ]
    const {
      public: { isG }
    } = useRuntimeConfig()
    if (isG) {
      apiList = apiListJSON
    } else {
      apiList = apiList0
    }

    const menus = $sourceMenus.data.map((item: { attributes: { name: string; api: string }; id: number }, index) => {
      const { name, api } = item.attributes
      return {
        id: item.id,
        name: name,
        api: apiList[index],
        apis: '/' + transRestful(api)
      }
    })
    return menus
  } catch (error) {
    onErr(error)
    console.error(error)
  }
}
export function getMenuContent(menus: { id: number; name: string; api: string; apis: string }[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const allMenuContentPromise = menus.map((item: { api: string }) => {
        return myfetch(item.api)
      })
      let allMenuContent = await Promise.all(allMenuContentPromise)
      allMenuContent = allMenuContent.map(({ data }) => data.value)
      allMenuContent = allMenuContent.map(item => {
        const { data } = item
        return data.map((item2: { attributes: any; id: any }) => {
          return {
            ...item2.attributes,
            id: item2.id
          }
        })
      })
      menus.forEach((_item: any, idx: number) => {
        _item.content = allMenuContent[idx]
      })

      resolve(menus)
    } catch (error) {
      reject(error)
    }
  })
}
