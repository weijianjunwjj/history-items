<!--
 * @Author: yqq
 * @Date: 2023-01-29 13:24:16
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 19:46:33
 * @FilePath: \website\pages\index\news-information\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="news-information-box">
    <div class="news-information-title fs-60-vw fw-bold">新闻动态</div>
    <main>
      <div class="news-information-items">
        <template v-for="(item, index) in newsList" :key="item.id">
          <div v-if="index === 0" class="news-information-item first-information">
            <div class="img-box">
              <img :src="replaceImgUrl(item.imgUrl)" alt="图片" @click="handleNewsInfomationDetail(item.id)" />
            </div>
            <p class="fs-20-vw mt-6-vw ellipsis-1 mb-0-vw">{{ item.attributes.newsTitle }}</p>
            <span class="fs-18-vw mt-6-vw opt65">{{ item.attributes.date }}</span>
          </div>
          <div v-else-if="index === 1" class="news-information-item second-information">
            <div class="img-box">
              <img :src="replaceImgUrl(item.imgUrl)" alt="图片" @click="handleNewsInfomationDetail(item.id)" />
            </div>
            <p class="fs-20-vw mt-6-vw ellipsis-1 mb-0-vw">{{ item.attributes.newsTitle }}</p>
            <span class="fs-18-vw mt-6-vw opt65">{{ item.attributes.date }}</span>
          </div>
          <div v-else class="news-information-item other-information">
            <div class="img-box">
              <img :src="replaceImgUrl(item.imgUrl)" alt="图片" @click="handleNewsInfomationDetail(item.id)" />
            </div>
            <p class="fs-20-vw mt-6-vw ellipsis-1 mb-0-vw">{{ item.attributes.newsTitle }}</p>
            <span class="fs-18-vw mt-6-vw opt65">{{ item.attributes.date }}</span>
          </div>
        </template>
      </div>
      <div class="add-more-box">
        <button v-if="total > newsList.length" class="add-more" @click="handleAddMore">加载更多</button>
        <span v-else class="no-more">没有更多了</span>
      </div>
    </main>
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
const pageSize = $ref(8)
const newsList = $ref([])
const router = useRouter()

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
        const newNewsList = newValue?.value?.data?.map(item => {
          if (item.attributes.newPic.data) {
            return { ...item, imgUrl: item.attributes.newPic.data?.length ? item.attributes.newPic.data[0].attributes.url : '' }
          }
          return { ...item }
        })
        if (newNewsList) {
          newsList.push(...newNewsList)
          total.value = newValue.value.meta.pagination.total
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
  } catch (error) {}
}

getNewsList()

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
</script>

<style lang="less" scoped>
.news-information-box {
  padding-top: @layout-header-height;

  .news-information-title {
    // margin-top: 80pxvw;
    background: url('https://osswebsite.yadea.com.cn/Rectangle_219_2x_b114317b18_2db17bc45a.png?updated_at=2023-03-16T03:24:02.912Z');
    width: 100%;
    height: 420pxvw;
    background-size: cover;
    background-position: center;
    line-height: 420pxvw;
    padding-left: 260pxvw;
    color: #fff;
  }

  main {
    padding: 0 260pxvw;
  }

  .news-information-items {
    width: 1400pxvw;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .news-information-item {
      margin-top: 60pxvw;
      width: 685pxvw;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;

      .img-box {
        width: 447pxvw;
        height: 320pxvw;
        overflow: hidden;
        cursor: pointer;
      }

      img {
        width: 447pxvw;
        height: 320pxvw;
        object-fit: cover;
        object-position: center center;

        &:hover {
          transform: scale(1.2);
          transition: all 1s;
        }
      }

      p {
        width: 100%;
        margin-bottom: 0 !important;
      }
    }

    .first-information,
    .second-information {
      width: 685pxvw;
      margin-top: 80pxvw;

      .img-box {
        width: 100%;
        height: 426pxvw;
        overflow: hidden;
        cursor: pointer;
      }

      img {
        width: 100%;
        height: 426pxvw;
        object-fit: cover;
        object-position: center center;

        &:hover {
          transform: scale(1.2);
          transition: all 1s;
        }
      }
    }

    .first-information {
      margin-right: 30pxvw;
    }
    .other-information {
      width: 447pxvw;
      margin-left: 29.5pxvw;

      &:nth-of-type(3n) {
        margin-left: 0;
      }
    }
  }

  .add-more-box {
    width: 100%;
    text-align: center;
    margin: 70pxvw 0 70pxvw;

    .add-more {
      width: 232pxvw;
      height: 58pxvw;
      background: transparent;
      color: #ff5f00;
      border: 2px solid #ff5f00;
      box-shadow: none;
      font-size: 20pxvw;
      cursor: pointer;
    }

    .no-more {
      opacity: 0.65;
      font-size: 18pxvw;
    }
  }
}
</style>
