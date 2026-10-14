$(function () {
  const { createApp } = Vue

  createApp({
    data() {
      return {
        footerShow: null,
        footerMenuList: [],
        urlOfParamsMap: {
          products: detail => {
            console.log(detail)
            $.ajax(`${url}products`, {
              type: 'GET',
              dataType: 'json',
              data: {
                filters: {
                  categoryId: detail.id
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
                detail.children = data
                this.threeMenus = data
                console.log(detail.children)
              },
              error: res => {
                console.log(res)
              }
            })
          },
          'life-products': detail => {
            $.ajax(`${url}life-products`, {
              type: 'GET',
              dataType: 'json',
              data: {
                filters: {
                  lifeCategory: detail.id
                },
                populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3'],
                encodeValuesOnly: true // prettify URL
              },
              success: ({ data }) => {
                detail.children = data
                this.threeMenus = data
              },
              error: res => {
                console.log(res)
              }
            })
          }
          // technologies: detail => {
          //   $.ajax(`${url}technologies`, {
          //     type: 'GET',
          //     dataType: 'json',
          //     data: {
          //       filters: {
          //         category: detail.id
          //       },
          //       populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3'],
          //       encodeValuesOnly: true // prettify URL
          //     },
          //     success: ({ data }) => {
          //       detail.children = data
          //       this.threeMenus = data
          //     },
          //     error: res => {
          //       console.log(res)
          //     }
          //   })
          // }
        },
        threeMenus: [],
        showWC: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      handleEnterWC() {
        this.showWC = true
      },
      handleLeaveWC() {
        this.showWC = false
      },
      // 前往详情页
      handleGoDetail(subItem) {
        if (subItem.attributes.aboutYadeaUrl) {
          window.location.href = `/mob${subItem.attributes.aboutYadeaUrl}`
        }
        if (subItem.attributes.supportUrl) {
          window.location.href = `/mob${subItem.attributes.supportUrl}`
        }
        if (subItem.attributes.url) {
          window.location.href = `/mob${subItem.attributes.url}`
        }
        if (subItem.attributes.model_static) {
          window.location.href = `${subItem.attributes.model_static}`
        }
      },
      // 返回顶部
      handleBackTop() {
        let timer = setInterval(() => {
          let ispeed = Math.floor(-window.scrollY / 7)
          document.documentElement.scrollTop = document.body.scrollTop = window.scrollY + ispeed
          if (window.scrollY <= 100) {
            clearInterval(timer)
            window.scrollTo(0, 0)
          }
        }, 10)
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
      // 前往车型详情页
      handleGoCarDetail(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      },
      // 点击打开连接按钮
      handleOpenLinkBox(id) {
        this.footerShow !== null && this.footerShow === id ? (this.footerShow = null) : (this.footerShow = id)
      },
      // 点击展开二级目录按钮
      async handleOpenDropItems(url, subItem) {
        threeMenus = []
        if (subItem.show) {
          subItem.show = false
        } else {
          this.footerMenuList.forEach(item => {
            item.category.forEach(subItem => {
              subItem.show = false
            })
          })
          try {
            if (subItem.children) {
              this.threeMenus = subItem.children
            } else {
              this.urlOfParamsMap[url](subItem)
            }
          } catch (error) {
            console.log(error)
          }
          subItem.show = true
        }
      },
      // 获取数据
      init() {
        const menuList = JSON.parse(window.sessionStorage.getItem('footerMenuList'))
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
                    this.footerMenuList = fetchSourceMenus
                    window.sessionStorage.setItem('footerMenuList', JSON.stringify(this.footerMenuList))
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
          this.footerMenuList = menuList
        }
      }
    }
  }).mount('#appFooter')
})
