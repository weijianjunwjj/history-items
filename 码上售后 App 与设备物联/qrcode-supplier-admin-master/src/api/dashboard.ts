// import axios from 'axios'
import { defaultRequest } from '@hx/packages/service/request'

export interface ContentDataRecord {
  x: string
  y: number
}

export function queryContentData() {
  return defaultRequest.get<ContentDataRecord[]>({ url: '/api/content-data' })
}

export interface PopularRecord {
  key: number
  clickNumber: string
  title: string
  increases: number
}

export function queryPopularList(params: { type: string }) {
  return defaultRequest.get<PopularRecord[]>({
    url: '/api/popular/list',
    params,
  })
}
