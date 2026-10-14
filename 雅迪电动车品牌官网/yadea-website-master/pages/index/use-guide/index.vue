<!--
 * @Author: weijianjun
 * @Date: 2023-02-02 09:23:05
 * @LastEditors: miaoyuxuan
 * @LastEditTime: 2023-03-07 20:18:33
 * @FilePath: /yadea-website/pages/index/use-guide/index.vue
 * @Description: 使用指南
 * 
-->
<template>
  <div class="page-use-guide page-pt pos-rel">
    <div class="top flex-c">
      <div class="top-content">
        <div class="top-content-title">使用指南</div>
        <div class="top-content-search hide">
          <client-only>
            <a-input v-model:value="userName" placeholder="请输入您想要查的问题或关键词" class="my-search">
              <template #prefix>
                <img class="icon-search" src="@/assets/images/icon-search.png" alt="" />
              </template>
            </a-input>
          </client-only>
        </div>
      </div>
    </div>

    <div class="menu flex-vc page-menu-pl">
      <client-only>
        <a-tabs v-model:activeKey="current[0]" class="maintance-pc-tabs" @tab-click="handleClickTab">
          <a-tab-pane v-for="item of menus" :key="item.name" :tab="item.name" force-render></a-tab-pane>
        </a-tabs>
      </client-only>
    </div>

    <main class="page-bgc">
      <div v-show="activeKey === menus[0].name && !isShowChild" class="tab1-div">
        <div class="instruction-book flex-c-sb">
          <div class="instruction-book-txt">
            <p>
              尊敬的用户，感谢你使用本公司生产的电动车，为保护你的合法权益，请熟读并严格遵守以下的相关标准及注意事项。当你使用本车时，请当场检验、调试并有权要求销售人员提供正确的操作方法及维护事项，提供有效购车票证和保修卡及保修单位的地址和联系电话。
            </p>
            <p>
              请不要私自对车体、线缆、电器件、发动机及其它有关该车结构性能进行改造；电缆线、电器件参数的私自修改，会造成整车性能下降或电器性能的失效及其它情况发生，缩短该车的使用寿命，性能得不到有效保障；由此产生的责任与损失，雅迪公司概不负责，一律由用户自行承担。
            </p>
          </div>

          <div class="instruction-book-code flex-col-sb">
            <img src="@/assets/images/use-guide/code_wx.png" alt="" />
            <div>车主平台二维码</div>
          </div>
        </div>

        <!-- 车俩维修与保养 -->
        <div class="vehicle-maintenance">
          <div class="vehicle-maintenance-title">车辆保养与维修</div>

          <div class="vehicle-maintenance-mods m-auto page-mlr">
            <client-only>
              <a-row v-for="(item, index) of types" :key="index" :gutter="[30, 30]" :class="index === types.length - 1 && 'mt-6'">
                <a-col v-for="(item2, index2) of item" :key="index2" :span="8" @click="onJump(item2)">
                  <div class="my-col">
                    <img :src="item2.icon" alt="" />
                    <div class="mt-4-vw">{{ item2.name }}</div>
                  </div>
                </a-col>
              </a-row>
            </client-only>
          </div>
        </div>

        <!-- 常见问题解答 -->
        <div class="FAQ">
          <div class="FAQ-title">常见问题解答</div>

          <div class="page-mlr">
            <!-- accordion -->
            <client-only>
              <a-collapse :bordered="false" expand-icon-position="right">
                <a-collapse-panel
                  v-for="(item, index) of faqs"
                  :key="index"
                  :style="customStyle"
                  :show-arrow="false"
                  class="my-collapse-panel pos-rel"
                  @click="handleClick(item)"
                >
                  <template v-for="(aItem, aindex) in item.a" :key="aindex">
                    <p class="desc">
                      {{ aItem }}
                    </p>
                  </template>

                  <template #header>
                    <div>{{ item.q }}</div>
                  </template>

                  <template #extra>
                    <img v-show="!item.close" class="plus" src="@/assets/images/use-guide/plus.png" alt="" />
                    <img v-show="item.close" class="reduce" src="@/assets/images/use-guide/reduce.png" alt="" />
                  </template>
                </a-collapse-panel>
              </a-collapse>
            </client-only>
          </div>
        </div>

        <!-- 安全注意事项 -->
        <div class="safety-precautions-container">
          <div class="safety-precautions-container-title">安全注意事项</div>
          <div class="safety-precautions-container-flex-content">
            <div class="img-introduce-title">行车安全</div>
            <div class="img-introduce-tips">
              <img :src="replaceImgUrl(tipsIcon1)" alt="" />
              <div class="tips-title">注意：</div>
            </div>
            <div class="safety-precautions-container-flex-content-img">
              <div v-for="(item, index) in safetyPrecautionsList" :key="index" class="safety-precautions-container-flex-content-img-item">
                <img class="safety-precautions-container-flex-content-img-item-image" :src="replaceImgUrl(item.imgUrl)" alt="图片" />
                <p class="safety-precautions-container-flex-content-img-item-desc">{{ item.desc }}</p>
              </div>
            </div>
            <div class="img-introduce-tips">
              <img :src="replaceImgUrl(tipsIcon2)" alt="" />
              <div class="tips-title tips-title-bold">警告：</div>
            </div>

            <div class="img-introduce-desc">
              1. 严格遵守道路交通法规，谨慎驾驶，保持车距；禁止超速、闯红灯、逆向行驶； <br />2.
              驾驶电动两轮轻便摩托车/电动摩托车必须持有摩托车驾驶证方可骑行； <br />3.
              严禁将本电动轻便摩托车/电动摩托车借给不会操纵或没有摩托车驾驶证的人员驾驶，避免发生事故; <br />4.
              请按照法律法规规定搭载人员或物品，严禁超载； <br />5.
              禁止酒后驾驶，患有高血压、疝气、脑震荡后遗症、癫痫病以及血管病等易突发疾病，请勿驾驶； <br />6.
              如果驾驶时发生异常，请立刻停止驾驶。并及时联系售后服务，在找出异常原因并修复前，请勿骑行。
            </div>

            <div class="img-introduce-title mg-introduce-title-mt-40">使用安全事项</div>
            <div class="img-introduce-tips img-introduce-tips-pb0">
              <img :src="replaceImgUrl(tipsIcon2)" alt="" />
              <div class="tips-title">警告：</div>
              <div class="tips-desc">禁止停放在建筑门厅、楼梯、走道、安全出口等区域，堵塞通道；</div>
            </div>
            <div class="img-introduce-tips img-introduce-tips-pb0">
              <img :src="replaceImgUrl(tipsIcon3)" alt="" />
              <div class="tips-title">危险：</div>
              <div class="tips-desc">
                禁止在居住建筑内和家庭室内充电和停放，充电时应远离可燃物，充电时间不宜过长；充电过程中，若有异味、温度<br />过高、电池出现鼓包等现象时，请立即停止充电，并送至雅迪授权服务商检修；
              </div>
            </div>
            <div class="img-introduce-tips img-introduce-tips-pb0">
              <img :src="replaceImgUrl(tipsIcon1)" alt="" />
              <div class="tips-title">注意：</div>
              <div class="tips-desc tips-desc-fw-normal">
                1. 水洗的注意事项：清洗前断开整车电源，禁止使用高压水枪冲洗，以免造成内部电子部件和线路进水造成事故隐患; <br />2.
                骑行时，保持车距，通过交叉路口时减速慢行 ，转弯前应发出转弯信号； <br />3. 骑行过路口时,
                请走人行横道，注意礼让行人，避让机动车；
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeKey === menus[1].name && !isShowChild" class="page-plr">
        <div class="table1">
          <div class="table1-title txt-c">部件三包范围与期限</div>
          <client-only>
            <a-table :data-source="dataSource" :columns="columns" :pagination="false"> </a-table>
          </client-only>
        </div>

        <div class="table2">
          <div class="table2-title txt-c">不属于“三包”的范围和内容</div>
          <client-only>
            <a-table :data-source="dataSource2" :columns="columns2" :pagination="false" :show-header="false"> </a-table>
          </client-only>
        </div>
      </div>

      <!-- xx保养 -->
      <maintains v-show="isShowChild" :config="childConfig" :go-back="goBack" />
    </main>
  </div>
</template>
<script setup lang="jsx">
import { SearchOutlined } from '@ant-design/icons-vue'
import icon1 from '@/assets/images/use-guide/icon-1.png'
import icon2 from '@/assets/images/use-guide/icon-2.png'
import icon4 from '@/assets/images/use-guide/icon-4.png'
import maintains from './components/maintains'
import { table1, table2 } from './data'

useHead({
  meta: [
    { name: 'keywords', content: '雅迪保养,雅迪维修' },
    {
      name: 'description',
      content: '本页面为大家提供雅迪车辆保养和维修信息,包括保养周期等等,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const current = $ref([])
const isShowChild = $ref(false)
const activeKey = $ref('车辆保养与维修')
const myTop = $ref(0)
const tipsIcon1 = 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/7_4x_1_2x_b70ff4e225.png?updated_at=2023-03-27T06:03:38.147Z'
const tipsIcon2 = 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/7_4x_2_2x_ab35218d15.png?updated_at=2023-03-27T06:21:16.655Z'
const tipsIcon3 = 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/7_4x_1_2x_1_e9b02024e8.png?updated_at=2023-03-27T06:53:01.955Z'
const menus = $ref([
  {
    name: '车辆保养与维修'
  },
  {
    name: '零部件三包标准'
  }
])
const customStyle = 'background: #fff;border-radius: 0;margin-bottom: 20px;border: 0;overflow: hidden'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '10%',
    customCell: (_, index) => {
      if (index === table1.length - 1) {
        return { colSpan: 0 }
      }
    }
  },
  {
    title: '部件名称',
    dataIndex: 'name',
    width: '35%',
    customCell: (_, index) => {
      if (index === table1.length - 1) {
        return { colSpan: 0 }
      }
    }
  },
  {
    title: '三包期限',
    dataIndex: 'deadline',
    width: '15%',
    customCell: (_, index) => {
      if (index === table1.length - 1) {
        return { colSpan: 0 }
      }
    }
  },
  {
    title: '三包内容',
    dataIndex: 'content',
    width: '40%',
    customRender: ({ text, record, index, column }) => {
      if (index === table1.length - 1) {
        return <div class="content" v-html={text} className="tab1-last-content"></div>
      } else {
        return text
      }
    },
    customCell: (_, index) => {
      if (index === table1.length - 1) {
        return { colSpan: 4 }
      }
    }
  }
]

const columns2 = [
  {
    dataIndex: 'index',
    width: '20%'
  },
  {
    dataIndex: 'content',
    width: '80%'
  }
]

const dataSource = ref(table1)
const dataSource2 = ref(table2)

const childConfig = reactive({
  name: '',
  table: {}
})
const types = reactive([
  [
    {
      name: '保养周期',
      icon: icon1
    },
    {
      name: '蓄电池使用和保养',
      icon: icon4
    },
    {
      name: '充电器使用和保养',
      icon: icon2
    }
  ]
])

const faqs = reactive([
  {
    q: '车辆无法充电怎么办？',
    a: [
      '1. 打开电门锁, 检查充电口是否有电压, 若无电池存在故障',
      '2. 内部不可回复故障须返厂维修',
      '3. 测试电池输出电压是否在可充电范围内',
      '4. 将电池放置室温下等待'
    ]
  },
  {
    q: '整车没电怎么办？',
    a: ['1. 检修或更换控制器', '2. 检修或更换电池', '3. 检修主线缆']
  },
  {
    q: '骑行过程中经常断电怎么办？',
    a: ['1. 检修控制器或电机是否有漏电或损坏', '2. 更换电池']
  },
  {
    q: '电池接触不良怎么办？',
    a: ['1. 检查整车线路的短路源', '2. 更换电池', '3. 检修放电口']
  },
  {
    q: '接通电源，电机轮毂不工作怎么办？',
    a: ['1. 修理重接', '2. 找经销商维修']
  },
  {
    q: '调速失灵怎么办？',
    a: ['1.可能为调速手把中弹簧卡滞', '2.或内部霍尔元件失效, 请找经销商修理或更换']
  },
  {
    q: '一次充电后续航里程缩短怎么办？',
    a: [
      '请检查',
      '1. 检修或更换充电器是否正常',
      '2. 是否电池故障测试或更换电池',
      '3. 检查轮胎气压是否正常或者是否严重过载或电机故障',
      '4. 检查刹车系统是否正常'
    ]
  }
])

const safetyPrecautionsList = ref([
  {
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/6_4x_2x_1_b6cce6124c.png?updated_at=2023-03-27T06:58:14.260Z',
    desc: '1、骑行时必须佩戴头盔，建议佩戴护目镜等防护用品；'
  },
  {
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/5_4x_2x_1_a27462041b.png?updated_at=2023-03-27T06:59:32.058Z',
    desc: '2、当您在颠簸的道路、减速带或其他非常规路面上行驶时，请减速慢行!'
  },
  {
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/4_4x_2x_1_a16b71577a.png?updated_at=2023-03-27T07:00:10.593Z',
    desc: '3、在湿滑地面/下坡骑行时，防止刹车抱死，引起摔车，请勿急刹；'
  },
  {
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/3_4x_2x_1_795f662153.png?updated_at=2023-03-27T07:01:04.451Z',
    desc: '4、雨、雪天骑行，制动距离会延长，易发生侧滑，请减速慢行；暴雨等恶劣天气，尽量避免出行；'
  },
  {
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_4x_2x_1_e979ff1a0a.png?updated_at=2023-03-27T07:01:32.073Z',
    desc: '5、请勿急转弯！转身或转弯时，需将身体重心略微向转向方向倾斜，并缓慢转动车把。'
  },
  {
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_4x_2x_1_d5c93fca70.png?updated_at=2023-03-27T07:02:00.511Z',
    desc: '6、骑行时，请勿看手机或戴着耳机听音乐!'
  }
])

function handleClick(item) {
  console.log('item', item)
  item.close = !item.close
}

function goBack() {
  isShowChild = false
}

function onJump(item) {
  console.log('item', item)
  const { name } = item
  isShowChild = true
  childConfig.name = name
  window.scrollTo({
    top: myTop
    // behavior: 'smooth'
  })
}

function onClick(name) {
  isShowChild = false
  current = [name.toString()]
  activeKey = name.toString()
}

const handleClickTab = Key => {
  isShowChild = false
  current = [Key.toString()]
  activeKey = Key.toString()
}

onMounted(() => {
  current = [menus[0].name]
  const child = document.querySelector(`#menu-list`)
  if (!child) {
    return
  }
  const offsetTop = child.getBoundingClientRect().top
  const top = Math.abs(offsetTop) - getVW(60)
  console.log('top', top)
  myTop = top
})
</script>

<style lang="less">
.page-use-guide {
  .ant-menu-item {
    padding-top: 19pxvw;
    padding-bottom: 19pxvw;
  }

  .replacecolor {
    background-color: @orange !important;
  }
  .my-search {
    width: 550pxvw;
    height: 52pxvw;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #dddddd;
  }
  .top {
    width: 100%;
    height: 420pxvw;
    background: url('https://osswebsite.yadea.com.cn/bg_top_2440436db2_f368f8a04c.png?updated_at=2023-03-16T03:25:46.759Z') no-repeat;
    background-size: cover;
    padding-left: 260pxvw;
    &-content {
      &-title {
        .h(87);
        .fs(60);
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 30pxvw;
      }
    }
  }
  .page-menu-pl {
    padding-left: 260pxvw;
    .ant-tabs-tab-btn {
      font-size: 18pxvw;
      font-weight: 500;
    }
    .ant-tabs-top > .ant-tabs-nav {
      margin: 0;
    }

    .ant-tabs-top > .ant-tabs-nav::before {
      display: none;
    }
  }
  main {
    .tab1-div {
      .pt(60);
      .instruction-book {
        width: 1400pxvw;
        height: 376pxvw;
        padding: 72pxvw 110pxvw 72pxvw 70pxvw;
        background: #ffffff;
        margin: auto;
        &-txt {
          .w(873);
          .h(232);
          margin-right: 154pxvw;
          p {
            .fs(20);
            font-weight: 400;
            color: #000000;
            line-height: 1.7;
          }
        }

        &-code {
          .h(232);
          & > img {
            display: inline-block;
            .w(193);
            .h(193);
          }
          & > div {
            .fs(18);
            font-weight: 400;
            color: #000000;
            text-align: center;
            .lh(21);
            .ptb(5);
          }
        }
      }
    }

    .vehicle-maintenance {
      &-title {
        .txt-c;
        .pt(100);
        .pb(60);
        .fs(42);
        font-weight: 500;
      }

      &-mods {
        .my-col {
          cursor: pointer;
          .txt-c;
          .pt(34);
          .pb(40);
          background-color: #fff;
          & > div {
            .fs(24);
            font-weight: 500;
            // color: #000000;
          }
        }
      }
    }

    .FAQ {
      &-title {
        .txt-c;
        .pt(100);
        .pb(60);
        .fs(42);
        font-weight: 500;
      }
    }

    .safety-precautions-container {
      padding-bottom: 80pxvw;
      &-title {
        .txt-c;
        .pt(60);
        .pb(60);
        .fs(42);
        font-weight: 500;
      }
      &-flex-content {
        margin: 0 auto;
        width: 1400pxvw;
        background-color: #ffffff;
        padding: 52pxvw 56pxvw 80pxvw;

        .img-introduce-title {
          font-size: 23pxvw;
          color: #ff5f00;
          font-weight: bold;
        }

        .mg-introduce-title-mt-40 {
          margin: 40pxvw 0 12pxvw;
        }

        .img-introduce-tips {
          display: flex;
          align-items: center;
          padding: 0 0 20pxvw;
          & > img {
            width: 16pxvw;
            height: 14pxvw;
          }

          .tips-title {
            font-size: 16pxvw;
            font-weight: 500;
            color: #ff5f00;
            margin: 0 0 0 9pxvw;
          }

          .tips-title-bold {
            font-weight: 600;
          }

          .tips-desc {
            font-size: 14pxvw;
            font-weight: 500;
          }

          .tips-desc-fw-normal {
            font-weight: 400;
          }
        }

        .img-introduce-tips-pb0 {
          padding: 0 0 0 13pxv;
          font-size: 14pxvw;
          align-items: baseline;
        }

        .img-introduce-desc {
          font-size: 14pxvw;
          font-weight: 500;
        }

        &-img {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin: 0 0 40pxvw;

          &-item {
            width: 414pxvw;

            &-image {
              width: 100%;
              padding-bottom: 20pxvw;
            }

            &:nth-last-child(-n + 3) .safety-precautions-container-flex-content-img-item-image {
              padding-top: 20pxvw;
            }

            &-desc {
              .fs(16);
              .lh(25);
              margin-bottom: 0 !important;
            }
          }
        }
      }
    }

    .table1 {
      &-title {
        .fs(42);
        .pt(100);
        .pb(60);
        font-weight: 500;
      }
    }
    .table2 {
      .pb(110);
      &-title {
        .fs(42);
        .pt(100);
        .pb(60);
        font-weight: 500;
      }
    }
  }

  .maintance-pc-tabs {
    .ant-tabs-nav-operations {
      display: none;
    }
  }

  #menu-list {
    .menu-list-item {
      .ptb(19);
    }
  }

  .my-collapse-panel {
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
    .pl(56);
    .ant-collapse-header {
      .plr(0);
      .fs(24);
      .ptb(22);
      // font-family: Source Han Sans SC-Regular, Source Han Sans SC;
      font-weight: 400;
    }
    .ant-collapse-content {
      &::before {
        content: '';
        display: inline-block;
        position: absolute;
        width: calc(100% - 112pxvw);
        @media screen and (min-width: @max-media-width) {
          width: calc(100% - 112px);
        }
        height: 2px;
        transform: scale(1, 0.5);
        background: #d9d9d9;
      }
    }
    .ant-collapse-content-box {
      padding-top: 40pxvw !important;
      .pt(40);
    }
    .ant-collapse-extra {
      position: absolute;
      .right(56);
      & > img {
        opacity: 1;
        .w(32);
        .h(32);
        transition: all 0.5s;
      }
    }
  }

  .ant-table-thead > tr > th {
    background-color: @orange !important;
    color: #ffffff;
  }

  .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    width: 0 !important;
  }

  .ant-table-thead {
    .fs(24);
    font-weight: 500;
    .ant-table-cell {
      font-size: 20pxvw;
      &:first-child {
        .pl(39);
      }
    }
  }

  .ant-table-tbody {
    .fs(18);
    font-weight: 400;
    .ant-table-row .ant-table-cell {
      font-size: 16pxvw;
      &:first-child {
        .pl(39);
      }
    }
  }

  .tab1-last-content {
    width: 61.3571%;
    .ptb(48);
  }
}
</style>
