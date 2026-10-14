/* eslint-disable prettier/prettier */
/*
 * @Author: weijianjun
 * @Date: 2023-01-04 14:35:58
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 19:44:35
 * @FilePath: \yadea-website\api\static\menuApi.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'

export default new (class menu extends Http {
  /**
   * 获取指定的骑行产品
   */
  getCarProductByCid(categoryId: string) {
    return this.get(`/json/product-${categoryId}.json`)
  }
  /**
   * 获取全部的骑行产品
   */
  getCarProducts() {
    return this.get(`/api/product.json`)
  }
  /**
   * 获取骑行产品的全部类别
   */
  getCarProCategories() {
    return this.get(`/api/product-category.json`)
  }

  /**
   * 获取指定的骑行生活
   */
  getCarLifeByCid(lifeCategory: string) {
    return this.get(`/json/lifeProduct-${lifeCategory}.json`)
  }

  /**
   * 获取指定的骑行科技
   */
  getTechnologiesByCid(category: string) {
    return this.get(`/json/technology-${category}.json`)
  }
  /**
   * 获取头部菜单列表
   */
  getHeaderMenus() {
    return this.get(`/json/header-menu.json`)
  }
  /**
   * 获取骑行生活类别
   */
  getLifeCategories() {
    return this.get(`/json/life-category.json`)
  }
})()
