export class BiMap {
  map: Map<any, any>
  inverseMap: Map<any, any>

  constructor(map: Map<any, any>, inverseMap: Map<any, any>) {
    this.map = map
    this.inverseMap = inverseMap
  }

  // 用于创建新的 BiMap，传入一个对象自动循环映射
  static createFromObject(obj: Record<any, any>) {
    const map = new Map()
    const inverseMap = new Map()

    for (const [key, value] of Object.entries(obj)) {
      map.set(key, value)
      inverseMap.set(value, key)
    }

    return new BiMap(map, inverseMap)
  }

  // 获取 map 和 inverseMap 的总大小
  get size() {
    return this.map.size
  }

  // 设置新值并保持双向映射
  set(key: any, value: any) {
    const oldValue = this.map.get(key)
    this.inverseMap.delete(oldValue)
    this.map.set(key, value)
    this.inverseMap.set(value, key)
    return this
  }

  // 获取 key 或 value，双向查找
  get(key: any) {
    return this.map.get(key) || this.inverseMap.get(key) || null
  }

  // 检查是否存在 key
  has(key: any) {
    return this.map.has(key) || this.inverseMap.has(key)
  }

  // 反转映射
  inverse() {
    return new BiMap(this.inverseMap, this.map)
  }

  // 清除所有映射
  clear() {
    this.map.clear()
    this.inverseMap.clear()
  }

  // 删除某个键及其对应的值
  delete(key: any) {
    const value = this.map.get(key)
    const deleted = this.map.delete(key)
    const inverseDeleted = this.inverseMap.delete(value)
    return deleted || inverseDeleted
  }

  // 迭代器
  *[Symbol.iterator]() {
    yield* this.map
  }
}

// // 使用示例
// const TYPE_MAP = BiMap.createFromObject({
//   0: '衣服',
//   1: '裤子',
//   2: '鞋子'
// })

// console.log('正向:', TYPE_MAP.get(0)) // 正向: 衣服
// console.log('逆向:', TYPE_MAP.inverse().get('衣服')) // 逆向: 0
