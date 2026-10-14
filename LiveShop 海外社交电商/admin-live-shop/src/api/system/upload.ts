
import { post } from "@/http/request"

export const uploadFile = (params: any,config) => post("BasePrivate/uploadFile", params, config)

