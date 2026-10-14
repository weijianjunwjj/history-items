<!--
 * @Author: yqq
 * @Date: 2023-01-30 14:16:57
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-01 10:42:51
 * @FilePath: \yadea-website\pages\index\investor-relations\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="investor-relations-box">
    <div class="investor-relations-banner1">
      <div class="fs-60-vw fw-600 txt-white">投资者关系</div>
    </div>
    <div class="investor-relations-banner2">
      <div class="investor-relations-banner2-top">
        <client-only>
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="公告">
              <div class="notice-list">
                <template v-for="item in noticeList" :key="item.id">
                  <div class="notice-item" @click="handlePreviewPdf(item.pdfUrl)">
                    <div class="notice-item-left">
                      <div class="title fs-18-vw">{{ item.attributes.title }}</div>
                      <div class="time fs-18-vw">{{ item.attributes.date }}</div>
                    </div>
                    <!-- <div class="notice-item-right">
                      <SvgIcon name="pdf"></SvgIcon>
                    </div> -->
                  </div>
                </template>
              </div>
              <a-pagination
                v-model:current="page"
                :total="total"
                :page-size="pageSize"
                show-less-items
                @showSizeChange="handleChangePagination"
                @change="handleChangePagination"
              />
            </a-tab-pane>
            <!-- <a-tab-pane key="2" tab="财务演示(即将开通)" disabled></a-tab-pane>
            <a-tab-pane key="3" tab="财务摘要(即将开通)" disabled></a-tab-pane>
            <a-tab-pane key="3" tab="财务报告(即将开通)" disabled></a-tab-pane> -->
            <template #leftExtra>
              <div class="fs-42-vw fw-500 mb-8-vw">通知和公函</div>
            </template>
          </a-tabs>
        </client-only>
      </div>
    </div>
    <div class="investor-relations-banner4">
      <div class="title fs-42-vw fw-500 mt-10-vw">企业资料</div>
      <div class="investor-relations-banner4-items">
        <div class="investor-relations-banner4-item">
          <div class="item-title fs-32-vw fw-500">注册办事处</div>
          <div class="item-text fs-18-vw mt-5-vw">
            Windward 3, Regatta Office Park<br />
            PO Box 1350<br />
            Grand Cayman KY1-1108<br />
            Cayman Islands
          </div>
        </div>
        <div class="investor-relations-banner4-item">
          <div class="item-title fs-32-vw fw-500">主要营业地点</div>
          <div class="item-text">
            <div class="fs-18-vw mt-5-vw opt65">总办事处及中国主要营业地点:</div>
            <div class="fs-18-vw mt-2-vw fw-500">中国江苏省无锡市锡山区安镇镇大成工业园锡山大道</div>
            <div class="fs-18-vw mt-3-vw opt65">香港主要营业地点:</div>
            <div class="fs-18-vw mt-2-vw fw-500">香港铜锣湾勿地臣街1号时代广场二座31楼</div>
          </div>
        </div>
        <div class="investor-relations-banner4-item">
          <div class="item-title fs-32-vw fw-500">联席公司秘书</div>
          <div class="item-text">
            <div class="fs-18-vw mt-5-vw opt65">沈瑜先生</div>
            <div class="fs-18-vw mt-2-vw fw-500">中国江苏省无锡市北塘区惠泉花园66号202室</div>
            <div class="fs-18-vw mt-3-vw opt65">梁志杰先生，ACG，HKACG</div>
            <div class="fs-18-vw mt-2-vw fw-500">香港铜锣湾勿地臣街1号时代广场二座31楼</div>
          </div>
        </div>
        <div class="investor-relations-banner4-item">
          <div class="item-title fs-32-vw fw-500">授权代表</div>
          <div class="item-text">
            <div class="fs-18-vw mt-5-vw opt65">
              钱静红女士<br />
              梁志杰先生，ACG，HKACG
            </div>
            <div class="fs-18-vw mt-2-vw fw-500">香港铜锣湾勿地臣街1号时代广场二座31楼</div>
          </div>
          <div class="item-text">
            <div class="fs-18-vw mt-5-vw opt65">公司投资者关系</div>
            <div class="fs-18-vw mt-2-vw fw-500">联系邮箱ir@yadea.com.cn</div>
          </div>
        </div>
        <div class="investor-relations-banner4-item">
          <div class="item-title fs-32-vw fw-500">香港证券登记处</div>
          <div class="item-text">
            <div class="fs-18-vw mt-5-vw opt65">卓佳证券登记有限公司</div>
            <div class="fs-18-vw mt-2-vw fw-500">香港夏悫道16号远东金融中心17楼</div>
          </div>
        </div>
        <div class="investor-relations-banner4-item">
          <div class="item-title fs-32-vw fw-500">皓天财经集团有限公司</div>
          <div class="item-text">
            <div class="fs-18-vw mt-5-vw fw-500">地址: 香港中环皇后大道中 99 号中环中心 9 楼</div>
            <div class="fs-18-vw mt-2-vw fw-500">电话: +852 3970 2177</div>
            <div class="fs-18-vw mt-2-vw fw-500">传真: +852 3102 0210</div>
            <div class="fs-18-vw mt-2-vw fw-500">电邮: yadea@wsfg.hk</div>
          </div>
        </div>
      </div>
    </div>
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

const { investorApi } = useApi()
const activeKey = $ref('1')
const page = $ref(1)
const pageSize = $ref(5)
const noticeList = $ref([])
const total = ref(0)

// const hoverIndex = ref(null)

// 获取通知和公函列表
const getNewsList = async () => {
  try {
    const { data } = await investorApi.getInvestorRelations(page, pageSize)
    watchVal(data, () => {
      const newNoticeList = data.value.data.map(item => {
        if (item.attributes.pdfUrl.data) {
          return { ...item, pdfUrl: item.attributes.pdfUrl.data[0].attributes.url }
        }
        return { ...item }
      })
      noticeList = [...newNoticeList]
      total.value = data.value.meta.pagination.total
    })
  } catch (error) {}
}

getNewsList()

// 页码改变事件
const handleChangePagination = (current, changePageSize) => {
  page = current
  pageSize = changePageSize
  getNewsList()
}

// 预览pdf
const handlePreviewPdf = pdfUrl => {
  window.open(pdfUrl)
}
</script>

<style lang="less">
.investor-relations-box {
  padding-top: @layout-header-height;

  .investor-relations-banner1 {
    width: 100%;
    height: 420pxvw;
    background: url('https://osswebsite.yadea.com.cn/Rectangle_219_3f870fc9f2.png') no-repeat;
    background-size: cover;
    background-position: center center;
    padding: 167pxvw 0 0 260pxvw;
  }

  .investor-relations-banner2 {
    padding: 100pxvw 250pxvw 60pxvw;
    .investor-relations-banner2-top {
      .notice-list {
        .notice-item {
          width: 1420pxvw;
          height: 132pxvw;
          // margin: 16pxvw 0 0;
          padding: 0 29pxvw 0 10pxvw;
          // overflow: hidden;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          position: relative;

          // &:first-child {
          //   margin: 0;
          // }

          &::after {
            content: '';
            height: 1px;
            background: #e9e9e9;
            position: absolute;
            z-index: -1;
            left: 10pxvw;
            right: 10pxvw;
            bottom: 0;
            // bottom: -16pxvw;
          }

          // svg {
          //   width: 36pxvw;
          //   height: 48pxvw;
          //   color: #ff5f00;
          // }

          .time {
            opacity: 0.65;
          }

          &:hover {
            &::before {
              content: '';
              height: 100pxvw;
              background: #f6f6f6;
              position: absolute;
              z-index: -1;
              right: 0;
              left: 0;
            }
          }
        }
      }
    }
  }

  .investor-relations-banner4 {
    width: 100%;
    // height: 937pxvw;
    padding: 100pxvw 260pxvw;
    background: #f9f9f9;

    .investor-relations-banner4-items {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;

      .investor-relations-banner4-item {
        margin-top: 60pxvw;
        width: 447pxvw;
        height: 15.541667vw;
        border-bottom: 1px solid #ff5f00;
      }
    }
  }
}
</style>

<style lang="less" scoped>
:deep(.ant-tabs-nav) {
  padding: 0 10pxvw;
  margin: 0;
}
:deep(.ant-tabs-nav-wrap) {
  justify-content: flex-end;

  .ant-tabs-tab-btn {
    font-size: 20pxvw;
    font-weight: 500;
    margin-bottom: 40pxvw;
  }
  .ant-tabs-tab.ant-tabs-tab-disabled {
    color: #000;
  }
}

:deep(.ant-tabs-nav::before) {
  border-bottom: 2px solid #d9d9d9;
  left: 10pxvw;
  right: 10pxvw;
}

:deep(.ant-tabs-ink-bar) {
  display: none;
}
:deep(.ant-pagination-prev) {
  display: none;
}

:deep(.ant-pagination-next) {
  display: none;
}

:deep(.ant-pagination-item) {
  min-width: 28pxvw;
  height: 28pxvw;
  font-size: 16pxvw;
  color: #000;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #dbdbdb;
  line-height: 26pxvw;

  a {
    &:hover {
      line-height: 26pxvw;
      text-decoration: none !important;
    }
  }
}

:deep(.ant-pagination-item-active) {
  background: #ff5f00;

  a {
    color: #fff;
    &:hover {
      text-decoration: none !important;
    }
  }
}

:deep(.ant-pagination) {
  text-align: right;
  margin-top: 40pxvw;
}
</style>
