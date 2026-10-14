<!--
 * @Author: weijianjun
 * @Date: 2022-12-27 13:42:41
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 21:22:14
 * @FilePath: \website\components\my\header\components\cycling-products.vue
 * @Description: 骑行产品内容
 * 
-->

<template>
  <div class="cycling-products">
    <div class="cycling-products-series flex just-sb align-center">
      <div class="flex">
        <div v-for="(item, index) of cyclingProductsSeries" :key="item.id" class="cycling-products-series-item flex align-center">
          <div
            class="fs-16-vw cur-point fs-max-16 series-no-active"
            :class="item.id === activeId && 'series-active'"
            @mouseenter="onMouseEnterMenu(item, index)"
          >
            {{ item.name }}
          </div>
          <div v-if="index !== cyclingProductsSeries.length - 1" class="mlr-5-vw">|</div>
        </div>
      </div>
    </div>
    <div class="btns-box">
      <div v-if="activeIndex === 1" class="btns-box-div" @click="goModelContrast">
        <SvgIcon name="contrast-small"></SvgIcon>
        <span>车型对比</span>
      </div>
      <div class="btns-box-div" @click="goAllModels">
        <SvgIcon name="all-model"></SvgIcon>
        <span>全部车型</span>
      </div>
    </div>

    <div class="cycling-products-list mt-8 mb-8">
      <!-- <client-only> -->
      <a-row v-for="(row, index) of myList" :key="index" :gutter="[40, 16]">
        <a-col v-for="(col, index2) of row" :key="index2" :span="6">
          <div class="cycling-products-list-item flex-col just-center pt-3 plr-3 pos-rel" @click="handleGoCarDetail(col.model_static)">
            <!-- <div v-if="col.licensingPolicy" class="driving-license flex align-center">
              <SvgIcon name="drive" size="16" />
              <span class="ml-1 fs-16-vw">需驾照</span>
            </div> -->
            <img class="car-img" :src="replaceImgUrl(col.bgImg)" alt="" />
            <div class="mt-2 mb-3 fw-500 txt-c car-name">{{ col.name }}</div>
            <div v-if="col.desc1" class="mb-3 opt65 txt-c car-desc">{{ col.desc1 }}</div>
          </div>
        </a-col>
      </a-row>
      <!-- </client-only> -->
    </div>

    <!-- <div class="cycling-products-btns">
      <MyButton class-name="fs-16-vw fs-max-18 border-box mr-8" type="border" shape="" size="big">
        <div @click="goAllModels">全部车型</div>
      </MyButton>
      <MyButton class-name="fs-16-vw fs-max-18 border-box" type="border" shape="" size="big">
        <div @click="goModelContrast">车型对比</div>
      </MyButton>
    </div> -->
  </div>
</template>

<script setup>
const props = defineProps({
  updateHeight: {
    type: Function,
    default: () => {}
  },
  hideMask: {
    type: Function,
    default: () => {}
  }
})

const { menuApi } = useApi()
const cyclingProductsSeries = ref([])
const mapping = $ref({})
const myList = ref([])

const activeId = ref()
const activeIndex = $ref(1)

const onMouseEnterMenu = async function (item, index) {
  const { id } = item
  // updateMenu(id)
  activeIndex = index
  activeId.value = id
  const target = mapping[id]
  myList.value = sort(target)
  await nextTick()
  setTimeout(() => {
    props.updateHeight()
  }, 50)
}

function sort(sourceList) {
  const list = []
  for (var i = 0; i < sourceList.length; i += 4) {
    list.push(sourceList.slice(i, i + 4))
  }
  return list
}

function goAllModels() {
  useRouter().push('/all-models')
  props.hideMask()
}

// 前往车型对比
const goModelContrast = () => {
  useRouter().push('/model-contrast')
  props.hideMask()
}

// 前往车型详情页
const handleGoCarDetail = url => {
  if (process.client) {
    url ? (window.location.href = url) : (window.location.href = '#')
  }
}

async function getAllData() {
  const allPromise = []
  cyclingProductsSeries.value.forEach(item => {
    allPromise.push(menuApi.getCarProductByCid(item.id))
  })

  const allRes = await Promise.all(allPromise)
  const callback = () => {
    if (allRes.every(item => item?.data?.value?.data)) {
      let allData = allRes.map((res, index) =>
        res?.data?.value?.data?.map(item => {
          const bgImg = item.attributes.picUrl.data.length ? item.attributes.picUrl.data[0].attributes.url : null
          return { ...item.attributes, bgImg, id: cyclingProductsSeries.value[index].id }
        })
      )
      allData.forEach(arr => {
        mapping[arr[0].id] = arr
      })
    } else {
      setTimeout(() => {
        callback()
      }, 0)
    }
  }

  callback()
}

menuApi
  .getCarProCategories()
  .then(async ({ data }) => {
    const carProCategories = data.value
    cyclingProductsSeries.value = carProCategories.data.map(item => {
      const {
        id,
        attributes: { name }
      } = item

      return {
        name,
        id
      }
    })
    const GNId = cyclingProductsSeries.value[1].id
    // console.log('cyclingProductsSeries.value :>> ', cyclingProductsSeries.value);
    getAllData()
    updateMenu(GNId)
    // 存入store
    const { useAppStore } = store
    const appStore = useAppStore()
    appStore.saveData({ carProCategories: cyclingProductsSeries.value })
  })
  .catch(err => {
    onErr()
    console.error(err)
  })

async function updateMenu(cid) {
  try {
    activeId.value = cid
    let { data: hoverData } = await menuApi.getCarProductByCid(cid)
    hoverData = hoverData.value
    hoverData = hoverData.data.map(item => {
      const attributes = item.attributes
      const data = attributes.picUrl.data
      return {
        ...attributes,
        bgImg: data ? data[0].attributes.url : null
      }
    })

    myList.value = sort(hoverData)
    await nextTick()
    setTimeout(() => {
      props.updateHeight()
    }, 50)
  } catch (err) {
    onErr()
    console.error(err)
  }
}
</script>

<style lang="less">
.cycling-products {
  padding-top: 20px !important;
  width: 1400pxvw;
  margin: 0 auto;
  // padding: 0 calc((100% - 1434pxvw) / 2);
  // .cycling-products-series-item > div {

  // }
  .series-no-active {
    font-weight: 400;
    opacity: 0.8;
  }

  .series-active {
    // font-weight: 500;
    opacity: 1 !important;
    color: @orange;
  }

  &-btns {
    margin-top: 50px;
  }

  .btns-box {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    color: #ff5f00;
    margin-top: 16pxvw;
    margin-right: 40pxvw;

    .btns-box-div {
      cursor: pointer;
      margin: 0 15pxvw;
      display: flex;
      align-items: center;
    }

    svg {
      width: 24pxvw;
      height: 24pxvw;
      color: #ff5f00;
      margin-right: 6pxvw;
    }
  }

  &-list {
    &-item {
      cursor: pointer;

      &:hover {
        background: #f8f8f8;

        // cursor: red;
        .driving-license {
          opacity: 1;

          .svg {
            width: 16pxvw;
            height: 16pxvw;
          }
        }
      }

      .car-img {
        display: inline-block;
        width: 100%;
        height: 218pxvw;
        object-fit: cover;
        object-position: center;
      }

      .car-name {
        .fs(18);
        // font-family: Source Han Sans SC-Normal, Source Han Sans SC;
        font-weight: 500;
        // height: 55pxvw;
        // overflow: hidden;
      }

      .car-desc {
        .fs(14);
        // font-family: Source Han Sans SC-Normal, Source Han Sans SC;
        font-weight: 100;
        // opacity: 0.65;
      }

      .driving-license {
        position: absolute;
        top: 17px;
        left: 17px;
        opacity: 0;
        transition: all 0.2s ease;
      }

      .fs-20-vw {
        margin-top: 2pxvw;
      }
    }
  }
}
</style>
