<!--
 * @Author: yqq
 * @Date: 2022-12-28 17:23:16
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 10:27:39
 * @FilePath: \website\pages\index\components\double-picture-two\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- double-picture-two -->
  <div ref="box" class="double-picture-two ptb-2 pl-4">
    <a-row :gutter="[20, 20]" class="full">
      <a-col v-for="(item, index) of mod.data" :key="index" :span="8">
        <div :style="`background:url(${replaceImgUrl(item.bgImage)}) no-repeat`" class="row-col full bgs-full txt-c">
          <div class="double-picture-two-animate my-animate" :class="isShow && 'my-animate-sildeUp'">
            <div class="fs-42-vw" :style="{ color: item?.descColor }">{{ item.desc1 }}</div>
            <div class="homepage-sub-title mb-2-vw" :style="{ color: item?.descColor }">{{ item.desc2 }}</div>
            <a class="fs-16-vw a-btn flex-hvc" :style="{ color: item?.descColor }" @click="jumpTo2(item)">
              <span>{{ item?.btn }}</span>
              <SvgIcon name="arrow-right-white" :style="{ color: item?.mobileDescColor }"></SvgIcon>
              <!-- <img class="ml-2-vw" src="@/assets/images/home/icon-right2.png" alt="箭头" /> -->
            </a>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-modal v-model:visible="show" class="double-picture-two-modal" centered :width="320" :title="null" :footer="null" @ok="handleOk">
      <div class="content flex-col align-center pos-center">
        <img class="content-img" src="@/assets/images/app-code.png" alt="" />

        <div class="content-txt">APP下载</div>
        <div class="conceal-txt fs-14-vw opt65" @click="handleGoConceal">隐私政策</div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
const props = defineProps({
  mod: {
    type: Object,
    default: () => {
      return {
        data: []
      }
    }
  }
})
const show = $ref(false)

function handleOk() {
  show = false
}

function jumpTo2(item) {
  const { btnUrl, id } = item
  if (btnUrl) {
    jumpTo(btnUrl)
  }
  if (id === 1) {
    show = true
  }
}

const handleGoConceal = () => {
  window.location.href = '/car-detail/conceal/index.html'
}

const { isShow } = useIsShow('.double-picture-two-animate')
</script>

<style lang="less">
.double-picture-two-modal {
  .ant-modal-body {
    height: 360px;
  }

  .content {
    &-img {
      width: 180px;
      height: 180px;
    }

    &-txt {
      font-size: 16px;
      color: #888;
      text-align: center;
      line-height: normal;
      margin-top: 20px;
    }

    .conceal-txt {
      margin-top: 10pxvw;
      cursor: pointer;
    }
  }
}
</style>

<style lang="less" scoped>
.double-picture-two {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 700pxvw;

  .row-col {
    .pt(60);

    .fs-42-vw {
      .fs(42);
      // margin-bottom: 8pxvw;
      color: #212121;
    }

    .homepage-sub-title {
      .fs(20);
      font-weight: 400 !important;
      margin-bottom: 0.65vw;
    }
  }

  .a-btn {
    color: #333;
    &:active,
    &:hover {
      color: #333;
    }

    svg {
      width: 18pxvw;
      height: 18pxvw;
    }
  }
}
</style>
