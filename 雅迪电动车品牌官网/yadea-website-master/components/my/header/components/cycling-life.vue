<!--
 * @Author: weijianjun
 * @Date: 2023-02-04 15:27:32
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-06 15:38:11
 * @FilePath: \website\components\my\header\components\cycling-life.vue
 * @Description: 骑行生活
 * 
-->

<template>
  <div class="cycling-life">
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
      <client-only>
        <a-row v-for="(row, index) of myList" :key="index" :gutter="[40, 16]">
          <a-col v-for="(col, index2) of row" :key="index2" :span="6" @click="handleGoCarDetail(col.model_static)">
            <div class="cycling-life-list-item flex-col just-center pt-3 plr-3 pos-rel">
              <!-- <div v-if="col.licensingPolicy" class="driving-license flex align-center">
                <SvgIcon name="drive" size="16" />
                <span class="ml-1 fs-16">需驾照</span>
              </div> -->
              <img class="car-img" :src="replaceImgUrl(col.bgImg)" alt="" />
              <div class="mt-2 fs-18-vw fw-500 txt-c">{{ col.name }}</div>
              <div class="fs-14-vw mb-3 txt-c">{{ col.desc1 }}</div>
            </div>
          </a-col>
        </a-row>
      </client-only>
    </div>

    <!-- <div class="cycling-life-btns">
      <MyButton class-name="fs-16-vw fs-max-18 border-box mr-8" type="border" shape="" size="big" @click="goAllModels">全部甄选</MyButton>
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

const handleGoCarDetail = url => {
  if (process.client) {
    url ? (window.location.href = url) : (window.location.href = '#')
  }
}

const { menuApi } = useApi()
const cyclingLifeSeries = ref([])

const myList = ref([])

const activeId = ref()

const onMouseEnterMenu = async function (item) {
  const { id } = item
  updateMenu(id)
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

menuApi
  .getLifeCategories()
  .then(async ({ data }) => {
    const lifeCategories = data.value
    console.log('lifeCategories', lifeCategories)
    cyclingLifeSeries.value = lifeCategories.data.map(item => {
      const {
        id,
        attributes: { name }
      } = item

      return {
        name,
        id
      }
    })
    const firstId = cyclingLifeSeries.value[0].id
    updateMenu(firstId)
    // 存入store
    const { useAppStore } = store
    const appStore = useAppStore()
    appStore.saveData({ cyclingLifeSeries: cyclingLifeSeries.value })
  })
  .catch(err => {
    onErr()
    console.error(err)
  })

async function updateMenu(cid) {
  try {
    activeId.value = cid
    let { data: hoverData } = await menuApi.getCarLifeByCid(cid)
    hoverData = hoverData.value
    console.log('hoverData', hoverData)
    hoverData = hoverData.data.map(item => {
      const attributes = item.attributes
      const data = attributes?.picUrl?.data
      return {
        ...attributes,
        bgImg: data ? data[0].attributes.url : null
      }
    })

    myList.value = sort(hoverData)
    props.updateHeight()
  } catch (err) {
    onErr()
    console.error(err)
  }
}
</script>

<style lang="less">
.cycling-life {
  padding-top: 20px !important;
  width: 1400pxvw;
  margin: 0 auto;
  // padding: 0 calc((100% - 1434pxvw) / 2);
  // .cycling-life-series-item > div {

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
  &-list {
    &-item {
      cursor: pointer;
      &:hover {
        background: #f8f8f8;
        // cursor: red;
        .driving-license {
          opacity: 1;
        }
      }
      .car-img {
        display: inline-block;
        // width: 268pxvw;
        height: 218pxvw;
        object-fit: cover;
        object-position: center;
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
