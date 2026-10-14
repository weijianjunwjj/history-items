/*
 * @Author: weijianjun
 * @Date: 2023-03-06 14:09:08
 * @LastEditors: miaoyuxuan
 * @LastEditTime: 2023-03-09 14:02:58
 * @FilePath: /yadea-website/api/homePageApi.ts
 * @Description:
 *
 */

import Http from '~~/composables/http'
import qs from 'qs'

export default new (class homePage extends Http {
  /**
   * 获取年份事件列表
   */
  getList() {
    const query = qs.stringify(
      {
        populate: {
          modular: {
            populate: [
              'swiper.media',
              'swiper1.media',
              'swiper1.coverPicture',
              'swiper2.media',
              'category',
              'pictureModule.pic',
              'pictureModule2.pic',
              'doublePictureModule.pic',
              'doublePictureModule2.pic',
              'pictureModule3.midPic'
            ]
          },
          homepageSeo: '*'
        }
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )

    return this.get(`/api/homepage-models?${query}`)
  }
  getMobList() {
    const query = qs.stringify(
      {
        populate: {
          modular: {
            populate: [
              'swiper.media',
              'swiper.mobilePic',
              'swiper.mobileVideo',
              'swiper1.media',
              'swiper1.mobilePic',
              'swiper1.mobileVideo',
              'swiper1.mobileCoverPicture',
              'swiper2.media',
              'swiper2.mobilePic',
              'swiper2.mobileVideo',
              'category',
              'pictureModule.pic',
              'pictureModule2.pic',
              'pictureModule3.midPic',
              'pictureModule3.mobileMidPic',
              'doublePictureModule.pic',
              'doublePictureModule2.pic'
            ]
          },
          homepageSeo: '*'
        }
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )

    return this.get(`/api/homepage-models?${query}`)
  }
})()
