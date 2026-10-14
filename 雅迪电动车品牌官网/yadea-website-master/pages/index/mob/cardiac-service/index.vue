<!--
 * @Author: weijianjun
 * @Date: 2023-02-24 10:33:25
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 16:41:15
 * @FilePath: \website\pages\index\mob\cardiac-service\index.vue
 * @Description: 心动服务
 * 
-->

<template>
  <div class="m-page-cardiac-service m-page-pt">
    <mobile-banner title="雅迪服务" img="https://osswebsite.yadea.com.cn/Rectangle_219_bd8e2d4380.png" />

    <div class="m-page-cardiac-service-desc">
      <div class="desc1">一键呼叫，好服务就在你身边</div>
      <div class="desc2">雅迪服务一站式电动车养护平台，为车主提供全面的用<br />车养车服务，打造超越期待的服务体验</div>
    </div>

    <main>
      <div class="list">
        <div class="list-item list-item1">
          <img :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/DSCF_5184_HDR_2_1_ec04dbeadb.png')" alt="" />
          <div class="title"><span class="theme-color">更多</span> 服务渠道</div>
          <div class="desc"><span class="theme-color">40000+</span>服务网点，便捷服务</div>
          <mobile-button type="border3" shape="" @click="openModal(1)">了解更多</mobile-button>
        </div>
        <div class="list-item list-item2">
          <img
            :src="
              replaceImgUrl(
                'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/DSCF_5184_HDR_2_2_2x_4a12fc8b12.png?updated_at=2023-03-10T08:07:32.611Z'
              )
            "
            alt=""
          />
          <div class="title"><span class="theme-color">更快</span> 服务响应</div>
          <div class="desc">
            <span class="theme-color">24</span>小时道路救援 <span class="theme-color">5</span>分钟响应
            <span class="theme-color">30</span>分钟到达
          </div>
          <mobile-button type="border3" shape="" @click="openModal(2)">了解更多</mobile-button>
        </div>
        <div class="list-item list-item3">
          <img
            :src="
              replaceImgUrl(
                'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/DSCF_5184_HDR_2_3_2x_5404d4d593.png?updated_at=2023-03-10T08:07:31.930Z'
              )
            "
            alt=""
          />
          <div class="title"><span class="theme-color">更好</span> 服务体验</div>
          <div class="desc"><span class="theme-color">五星级</span>服务体验 <span class="theme-color">认证</span>工程师坐镇</div>
          <mobile-button type="border3" shape="" @click="openModal(3)">了解更多</mobile-button>
        </div>
        <div class="list-item list-item4">
          <img
            :src="
              replaceImgUrl(
                'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/DSCF_5184_HDR_2_4_2x_bb6295fe49.png?updated_at=2023-03-10T08:07:32.231Z'
              )
            "
            alt=""
          />
          <div class="title"><span class="theme-color">更省</span> 服务成本</div>
          <div class="desc"><span class="theme-color">免费</span>检修 <span class="theme-color">明码</span>标价</div>
          <mobile-button type="border3" shape="" @click="openModal(4)">了解更多</mobile-button>
        </div>
      </div>
    </main>

    <van-dialog v-model:show="show" class="van-dialog-cardiac-service pos-rel" width="81.6%" show-cancel-button>
      <template #title>
        <div class="dialog-title flex-c-sb plr-4-mvw pt-4-mvw pb-1-mvw fs-16-mvw fw-500">
          <div class="dialog-title-txt">{{ title }}</div>
          <svg-icon name="cha" class="my-icon-cha" @click="closeDialog"></svg-icon>
        </div>
      </template>
      <div class="bgi pos-mid" :style="`background-image:url(${bgi})`"></div>

      <div class="dialog-content plr-4-mvw pb-4-mvw fs-12-mvw pos-rel">
        <div v-if="title === '更多服务渠道'" class="my-content content1">
          <div class="fs-13-mvw">任何一家都能提供专业、便捷、优质的服务</div>

          <div class="mt-3-mvw">
            <div class="dialog-desc flex-c">
              <div class="dialog-desc-index flex-hvc"><span>1</span></div>
              打开雅迪车主服务小程序
            </div>
            <div class="dialog-desc flex-c">
              <div class="dialog-desc-index flex-hvc"><span>2</span></div>
              点击服务网点
            </div>
            <div class="dialog-desc flex-c">
              <div class="dialog-desc-index flex-hvc"><span>3</span></div>
              轻松查询附近服务网点
            </div>
          </div>

          <footer class="my-footer">
            <div class="flex-col align-center">
              <img src="../../../../assets/images/cardiac-service/modal1-img1.png" alt="" />
              <div class="dialog-desc-index flex-hvc mtb-1-mvw ml-4-vw"><span>1</span></div>
            </div>

            <div class="flex-col align-center">
              <img src="../../../../assets/images/cardiac-service/modal1-img2.png" alt="" />
              <div class="dialog-desc-index flex-hvc mtb-1-mvw ml-4-vw"><span>2</span></div>
            </div>
          </footer>
        </div>
        <div v-if="title === '更快服务响应'" class="my-content content2">
          <div class="fs-13-mvw">护航有道，时刻守护美好出行</div>

          <div class="mt-3-mvw">
            <div class="dialog-desc flex-c">
              <div class="dialog-desc-index flex-hvc"><span>1</span></div>
              打开雅迪车主服务小程序
            </div>
            <div class="dialog-desc flex-c">
              <div class="dialog-desc-index flex-hvc"><span>2</span></div>
              点击服务网点
            </div>
            <div class="dialog-desc flex-c">
              <div class="dialog-desc-index flex-hvc"><span>3</span></div>
              轻松查询附近服务网点
            </div>
          </div>

          <footer class="my-footer">
            <div class="flex-col align-center">
              <img src="../../../../assets/images/cardiac-service/modal1-img1.png" alt="" />
              <div class="dialog-desc-index flex-hvc mtb-1-mvw ml-4-vw"><span>1</span></div>
            </div>

            <div class="flex-col align-center">
              <img src="../../../../assets/images/cardiac-service/modal2-img2.png" alt="" />
              <div class="dialog-desc-index flex-hvc mtb-1-mvw ml-4-vw"><span>2</span></div>
            </div>
          </footer>
        </div>
        <div v-if="title === '更好服务体验'" class="my-content content3">
          <div class="fs-13-mvw">轻松解决问题，让旅途更长久</div>

          <div class="fs-11-mvw mt-3-mvw">
            行业五星级服务认证<br />
            星级服务体验中心<br />
            认证工程师坐镇
          </div>

          <footer class="flex-col align-center pt-5-mvw">
            <img class="modal3-img1" src="../../../../assets/images/cardiac-service/modal3-img1.png" alt="" />
            <div class="fs-11-mvw opt65">国家权威认证：行业内首家通过五星级售后服务认证</div>
          </footer>
        </div>
        <div v-if="title === '更省服务成本'" class="my-content content4">
          <div class="fs-13-mvw">省钱、省时、更省心、超值服务值得信赖</div>

          <div class="mt-5-mvw">
            <div class="main-item">
              <img src="../../../../assets/images/mobile/cardiac-service/icon1.png" alt="" />
              <section>
                <div class="main-item-title">免费保养服务</div>
                <div class="main-item-desc">
                  提供20项免费保养服务<br />
                  10元内零部件免费更换
                </div>
              </section>
            </div>
            <div class="main-item">
              <img src="../../../../assets/images/mobile/cardiac-service/icon2.png" alt="" />
              <section>
                <div class="main-item-title">保证原厂配件</div>
                <div class="main-item-desc">
                  原厂配件质量可靠、安全，三包<br />
                  有保障，价格透明、值得您信赖
                </div>
              </section>
            </div>
            <div class="main-item">
              <img src="../../../../assets/images/mobile/cardiac-service/icon3.png" alt="" />
              <section>
                <div class="main-item-title">汽车级洗车服务</div>
                <div class="main-item-desc">
                  高效深度洗车，让每一台陪伴你<br />
                  的雅迪都历史弥新
                </div>
              </section>
            </div>
            <div class="main-item">
              <img src="../../../../assets/images/mobile/cardiac-service/icon4.png" alt="" />
              <section>
                <div class="main-item-title">免费上门服务</div>
                <div class="main-item-desc">
                  购车一年内，提供及时、快速免<br />
                  费上门服务（具体以当地实际开通情况为准）
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </van-dialog>

    <van-popup v-model:show="show" overlay-class="van-popup-cardiac-service" position="bottom" :style="{ height: '110px' }">
      <div class="flex-c pos-center">
        <img style="width: 90px; height: 90px" src="../../../../assets/images/cardiac-service/mini-code.png" alt="" />
        <div class="ml-3-mvw fs-12-mvw">
          微信扫码<br />
          进入车主服务小程序
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import banner from '@/assets/images/mobile/cardiac-service/banner.png'
// import banner11 from 'https://osswebsite.yadea.com.cn/Mask_group_2x_3_f859c7b52a.png?updated_at=2023-03-10T08:33:11.990Z'
// import banner22 from 'https://osswebsite.yadea.com.cn/Mask_group_2x_1_46acdbdd94.png?updated_at=2023-03-10T08:33:11.942Z'
// import banner33 from 'https://osswebsite.yadea.com.cn/Mask_group_2x_10d19d8ad3.png?updated_at=2023-03-10T08:33:11.985Z'
// import banner44 from 'https://osswebsite.yadea.com.cn/Mask_group_2x_2_61deac9a9c.png?updated_at=2023-03-10T08:33:11.944Z'

useHead({
  meta: [
    { name: 'keywords', content: '雅迪客户服务,雅迪服务政策' },
    {
      name: 'description',
      content: '雅迪客户服务为大家提供全国联保,原厂配件,上门服务,保养等信息,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const showBottom = $ref(false)

const mapping = {
  1: {
    banner: replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/bg1_a815a1e044.png?updated_at=2023-03-23T02:37:36.567Z'),
    txt: '更多服务渠道'
  },
  2: {
    banner: 'https://osswebsite.yadea.com.cn/Mask_group_2x_1_46acdbdd94.png?updated_at=2023-03-10T08:33:11.942Z',
    txt: '更快服务响应'
  },
  3: {
    banner: 'https://osswebsite.yadea.com.cn/Mask_group_2x_10d19d8ad3.png?updated_at=2023-03-10T08:33:11.985Z',
    txt: '更好服务体验'
  },
  4: {
    banner: 'https://osswebsite.yadea.com.cn/Mask_group_2x_2_61deac9a9c.png?updated_at=2023-03-10T08:33:11.944Z',
    txt: '更省服务成本'
  }
}

// ---data---
const show = $ref(false)
const title = $ref('')
const bgi = $ref('')
// ---function---

function openModal(id) {
  const { banner, txt } = mapping[id]
  title = txt
  bgi = banner
  show = true
}

function closeDialog() {
  show = false
}

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.m-page-cardiac-service {
  &-desc {
    .m-mt(40);
    .m-mb(25);
    text-align: center;
    .desc1 {
      .m-fs(14);
      font-weight: 500;
      margin-bottom: 6mpxvw;
    }
    .desc2 {
      .m-fs(12);
      font-weight: 400;
    }
  }
  main {
    .m-mlr(20);

    .list-item {
      .m-ptb(30);

      img {
        width: 100%;
        height: 350mpxvw;
        object-fit: cover;
        object-position: center;
      }

      .title {
        font-size: 14mpxvw;
        font-weight: 500;
        .m-mt(16);
        .m-mb(5);
      }

      .desc {
        font-size: 12px;
        .theme-color {
          font-family: DINPro-Bold;
          font-weight: bold;
        }
        .m-mb(24);
      }

      .yadi-mbtn-border3 {
        width: 130mpxvw;
        height: 37mpxvw;
        font-size: 12mpxvw;
        border: 1px solid #000;
      }
    }
  }
}

.van-popup-cardiac-service {
  display: none;
}

.van-dialog-cardiac-service {
  width: 306mpxvw;
  min-height: 429mpxvw;
  border-radius: 0;
  .van-dialog__header {
    padding: 0;

    .my-icon-cha {
      .m-w(20);
      .m-h(20);
    }
  }

  .main-item {
    &:last-child {
      .m-pb(5);
    }
    &:not(:last-child) {
      .m-pb(25);
    }
    display: flex;
    align-items: center;
    section {
      .m-ml(10);
    }
    &-title {
      font-size: 12mpxvw;
      font-weight: 500;
    }
    &-desc {
      font-size: 11mpxvw;
      font-weight: 400;
    }
  }

  .content3 {
    footer {
      .fs-11-mvw {
        .m-pt(10);
        // .m-pb(25);
      }
    }
  }

  .dialog-title {
    &-txt {
      .m-mt(13);
    }
  }

  .my-footer {
    display: flex;
    justify-content: space-around;
    margin-top: 33mpxvw;
    img {
      display: inline-block;
      .m-w(91);
      .m-h(198);
    }
  }

  .dialog-desc {
    .m-fs(12);
    .m-mb(10);
    display: flex;
    &-index {
      position: relative;
      width: 14mpxvw;
      height: 14mpxvw;
      background: #ff5f00;
      text-align: center;
      border-radius: 50%;
      .m-mr(8);
      span {
        .m-fs(10);
        .pos-center;
        color: #fff;
      }
    }
  }

  .modal3-img1 {
    display: inline-block;
    .m-w(209);
    .m-h(231);
  }

  .van-dialog__content {
    height: calc(100% - 54mpxvw);

    .dialog-content {
      height: 100%;

      .my-content {
        height: 100%;
        position: relative;

        .footer {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }
  }

  .bgi {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: -1;
  }

  .my-p {
    line-height: 1.8;
  }

  .footer {
    display: flex;
    justify-content: flex-end;

    &-content {
      display: flex;
      align-items: flex-end;

      svg {
        width: 16mpxvw;
        height: 16mpxvw;
      }
    }
  }

  .footer1 {
    .m-mt(157);
  }

  .footer2 {
    .m-mt(37);
  }

  .footer3 {
    .m-mt(13);
  }

  .footer4 {
    .m-mt(109);
  }

  .van-dialog__footer {
    display: none;
  }
}
</style>
