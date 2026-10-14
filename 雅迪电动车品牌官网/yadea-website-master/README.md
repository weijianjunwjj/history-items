<!--
 * @Author: weijianjun
 * @Date: 2022-12-13 10:00:59
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-06 09:25:04
 * @FilePath: \website\README.md
 * @Description:
 *
 -->

#yadea-website

css 的 pxvw 单位，会根据 postcss-px-to-viewport-8-plugin 将 pxvw 按照 1920 的比例转换为对应的 vw

客户端使用 useMyFetch || useFetch，需使用 watch 监听 data.value
服务端使用，则无需这些

function useFetch(
  url: string | Request | Ref<string | Request> | () => string | Request,
  options?: UseFetchOptions<DataT>
): Promise<AsyncData<DataT>>

type UseFetchOptions = {
  key?: string
  method?: string
  query?: SearchParams
  params?: SearchParams
  body?: RequestInit['body'] | Record<string, any>
  headers?: { key: string, value: string }[]
  baseURL?: string
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  default?: () => DataT
  transform?: (input: DataT) => DataT
  pick?: string[]
  watch?: WatchSource[]
}

type AsyncData<DataT> = {
  data: Ref<DataT>
  pending: Ref<boolean>
  refresh: (opts?: { dedupe?: boolean }) => Promise<void>
  execute: () => Promise<void>
  error: Ref<Error | boolean>
}


