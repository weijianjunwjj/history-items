<template>
  <div class="m-news-page-box">
    <div class="news-page-container">
      <div class="share_box">
        <!-- <div class="share-text">分享到</div> -->
        <!-- <div class="share-link">
          <div class="share-item">
            <a class="wx"></a>
          </div>
          <div class="share-item">
            <a
              href="javascript:void((function(s,d,e){try{}catch(e){}var f='https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',u=d.location.href,p=['url=',e(u),'&amp;title=',e(d.title),'&amp;appkey=1087202303'].join('');function a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=620,height=450,left=',(s.width-620)/2,',top=',(s.height-450)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}})(screen,document,encodeURIComponent));"
              class="qq"
            ></a>
          </div>
          <div class="share-item">
            <a
              href="javascript:void((function(s,d,e){try{}catch(e){}var f='http://v.t.sina.com.cn/share/share.php?',u=d.location.href,p=['url=',e(u),'&amp;title=',e(d.title),'&amp;appkey=1087202303'].join('');function a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=620,height=450,left=',(s.width-620)/2,',top=',(s.height-450)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}})(screen,document,encodeURIComponent));"
              class="wb"
            ></a>
          </div>
        </div> -->
      </div>
      <div class="container" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { newsApi } = useApi()

const id = route.query.id

const content = $ref('')

// 获取新闻列表
const getNewsList = async () => {
  try {
    const { data } = await newsApi.getNew(id)
    watch(
      () => data,
      newValue => {
        content = newValue.value.data.attributes.content
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

<style lang="less">
.m-news-page-box {
  padding-top: @layout-m-header-height;

  .news-page-container {
    width: 85%;
    margin: 0 auto;
    position: relative;
    border-bottom: 1px solid #e3e1e1;
    margin-bottom: 100pxvw;
    .share_box {
      width: 200mpxvw;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      .share-text {
        text-align: center;
        font-size: 14mpxvw;
        color: #878787;
        margin: 35mpxvw 0 25mpxvw;
      }
      .share-link {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        .share-item {
          width: 36mpxvw;
          height: 36mpxvw;
          padding: 6mpxvw;
          border: 2px solid #ec6305;
          margin-bottom: 20px;
          border-radius: 100%;
          .wx,
          .qq,
          .wb {
            width: 20mpxvw;
            height: 20mpxvw;
            display: inline-block;
            background-image: url(@/assets/images/news-detail/wx.png);
            background-size: 100% 100%;
            background-position: center center;
          }

          .qq {
            background-image: url(@/assets/images/news-detail/qq.png);
          }

          .wb {
            background-image: url(@/assets/images/news-detail/wb.png);
          }
        }
      }
    }

    .container {
      width: 100%;
      margin: 0 auto;
      // border: 1px solid #000;
    }
  }
}
</style>
