<!--
 * @Author: yqq
 * @Date: 2023-01-28 14:26:50
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 17:14:46
 * @FilePath: \website\pages\index\contact-us\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="contact-us-box">
    <div class="contact-us-banner1">
      <span class="fs-60-vw fw-600 txt-white">联系我们</span>
    </div>
    <div class="contact-us-banner2">
      <div class="contact-us-banner2-top">
        <div class="top-item">
          <div class="title fs-32-vw fw-500">售后服务</div>
          <div class="desc">
            <div class="fs-20-vw mt-8-vw">客服热线: 400-900-1212</div>
            <div class="mt-2-vw fs-20-vw">邮箱: ydsh@yadea.com.cn</div>
          </div>
        </div>
        <div class="top-item">
          <div class="title fs-32-vw fw-500">招商加盟</div>
          <div class="desc">
            <div class="fs-20-vw mt-8-vw">
              两轮、三轮加盟电话: 0510-68851000<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可转分机: 8022、8023、8024
            </div>
            <div class="mt-2-vw fs-20-vw">邮箱: ydsh@yadea.com.cn</div>
          </div>
        </div>
        <div class="top-item">
          <div class="title fs-32-vw fw-500">团购定制</div>
          <div class="desc">
            <div class="fs-20-vw mt-8-vw">团购电话: 18800561909</div>
            <div class="mt-2-vw fs-20-vw">定制电话: 15251519435</div>
          </div>
        </div>
      </div>
      <div class="contact-us-banner2-top">
        <div class="top-item">
          <div class="title fs-32-vw fw-500">品牌广宣</div>
          <div class="desc">
            <div class="fs-20-vw mt-8-vw">邮箱: brand@yadea.com.cn</div>
          </div>
        </div>
        <div class="top-item">
          <div class="title fs-32-vw fw-500">国际业务合作</div>
          <div class="desc">
            <div class="fs-20-vw mt-8-vw">邮箱: MARKET@yadea.com</div>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-us-banner3">
      <div class="contact-us-banner3-left">
        <div class="title fs-32-vw fw-500">雅迪集团</div>
        <div class="content">
          <SvgIcon name="logo-text"></SvgIcon>
          <div class="text fs-24-vw fw-500">无论您有任何问题<br />请第一时间联系我们</div>
        </div>
      </div>
      <div class="contact-us-banner3-right">
        <div class="title fs-32-vw fw-500">在线客服</div>
        <div class="content">
          <img src="@/assets/images/contact-us/b43a7ac5f2ed1470edb090d119e067ae.png" alt="二维码" />
          <span class="fs-18-vw mt-3-vw">车主平台二维码</span>
        </div>
      </div>
    </div>
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
</script>

<style lang="less" scoped>
.contact-us-box {
  padding-top: @layout-header-height;

  .contact-us-banner1 {
    width: 100%;
    height: 420pxvw;
    background: url('https://osswebsite.yadea.com.cn/banner1_74d994f383_4a1555339f.png?updated_at=2023-03-16T03:12:27.508Z');
    background-size: cover;
    background-position: center center;
    padding-top: 167pxvw;
    padding-left: 260pxvw;
  }

  .contact-us-banner2 {
    overflow: hidden;
    padding: 0 260pxvw;
    .contact-us-banner2-top {
      margin-top: 60pxvw;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 60pxvw;

      .top-item {
        width: 373pxvw !important;
        margin-left: 140pxvw;

        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }

  .contact-us-banner3 {
    margin-top: 60pxvw;
    padding: 0 260pxvw;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 100pxvw;

    .contact-us-banner3-left {
      .content {
        margin-top: 40pxvw;
        background: url('https://osswebsite.yadea.com.cn/item3_bddd7e7b5c_9a6143384c.png?updated_at=2023-03-16T03:13:13.458Z') no-repeat;
        width: 995pxvw;
        height: 370pxvw;
        background: url('https://osswebsite.yadea.com.cn/item3_bddd7e7b5c_9a6143384c.png?updated_at=2023-03-16T03:13:13.458Z');
        background-size: cover;
        background-position: center center;
        position: relative;

        svg {
          width: 80pxvw;
          height: 23pxvw;
          margin-top: 51pxvw;
          margin-left: 47pxvw;
        }

        .text {
          width: 216pxvw;
          position: absolute;
          bottom: 59pxvw;
          left: 47pxvw;
        }
      }
    }

    .contact-us-banner3-right {
      .content {
        margin-top: 40pxvw;
        width: 377pxvw;
        height: 370pxvw;
        background: #f6f6f6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
          width: 172pxvw;
          height: 172pxvw;
        }
      }
    }
  }
}
</style>
