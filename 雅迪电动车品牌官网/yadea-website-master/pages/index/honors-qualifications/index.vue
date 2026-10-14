<!--
 * @Author: weijianjun
 * @Date: 2023-01-28 10:53:44
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-08 11:11:20
 * @FilePath: \website\pages\index\honors-qualifications\index.vue
 * @Description: 荣誉资质
 * 
-->

<template>
  <div class="page-honors-qualifications">
    <div class="header"></div>

    <main class="flex">
      <div class="main-left" @mouseenter="handleMouseOver" @mouseleave="handleMouseOut">
        <div class="custom-pagination">
          <template v-for="(item, index) in list" :key="item.id">
            <div
              class="custom-pagination-item"
              :class="swiperActiveIndex === index && 'custom-pagination-active'"
              @click="handleClickIndex(index)"
            >
              {{ item.key }}
            </div>
          </template>
        </div>
      </div>
      <div class="main-right">
        <swiper
          class="my-swiper m0"
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          direction="vertical"
          :mousewheel="false"
          :pagination="{
            clickable: true
          }"
          @slide-change="onSwiperChange"
          @swiper="onSwiper"
        >
          <swiper-slide v-for="(item, index) of list" :key="index">
            <ul class="my-ul">
              <li v-for="(item2, index2) of item.value" :key="index2">
                <p>{{ item2.content }}</p>
              </li>
            </ul>
          </swiper-slide>
        </swiper>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Mousewheel } from 'swiper'
import { delay } from '@/configs/data'
import _ from 'lodash'
import 'swiper/css'
import 'swiper/less/navigation'

useHead({
  meta: [
    { name: 'keywords', content: '雅迪获奖,雅迪荣誉资质' },
    {
      name: 'description',
      content: '雅迪致力于打磨每一个产品,先后获得德国红点奖,中国制造业企业500强等大量奖项,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const modules = [Pagination, Mousewheel]
let curSwiper = null
const swiperActiveIndex = $ref(0)

const onSwiper = swiper => {
  curSwiper = swiper
}

const handleClickIndex = index => {
  curSwiper.slideTo(index)
  swiperActiveIndex = index
}

const onSwiperChange = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex = realIndex
}, 50)

// 鼠标滚轮事件
const mousewheel = e => {
  // 考虑兼容性
  let evt = e || window.event
  if (evt.deltaY > 0) {
    // 在火狐中 向下滚动是3 谷歌是125
    curSwiper.slideNext()
  } else {
    curSwiper.slidePrev()
    // 在火狐中 向上滚动是-3 谷歌是-125
  }
}

// 鼠标进入左部分
const handleMouseOver = () => {
  setBodyOverflow('hidden')
  if (process.client) {
    window.addEventListener('wheel', mousewheel)
  }
}

// 鼠标出左部分
const handleMouseOut = () => {
  setBodyOverflow('overlay')
  window.removeEventListener('wheel', mousewheel)
}

const { honorsApi } = useApi()
const list = $ref([])
const init = async () => {
  try {
    const { data } = await honorsApi.getList()
    watchVal(data, () => {
      let $list = data?.value?.data ? fList(data.value.data) : []
      $list = $list ? sortClass($list, 'year') : []
      list = $list
    })
  } catch (error) {
    console.log(error)
  }
}
init()
</script>

<style lang="less">
.page-honors-qualifications {
  margin-top: @layout-header-height;
  .header {
    background: url(https://osswebsite.yadea.com.cn/Group_534_2_05a5f2cd32_e48d7f4491.png?updated_at=2023-03-16T01:56:26.297Z) no-repeat;
    background-size: cover;
    .h(420);
  }

  .content-h {
    height: 1200pxvw;
  }

  .my-swiper {
    width: calc(100vw - 420pxvw);
    .content-h;
    .swiper-pagination-vertical {
      display: none !important;
    }
    .swiper-wrapper {
      .pl(170);
      .pt(94);
    }
    .my-ul {
      width: 600pxvw;
      li {
        .fs(20);
        // font-family: Source Han Sans SC-Regular, Source Han Sans SC;
        font-weight: 400;
        list-style-type: disc;
        .mb(30);
        &::marker {
          font-size: 5pxvw;
        }
      }
    }
  }

  .custom-pagination {
    .w(420);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border-right: 1px solid #e9e9e9;
    .pt(94);
    .pb(33);
    .content-h;

    &-item {
      .w(70);
      box-sizing: content-box;
      .pr(90);
      .mtb(15);
      .fs(24);
      font-family: DINPro-Bold;
      font-weight: bold;
      cursor: pointer;
    }

    .custom-pagination-active {
      position: relative;
      .fs(32);
      font-family: DINPro-Bold;
      font-weight: bold;
      color: #ff5f00;

      &::after {
        content: '';
        width: 4px;
        height: 18px;
        background: #ff5f00;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto 0;
      }
    }
  }
}
</style>
