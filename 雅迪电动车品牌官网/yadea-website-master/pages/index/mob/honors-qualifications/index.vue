<!--
 * @Author: weijianjun
 * @Date: 2023-02-15 10:34:15
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 17:15:58
 * @FilePath: \website\pages\index\mob\honors-qualifications\index.vue
 * @Description: 企业荣誉
 * 
-->

<template>
  <div class="m-page-honors-qualifications m-page-pt">
    <div class="honors-qualifications-mod1 pos-rel">
      <div class="txt-c text pos-middle-v ml-4-mvw">企业荣誉</div>
    </div>

    <main class="main">
      <a-collapse :bordered="false" expand-icon-position="right" :accordion="true">
        <a-collapse-panel
          v-for="(item, index) of list"
          :key="index"
          :show-arrow="false"
          class="my-collapse-panel pos-rel"
          @click="handleClick(item)"
        >
          <template #header>
            <div class="years">{{ item.key }}</div>
          </template>

          <ul class="my-ul">
            <li v-for="(item2, index2) of item.value" :key="index2">
              <p>{{ item2.content }}</p>
            </li>
          </ul>

          <template #extra>
            <img v-show="!item.close" class="icon-arrow" src="@/assets/images/mobile/honors-qualification/arrow-close.png" alt="" />
            <img v-show="item.close" class="icon-arrow" src="@/assets/images/mobile/honors-qualification/arrow-open.png" alt="" />
          </template>
        </a-collapse-panel>
      </a-collapse>
    </main>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { name: 'keywords', content: '雅迪获奖,雅迪荣誉资质' },
    {
      name: 'description',
      content: '雅迪致力于打磨每一个产品,先后获得德国红点奖,中国制造业企业500强等大量奖项,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const { honorsApi } = useApi()

const list = $ref([])
const init = async () => {
  try {
    const { data } = await honorsApi.getList()
    watchVal(data, () => {
      let $list = fList(data.value.data)
      $list = sortClass($list, 'year')
      list = $list
    })
  } catch (error) {
    console.log(error)
  }
}
init()

function handleClick(item) {
  item.close = !item.close
}

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.m-page-honors-qualifications {
  .honors-qualifications {
    &-mod1 {
      width: 100%;
      height: 220mpxvw;
      background: url(@/assets/images/mobile/honors-qualification/bg1.png) no-repeat;
      background-size: 100%;
      .text {
        font-size: 32mpxvw;
        color: #ffffff;
        font-weight: 500;
      }
    }
  }

  main {
    .my-ul {
      margin: 0;
      li {
        font-weight: 400;
        list-style-type: disc;
        .m-mb(20);
        &::marker {
          font-size: 5mpxvw;
        }
        p {
          font-size: 13mpxvw;
          font-weight: 400;
          margin: 0;
        }
      }
    }
    .ant-collapse-item-active {
      .years {
        letter-spacing: -1px;
        color: #ff5f00;
      }
      border-bottom: 0;
    }
    .years {
      font-size: 18mpxvw;
      font-family: DINPro-Bold;
      font-weight: bold;
    }
    .icon-arrow {
      width: 16mpxvw;
      height: 16mpxvw;
    }

    .ant-collapse-borderless {
      background: #fff;
    }

    .my-collapse-panel {
      .m-mlr(20);
      background: #ffffff;
      .ant-collapse-header {
        padding-left: 0 !important;
        padding-right: 0;
        .m-pt(20);
        .m-pb(12);
        font-weight: 400;
      }
      .ant-collapse-content {
        &::before {
          content: '';
          display: inline-block;
          position: absolute;
          width: calc(100vw - 40mpxvw);
          left: 0;
          right: 0;
          height: 1px;
          background: #d9d9d9;
        }
      }
      .ant-collapse-content-box {
        padding-bottom: 0 !important;
        padding-top: 12mpxvw !important;
      }
      .ant-collapse-extra {
        position: absolute;
        right: 0;
        & > img {
          opacity: 1;
          transition: all 0.5s;
        }
      }
    }
  }
}
</style>
