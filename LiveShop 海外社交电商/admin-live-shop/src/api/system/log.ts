import { get, post } from "@/http/request"

export const getList = (params: any) => post("Log/index", params)

export const del = (id: number) => get("Log/del", { id })

