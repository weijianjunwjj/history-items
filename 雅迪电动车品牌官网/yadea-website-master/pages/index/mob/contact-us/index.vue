<!--
 * @Author: weijianjun
 * @Date: 2023-02-19 15:15:10
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-09 15:04:03
 * @FilePath: \website\pages\index\mob\contact-us\index.vue
 * @Description: 
 * 
-->

<template>
  <div class="m-page-contact-us m-page-mt">
    <div class="banner pos-rel">
      <div class="ml-4-mvw pos-middle-v">联系我们</div>
    </div>

    <main class="mlr-4-mvw">
      <div class="mod1">
        <ClientOnly>
          <div v-for="(item, index) of list" :key="index" class="mod1-item">
            <div class="mod1-item-title" :class="index == 0 && 'pt-4-mvw'" v-html="item.title"></div>
            <div class="mod1-item-desc" v-html="item.desc1"></div>
            <div v-if="item.desc2" class="mod1-item-desc">{{ item.desc2 }}</div>
            <a-divider></a-divider>
          </div>
        </ClientOnly>
      </div>
      <!-- 雅迪集团 -->
      <div class="mod2">
        <div class="mod2-title">雅迪集团</div>
        <div class="mod2-map">
          <div>无论您有任何问题<br />请第一时间联系我们</div>
        </div>
        <a-divider></a-divider>
      </div>
      <!-- 在线客服 -->
      <div class="mod3 pb-6-mvw">
        <div class="mod3-title">在线客服</div>
        <div class="mod3-code flex-hvc">
          <div>
            <img src="@/assets/images/mobile/contact-us/b43a7ac5f2ed1470edb090d119e067ae.png" alt="" />
            <div class="mt-2-mvw txt-c">车主平台二维码</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { name: 'keywords', content: '联系雅迪' },
    {
      name: 'description',
      content: '本页面提供雅迪各类需求联系方式,方便您获取信息,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

// ---data---
const list = reactive([
  {
    title: '售后服务',
    desc1: '客服热线：400-900-1212',
    desc2: '邮箱：ydsh@yadea.com.cn'
  },
  {
    title: '招商加盟',
    desc1: '两轮、三轮加盟电话：0510-68851000<br/>可转分机：8022、8023、8024',
    desc2: '邮箱：ydsh@yadea.com.cn'
  },
  {
    title: '团购定制',
    desc1: '团购电话：18800561909',
    desc2: '定制电话：15251519435'
  },
  {
    title: '品牌广宣',
    desc2: '邮箱：brand@yadea.com.cn'
  },
  {
    title: '国际业务合作',
    desc1: '邮箱：MARKET@yadea.com'
  }
])
definePageMeta({
  layout: 'mobile'
})
// ---function---
</script>

<style lang="less">
.m-page-contact-us {
  .banner {
    width: 100%;
    height: 220mpxvw;
    background: url(@/assets/images/mobile/contact-us/banner.png) no-repeat;
    background-size: 100%;
    div {
      .m-fs(24);
      font-weight: 500;
      color: #ffffff;
    }
  }
  main {
    .mod1 {
      &-item {
        &-title {
          font-size: 16mpxvw;
          font-weight: 500;
          .m-pb(12);
        }
        &-desc {
          font-size: 12mpxvw;
          font-weight: 400;
          .m-pb(10);
        }
      }
      .ant-divider-horizontal {
        margin: 20mpxvw 0;
      }
    }
    .mod2 {
      &-title {
        .m-fs(16);
        .m-pb(16);
        font-weight: 500;
      }
      &-map {
        width: 100%;
        height: 189mpxvw;
        background: url(@/assets/images/mobile/contact-us/map.png) no-repeat;
        background-size: 100%;
        position: relative;
        div {
          position: absolute;
          .m-left(16);
          .m-bottom(16);
          font-size: 12mpxvw;
          font-weight: 500;
        }
      }
    }

    .mod3 {
      position: relative;
      &-title {
        .m-fs(16);
        .m-pb(16);
        font-weight: 500;
      }
      &-code {
        .m-w(335);
        .m-h(216);
        background: #f6f6f6;
        img {
          width: 107mpxvw;
          height: 107mpxvw;
        }

        .mt-2-mvw {
          font-size: 12mpxvw;
        }
      }
    }
  }
}
</style>
