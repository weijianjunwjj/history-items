<!--
 * @Author: weijianjun
 * @Date: 2023-01-31 11:20:32
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-01 11:00:00
 * @FilePath: \yadea-website\pages\index\security-check\index.vue
 * @Description: 防伪查询
 * 
-->
<template>
  <div class="page-security-check page-pt page-bgc">
    <div class="page-security-check-mod pos-center-h txt-c">
      <div class="page-security-check-mod-title">输入您的防伪码</div>
      <div class="page-security-check-mod-S-code">
        <client-only>
          <a-input v-model:value="form.SCode" size="large" placeholder="请输入防伪编码" class="my-input" />
        </client-only>
      </div>
      <div class="page-security-check-mod-V-code">
        <client-only>
          <a-input v-model:value="form.VCode" size="large" placeholder="请输入验证码" class="my-input" />
        </client-only>
      </div>
      <div class="page-security-check-mod-btn">
        <MyButton type="primary" size="big" class="check-btn">立即查询</MyButton>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { name: 'keywords', content: '雅迪门店查询' },
    {
      name: 'description',
      content: '本页面为大家提供雅迪服务网点查询,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})
const form = reactive({
  SCode: undefined,
  VCode: undefined
})
</script>

<style lang="less" scoped>
.page-security-check {
  width: 100%;
  height: 100vh;
  &-mod {
    width: auto;
    &-title {
      font-size: 42pxvw;
      font-weight: 500;
      color: #000000;
      line-height: 49pxvw;
      margin-top: 190pxvw;
      margin-bottom: 50pxvw;
    }
    &-S-code {
      margin-bottom: 20pxvw;
    }
    &-V-code {
      margin-bottom: 75pxvw;
    }
    &-btn {
    }
  }
}

:deep(.my-input) {
  width: 640pxvw;
  height: 89pxvw;
  background: #ffffff;
  border-radius: 12px 12px 12px 12px;
  opacity: 1;
  border-width: 3px;
  border-right-width: 3px !important;
  padding-left: 48pxvw;
  padding-right: 48pxvw;
  @media screen and (min-width: @max-media-width) {
    width: 640px;
    height: 89px;
    padding-left: 48px;
    padding-right: 48px;
  }
}

.check-btn {
  width: 282px;
  height: 58px;
}
</style>
