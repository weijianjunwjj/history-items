function myLib() {
  const watchVal = (item: any, fn: () => void) => {
    if (item.value.length) {
      fn()
    } else {
      setTimeout(() => {
        watchVal(item, fn)
      })
    }
  }

  /**
   * @description: 数据类型的检测的方式
   * @param {any} data 要检测数据类型的变量
   * @param {string} type 具体的类型名称【小写】
   */
  const is = (type: string, data: any) => {
    return (
      Object.prototype.toString
        .call(data)
        .replace(/\[object (\w+)\]/, '$1')
        .toLowerCase() === type
    )
  }

  const none = (val: any) => {
    const isNone = (_val: any) => [null, undefined].includes(_val)
    if (is('array', val)) {
      return val.some((item: any) => isNone(item))
    }
    return isNone(val)
  }

  return {
    watchVal,
    is,
    none,
  }
}

export default myLib()
