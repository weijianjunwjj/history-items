import { post } from "@/http/request"

export const getDetail = (date: any) => post("Statistic/detail", {date})



