/*
 * @Author: weijianjun
 * @Date: 2023-03-01 18:55:24
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-02 13:42:27
 * @FilePath: \yadea-website\composables\commons.js
 * @Description:
 *
 */

import streets from '../configs/streets.json'
/**
 * @description: 给我区代码，给你所属街道数据
 */
export const getStreets = area => {
  return streets.filter(item => Number(item.areaCode) === Number(area)).flat()
}

export const invertKeyValues = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[obj[key]] = key
    return acc
  }, {})
