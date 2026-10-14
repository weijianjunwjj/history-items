/*
 * @Author: weijianjun
 * @Date: 2022-12-23 14:29:58
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-13 13:41:02
 * @FilePath: \yadea-website\composables\store.ts
 * @Description: 全局页面动态数据-存储仓库
 *
 */
import useAppStore from '@/store/modules/app'
import useHomePageStore from '@/store/modules/home-page'
import useIsSafari from '@/store/modules/is-safari'
import useMobileData from '@/store/modules/mobile-data'
import useAllModelsStore from '@/store/modules/all-models'

export const store = { useAppStore, useHomePageStore, useIsSafari, useMobileData, useAllModelsStore }
