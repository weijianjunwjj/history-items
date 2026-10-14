import { get, post } from "../request"



export default {
  myDevices: params => get(`/iot/myDevices`, { params }),
  getDevice: (deviceId) => get(`/iot/getDevice/${deviceId}`),
  getDataRecord: params => get(`/iot/device/data-record`, { params }),
  getDataRecordById: id => get(`/iot/device/data-record/${id}`),
  deviceMessageRecord: params => get(`/iot/deviceMessageRecord/list`, { params }),
  deviceChildUsers: deviceId => get(`/iot/device/rel/child/user/${deviceId}`),
  addSharePhone: (data) => post(`/iot/device/share/add/${data.userPhone}`, [data]),
  readMessage: params => get(`/iot/deviceMessageRecord/readMessage/${params.id}`, { userId: params.userId }),
  readAllMessage: () => get(`/iot/deviceMessageRecord/readAllMessage`),
  getMess: params => get(`/iot/get/message/${params.deviceId}`, { userId: params.userId }),
  updateDeviceName: (p) => post(`/iot/deviceName/custom/update/${p.id}?customName=${p.customName}`),



}