<!--
 * @Author: weijianjun
 * @Date: 2023-02-19 09:33:22
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 17:25:14
 * @FilePath: \website\pages\index\mob\investor-relations\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="m-page-investor-relations m-page-pt">
    <div class="banner pos-rel">
      <div class="ml-4-mvw pos-middle-v">投资者关系</div>
    </div>

    <main>
      <!-- 企业与公函 -->
      <div class="notice">
        <div class="notice-title">企业与公函</div>

        <a-list item-layout="vertical" size="large" :pagination="false" :data-source="noticeList">
          <template #renderItem="{ item }">
            <a-list-item :key="item.attributes.title" class="notice-list">
              <div class="notice-list-item" @click="handlePreviewPdf(item.pdfUrl)">
                <div class="title">{{ item.attributes.title }}</div>
                <div class="date">{{ item.attributes.date }}</div>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>

      <!-- 企业资料 -->
      <div class="info">
        <div class="info-title">企业资料</div>

        <div class="info-list">
          <div class="info-list-item">
            <div class="info-list-item-title">注册办事处</div>

            <div class="info-list-item-value mb-1-mvw">Clifton House 75 Fort Street Grand</div>
            <div class="info-list-item-value">Cayman KY1-1108 Cayman Islands</div>

            <a-divider class="p0"></a-divider>
          </div>

          <div class="info-list-item">
            <div class="info-list-item-title">主要营业地点</div>
            <div class="info-list-item-list2">
              <div class="info-list-item-list2-item">
                <div class="info-list-item-list2-item">
                  <div class="info-list-item-list2-item-label mb-1-mvw">总办事处及中国主要营业地点：</div>
                  <div class="info-list-item-list2-item-value mb-3-mvw">中国江苏省无锡市锡山区安镇镇大成工业园锡山大道</div>
                </div>
                <div class="info-list-item-list2-item">
                  <div class="info-list-item-list2-item-label">香港主要营业地点：</div>
                  <div class="info-list-item-list2-item-value">香港铜锣湾勿地臣街1号时代广场二座31楼</div>
                </div>
              </div>
            </div>
            <a-divider class="p0"></a-divider>
          </div>

          <div class="info-list-item">
            <div class="info-list-item-title">联席公司秘书</div>
            <div class="info-list-item-list2">
              <div class="info-list-item-list2-item">
                <div class="info-list-item-list2-item">
                  <div class="info-list-item-list2-item-label mb-1-mvw">沈瑜先生</div>
                  <div class="info-list-item-list2-item-value mb-3-mvw">中国江苏省无锡市北塘区惠泉花园66号202室</div>
                </div>
                <div class="info-list-item-list2-item">
                  <div class="info-list-item-list2-item-label">梁志杰先生，ACG，HKACG</div>
                  <div class="info-list-item-list2-item-value">香港铜锣湾勿地臣街1号时代广场二座31楼</div>
                </div>
              </div>
            </div>
            <a-divider class="p0"></a-divider>
          </div>

          <div class="info-list-item">
            <div class="info-list-item-title">授权代表</div>
            <div class="info-list-item-list2">
              <div class="info-list-item-list2-item">
                <div class="info-list-item-list2-item">
                  <div class="info-list-item-list2-item-label mb-1-mvw">
                    钱静红女士<br />
                    梁志杰先生，ACG，HKACG
                  </div>
                  <div class="info-list-item-list2-item-value mb-3-mvw">香港铜锣湾勿地臣街1号时代广场二座31楼</div>
                </div>
                <div class="info-list-item-list2-item">
                  <div class="info-list-item-list2-item-label mb-1-mvw">公司投资者关系</div>
                  <div class="info-list-item-list2-item-value mb-3-mvw">联系邮箱ir@yadea.com.cn</div>
                </div>
              </div>
            </div>
            <a-divider class="p0"></a-divider>
          </div>

          <div class="info-list-item">
            <div class="info-list-item-title">香港证券登记处</div>
            <div class="info-list-item-list2">
              <div class="info-list-item-list2-item">
                <div class="info-list-item-list2-item">
                  <div class="info-list-item-list2-item-label mb-1-mvw">卓佳证券登记有限公司</div>
                  <div class="info-list-item-list2-item-value mb-3-mvw">香港夏悫道16号远东金融中心17楼</div>
                </div>
              </div>
            </div>
            <a-divider class="p0"></a-divider>
          </div>

          <div class="info-list-item">
            <div class="info-list-item-title">注册办事处</div>

            <div class="info-list-item-value mb-1-mvw">地址：香港中环皇后大道中 99 号中环中心 9 楼</div>
            <div class="info-list-item-value mb-1-mvw">电话：+852 3970 2177</div>
            <div class="info-list-item-value mb-1-mvw">传真：+852 3102 0210</div>
            <div class="info-list-item-value">电邮：yadea@wsfg.hk</div>

            <a-divider class="p0"></a-divider>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { name: 'keywords', content: '雅迪投资者关系' },
    {
      name: 'description',
      content:
        '作为一家上市公司,雅迪致力于与资本市场参与者和公众保持透明,本页面提供各种信息方便大家浏览,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

// ---data---
const { investorApi } = useApi()
const pageSize = $ref(5)
const noticeList = $ref([])

const pagination = {
  onChange: page => {
    pagination.page = page
    getNewsList()
  },
  page: 1,
  total: 0,
  pageSize: 5
}

// ---function---

// 获取通知和公函列表
const getNewsList = async () => {
  try {
    const { data } = await investorApi.getInvestorRelations(pagination.page, pageSize)
    watchVal(data, () => {
      const newNoticeList = data.value.data.map(item => {
        if (item.attributes.pdfUrl.data) {
          return { ...item, pdfUrl: item.attributes.pdfUrl.data[0].attributes.url }
        }
        return { ...item }
      })
      noticeList = [...newNoticeList]
      pagination.total = data.value.meta.pagination.total
    })
  } catch (error) {}
}

getNewsList()

// 页码改变事件
const handleChangePagination = pageVal => {
  page = pageVal
  getNewsList()
}

// 预览pdf
const handlePreviewPdf = pdfUrl => {
  window.open(pdfUrl)
}

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.m-page-investor-relations {
  .banner {
    width: 100%;
    height: 220mpxvw;
    background: url(@/assets/images/mobile/investor-relations/banner.png) no-repeat;
    background-size: 100%;
    div {
      .m-fs(32);
      color: #ffffff;
    }
  }

  .common-title {
    font-size: 20mpxvw;
    font-weight: 500;
    padding-top: 24mpxvw;
    padding-bottom: 16mpxvw;
  }

  .ant-list-lg .ant-list-item {
    padding: 0 !important;
  }
  .ant-pagination {
    .m-mt(15);
    .m-mb(40);
    .Page {
      display: none;
    }
  }

  .ant-divider {
    background: #ff5f00;
  }

  main {
    position: relative;
    .notice {
      .m-mlr(20);
      &-title {
        .common-title;
        position: relative;
        font-size: 24mpxvw;

        &::after {
          position: absolute;
          display: inline-block;
          content: '';
          width: 100%;
          height: 1px;
          bottom: 0;
          left: 0;
          right: 0;
          background: #e9e9e9;
        }
      }
      &-list {
        &-item {
          .title {
            .m-fs(13);
            font-weight: 400;
            .m-ptb(10);
          }
          .date {
            .m-fs(12);
            font-weight: 400;
            color: @date;
            .m-pb(10);
          }
        }
      }

      .ant-pagination-prev,
      .ant-pagination-next,
      .ant-pagination-jump-prev,
      .ant-pagination-jump-next {
        display: none !important;
      }
    }

    .info {
      .m-pb(16);
      .m-plr(20);
      background-color: @page-bgc;
      &-title {
        .common-title;
        font-size: 24mpxvw;
      }
      &-list {
        &-item {
          position: relative;
          // &::after {
          //   position: absolute;
          //   display: inline-block;
          //   content: '';
          //   width: 100%;
          //   height: 2px;
          //   transform: scale(1, 0.5);
          //   background: #ff5f00;
          //   left: 0;
          //   right: 0;
          //   bottom: 0;
          // }

          &-title {
            font-size: 16mpxvw;
            font-weight: 500;
            .m-mb(10);
          }

          &-value {
            font-size: 12mpxvw;
            font-weight: 400;
            color: #000000;
            line-height: 14mpxvw;
          }

          &-list2 {
            &-item {
              &-label {
                font-size: 12px;
                font-weight: 400;
                opacity: 0.65;
              }
              &-value {
                font-size: 12px;
                font-weight: 400;
              }
            }
          }
        }
      }
    }
  }
}
</style>
