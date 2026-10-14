<!--
 * @Author: weijianjun
 * @Date: 2023-02-19 16:22:23
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 17:04:07
 * @FilePath: \website\pages\index\mob\use-guide\index.vue
 * @Description: 
 * 
-->

<template>
  <div class="m-page-use-guide m-page-pt pos-rel">
    <div class="top flex-vc pl-4-mvw">
      <div class="top-content txt-c">
        <div class="top-content-title">使用指南</div>
      </div>
    </div>

    <div class="menu flex-vc page-menu-pl">
      <client-only>
        <a-tabs v-model:activeKey="current[0]" @tab-click="handleClickTab">
          <a-tab-pane v-for="item of menus" :key="item.name" :tab="item.name"></a-tab-pane>
        </a-tabs>
      </client-only>
    </div>

    <main class="page-bgc">
      <div v-show="activeKey === menus[0].name && !isShowChild" class="tab1-div">
        <div class="instruction-book flex-col just-sb">
          <div class="instruction-book-txt">
            <p>
              尊敬的用户，感谢你使用本公司生产的电动车，为保护你的合法权益，请熟读并严格遵守以下的相关标准及注意事项。当你使用本车时，请当场检验、调试并有权要求销售人员提供正确的操作方法及维护事项，提供有效购车票证和保修卡及保修单位的地址和联系电话。
            </p>
            <p>
              请不要私自对车体、线缆、电器件、发动机及其它有关该车结构性能进行改造；电缆线、电器件参数的私自修改，会造成整车性能下降或电器性能的失效及其它情况发生，缩短该车的使用寿命，性能得不到有效保障；由此产生的责任与损失，雅迪公司概不负责，一律由用户自行承担。
            </p>
          </div>

          <div class="instruction-book-code flex-col-sb align-center">
            <img src="@/assets/images/use-guide/code_wx.png" alt="" />
            <div>车主平台二维码</div>
          </div>
        </div>

        <!-- 车俩维修与保养 -->
        <div class="vehicle-maintenance">
          <div class="vehicle-maintenance-title">车辆保养与维修</div>

          <div class="vehicle-maintenance-mods m-auto m-page-mlr">
            <a-row v-for="(item, index) of types" :key="index" :gutter="[15, 15]">
              <a-col v-for="(item2, index2) of item" :key="index2" :span="24" @click="onJump(item2)">
                <div class="my-col">
                  <img :src="item2.icon" alt="" />
                  <div class="mt-4-vw">{{ item2.name }}</div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>

        <!-- 常见问题解答 -->

        <div class="FAQ">
          <div class="FAQ-title">常见问题解答</div>
          <div class="FAQ-list">
            <!-- accordion -->
            <a-collapse :bordered="false" expand-icon-position="right">
              <a-collapse-panel
                v-for="(item, index) of faqs"
                :key="index"
                :show-arrow="false"
                class="my-collapse-panel pos-rel"
                @click="handleClick(item)"
              >
                <template v-for="(aItem, aindex) in item.a" :key="aindex">
                  <p class="desc">
                    {{ aItem }}
                  </p>
                </template>
                <!-- <p class="desc">
                  请检查<br />
                  1.检修或更换充电器是否正常<br />
                  2.是否电池故障测试或更换电池<br />
                  3.检查轮胎气压是否正常或者是否严重过载或电机故障<br />
                  4.检查刹车系统是否正常
                </p> -->

                <template #header>
                  <div>{{ item.q }}</div>
                </template>

                <template #extra>
                  <img v-show="!item.close" class="plus" src="@/assets/images/use-guide/plus.png" alt="" />
                  <img v-show="item.close" class="reduce" src="@/assets/images/use-guide/reduce.png" alt="" />
                </template>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>

        <!-- 安全注意事项 -->
        <div class="safety-precautions-m-container">
          <div class="safety-precautions-m-container-title">安全注意事项</div>

          <div class="safety-precautions-m-container-flex-content">
            <div class="tip">
              <div class="label">行车安全</div>
              <div class="flex-c mt-1-mvw">
                <img src="@/assets/images/mobile/use-guide/warn0.png" alt="" />
                <span class="ml-1-mvw label">注意：</span>
              </div>
            </div>

            <div
              v-for="(item, index) in safetyPrecautionsList"
              :key="index"
              class="safety-precautions-m-container-flex-content-item"
              :style="index === 0 && 'padding-top:16px'"
            >
              <img class="safety-precautions-m-container-flex-content-item-image" :src="item.imgUrl" alt="图片" />
              <p class="safety-precautions-m-container-flex-content-item-desc">{{ item.desc }}</p>
            </div>

            <div class="tip mt-4-mvw mb-2-mvw">
              <div class="flex-c mt-1-mvw">
                <img src="@/assets/images/mobile/use-guide/warn.png" alt="" />
                <span class="ml-1-mvw label">警告：</span>
              </div>
            </div>

            <div class="ps">
              <p class="fw-bold">1. 严格遵守道路交通法规，谨慎驾驶，保持车距；禁止超速、闯红灯、逆向行驶；</p>
              <p class="fw-bold">2.驾驶电动两轮轻便摩托车/电动摩托车必须持有摩托车驾驶证方可骑行；</p>
              <p>3.严禁将本电动轻便摩托车/电动摩托车借给不会操纵或没有摩托车驾驶证的人员驾驶，避免发生事故;</p>
              <p>4.请按照法律法规规定搭载人员或物品，严禁超载；</p>
              <p>5.禁止酒后驾驶，患有高血压、疝气、脑震荡后遗症、癫痫病以及血管病等易突发疾病，请勿驾驶；</p>
              <p class="fw-bold">6.如果驾驶时发生异常，请立刻停止驾驶。并及时联系售后服务，在找出异常原因并修复前，请勿骑行。</p>
            </div>

            <div class="tip mt-6-mvw mb-3-mvw">
              <span class="ml-1-mvw label">使用安全事项</span>
            </div>

            <div class="tip flex flex-start">
              <div class="flex-c">
                <img src="@/assets/images/mobile/use-guide/warn.png" alt="" />
                <span class="ml-1-mvw label fs-13-mvw">警告：</span>
              </div>
              <div class="flex-1 fs-12-mvw fw-bold">禁止停放在建筑门厅、楼梯、走道、安全出口等区域，堵塞通道；</div>
            </div>

            <div class="tip flex flex-start">
              <div class="flex-c">
                <img src="@/assets/images/mobile/use-guide/dang.png" alt="" />
                <span class="ml-1-mvw label fs-13-mvw">危险：</span>
              </div>
              <div class="flex-1 fs-12-mvw fw-bold">
                禁止在居住建筑内和家庭室内充电和停放，充电时应远离可燃物，充电时间不宜过长；充电过程中，若有异味、温度过高、电池出现鼓包等现象时，请立即停止充电，并送至雅迪授权服务商检修；
              </div>
            </div>
            <div class="tip flex flex-start">
              <div class="flex-c">
                <img src="@/assets/images/mobile/use-guide/warn0.png" alt="" />
                <span class="ml-1-mvw label fs-13-mvw">注意：</span>
              </div>
              <div class="flex-1 fs-12-mvw">
                1. 水洗的注意事项：清洗前断开整车电源，禁止使用高压水枪冲洗，以免造成内部电子部件和线路进水造成事故隐患; 2.
                骑行时，保持车距，通过交叉路口时减速慢行 ，转弯前应发出转弯信号； 3. 骑行过路口时, 请走人行横道，注意礼让行人，避让机动车；
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeKey === menus[1].name && !isShowChild" class="page-paddinglr">
        <div class="table1">
          <div class="table1-title txt-c">部件三包范围与期限</div>
          <a-table class="sanbao-standard-table" :data-source="dataSource" :columns="columns" :pagination="false"> </a-table>
        </div>

        <div class="table2">
          <div class="table2-title txt-c">不属于“三包”的范围和内容</div>
          <a-table :data-source="dataSource2" :columns="columns2" :pagination="false" :show-header="false"> </a-table>
        </div>
      </div>

      <a-modal v-model:visible="visible" :width="306" :footer="null" class="use-guide-model" :closable="false">
        <div class="dialog-top-container">
          <div class="title">{{ dialogTitle }}</div>
          <svgIcon name="use-guide-close" class="dialog-close-btn" @click="closeDialog" />
        </div>
        <div class="desc">
          {{ dialogDesc }}
        </div>
      </a-modal>

      <!-- xx保养 -->
      <maintains v-show="isShowChild" :config="childConfig" :go-back="goBack" />
    </main>
  </div>
</template>
<script setup lang="jsx">
import icon1 from '@/assets/images/use-guide/icon-1.png'
import icon2 from '@/assets/images/use-guide/icon-2.png'
import icon3 from '@/assets/images/use-guide/icon-3.png'
import icon4 from '@/assets/images/use-guide/icon-4.png'
import icon5 from '@/assets/images/use-guide/icon-5.png'
import icon6 from '@/assets/images/use-guide/icon-6.png'
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
const visible = $ref(false)
const dialogTitle = $ref('')
const dialogDesc = $ref('')

const menus = $ref([
  {
    name: '车辆保养与维修'
  },
  {
    name: '零部件三包标准'
  }
])
console.log('menus :>> ', menus)
const customStyle = 'background: #fff;border-radius: 0;margin-bottom: 20px;border: 0;overflow: hidden'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '20%',
    customCell: (_, index) => {
      if (index === table1.length - 1) {
        return { colSpan: 0 }
      }
    }
  },
  {
    title: '部件名称',
    dataIndex: 'name',
    width: '30%',
    customCell: (_, index) => {
      if (index === table1.length - 1) {
        return { colSpan: 0 }
      }
    }
  },
  {
    title: '三包期限',
    dataIndex: 'deadline',
    width: '25%',
    customCell: (_, index) => {
      if (index === table1.length - 1) {
        return { colSpan: 0 }
      }
    }
  },
  {
    title: '三包内容',
    dataIndex: 'content',
    width: '25%',
    customRender: ({ text, record, index, column }) => {
      if (index === table1.length - 1) {
        return <div class="content" v-html={text} className="tab1-last-content"></div>
      } else {
        return (
          <div class="view-detail" onClick={e => viewDetailClick(index, text)}>
            查看详情
          </div>
        )
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
    imgUrl: 'https://osswebsite.yadea.com.cn/5_4x_2x_279bc84a83_f4f595e292.png?updated_at=2023-03-16T03:15:26.113Z',
    desc: '1、骑行时必须佩戴头盔，建议佩戴护目镜等防护用品'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/5_4x_2x_1_a27462041b.png?updated_at=2023-03-27T06:59:32.058Z',
    desc: '2、当您在颠簸的道路、减速带或其他非常规路面上行驶时，请减速慢行!'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/4_4x_2x_f2ec672774_95c4ff9f58.png?updated_at=2023-03-16T03:15:54.013Z',
    desc: '3、在湿滑地面/下坡骑行时，防止刹车抱死，引起摔车，请忽急刹；'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/3_4x_2x_ab9b61b666_ee0a20dceb.png?updated_at=2023-03-16T03:16:15.820Z',
    desc: '4、雨、雪骑行，制动距离会延长，易发生侧滑，请减速慢行；暴雨等恶劣天气，尽量避免出行；'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/1_4x_2x_1_e979ff1a0a.png?updated_at=2023-03-27T07:01:32.073Z',
    desc: '5、转弯时请勿将内侧的脚蹬放在最低处，以防脚蹬和地面接触导致车辆倾倒；'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/2_4x_2x_1_d5c93fca70.png?updated_at=2023-03-27T07:02:00.511Z',
    desc: '6、车辆在行驶时严禁将手、脚或物品伸入车轮、链条、脚蹬等旋转部件及间隙中，以防危机人身安全'
  }
])

function handleClick(item) {
  item.close = !item.close
}

function goBack() {
  isShowChild = false
}

function onJump(item) {
  const { name } = item
  isShowChild = true
  childConfig.name = name
  window.scrollTo({
    top: myTop
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

const viewDetailClick = (index, desc) => {
  dialogTitle = dataSource.value[index].name.slice(0, 7)
  if (dataSource.value[index].name.length > 7) {
    dialogTitle = dialogTitle.concat('...')
  }
  dialogDesc = desc
  visible = true
}

function closeDialog() {
  visible = false
}

onMounted(() => {
  current = [menus[0].name]
  const child = document.querySelector(`#menu-list`)
  if (!child) {
    return
  }
  const offsetTop = child.getBoundingClientRect().top
  const top = Math.abs(offsetTop) - getVW(60)
  myTop = top
})

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.m-page-use-guide {
  .ant-menu-item {
    padding-top: 14mpxvw;
    padding-bottom: 15mpxvw;
  }

  .ps {
    p {
      font-size: 12mpxvw;
      color: #000000;
      margin-bottom: 0;
      line-height: 19mpxvw;
    }
  }

  .top {
    width: 100%;
    height: 220mpxvw;
    background: url('@/assets/images/mobile/use-guide/banner.png') no-repeat;
    background-size: 100%;
    &-content {
      &-title {
        font-size: 24mpxvw;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }

  .ant-col.ant-col-12 {
    padding-top: 7.5px;
    padding-bottom: 7.5px;
  }

  .page-menu-pl {
    padding-left: 20mpxvw;
    .ant-tabs-tab-btn {
      font-size: 13mpxvw;
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
      overflow: hidden;
      .instruction-book {
        padding: 15mpxvw 15mpxvw 30mpxvw;
        // padding-bottom: 30mpxvw;
        background: #ffffff;
        margin: 20mpxvw 20mpxvw 0;
        &-txt {
          font-size: 12mpxvw;
          font-weight: 400;
        }

        &-code {
          & > img {
            display: inline-block;
            .m-w(90);
            .m-h(90);
          }
          & > div {
            font-size: 12mpxvw;
            font-weight: 400;
          }
        }
      }
    }

    .vehicle-maintenance {
      &-title {
        .txt-c;
        .m-pt(30);
        .m-pb(16);
        .m-fs(16);
        font-weight: 500;
      }

      &-mods {
        .my-col {
          cursor: pointer;
          .txt-c;
          .m-pt(10);
          .m-pb(14);
          background-color: #fff;

          & > img {
            .m-w(60);
            .m-h(60);
          }
          & > div {
            .m-fs(12);
            font-weight: 400;
          }
        }
      }
    }

    .FAQ {
      .m-pl(20);
      .m-pr(20);
      &-title {
        .txt-c;
        .m-pt(40);
        .m-pb(20);
        .m-fs(24);
        font-weight: 500;
      }
    }

    .safety-precautions-m-container {
      padding-bottom: 32mpxvw;
      &-title {
        .txt-c;
        .m-pt(40);
        .m-pb(20);
        .m-fs(24);
        font-weight: 500;
      }
      &-flex-content {
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        padding: 20mpxvw;
        width: 335mpxvw;
        background-color: #ffffff;
        flex-wrap: wrap;
        flex-direction: column;

        .tip {
          font-size: 14mpxvw;
          .label {
            color: #ff5f00;
            font-weight: bold;
          }
          img {
            display: inline-block;
            .m-w(12);
            .m-h(10);
          }
        }

        &-item {
          width: 100%;
          padding-top: 32mpxvw;
          &:first-of-type {
            padding-top: 0;
          }

          &-image {
            width: 100%;
            padding-top: 0;
            padding-bottom: 12mpxvw;
          }

          &-desc {
            .m-fs(12);
            .m-lh(18);
            margin-bottom: 0 !important;
          }
        }
      }
    }

    .page-paddinglr {
      padding: 0 12mpxvw 0;
      .table1 {
        &-title {
          .m-fs(24);
          .pt(100);
          .pb(60);
          font-weight: 500;
        }
      }
      .table2 {
        .pb(110);
        &-title {
          .m-fs(24);
          .pt(100);
          .pb(60);
          font-weight: 500;
        }
      }
    }
  }

  .sanbao-standard-table {
    .ant-table-cell {
      font-size: 13mpxvw;
    }
  }

  #menu-list {
    .menu-list-item {
      .m-ptb(19);
    }
  }

  .my-collapse-panel {
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
    .m-mb(12);
    border: none;
    .desc {
      margin-bottom: 0 !important;
    }
    .ant-collapse-header {
      .m-plr(0);
      .m-fs(12);
      .m-pl(20) !important;
      .m-ptb(12);
      font-weight: 400;
    }
    .ant-collapse-content {
      &::before {
        content: '';
        display: inline-block;
        position: absolute;
        left: 20mpxvw;
        width: calc(100% - 40mpxvw);
        height: 2px;
        transform: scale(1, 0.5);
        background: #e9e9e9;
      }
    }
    .ant-collapse-content-box {
      padding-top: 40pxvw !important;
      .m-pt(20);
      p {
        .m-fs(12);
        font-weight: 400;
      }
    }
    .ant-collapse-extra {
      position: absolute;
      .m-right(20);
      & > img {
        opacity: 1;
        .m-w(16);
        .m-h(16);
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
      &:first-child {
        .pl(39);
      }
      &:last-child {
        .pr(74);
      }
    }
  }

  .ant-table-tbody {
    .m-fs(12);
    font-weight: 400;
    .ant-table-row .ant-table-cell {
      &:first-child {
        .pl(39);
      }
      &:last-child {
        .pr(74);
      }
    }
  }

  .tab1-last-content {
    // width: 61.3571%;
    .ptb(48);
  }
}

.use-guide-model {
  .dialog-top-container {
    display: flex;
    justify-content: space-between;
    .title {
      color: #000000;
      font-weight: 500;
      .m-fs(16);
    }
  }
  svg {
    width: 20mpxvw;
    height: 20mpxvw;
  }

  .desc {
    .m-fs(12);
    padding-top: 12mpxvw;
  }
}
</style>

<style scoped lang="less">
.m-page-use-guide {
  &:deep(.view-detail) {
    color: #0094ff !important;
    text-decoration: underline;
  }
}
</style>
