/* eslint-disable prettier/prettier */
/*
 * @Author: weijianjun
 * @Date: 2023-01-04 14:35:58
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 10:11:49
 * @FilePath: \yadea-website\api\menuApi.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'
import { transRestful } from '~~/composables/common'
import qs from 'qs'

export default new (class menu extends Http {
  /**
   * 获取指定的骑行产品
   */
  getCarProductByCid(categoryId: string) {
    const query = qs.stringify(
      {
        filters: {
          categoryId
        },
        populate: {
          colorModule: {
            populate: ['pic']
          },
          vehicleVersion: {
            populate: {
              vehicleTechnology: '*',
              vehicleParameters: '*',
              vehicleSmartTechnology: '*',
              vehicleColor: {
                populate: ['pic']
              }
            }
          },
          picUrl: '*',
          partsPic1: '*',
          partsPic2: '*',
          partsPic3: '*',
        }
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )

    return this.get(`/api/products?${query}`)
  }
  /**
   * 获取全部的骑行产品
   */
  getCarProducts(categoryId:number) {
    const query = qs.stringify(
      {
        filters: {
          categoryId
        },
        populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3']
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )
    

    return this.get(`/api/products?${query}`)
  }
  /**
   * 获取骑行产品的全部类别
   */
  getCarProCategories() {
    const query = qs.stringify(
      {
        populate: '*'
      },

      {
        encodeValuesOnly: true // prettify URL
      }
    )
    return this.get(`/api/product-categories?${query}`)
  }

  /**
   * 获取指定的骑行生活
   */
  getCarLifeByCid(lifeCategory: string) {
    const query = qs.stringify(
      {
        filters: {
          lifeCategory
        },
        populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3']
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )

    return this.get(`/api/life-products?${query}`)
  }

  /**
   * 获取指定的骑行科技
   */
  getTechnologiesByCid(category: string) {
    const query = qs.stringify(
      {
        filters: {
          category
        },
        populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3']
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )

    return this.get(`/api/technologies?${query}`)
  }
  /**
   * 获取头部菜单列表
   */
  getHeaderMenus() {
    return this.get(`/api/header-menus`)
  }
  /**
   * 获取冠能系列的第二层系列
   */
  getSubCategories() {
    return this.get(`/api/product-sub-categories`)
  }
  /**
   * 获取骑行生活类别
   */
  getLifeCategories() {
    return this.get(`/api/life-categories?test=6666666666`)
  }
})()
