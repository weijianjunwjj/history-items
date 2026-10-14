$(function () {
  const { createApp } = Vue

  createApp({
    data() {
      return {
        mobileHeaderMenus: [],
        // 是否是展开状态
        show: false,
        // 定义一级目录展开状态
        menusShow: null,
        // 定义二级目录展开状态
        dropsShow: null,
        // 滚动条是否滚动
        isScrollYMove: false,
        // 定义三级目录数据
        threeMenus: [],
        showMall: false,
        urlOfParamsMap: {
          products: (url, id) => {
            this.getCarProductByCid(url, id)
          },
          'life-products': (url, id) => {
            this.getCarLifeByCid(url, id)
          }
          // technologies: (url, id) => {
          //   this.getTechnologiesByCid(url, id)
          // }
        },
        imgLogo: ''
      }
    },
    // 监听面包屑状态 改变body的overflow
    watch: {
      show(newVal) {
        if (newVal) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = 'visible'
          this.menusShow = null
          this.dropsShow = null
        }
      },
      deep: true
    },
    created() {
      this.init()
    },
    mounted() {
      window.addEventListener('scroll', this.changeIsScrollYMove)
    },

    beforeUnmount() {
      window.removeEventListener('scroll', this.changeIsScrollYMove)
    },
    methods: {
      handleEnterShopMall() {
        this.showMall = true
      },
      handleOutShopMall() {
        this.showMall = false
      },
      // 前往全部车型
      handleGoAllModels() {
        window.location.href = '/mob/all-models'
      },
      // 前往对应页面
      jump(item) {
        if (item.attributes.aboutYadeaUrl) {
          window.location.href = `/mob${item.attributes.aboutYadeaUrl}`
        }
        if (item.attributes.supportUrl) {
          window.location.href = `/mob${item.attributes.supportUrl}`
        }
        if (item.attributes.url) {
          window.location.href = `/mob${item.attributes.url}`
        }
        if (item.attributes.model_static) {
          item.attributes.model_static ? (window.location.href = item.attributes.model_static) : (window.location.href = '#')
        }
        // show.value = false
      },
      // 前往详情页
      handleGoCarDetail(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      },
      getHeaderMenusFormat($sourceMenus) {
        try {
          const apiList = [
            'product-categories',
            'life-categories',
            'technology-categories',
            'purchase-supports',
            'service-supports',
            'about-yadeas'
          ]

          const menus = $sourceMenus.map((item, index) => {
            const { name, api } = item.attributes
            return {
              id: item.id,
              name: name,
              api: apiList[index],
              apis: this.transRestful(api)
            }
          })
          return menus
        } catch (error) {
          console.error(error)
        }
      },
      replaceImgUrl(url) {
        return url ? url.replace('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/', 'https://osswebsite.yadea.com.cn/') : ''
      },
      transRestful(rest) {
        rest = rest.replace('api::', '')
        rest = rest.split('.')[0]
        if (rest.charAt(rest.length - 1) === 'y') {
          rest = rest.slice(0, -1) + 'ies'
        } else {
          rest = rest + 's'
        }
        return rest
      },
      // 获取指定id骑行产品
      getCarProductByCid(itemId, subItemId) {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        const flag = menuList.find(item => {
          return (
            item.id === itemId &&
            item.category.find(subItem => {
              return subItem.id === subItemId && subItem.children
            })
          )
        })
        if (!flag) {
          $.ajax(`${url}products`, {
            type: 'GET',
            dataType: 'json',
            data: {
              filters: {
                categoryId: subItemId
              },
              populate: {
                colorModule: {
                  populate: ['pic']
                },
                picUrl: '*',
                partsPic1: '*',
                partsPic2: '*',
                partsPic3: '*'
              },
              encodeValuesOnly: true // prettify URL
            },
            success: ({ data }) => {
              menuList.map(menuItem => {
                menuItem.id === itemId &&
                  menuItem.category.map(subItem => {
                    if (subItem.id === subItemId) {
                      subItem.children = data
                    }
                  })
              })
              this.mobileHeaderMenus = menuList
              window.sessionStorage.setItem('menuList', JSON.stringify(menuList))
              this.dropsShow = subItemId
            },
            error: res => {
              console.log(res)
            }
          })
        } else {
          this.dropsShow = subItemId
        }
      },
      // 获取指定id的骑行生活
      getCarLifeByCid(itemId, subItemId) {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        const flag = menuList.find(item => {
          return (
            item.id === itemId &&
            item.category.find(subItem => {
              return subItem.id === subItemId && subItem.children
            })
          )
        })
        if (!flag) {
          $.ajax(`${url}life-products`, {
            type: 'GET',
            dataType: 'json',
            data: {
              filters: {
                lifeCategory: subItemId
              },
              populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3'],
              encodeValuesOnly: true // prettify URL
            },
            success: ({ data }) => {
              menuList.map(menuItem => {
                menuItem.id === itemId &&
                  menuItem.category.map(subItem => {
                    if (subItem.id === subItemId) {
                      subItem.children = data
                    }
                  })
              })
              this.mobileHeaderMenus = menuList
              window.sessionStorage.setItem('menuList', JSON.stringify(menuList))
              this.dropsShow = subItemId
            },
            error: err => {
              console.log(err)
            }
          })
        } else {
          this.dropsShow = subItemId
        }
      },
      // 获取指定id的骑行科技
      getTechnologiesByCid(itemId, subItemId) {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        const flag = menuList.find(item => {
          return (
            item.id === itemId &&
            item.category.find(subItem => {
              return subItem.id === subItemId && subItem.children
            })
          )
        })
        if (!flag) {
          $.ajax(`${url}technologies`, {
            type: 'GET',
            dataType: 'json',
            data: {
              filters: {
                category: subItemId
              },
              populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3'],
              encodeValuesOnly: true // prettify URL
            },
            success: ({ data }) => {
              menuList.map(menuItem => {
                menuItem.id === itemId &&
                  menuItem.category.map(subItem => {
                    if (subItem.id === subItemId) {
                      subItem.children = data
                    }
                  })
              })
              this.mobileHeaderMenus = menuList
              window.sessionStorage.setItem('menuList', JSON.stringify(menuList))
              this.dropsShow = subItemId
            },
            error: res => {
              console.log(res)
            }
          })
        } else {
          this.dropsShow = subItemId
        }
      },
      // 点击面包屑
      handleShowDropDown() {
        this.show = !this.show
      },
      // 监听滚动条是否滚动超过50 改变isScrollYMove
      changeIsScrollYMove() {
        window.scrollY >= 50 ? (this.isScrollYMove = true) : (this.isScrollYMove = false)
      },
      // 点击展开一级目录按钮
      handleOpenMenuItems(id) {
        if (this.menusShow !== null && this.menusShow === id) {
          this.menusShow = null
          this.dropsShow = null
          this.threeMenus = []
        } else {
          this.menusShow = id
          this.dropsShow = null
        }
      },
      // 点击展开二级目录按钮
      async handleOpenDropItems(url, itemId, subItemId) {
        if (this.dropsShow !== null && this.dropsShow === subItemId) {
          this.dropsShow = null
          this.threeMenus = []
        } else {
          try {
            this.urlOfParamsMap[url](itemId, subItemId)
          } catch (error) {
            console.log(error)
          }
        }
      },
      getVal(data, mod, key) {
        return data[0].attributes[mod].data[0].attributes[key]
      },
      // 获取数据
      init() {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        $.ajax(`${url}homepage-headers?populate=*`, {
          type: 'GET',
          dataType: 'json',
          success: ({ data: headersData }) => {
            if (headersData) {
              this.imgLogo = this.getVal(headersData, 'logo', 'url')
            }
          },
          error: err => {
            console.log(err)
          }
        })
        if (!menuList) {
          $.ajax(`${url}header-menus`, {
            type: 'GET',
            dataType: 'json',
            success: ({ data }) => {
              let fetchSourceMenus = data
              fetchSourceMenus = this.getHeaderMenusFormat(fetchSourceMenus)
              fetchSourceMenus.forEach(item => {
                item.category = []
                $.ajax(`${url}${item.api}`, {
                  type: 'GET',
                  dataType: 'json',
                  success: ({ data }) => {
                    data.forEach(subItem => {
                      item.category.push({ name: subItem.attributes.name, id: subItem.id, ...subItem })
                    })
                    this.mobileHeaderMenus = fetchSourceMenus
                    window.sessionStorage.setItem('menuList', JSON.stringify(this.mobileHeaderMenus))
                  },
                  error: err => {
                    console.log(err)
                  }
                })
              })
            },
            error: err => {
              console.log(err)
            }
          })
        } else {
          this.mobileHeaderMenus = menuList
        }
      }
    }
  }).mount('#app')
})
