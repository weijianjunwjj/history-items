$(function () {
  // 详情页菜单数据
  const $menuList = []

  const { createApp } = Vue
  // 骑行产品组件
  const cyclingProducts = {
    // template模板 书写页面结构。类似于之前的html  模板只能有一个根组件(标签)
    template: `
      <div class="cycling-products">
        <div class="cycling-products-series flex just-sb align-center">
          <div class="flex">
            <div v-for="(item, index) of cyclingProductsSeries" :key="item.id" class="cycling-products-series-item flex align-center">
              <div
                class="fs-16-vw cur-point fs-max-16 series-no-active"
                :class="item.id === activeId && 'series-active'"
                @mouseenter="onMouseEnterMenu(item)"
              >
                {{ item.name }}
              </div>
              <div v-if="index !== cyclingProductsSeries.length - 1" class="mlr-5-vw">|</div>
            </div>
          </div>
        </div>
        <div class="btns-box">
          <div class="btns-box-div" @click="goModelContrast">
            <img src="/car-detail/assets/images/svg/contrast-small.svg" alt="" />
            <span>车型对比</span>
          </div>
          <div class="btns-box-div" @click="goAllModels">
            <img src="/car-detail/assets/images/svg/all-model.svg" alt="" />
            <span>全部车型</span>
          </div>
        </div>
    
        <div class="cycling-products-list mt-8">
          <div class="ant-row" style="margin-left: -20px; margin-right: -20px; row-gap: 16px;">
            <div class="ant-col ant-col-6" v-for="(col, index2) of myList" :key="index2" style="padding-left: 20px; padding-right: 20px;">
              <div class="cycling-products-list-item flex-col just-center pt-3 plr-3 pos-rel" @click="handleGoCarDetail(col.attributes.model_static)">
                <div v-if="false" class="driving-license flex align-center">
                  <img src="../assets/images/svg/drive.svg" alt="" />
                  <span class="ml-1 fs-16-vw">需驾照</span>
                </div>
                <img class="car-img" :src="replaceImgUrl(col.attributes.picUrl.data[0].attributes.url)" alt="" />
                <div class="mt-2 fs-18-vw fw-500 txt-c">{{ col.attributes.name }}</div>
                <div v-if="col.attributes.desc1" class="fs-14-vw opt65 mb-3 txt-c">{{ col.attributes.desc1 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        cyclingProductsSeries: [],
        myList: [],
        activeId: null
      }
    },
    props: {
      updateHeight: {
        type: Function,
        default: () => {}
      },
      hideMask: {
        type: Function,
        default: () => {}
      }
    },
    created() {
      this.getCyclingProductsSeries()
    },
    methods: {
      // 获取分类信息
      getCyclingProductsSeries() {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        if (!menuList) {
          this.getMenuList()
        } else {
          try {
            if (
              menuList.find(item => {
                return item.api === 'product-categories' && item.category
              })
            ) {
              const item = menuList.find(item => {
                return item.api === 'product-categories' && item.category
              })
              this.cyclingProductsSeries = item.category
              if (item.category[0]) {
                const firstId = item.category[1].id
                this.updateMenu(firstId)
              }
            } else {
              this.getMenuList()
            }
          } catch (err) {}
        }
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
      getMenuList() {
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
                  window.sessionStorage.setItem('menuList', JSON.stringify(fetchSourceMenus))
                  this.getCyclingProductsSeries()
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
      },
      replaceImgUrl(url) {
        return url ? url.replace('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/', 'https://osswebsite.yadea.com.cn/') : ''
      },
      onMouseEnterMenu(item) {
        const { id } = item
        this.updateMenu(id)
      },
      goAllModels() {
        window.location.href = '/all-models'
        this.hideMask()
      },
      // 前往车型对比
      goModelContrast() {
        window.location.href = '/model-contrast'
        this.hideMask()
      },
      // 前往车型详情页
      handleGoCarDetail(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      },
      // 获取指定id骑行产品
      getCarProductByCid(cid) {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        const flag = menuList.find(item => {
          return (
            item.api === 'product-categories' &&
            item.category.find(subItem => {
              return subItem.id === cid && subItem.children
            })
          )
        })
        if (!flag) {
          $.ajax(`${url}products`, {
            type: 'GET',
            dataType: 'json',
            data: {
              filters: {
                categoryId: cid
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
                menuItem.api === 'product-categories' &&
                  menuItem.category.map(subItem => {
                    if (subItem.id === cid) {
                      subItem.children = data
                    }
                  })
              })
              window.sessionStorage.setItem('menuList', JSON.stringify(menuList))
              this.myList = data
              setTimeout(() => {
                this.updateHeight()
              }, 100)
            },
            error: res => {
              console.log(res)
            }
          })
        } else {
          const item = flag.category.find(item => {
            return item.id === cid
          })
          this.myList = item.children
          setTimeout(() => {
            this.updateHeight()
          }, 100)
        }
      },
      async updateMenu(cid) {
        try {
          this.activeId = cid
          this.getCarProductByCid(cid)
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
  // 骑行生活组件
  const cyclingLife = {
    template: `<div class="cycling-life">
        <div class="cycling-life-series flex just-sb align-center">
          <div class="flex">
            <div v-for="(item, index) of cyclingLifeSeries" :key="item.id" class="cycling-life-series-item flex align-center">
              <div
                class="fs-16-vw cur-point fs-max-16 series-no-active"
                :class="item.id === activeId && 'series-active'"
                @mouseenter="onMouseEnterMenu(item)"
              >
                {{ item.name }}
              </div>
              <div v-if="index !== cyclingLifeSeries.length - 1" class="mlr-5-vw">|</div>
            </div>
          </div>
        </div>
        <div class="cycling-life-list mt-8">
            <div class="ant-row" style="margin-left: -20px; margin-right: -20px; row-gap: 16px;">
              <div class="ant-col ant-col-6" v-for="(col, index2) of myList" :key="index2" style="padding-left: 20px; padding-right: 20px;" @click="handleGoCarDetail(col.attributes.model_static)">
                <div class="cycling-life-list-item flex-col just-center pt-3 plr-3 pos-rel">
                  <div v-if="col.attributes.licensingPolicy" class="driving-license flex align-center">
                    <SvgIcon name="drive" size="16" />
                    <span class="ml-1 fs-16">需驾照</span>
                  </div>
                  <img class="car-img" :src="replaceImgUrl(col.attributes.picUrl.data[0].attributes.url)" alt="" />
                  <div class="mt-2 fs-18-vw fw-500 txt-c">{{ col.attributes.name }}</div>
                  <div class="fs-14-vw opt65 mb-3 txt-c">{{ col.attributes.desc1 }}</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    `,
    data() {
      return {
        myList: [],
        activeId: null,
        cyclingLifeSeries: []
      }
    },
    props: {
      updateHeight: {
        type: Function,
        default: () => {}
      },
      hideMask: {
        type: Function,
        default: () => {}
      }
    },
    created() {
      this.getCyclingLifeSeries()
    },
    methods: {
      getCyclingLifeSeries() {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        if (!menuList) {
          this.getMenuList()
        } else {
          if (
            menuList.find(item => {
              return item.api === 'life-categories' && item.category
            })
          ) {
            const item = menuList.find(item => {
              return item.api === 'life-categories' && item.category
            })
            this.cyclingLifeSeries = item.category
            if (item.category[0]) {
              const firstId = item.category[0].id
              this.updateMenu(firstId)
            }
          } else {
            this.getMenuList()
          }
        }
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
      getMenuList() {
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
                  window.sessionStorage.setItem('menuList', JSON.stringify(fetchSourceMenus))
                  this.getCyclingLifeSeries()
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
      },
      replaceImgUrl(url) {
        return url ? url.replace('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/', 'https://osswebsite.yadea.com.cn/') : ''
      },
      // 前往骑行生活详情页
      handleGoCarDetail(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      },
      goAllModels() {
        window.location.href = 'all-models'
        this.hideMask()
      },
      onMouseEnterMenu(item) {
        const { id } = item
        this.updateMenu(id)
      },
      // 获取指定id骑行生活
      getCarLifeByCid(cid) {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        const flag = menuList.find(item => {
          return (
            item.api === 'life-categories' &&
            item.category.find(subItem => {
              return subItem.id === cid && subItem.children
            })
          )
        })
        if (!flag) {
          $.ajax(`${url}life-products`, {
            type: 'GET',
            dataType: 'json',
            data: {
              filters: {
                lifeCategory: cid
              },
              populate: ['picUrl', 'partsPic1', 'partsPic2', 'partsPic3'],
              encodeValuesOnly: true // prettify URL
            },
            success: ({ data }) => {
              menuList.map(menuItem => {
                menuItem.api === 'life-categories' &&
                  menuItem.category.map(subItem => {
                    if (subItem.id === cid) {
                      subItem.children = data
                    }
                  })
              })
              window.sessionStorage.setItem('menuList', JSON.stringify(menuList))
              this.myList = data
            },
            error: res => {
              console.log(res)
            }
          })
        } else {
          const item = flag.category.find(item => {
            return item.id === cid
          })
          this.myList = item.children
        }
      },
      async updateMenu(cid) {
        try {
          this.activeId = cid
          this.getCarLifeByCid(cid)
          this.updateHeight()
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
  // 骑行科技组件
  const cyclingTechnology = {
    template: `
      <div class="cycling-technology">
        <section class="fs-16-vw fs-max-16 cycling-technology-box pt-4">
          <div
            v-for="(item, index) in technologiesSeries"
            :key="item.id"
            class=" cycling-technology-title"
          >
            <span @click="handleGoCarDetail(item.attributes.model_static)">{{ item.name }}</span>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        left: 0,
        subMenus: [],
        technologiesSeries: [],
        titleWidth: 0,
        subMenusArr: []
      }
    },
    props: {
      index: {
        type: Number,
        default: 0
      },
      updateHeight: {
        type: Function,
        default: () => {}
      },
      hideMask: {
        type: Function,
        default: () => {}
      }
    },
    watch: {
      technologiesSeries(newValue) {
        if (newValue.length) {
          this.updateHeight()
        }
      },
      immediate: true,
      deep: true
    },
    mounted() {
      this.callback()
      window.addEventListener('resize', this.callback)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.callback)
    },
    created() {
      this.getTechnologiesSeries()
    },
    methods: {
      getTechnologiesSeries() {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        if (!menuList) {
          this.getMenuList()
        } else {
          if (
            menuList.find(item => {
              return item.api === 'technology-categories' && item.category
            })
          ) {
            const item = menuList.find(item => {
              return item.api === 'technology-categories' && item.category
            })
            this.technologiesSeries = item.category
            // if (item.category[0]) {
            //   this.getTechnologiesByCid(item.category[0].id)
            // }
          } else {
            this.getMenuList()
          }
        }
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
      getMenuList() {
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
                  window.sessionStorage.setItem('menuList', JSON.stringify(fetchSourceMenus))
                  this.getTechnologiesSeries()
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
      },
      // 前往车型详情页
      handleGoCarDetail(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      },
      getVW(vw) {
        if (document) {
          return (vw / 1920) * document.body.clientWidth
        } else {
          return 0
        }
      },
      callback() {
        const dom = document.querySelector('.header-menu-item-2')
        const doms = document.querySelectorAll('.cycling-technology-title')
        if (dom && doms.length) {
          const width = dom.offsetWidth
          const offsetLeft = dom.getBoundingClientRect().left
          this.left = offsetLeft + 'px'
          this.titleWidth = width + 'px'
          document.querySelector('.cycling-technology-box').style.left = offsetLeft + width / 2 + 'px'
          document.querySelector('.cycling-technology-box').style.transform = 'translateX(-50%)'
        } else {
          setTimeout(() => {
            this.callback()
          }, 0)
        }
      },
      handleMouseEnter(item) {
        setTimeout(() => {
          item.showSub = true
        }, 100)
      }
    }
  }
  // 购买支持
  const buySupport = {
    template: `
      <div ref="myRef" class="buy-support">
        <section class="fs-16-vw buy-support-items fs-max-16 pt-4 txt-c">
          <div v-for="(item, index) of menus" :key="index" class="buy-support-item" @click="onClick(item.attributes.url)">
            <a>{{ item.name }}</a>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        left: 0,
        menus: []
      }
    },
    watch: {
      menus(newVal) {
        if (newVal.length) {
          this.updateHeight()
        }
      },
      immediate: true,
      deep: true
    },
    props: {
      index: {
        type: Number,
        default: 0
      },
      updateHeight: {
        type: Function,
        default: () => {}
      },
      hideMask: {
        type: Function,
        default: () => {}
      }
    },
    mounted() {
      this.callback()
      window.addEventListener('resize', this.callback)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.callback)
    },
    created() {
      this.getBuySupportSeries()
    },
    methods: {
      getBuySupportSeries() {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        if (!menuList) {
          this.getMenuList()
        } else {
          if (
            menuList.find(item => {
              return item.api === 'purchase-supports' && item.category
            })
          ) {
            const item = menuList.find(item => {
              return item.api === 'purchase-supports' && item.category
            })
            this.menus = item.category
          } else {
            this.getMenuList()
          }
        }
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
      getMenuList() {
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
                  window.sessionStorage.setItem('menuList', JSON.stringify(fetchSourceMenus))
                  this.getBuySupportSeries()
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
      },
      callback() {
        const dom = document.querySelector('.header-menu-item-3')
        if (dom) {
          const width = dom.offsetWidth
          const offsetLeft = dom.getBoundingClientRect().left
          this.left = offsetLeft + 'px'
          document.querySelector('.buy-support-items').style.left = offsetLeft + width / 2 + 'px'
          document.querySelector('.buy-support-items').style.transform = 'translateX(-50%)'
        } else {
          setTimeout(() => {
            this.callback()
          }, 0)
        }
      },
      // 前往详情页
      onClick(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      }
    }
  }
  // 服务支持
  const serviceSupport = {
    template: `
      <div class="service-support">
        <section class="fs-16-vw fs-max-16 pt-4 service-support-items  txt-c">
          <div v-for="(item, index) of menus" :key="index" class="service-support-item" @click="onClick(item.attributes.supportUrl)">
            <a>{{ item.name }}</a>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        left: 0,
        menus: []
      }
    },
    watch: {
      menus(newVal) {
        if (newVal.length) {
          this.updateHeight()
        }
      },
      immediate: true,
      deep: true
    },
    props: {
      index: {
        type: Number,
        default: 0
      },
      updateHeight: {
        type: Function,
        default: () => {}
      },
      hideMask: {
        type: Function,
        default: () => {}
      }
    },
    mounted() {
      this.callback()
      window.addEventListener('resize', this.callback)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.callback)
    },
    created() {
      this.getServiceSupportSeries()
    },
    methods: {
      getServiceSupportSeries() {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        if (!menuList) {
          this.getMenuList()
        } else {
          if (
            menuList.find(item => {
              return item.api === 'service-supports' && item.category
            })
          ) {
            const item = menuList.find(item => {
              return item.api === 'service-supports' && item.category
            })
            this.menus = item.category
          } else {
            this.getMenuList()
          }
        }
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
      getMenuList() {
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
                  window.sessionStorage.setItem('menuList', JSON.stringify(fetchSourceMenus))
                  this.getServiceSupportSeries()
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
      },
      callback() {
        const dom = document.querySelector('.header-menu-item-4')
        if (dom) {
          const width = dom.offsetWidth
          const offsetLeft = dom.getBoundingClientRect().left
          this.left = offsetLeft + 'px'
          document.querySelector('.service-support-items').style.left = offsetLeft + width / 2 + 'px'
          document.querySelector('.service-support-items').style.transform = 'translateX(-50%)'
        } else {
          setTimeout(() => {
            this.callback()
          }, 0)
        }
      },
      // 前往详情页
      onClick(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      }
    }
  }
  // 关于雅迪
  const aboutYadea = {
    template: `
      <div class="about-yadea">
        <section class="fs-16-vw fs-max-16 pt-4 about-yadea-items txt-c">
          <div v-for="(item, index) of menus" :key="index" class="about-yadea-item" @click="onClick(item.attributes.aboutYadeaUrl)">
            <a>{{ item.name }}</a>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        left: 0,
        menus: []
      }
    },
    watch: {
      menus(newVal) {
        if (newVal.length) {
          this.updateHeight()
        }
      },
      immediate: true,
      deep: true
    },
    props: {
      index: {
        type: Number,
        default: 0
      },
      updateHeight: {
        type: Function,
        default: () => {}
      },
      hideMask: {
        type: Function,
        default: () => {}
      }
    },
    mounted() {
      this.callback()
      window.addEventListener('resize', this.callback)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.callback)
    },
    created() {
      this.getAboutYadeaSeries()
    },
    methods: {
      getAboutYadeaSeries() {
        const menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
        if (!menuList) {
          this.getMenuList()
        } else {
          if (
            menuList.find(item => {
              return item.api === 'about-yadeas' && item.category
            })
          ) {
            const item = menuList.find(item => {
              return item.api === 'about-yadeas' && item.category
            })
            this.menus = item.category
          } else {
            this.getMenuList()
          }
        }
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
      getMenuList() {
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
                  window.sessionStorage.setItem('menuList', JSON.stringify(fetchSourceMenus))
                  this.getAboutYadeaSeries()
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
      },
      callback() {
        const dom = document.querySelector('.header-menu-item-5')
        if (dom) {
          const width = dom.offsetWidth
          const offsetLeft = dom.getBoundingClientRect().left
          this.left = offsetLeft + 'px'
          document.querySelector('.about-yadea-items').style.left = offsetLeft + width / 2 + 'px'
          document.querySelector('.about-yadea-items').style.transform = 'translateX(-50%)'
        } else {
          setTimeout(() => {
            this.callback()
          }, 0)
        }
      },
      // 前往详情页
      onClick(url) {
        url ? (window.location.href = url) : (window.location.href = '#')
      }
    }
  }
  createApp({
    components: {
      // 占位符:组件
      'cycling-products': cyclingProducts,
      'cycling-life': cyclingLife,
      'cycling-technology': cyclingTechnology,
      'buy-support': buySupport,
      'service-support': serviceSupport,
      'about-yadea': aboutYadea
    },
    data() {
      return {
        imgLogo: '',
        maskHeight: '',
        activeIndex: 0,
        // lastActiveIndex: null,
        isMove: false,
        isShowMask: false,
        isHomePage: true,
        scrollTo: 0,
        isShowHeader: true,
        menus: [],
        showMall: false
      }
    },
    // watch: {
    //   activeIndex(newVal) {
    //     this.lastActiveIndex = newVal
    //   }
    // },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    },
    created() {
      this.init()
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleEnterShopMall() {
        this.showMall = true
      },
      handleOutShopMall() {
        this.showMall = false
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
      setBodyOverflow(style) {
        document.body.style.overflow = style
      },
      replaceImgUrl(url) {
        return url ? url.replace('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/', 'https://osswebsite.yadea.com.cn/') : ''
      },
      async updateHeight() {
        this.$nextTick(() => {
          if (this.$refs.maskRefs) {
            const plus = this.activeIndex > 1 ? 0 : 66
            document.querySelector('.page-header-mask-content').style.height = this.$refs.maskRefs.clientHeight + plus + 'px'
          }
        })
      },
      mouseOutMenu(item, index) {
        this.hideMask()
      },
      mouseOverMask() {
        this.isShowMask = true
        this.isMove = true
        // this.activeIndex = this.lastActiveIndex
        this.updateHeight()
        this.setBodyOverflow('hidden')
      },
      clearHeight() {
        this.maskHeight = '0px'
      },
      async hideMask() {
        this.isShowMask = false
        this.isMove = this.scrollTo !== 0
        this.clearHeight()
        this.setBodyOverflow('overlay')
      },
      mouseOverMenu(item, index) {
        this.isShowMask = true
        this.activeIndex = index
        this.isMove = true
        this.updateHeight()
        this.setBodyOverflow('hidden')
      },
      mouseOutMask() {
        this.hideMask()
      },
      async init() {
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
                    this.menus = fetchSourceMenus
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
          this.menus = menuList
        }
      },
      getVal(data, mod, key) {
        return data[0].attributes[mod].data[0].attributes[key]
      },
      // js获取滚动条距离浏览器顶部,底部的高度,兼容ie和firefox
      getScrollTop() {
        let scrollTop = 0
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop
        } else if (document.body) {
          scrollTop = document.body.scrollTop
        }
        return scrollTop
      },
      handleScroll() {
        const top = this.getScrollTop()
        this.scrollTo = top
        if (top === 0) {
          this.isMove = false
        } else {
          this.isMove = true
        }
      }
    }
  }).mount('#headerPc')
})
