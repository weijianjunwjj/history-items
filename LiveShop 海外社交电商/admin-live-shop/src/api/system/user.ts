import { get, post } from "@/http/request"

export const getList = (params: any) => post("User/index", params)

export const getGroups = (params: any) => post("Auth/index", params)

export const changeStatus = (status: number, id: number) => get("User/changeStatus", { status, id })

export const config = (params: any) => post(`User/${params.id ? 'edit' : 'add'}`, params)

export const del = (id: any) => get("User/del", { id })

export const own = (data: any) => post("BasePrivate/userEditData", data)

