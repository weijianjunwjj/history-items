<!--
 * @Author: weijianjun
 * @Date: 2023-02-03 09:35:11
 * @LastEditors: miaoyuxuan
 * @LastEditTime: 2023-03-07 21:31:28
 * @FilePath: /yadea-website/pages/index/mob/use-guide/components/maintains/index.vue
 * @Description: xx保养
 * 
-->

<template>
  <div>
    <div class="m-page-use-guide-maintain">
      <client-only>
        <a-breadcrumb class="breadcrumb" separator="">
          <a-breadcrumb-item @click="goBack"><a class="breadcrumb-first">车辆保养与维修</a></a-breadcrumb-item>
          <a-breadcrumb-separator>
            <SvgIcon name="arrow-right-black"></SvgIcon>
          </a-breadcrumb-separator>
          <a-breadcrumb-item class="breadcrumb-second opt65">{{ config.name }}</a-breadcrumb-item>
        </a-breadcrumb>
      </client-only>

      <div class="table1">
        <div v-if="config.name === '电池禁固保养'" class="opt65 fs-12-mvw">蓄电池是电动轻便摩托车的重要部件，请正确使用并妥善保护</div>
        <div class="title">{{ config.name }}</div>
        <client-only>
          <a-table
            v-if="config.name === '保养周期'"
            class="maintenance-interval-table"
            :data-source="dataSource"
            :columns="columns"
            :pagination="false"
          >
          </a-table>
          <div v-if="config.name === '蓄电池使用和保养'" class="storage-battery-box">
            <div class="table1-tip mb-4-mvw">
              <span class="txt1"><img src="@/assets/images/mobile/use-guide/warn.png" alt="" /> <span> 警告：</span></span>
              <span class="txt2">1、蓄电池是电动轻便摩托车的重要部件，请正确使用并妥善保护</span>
            </div>

            <template v-for="(item, index) in safetyPrecautionsList" :key="index">
              <div class="storage-battery-item">
                <img :src="item.imgUrl" alt="" />
                <div>{{ item.desc }}</div>
              </div>
            </template>
          </div>
          <div v-if="config.name === '充电器使用和保养'" class="storage-battery-box">
            <div class="table1-tip mb-4-mvw">
              <span class="txt1"><img src="@/assets/images/mobile/use-guide/warn.png" alt="" /> <span> 警告：</span></span>
              <span class="txt2">1、充电前应当检查充电器的电池类型和充电器规格是否相互匹配</span>
            </div>
            <template v-for="(item, index) in ChargerList" :key="index">
              <div class="storage-battery-item">
                <img :src="item.imgUrl" alt="" />
                <div>{{ item.desc }}</div>
              </div>
            </template>

            <div class="surplus-container">
              <div class="table1-tip mb-4-mvw">
                <span class="txt1"><img src="@/assets/images/mobile/use-guide/warn.png" alt="" /> <span> 警告：</span></span>
              </div>
              <p>4、 当绿灯亮起应及时切断电源,禁止在不充电的情况下,长时间将充电器空载连接在交流电源上；</p>
              <p class="fw-bold">
                5、 在充电过程中,如指示灯异常、出现异味或充电器外壳过热,应立即停止充电,并送至雅迪授权服务商处检修或更换；
              </p>
              <p>6、充电器在使用和保管过程中,注意避免异物进入,特别是避免流入水或其他液体,谨防雨淋,以免造成充电器内部短路；</p>
              <p>7、充电器尽量不要随车携带,如确需携带的,应在做好减震处理后放置于工具箱内；</p>
              <p class="fw-bold">8、充电器内含有高压电路,不得自行拆卸或更换充电器内的器件；</p>
              <p class="fw-bold">9、如果电源或充电系统出现故障,请前往雅迪授权服务商处进行更换和维修。</p>
            </div>
          </div>
        </client-only>
      </div>

      <a-modal v-model:visible="visible" :width="306" :footer="null" class="use-guide-inner-model" :closable="false">
        <div class="dialog-top-container">
          <div class="title">{{ dialogTitle }}</div>
          <svgIcon name="use-guide-close" class="dialog-close-btn" @click="visible = false" />
        </div>
        <div class="period">周期</div>
        <div class="detail-list">
          <div class="leading-title">1500公里/6个月</div>
          <img v-show="monthsSelectType.sixMonth" :src="maintenance" alt="" class="tail-image" />
        </div>
        <div class="detail-list">
          <div class="leading-title">3000公里/12个月</div>
          <img v-show="monthsSelectType.twelveMonth" :src="maintenance" alt="" class="tail-image" />
        </div>
        <div class="detail-list">
          <div class="leading-title">4500公里/18个月</div>
          <img v-show="monthsSelectType.eighteenMonth" :src="maintenance" alt="" class="tail-image" />
        </div>
        <div class="detail-list">
          <div class="leading-title">6000公里/24个月</div>
          <img v-show="monthsSelectType.twentyFourMonth" :src="maintenance" alt="" class="tail-image" />
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="jsx">
import maintenance from '@/assets/svg/maintenance-interval.svg'
import img1 from '../../../../../../assets/images/mobile/use-guide/img1.png'
import img2 from '../../../../../../assets/images/mobile/use-guide/img2.png'

// ---data---
const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {
        name: '',
        table: {}
      }
    }
  },
  goBack: {
    type: Function,
    default: () => {}
  }
})

const visible = $ref(false)
const dialogTitle = $ref('')
const monthsSelectType = $ref({
  sixMonth: false,
  twelveMonth: false,
  eighteenMonth: false,
  twentyFourMonth: false
})

const columns = [
  {
    title: '保养明细',
    dataIndex: 'maintenanceTitle',
    width: '25%'
  },
  {
    title: '详细动作',
    dataIndex: 'detailAction',
    width: '50%',
    customRender: ({ text, record, index, column }) => {
      return <div class={text === '√' && 'theme-color'}>{text}</div>
    }
  },
  {
    title: '保养详情',
    dataIndex: 'maintenanceDetails',
    width: '25%',
    customRender: ({ text, record, index, column }) => {
      return (
        <div class="view-detail" onClick={e => viewDetailClick(index, text)}>
          查看详情
        </div>
      )
    }
  }
]

const dataSource = reactive([
  {
    maintenanceTitle: '线路',
    detailAction: '电缆线检查、控制器插头检查、电源连头检查',
    maintenanceDetails: '',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    maintenanceTitle: '外观',
    detailAction: '轮胎检查、分析检查、整车塑件外观',
    maintenanceDetails: '',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    maintenanceTitle: '刹车系统',
    detailAction: '刹车油量检查、 刹车线检查刹车盘检查、制动器油管检有弹簧片检查、刹车片检查、刹车外观检查、刹车效果检查',
    maintenanceDetails: '',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    maintenanceTitle: '结构件',
    detailAction: '轮辋检查、各安装支架紧固、前后轮紧固、中撑/边撐整车螺丝螺栓螺丹紧固件',
    maintenanceDetails: '',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    maintenanceTitle: '电器件',
    detailAction: '智能APP功能检查、电机检查、防盗器检查、喇叭检查开关检查、仪表显示检查、灯光检查、电源锁检查',
    maintenanceDetails: '',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    maintenanceTitle: '悬挂+转向系统',
    detailAction: '车把转向检查,前后减震检查、钢柱和轴承检查、前轮检查后平叉检查',
    maintenanceDetails: '',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    maintenanceTitle: '整车骑行',
    detailAction: '驻车检查、整车异响检查、整车运行检查',
    maintenanceDetails: '',
    sixMonth: false,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    maintenanceTitle: '电池',
    detailAction: '电池插孔检查、充电检测、防水性检查、电池盒外观检查电池检测',
    maintenanceDetails: '',
    sixMonth: false,
    twelveMonth: false,
    eighteenMonth: true,
    twentyFourMonth: true
  }
])

const safetyPrecautionsList = ref([
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/69_4x_2x_2a3f41dd84_dffe2aa60a.png',
    desc: '1、充电时请务必使用本公司配置的专用充电器'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/73_4x_2x_4da666e202_2c4c769d07.png',
    desc: '2、电池长时间存放会引起电池亏电, 建议每隔30天进行一次充电,以免影响电池性能和寿命'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/74_4x_2x_7ec583a35a_bf1818af13.png',
    desc: '3、不要在电池电量过低或完全用尽后再补充电 了避免因“过放电”而造成电池寿命缩短'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/72_4x_2x_cd5f60b1e4_9c77fe80bf.png',
    desc: '4、电池不可靠近火源、热源,严禁在阳光下暴晒、 放入火中、投入水中或弄湿电池；'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/71_4x_2x_1a33c582db_47f1a6e52c.png?updated_at=2023-03-16T03:18:50.530Z',
    desc: '5、严禁电池正负极反接、短路'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/70_4x_2x_1d64f58256_bec119d55e.png?updated_at=2023-03-16T03:18:15.553Z',
    desc: '6、严禁电池倒置、卧放、重压、穿刺,以及使电池受到剧到震动．碰撞'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/75_4x_2x_bd85c0b3b4_d33e061e5f.png?updated_at=2023-03-16T03:20:26.950Z',
    desc: '7、不要随意丢弃废旧蓄电池,也不可擅自拆解蓄电池,以免污染坏境。本产品的废蓄电池由雅迪授权经销商协助回收或相关专业部门组织回收'
  }
])

const ChargerList = ref([
  {
    imgUrl: img1,
    desc: '2、充电时, ①先插充电孔 ②再连接电源; 充足后 ③先断开电源 ④再拔充电孔连接线'
  },
  {
    imgUrl: img2,
    desc: '3、充电时应放置在通风环境下, 严禁在室内或烈日及高温环境下充电, 不得将充电器放在座桶或尾箱内充电'
  }
])

const viewDetailClick = (index, desc) => {
  dialogTitle = dataSource[index].maintenanceTitle
  monthsSelectType.sixMonth = dataSource[index].sixMonth
  monthsSelectType.twelveMonth = dataSource[index].twelveMonth
  monthsSelectType.eighteenMonth = dataSource[index].eighteenMonth
  monthsSelectType.twentyFourMonth = dataSource[index].twentyFourMonth

  visible = true
}

// ---function---
</script>

<style lang="less">
.m-page-use-guide-maintain {
  .m-p(20);
  .breadcrumb {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 500;

    .breadcrumb-first {
      color: #000000;
      text-decoration: none !important;
      .m-fs(12);
    }

    .ant-breadcrumb-link {
      .m-fs(12);
    }

    .ant-breadcrumb-separator {
      display: flex;
      justify-content: center;
    }
    .svg-icon {
      width: 16mpxvw;
      height: 16mpxvw;
      color: #000;
    }
  }

  .title {
    .txt-c;
    .m-fs(20);
    .m-pt(32);
    .m-pb(20);
    font-weight: 500;
  }

  .table1 {
    .m-pb(20);
    &-title {
      .m-fs(42);
      .m-pt(100);
      .m-pb(60);
      font-weight: 500;
      .m-fs(20);
    }
    &-tip {
      .txt1 {
        font-size: 13mpxvw;
        font-weight: 500;
        color: #ff5f00;
      }
      .txt2 {
        font-size: 12mpxvw;
        font-weight: 400;
        color: #000000;
      }
    }

    .storage-battery-box {
      .m-p(20);
      .m-pb(34);
      background: #fff;

      .storage-battery-item {
        & + .storage-battery-item {
          .m-mt(32);
        }
        img {
          width: 297mpxvw;
          height: 248mpxvw;
          object-fit: contain;
          object-position: center;
        }
        div {
          .m-mt(12);
        }
      }
      .surplus-container {
        margin-top: 26mpxvw;
        > * {
          margin: 0;
          margin-top: 6mpxvw;
        }
      }
    }
  }

  .view-detail {
    color: #0094ff !important;
    text-decoration: underline;
  }
  .ant-table-cell {
    font-size: 13mpxvw;
  }
}
</style>

<style lang="less">
.use-guide-inner-model {
  .ant-modal-body {
    padding: 0;
  }
  .dialog-top-container {
    display: flex;
    justify-content: space-between;
    height: 54mpxvw;
    line-height: 54mpxvw;
    align-items: center;
    padding: 0 20mpxvw;
    .title {
      color: #000000;
      .m-fs(16);
      font-weight: 500;
      // padding-left: 20mpxvw;
    }

    svg {
      width: 20mpxvw;
      height: 20mpxvw;
      // padding-right: 20mpxvw;
    }
  }

  .period {
    display: inline-block;

    width: 100%;
    height: 32mpxvw;
    line-height: 32mpxvw;
    color: #ffffff;
    background-color: #ff5f00;
    padding-left: 20mpxvw;
  }

  .desc {
    .m-fs(12);
    padding-top: 12mpxvw;
  }
  .detail-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40mpxvw;
    padding: 0 20mpxvw 0;

    .tail-image {
      width: 15mpxvw;
      height: 10mpxvw;
    }
  }
}
</style>
