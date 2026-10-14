<!--
 * @Author: weijianjun
 * @Date: 2023-02-14 14:47:42
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-11 10:23:43
 * @FilePath: \website\pages\index\mob\news-information\index.vue
 * @Description: 新闻动态
 * 
-->
<template>
  <div class="m-page-news-information m-page-pt">
    <div class="news-information-mod1 pos-rel">
      <div class="txt-c text pos-middle-v ml-4-mvw">新闻动态</div>
    </div>

    <div class="news-information-list">
      <div v-for="(item, index) of newsList" :key="index" class="news-information-list-item" @click="handleNewsInfomationDetail(item.id)">
        <img :src="item.imgUrl" alt="" />
        <div class="title mb-1-mvw mt-2-mvw">
          {{ item.attributes.newsTitle }}
        </div>
        <div class="date">
          {{ item.attributes.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { name: 'keywords', content: '雅迪新闻,雅迪动态' },
    {
      name: 'description',
      content: '本页面为大家提供雅迪品牌最新的新闻和动态,便于大家进一步了解雅迪如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const { newsApi } = useApi()
const total = ref(0)
const page = $ref(1)
const pageSize = $ref(9)
const newsList = $ref([])
const router = useRouter()

// 前往新闻动态详情页
const handleNewsInfomationDetail = id => {
  router.push({
    path: '/news-detail',
    query: {
      id
    }
  })
  // url ? (window.location.href = url) : (window.location.href = '#')
}

const handleAddMore = () => {
  page++
  getNewsList()
}

// 获取新闻列表
const getNewsList = async () => {
  try {
    const { data } = await newsApi.getNews(page, pageSize)
    watch(
      () => data,
      newValue => {
        const newNewsList = newValue.value.data.map(item => {
          if (item.attributes.newPic.data) {
            return { ...item, imgUrl: item.attributes.newPic.data?.length ? item.attributes.newPic.data[0].attributes.url : '' }
          }
          return { ...item }
        })
        newsList.push(...newNewsList)
        total.value = newValue.value.meta.pagination.total
      },
      {
        deep: true,
        immediate: true
      }
    )
  } catch (error) {}
}

getNewsList()

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less" scoped>
.m-page-news-information {
  .news-information {
    &-mod1 {
      height: 220mpxvw;
      background: url(@/assets/images/mobile/news-info/bg1.png) no-repeat;
      background-size: contain;
      .text {
        font-size: 24px;
        font-weight: 500;
        color: #ffffff;
      }
    }
    &-list {
      .m-plr(20);
      .m-ptb(25);
      &-item {
        .m-pb(24);
        & > img {
          object-fit: cover;
          width: 335mpxvw;
          height: 240mpxvw;
          // max-width: 100%;
          // height: 240mpxvw;
        }
        .title {
          font-size: 13mpxvw;
          font-weight: 400;
        }
        .date {
          font-size: 11mpxvw;
          font-weight: 400;
          color: @date;
        }
      }
    }
  }
}
</style>
