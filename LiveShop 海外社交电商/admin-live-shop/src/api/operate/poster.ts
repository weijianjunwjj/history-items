import { get, post } from "@/http/request"

export const getList = (params: any) => get("Advertisement/index", params)

export const putOn = (id: number) => post("Advertisement/putOn", { id })
export const takeOff = (id: number) => post("Advertisement/takeOff", { id })

export const config = (params: any) => post(`Advertisement/${params.id ? 'edit' : 'add'}`, params)

export const del = (id: any) => post("Advertisement/del", { id })


