<!--
 * @Author: yqq
 * @Date: 2023-01-31 10:36:48
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 09:02:50
 * @FilePath: \website\pages\index\cardiac-service\index.vue
 * @Description: 
 * 
-->
<template>
  <div>
    <div class="page-cardiac-service">
      <div class="banner">
        <div class="title">雅迪服务</div>
      </div>

      <div class="page-cardiac-service-desc">
        <div class="desc1">一键呼叫，好服务就在你身边</div>
        <div class="desc2">雅迪服务一站式电动车养护平台，为车主提供全面的用车养车服务，打造超越期待的服务体验</div>
      </div>

      <main>
        <div class="list">
          <div class="list-item list-item1">
            <div class="list-item-left">
              <div class="title"><span class="theme-color">更多</span> 服务渠道</div>
              <div class="desc"><span class="theme-color">40000+</span>服务网点，便捷服务</div>
              <my-button type="border3" shape="" class="learn-more" @click="openModal(1)">了解更多</my-button>
            </div>

            <img :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/DSCF_5184_HDR_2_1_fe436863d3.png')" alt="" />
          </div>
          <div class="list-item list-item2">
            <div class="list-item-left">
              <div class="title"><span class="theme-color">更快</span> 服务响应</div>
              <div class="desc">
                <span class="theme-color">24</span>小时道路救援 <span class="theme-color">5</span>分钟响应
                <span class="theme-color">30</span>分钟到达
              </div>
              <my-button type="border3" shape="" class="learn-more" @click="openModal(2)">了解更多</my-button>
            </div>

            <img :src="banner2" alt="" />
          </div>
          <div class="list-item list-item3">
            <div class="list-item-left">
              <div class="title"><span class="theme-color">更好</span> 服务体验</div>
              <div class="desc"><span class="theme-color">五星级</span>服务体验 <span class="theme-color">认证</span>工程师坐镇</div>
              <my-button type="border3" shape="" class="learn-more" @click="openModal(3)">了解更多</my-button>
            </div>

            <img :src="banner3" alt="" />
          </div>
          <div class="list-item list-item4">
            <div class="list-item-left">
              <div class="title"><span class="theme-color">更省</span> 服务成本</div>
              <div class="desc"><span class="theme-color">免费</span>检修 <span class="theme-color">明码</span>标价</div>
              <my-button type="border3" shape="" class="learn-more" @click="openModal(4)">了解更多</my-button>
            </div>
            <img :src="banner4" alt="" />
          </div>
        </div>
      </main>

      <client-only>
        <a-modal v-model:visible="show" :footer="null" class="modal-cardiac-service" @ok="openModal">
          <template #title>
            <div class="title">
              <svg-icon name="cha" class="my-cha" @click="closeModal" />
            </div>
          </template>

          <div class="bgi pos-mid" :style="`background-image:url(${bgi})`"></div>

          <div class="dialog-content pos-rel">
            <div v-if="title === '更多服务渠道'" class="my-content content1">
              <div class="content1-left">
                <div class="dialog-content-title">{{ title }}</div>

                <div class="dialog-content-desc1">任何一家都能提供专业、便捷、优质的服务</div>

                <div class="dialog-content-desc2 flex-c">
                  <div class="dialog-content-desc2-index flex-hvc"><span>1</span></div>
                  打开雅迪车主服务小程序
                </div>
                <div class="dialog-content-desc2 flex-c">
                  <div class="dialog-content-desc2-index flex-hvc"><span>2</span></div>
                  点击服务网点
                </div>
                <div class="dialog-content-desc2 flex-c">
                  <div class="dialog-content-desc2-index flex-hvc"><span>3</span></div>
                  轻松查询附近服务网点
                </div>

                <div class="dialog-footer dialog-footer1 flex-c">
                  <img class="mini-code" src="../../../assets/images/cardiac-service/mini-code.png" alt="" />
                  <div class="dialog-content-desc3 ml-3-vw">微信扫码<br />进入车主服务小程序</div>
                </div>
              </div>
              <div class="content1-right flex-c">
                <div class="content1-right-1 flex-col align-center">
                  <img class="content1-right-img1" src="../../../assets/images/cardiac-service/modal1-img1.png" alt="" />
                  <div class="dialog-content-desc2-index flex-hvc mt-2-vw ml-4-vw"><span>1</span></div>
                </div>
                <div class="content1-right-2 flex-col align-center">
                  <img src="../../../assets/images/cardiac-service/modal1-img2.png" alt="" />
                  <div class="dialog-content-desc2-index flex-hvc mt-2-vw ml-4-vw"><span>2</span></div>
                </div>
              </div>
            </div>
            <div v-if="title === '更快服务响应'" class="my-content content1">
              <div class="content1-left">
                <div class="dialog-content-title">{{ title }}</div>

                <div class="dialog-content-desc1">护航有道，时刻守护美好出行</div>

                <div class="dialog-content-desc2 flex-c">
                  <div class="dialog-content-desc2-index flex-hvc"><span>1</span></div>
                  打开雅迪车主服务小程序
                </div>
                <div class="dialog-content-desc2 flex-c">
                  <div class="dialog-content-desc2-index flex-hvc"><span>2</span></div>
                  点击一键救援
                </div>
                <div class="dialog-content-desc2 flex-c">
                  <div class="dialog-content-desc2-index flex-hvc"><span>3</span></div>
                  选择故障类型，点击救援
                </div>

                <div class="dialog-footer dialog-footer1 flex-c">
                  <img class="mini-code" src="../../../assets/images/cardiac-service/mini-code.png" alt="" />
                  <div class="dialog-content-desc3 ml-3-vw">微信扫码<br />进入车主服务小程序</div>
                </div>
              </div>
              <div class="content1-right flex-c">
                <div class="content1-right-1 flex-col align-center">
                  <img class="content1-right-img1" src="../../../assets/images/cardiac-service/modal1-img1.png" alt="" />
                  <div class="dialog-content-desc2-index flex-hvc mt-2-vw ml-4-vw"><span>1</span></div>
                </div>
                <div class="content1-right-2 flex-col align-center">
                  <img src="../../../assets/images/cardiac-service/modal2-img2.png" alt="" />
                  <div class="dialog-content-desc2-index flex-hvc mt-2-vw ml-4-vw"><span>2</span></div>
                </div>
              </div>
            </div>
            <div v-if="title === '更好服务体验'" class="my-content content1 content3">
              <div class="content1-left">
                <div class="dialog-content-title">{{ title }}</div>

                <div class="dialog-content-desc1">轻松解决问题，让旅途更长久</div>

                <div class="dialog-content-desc2">
                  行业五星级服务认证<br />
                  星级服务体验中心<br />
                  认证工程师坐镇
                </div>

                <div class="dialog-footer dialog-footer1 flex-c">
                  <img class="mini-code" src="../../../assets/images/cardiac-service/mini-code.png" alt="" />
                  <div class="dialog-content-desc3 ml-3-vw">微信扫码<br />进入车主服务小程序</div>
                </div>
              </div>
              <div class="content3-right flex-c">
                <div class="content3-right-1 flex-col align-center">
                  <img class="content3-right-img1" src="../../../assets/images/cardiac-service/modal3-img1.png" alt="" />

                  <div class="content3-right-txt">国家权威认证：行业内首家通过五星级售后服务认证</div>
                </div>
              </div>
            </div>
            <div v-if="title === '更省服务成本'" class="my-content content4 flex-col">
              <div class="header">
                <div class="dialog-content-title">{{ title }}</div>
                <div class="dialog-content-desc1 mt-2-vw">省钱、省时、更省心、超值服务值得信赖</div>
              </div>

              <div class="middle">
                <section class="flex-c">
                  <div class="middle-item">
                    <img class="middle-item-img" src="../../../assets/images/mobile/cardiac-service/icon1.png" alt="" />
                    <div class="middle-item-txt">
                      <div>免费保养服务</div>
                      <div>
                        提供20项免费保养服务<br />
                        10元内零部件免费更换
                      </div>
                    </div>
                  </div>
                  <div class="middle-item">
                    <img class="middle-item-img" src="../../../assets/images/mobile/cardiac-service/icon2.png" alt="" />
                    <div class="middle-item-txt">
                      <div>保证原厂配件</div>
                      <div>原厂配件质量可靠、安全，三包有保障，价格透明、值得您信赖</div>
                    </div>
                  </div>
                </section>

                <section class="flex-c" style="margin-top: 52px">
                  <div class="middle-item">
                    <img class="middle-item-img" src="../../../assets/images/mobile/cardiac-service/icon3.png" alt="" />
                    <div class="middle-item-txt">
                      <div>汽车级洗车服务</div>
                      <div>高效深度洗车，让每一台陪伴你的雅迪都历史弥新</div>
                    </div>
                  </div>
                  <div class="middle-item">
                    <img class="middle-item-img" src="../../../assets/images/mobile/cardiac-service/icon4.png" alt="" />
                    <div class="middle-item-txt">
                      <div>免费上门服务</div>
                      <div>购车一年内，提供及时、快速免费上门服务(具体以当地实际开通情况为准)</div>
                    </div>
                  </div>
                </section>
              </div>

              <div class="dialog-footer dialog-footer1 flex-c">
                <img class="mini-code" src="../../../assets/images/cardiac-service/mini-code.png" alt="" />
                <div class="dialog-content-desc3 ml-3-vw">微信扫码<br />进入车主服务小程序</div>
              </div>
            </div>
          </div>
        </a-modal>
      </client-only>
    </div>
  </div>
</template>

<script setup>
import banner1 from '@/assets/images/cardiac-service/banner1.png'
import banner2 from '@/assets/images/cardiac-service/banner2.png'
import banner3 from '@/assets/images/cardiac-service/banner3.png'
import banner4 from '@/assets/images/cardiac-service/banner4.png'
import banner11 from '@/assets/images/cardiac-service/banner11.png'
import banner22 from '@/assets/images/cardiac-service/banner22.png'
import banner33 from '@/assets/images/cardiac-service/banner33.png'
import banner44 from '@/assets/images/cardiac-service/banner44.png'

useHead({
  meta: [
    { name: 'keywords', content: '雅迪客户服务,雅迪服务政策' },
    {
      name: 'description',
      content: '雅迪客户服务为大家提供全国联保,原厂配件,上门服务,保养等信息,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const mapping = {
  1: {
    banner: banner11,
    txt: '更多服务渠道'
  },
  2: {
    banner: banner22,
    txt: '更快服务响应'
  },
  3: {
    banner: banner33,
    txt: '更好服务体验'
  },
  4: {
    banner: banner44,
    txt: '更省服务成本'
  }
}

const title = $ref('')
const bgi = $ref('')
const show = $ref(false)

function openModal(id) {
  const { banner, txt } = mapping[id]
  title = txt
  bgi = banner
  show = true
  console.log('title :>> ', title)
}

function closeModal() {
  show = false
}
</script>

<style lang="less">
.page-cardiac-service {
  padding-top: @layout-header-height;

  .banner {
    position: relative;
    .h(500);
    background-image: url(https://osswebsite.yadea.com.cn/Rectangle_219_92321356f9.png);
    background-size: 100%;

    .title {
      .pos-middle-v;
      .fs(60);
      font-weight: bold;
      color: #ffffff;
      .ml(260);
    }
  }

  &-desc {
    .mt(130);
    .mb(52);
    text-align: center;
    .desc1 {
      .fs(40);
      font-weight: 500;
      margin-bottom: 12pxvw;
    }
    .desc2 {
      .fs(20);
      font-weight: 400;
    }
  }

  main {
    padding-top: 90pxvw;
    padding-bottom: 20pxvw;

    .list-item {
      margin-bottom: 60pxvw;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 260pxvw;

      img {
        width: 790pxvw;
      }

      &-left {
      }

      .title {
        .fs(42);
        font-weight: 500;
      }

      .learn-more {
        border: 2px solid #000000;
        font-size: 18pxvw;

        &:hover {
          color: #000;
        }
      }

      .desc {
        .mt(12);
        .mb(60);
        .fs(24);
        font-family: DINPro-Bold;
        font-weight: bold;
      }
    }
  }
}
</style>

<style lang="less">
.modal-cardiac-service {
  .w-i(1400);

  .mini-code {
    display: inline-block;
    .w(100);
    .h(100);
  }

  .ant-modal-content {
  }

  .content4 {
    .pt(49);
    .pb(170);
    .plr(200);
    .middle-item {
      display: flex;
      align-items: center;
      &-img {
        .w(90);
        .h(90);
      }
      &-txt {
        .ml(30);
        .mr(70);
        .w(310);
      }
    }
  }

  .content1 {
    display: flex;
    align-items: center;
    .pt(49);
    .pb(91);
    .plr(200);
    &-right {
      .ml(95);
      img {
        .w(273);
        .h(552);
      }
      &-1 {
        .mr(55);
      }
    }
  }

  .content3 {
    .pr(164);
    justify-content: space-between;
    &-right-1 {
      .w(533);
      .h(692);
    }

    .content3-right {
      position: relative;
      // .ml(295);
      .content3-right-txt {
        position: absolute;
        top: 546pxvw;
        .fs(14);
      }
      .content3-right-img1 {
        width: 533pxvw;
        height: 546pxvw;
      }
    }
    .dialog-content-desc2 {
      .fs(14);
    }
  }

  .ant-modal-header {
    .pt(40);
    .plr(50);
  }

  .ant-modal-body {
    padding: 0;
  }

  .dialog-footer {
    .fs(24);
    .mt(118);
  }

  .dialog-content {
    .p(0);

    &-title {
      .fs(28);
      .mb(10);
      font-weight: 500;
      color: #000000;
    }

    &-desc1 {
      .fs(16);
      .mb(42);
    }

    &-desc2 {
      .fs(14);
      .mb(28);
      display: flex;
      &-index {
        position: relative;
        width: 24pxvw;
        height: 24pxvw;
        background: #ff5f00;
        text-align: center;
        border-radius: 50%;
        .mr(12);
        span {
          .pos-center;
          color: #fff;
          .fs(14);
        }
      }
    }

    &-desc3 {
      .fs(14);
    }

    &-footer {
      .mt(90);
    }

    .main {
      .fs(32);
      font-family: DINPro-Bold;
      font-weight: bold;
      line-height: 1.8;
    }
  }

  .bgi {
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .my-p {
    .fs(32);
    line-height: 1.8;
  }

  .footer {
    display: flex;
    justify-content: flex-end;

    .code {
      .w(179);
      .h(179);
    }

    &-content {
      display: flex;
      align-items: flex-end;
    }
  }

  .footer1 {
    .mt(47);
  }

  .footer2 {
    .mt(96);
  }

  .footer3 {
    margin-top: 96pxvw;
  }

  .footer4 {
    .mt(47);
  }

  .ant-modal-close-x {
    display: none;
  }

  .title {
    display: flex;
    justify-content: flex-end;
  }

  .ant-modal-header {
    border-bottom: 0;
  }

  .h(800);

  .my-cha {
    .w(32);
    .h(32);
    z-index: 11;
  }
}
</style>
