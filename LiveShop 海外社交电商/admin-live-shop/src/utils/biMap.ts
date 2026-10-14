export class BiMap {
  map: any
  inverseMap: any
  constructor(map, inverseMap) {
    this.map = map
    this.inverseMap = inverseMap
  }

  static create() {
    return new BiMap(new Map(), new Map())
  }

  get size() {
    return this.map.size
  }

  set(key, value) {
    const oldValue = this.map.get(key)
    this.inverseMap.delete(oldValue)
    this.map.set(key, value)
    this.inverseMap.set(value, key)
    return this
  }

  sets(list) {
    list.forEach(([key, value]) => {
      const oldValue = this.map.get(key)
      this.inverseMap.delete(oldValue)
      this.map.set(key, value)
      this.inverseMap.set(value, key)
    })
    return this
  }

  clear() {
    this.map.clear()
    this.inverseMap.clear()
  }

  delete(key) {
    const value = this.map.get(key)
    const deleted = this.map.delete(key)
    const inverseDeleted = this.inverseMap.delete(value)

    return deleted || inverseDeleted
  }

  entries() {
    return this.map.entries()
  }

  get(key) {
    if (this.map.has(key)) {
      return this.map.get(key)
    } else if (this.inverseMap.has(key)) {
      return this.inverseMap.get(key)
    } else {
      return null
    }
  }

  has(key) {
    return this.map.has(key)
  }

  keys() {
    return this.map.keys()
  }

  inverse() {
    return new BiMap(this.inverseMap, this.map)
  }

  values() {
    return this.inverseMap.keys()
  }

  *[Symbol.iterator]() {
    yield* this.map
  }
}
