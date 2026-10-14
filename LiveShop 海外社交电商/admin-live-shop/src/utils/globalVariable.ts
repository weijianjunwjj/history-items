/* eslint-disable no-unused-vars */
/* eslint-disable no-control-regex */


function myLib() {

  const getMatched = (parentArr, childrenArr) => {
    let target = []
    parentArr.forEach((v) => {
      if (childrenArr.includes(v)) {
        target.push(v)
      }
    })

    return target
  }
  const getCusName = (customizedCustomerList, cusAgencyId) => {
    const target = customizedCustomerList.find((_) => _.dictValue.includes(cusAgencyId))
    return target?.remark
  }


  const isEmptyObj = (val) => JSON.stringify(val) === '{}'

  const isEmptyArr = (val) => JSON.stringify(val) === '[]'

  const isEmpty = (val) => [undefined, null, ''].some((item) => item === val) || isEmptyObj(val) || isEmptyArr(val)

  const noEmpty = (val) => [undefined, null, ''].every((item) => item !== val) && !isEmptyObj(val) && !isEmptyArr(val)

  const defined = (val) => ![undefined, null].includes(val)

  const noEmptys = (...rest) => rest.every((item) => noEmpty(item))

  const zero = (val) => {
    return [undefined, null, '', 0, '0'].includes(val)
  }
  /**
   * @description: 数据类型的检测的方式
   * @param {any} data 要检测数据类型的变量
   * @param {string} type 具体的类型名称【小写】
   */
  const is = (type, data) => {
    return (
      Object.prototype.toString
        .call(data)
        .replace(/\[object (\w+)\]/, '$1')
        .toLowerCase() === type
    )
  }
  const type = (data) => {
    return Object.prototype.toString
      .call(data)
      .replace(/\[object (\w+)\]/, '$1')
      .toLowerCase()
  }
  const $$ = (str = '') => {
    if (str.charAt(0) == '#') {
      return document.getElementById(str.substring(1))
    } else if (str.charAt(0) == '.') {
      const classnode = document.getElementsByClassName(str.substring(1))
      return classnode.length > 1 ? classnode : classnode.length === 1 ? classnode[0] : null
    } else {
      const classnode = document.getElementsByName(str)
      return classnode.length > 1 ? classnode : classnode.length === 1 ? classnode[0] : null
    }
  }
  const allEqual = (arr) => arr.every((val) => val === arr[0])
  const allKeyEqual = (arr, key) => arr.every((val) => val[key] === arr[0][key])
  const elementContains = (parent, child) => parent !== child && parent.contains(child)

  const sortClass = (sortData = [{}], key = '') => {
    const groupBy = (array, f) => {
      let groups = {}
      array.forEach((o) => {
        let group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      return Object.keys(groups).map((group) => {
        return groups[group]
      })
    }
    const sorted = groupBy(sortData, (item) => {
      return item[key] // 返回需要分组的对象
    })
    return sorted
  }

  /**
   *  @description:   归档，对一维json数组进行归档（根据key）
   *  @param {Array}  arr:一维数组
   *  @param {String} key：key字符串
   */
  const sort = function (arr, key) {
    // @ts-ignore
    return [...new Set(arr.map((i) => i[key]))].reduce((p, c) => [...p, arr.filter((i) => i[key] === c)], [])
  }

  const unique_obj_arr = (arr, key) => {
    const res = new Map()
    return arr.filter((arr) => !res.has(arr[key]) && res.set(arr[key], 1))
  }

  const unique = (arr) => Array.from(new Set(arr))

  const flatten = (arr) => {
    while (arr.some((item) => Array.isArray(item))) {
      arr = [].concat(...arr)
    }
    return unique(arr)
  }

  const limitStr = (strval, strnum) => {
    let re = ''

    strval = strval || ''

    const strleng = strval.length
    // 返回字符串的总字节数
    const byteleng = strval.replace(/[^\x00-\xff]/g, '**').length

    if (byteleng <= strnum) return strval
    for (let i = 0, bytenum = 0; i < strleng; i++) {
      const byte = strval.charAt(i)

      if (/[\x00-\xff]/.test(byte)) {
        bytenum++ // 单字节字符累加1
      } else {
        bytenum += 2 // 非单字节字符累加2
      }
      if (bytenum <= strnum) {
        re += byte
      } else {
        return re
      }
    }
  }
  const strLen = (sString) => {
    var j = 0
    var s = sString
    if (s == '') return j
    for (var i = 0; i < s.length; i++) {
      if (s.substr(i, 1).charCodeAt(0) > 255) j = j + 2
      else j++
    }
    return j
  }

  const del = (arrylist, id) => {
    if (is('array', arrylist)) {
      const idx = arrylist.findIndex((item) => item.id === id)
      arrylist.splice(idx, 1)
    } else {
    }
  }

  const resetData = (self) => {
    setTimeout(() => {
      Object.assign(self.$data, self.$options.data())
    }, 300)
  }

  const toFixed = (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed)

  const sum = (params) => {
    if (is('array', params)) {
      return params.reduce((pre, curr) => Number(pre) + Number(curr))
    } else {
      return Object.values(params).reduce((pre, curr) => Number(pre) + Number(curr))
    }
  }
  function includes(arr1, arr2) {
    return arr1.every((val) => arr2.includes(val))
  }
  /**
   * @description: 仿jq的find方法，寻找到符合条件的单个dom
   */
  // ~~~推荐使用findDom
  const findDom = (parent, label) => {
    const find = (_parent, _label) => {
      for (let i = 0; i < _parent.children.length; i++) {
        const item = _parent.children[i]
        const classList = Array.from(item.classList)
        const id = item.id.toLowerCase()
        const tagName = item.tagName.toLowerCase()

        if (classList.includes(_label) || [id, tagName].includes(_label)) {
          // 注意：只有使用for循环 return 才有效
          return item
        }
        find(item, _label)
      }
    }

    return find(parent, label)
  }

  /**
   * @description: 仿vue的watch方法，当传入的数组有值时，执行callback
   */
  const watchVal = (that, name, callback) => {
    // count记录回调了多少次
    let count = 0

    const watchItem = () => {
      const item = that[name]
      if (item.length) {
        callback()
      } else {
        count++
        setTimeout(() => {
          watchItem()
        })
      }
    }
    watchItem()
  }

  const debounce = function (fn, interval) {
    var timerId = null

    return function () {
      var args = [].slice.call(arguments, 0)
      var context = this
      clearTimeout(timerId)
      timerId = setTimeout(function () {
        fn.apply(context, args)
      }, interval)
    }
  }

  const clearObj = (obj) => {
    for (const key in obj) {
      obj[key] = undefined
    }
  }

  function delNullAttrObj(list) {
    list.forEach((obj, idx1) => {
      Object.keys(obj).forEach((item) => {
        if (isEmpty(obj[item])) {
          delete list[idx1]
        }
      })
    })

    return list.filter(Boolean)
  }

  const allFuncs = {
    // 值
    // 方法
    delNullAttrObj,
    clearObj,
    defined,
    debounce,
    type,
    watchVal,
    findDom,
    includes,
    zero,
    sum,
    getMatched,
    resetData,
    del,
    strLen,
    limitStr,
    isEmpty,
    noEmpty,
    noEmptys,
    is,
    allEqual,
    allKeyEqual,
    elementContains,
    sortClass,
    sort,
    $$,
    unique_obj_arr,
    unique,
    flatten,
  }

  return allFuncs
}


const $g = myLib()


export default $g
