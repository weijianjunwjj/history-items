$(function () {
  const { createApp } = Vue
  createApp({
    data() {
      return {
        footerMenuList: [],
        threeMenus: [],
        footerModalIndex: null,
        urlOfParamsMap: {
          products: detail => {
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
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      footerModalEnter(index) {
        this.footerModalIndex = index
      },
      footerModalOut() {
        this.footerModalIndex = null
      },
      // 前往车型详情页
      handleGoCarDetail(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      },
      // 展开子菜单
      handleOpenSubMenu(detail, api) {
        this.threeMenus = []
        if (detail.show) {
          detail.show = false
        } else {
          this.footerMenuList.forEach(item => {
            item.category.forEach(subItem => {
              if (subItem.id !== detail.id) {
                subItem.show = false
              }
            })
            item.children &&
              item.children.category.forEach(subItem => {
                if (subItem.id !== detail.id) {
                  subItem.show = false
                }
              })
          })
          try {
            if (detail.children) {
              this.threeMenus = detail.children
            } else {
              this.urlOfParamsMap[api](detail)
            }
          } catch (error) {}
          detail.show = true
        }
      },
      jump(item) {
        if (item.attributes.aboutYadeaUrl) {
          window.location.href = item.attributes.aboutYadeaUrl
        }
        if (item.attributes.supportUrl) {
          window.location.href = item.attributes.supportUrl
        }
        if (item.attributes.url) {
          window.location.href = item.attributes.url
        }
        if (item.attributes.model_static) {
          window.location.href = item.attributes.model_static
        }
      },
      // 前往预约骑行
      goBookingRide() {
        window.location.href = '/booking-ride'
      },
      // 前往车型对比
      goModelContrast() {
        window.location.href = `/model-contrast`
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
                  async: false,
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
              this.footerMenuList[2].categoryTitle = this.footerMenuList[1]
              this.footerMenuList.splice(1, 1)
            },
            error: err => {
              console.log(err)
            }
          })
        } else {
          this.footerMenuList = menuList
          // this.footerMenuList[2].categoryTitle = this.footerMenuList[1]
          // this.footerMenuList.splice(1, 1)
        }
      }
    }
  }).mount('#footerPc')
})
