let list = Array.from({ length: 15 }).map((item, index) => {
  return {
    id: index,
    sn: '1498497126920065024-1498903103861600258',
    deviceId: '1498917219934318593',
    deviceSn: 'TEST-100001',
    deviceName: '测试产品三',
    userId: '1519505680215670786',
    userPhone: '18352517082',
    state: 1,
    readState: 0,
    createTime: '2022-05-20 18:47:21',
    updateTime: '2022-05-20 18:47:57',
    tenantId: '1498497126920065024',
    kfUserId: '1519503120412135424',
    roomId: 76989458,
    finishTime: '2022-05-20 18:47:57',
    children: [
      {
        id: index,
        sn: '1498497126920065024-1498903103861600258',
        deviceId: '1498917219934318593',
        deviceSn: 'TEST-100001',
        deviceName: '测试产品三',
        userId: '1519505680215670786',
        userPhone: '18352517082',
        state: 1,
        readState: 0,
        createTime: '2022-05-20 18:47:21',
        updateTime: '2022-05-20 18:47:57',
        tenantId: '1498497126920065024',
        kfUserId: '1519503120412135424',
        roomId: 76989458,
        finishTime: '2022-05-20 18:47:57',
      },
    ],
  }
})

interface getListParams {
  page: number
  size: number
}

const time = 500

export function getList(params: getListParams) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const page = params.page || 1
      const size = params.size || 10
      const startIdx = (page - 1) * size
      const endIdx = page * size
      resolve({
        data: {
          list: list.slice(startIdx, endIdx),
          total: list.length,
        },
      })
    }, time)
  })
}
export function addList() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      list.push({
        ...list[list.length - 1],
        id: list.length,
      })
      resolve(list)
    }, time)
  })
}
export function delList(ids: number[] | string[]) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newList = list.filter((item) => {
        return !ids.includes(item.id)
      })
      list = newList
      resolve(list)
    }, time)
  })
}
