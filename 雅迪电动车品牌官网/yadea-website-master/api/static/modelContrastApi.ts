/*
 * @Author: weijianjun
 * @Date: 2023-02-22 13:54:15
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-02 16:46:02
 * @FilePath: \yadea-website\api\modelContrastApi.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'
import qs from 'qs'

export default new (class grey extends Http {
  /**
   * 获取车辆产品
   */
  getProducts(categoryId: number) {
    console.log('categoryId222 :>> ', categoryId)
    const query = qs.stringify(
      {
        filters: {
          categoryId
        },
        populate: ['picUrl']
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )
    return this.get(`/api/products?${query}`)
  }

  // 获取车辆类别
  getProductsCategory() {
    return this.get(`/api/product-categories`)
  }

  // 查询单一车辆详情
  getProduct(id: number) {
    const query = qs.stringify(
      {
        populate: {
          colorModule: {
            populate: ['pic']
          },
          picUrl: '*',
          backgroundPic: '*',
          parameters1: '*',
          parameters2: '*',
          parameters3: '*'
        }
        // populate: ['picUrl', 'parameters1', 'parameters2', 'parameters3', 'colorModule']
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )
    return this.get(`/api/products/${id}?${query}`)
  }
})()
