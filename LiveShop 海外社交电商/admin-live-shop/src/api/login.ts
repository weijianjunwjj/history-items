import {post, get} from "@/http/request"

export const login = (params: any) => post("Base/login", params, {hint: true})
export const logout = (id: any) => post("User/logout",{id})

export const userInfo = () => get("BasePrivate/userData")
export const getDictSn = (dictSn: any) => get("Dictionary/getDictSn", {dictSn})

export const getCaptcha = () => post("Base/captcha")
