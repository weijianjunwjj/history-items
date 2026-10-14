<!--
 * @Author: weijianjun
 * @Date: 2023-02-03 09:35:11
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 14:19:29
 * @FilePath: \website\pages\index\use-guide\components\maintains\index.vue
 * @Description: xx保养
 * 
-->

<template>
  <div class="page-use-guide-maintain page-use-guide-pc-maintain page-mlr">
    <client-only>
      <a-breadcrumb class="breadcrumb" separator="">
        <a-breadcrumb-item @click="goBack"><a class="breadcrumb-first">车辆保养与维修</a></a-breadcrumb-item>
        <a-breadcrumb-separator>
          <SvgIcon name="arrow-right-black"></SvgIcon>
        </a-breadcrumb-separator>
        <a-breadcrumb-item class="breadcrumb-second opt65">{{ config.name }}</a-breadcrumb-item>
      </a-breadcrumb>
    </client-only>

    <p v-show="config.name === '保养周期'" class="maintenance-interval-decs opt65 fs-14-vw">
      电动车在正常使用过程中会接触各种各样的环境,整车各零部件在使用过程中会存在不同程度磨损,但有些关键零部件如不及时维修更换,将会影响车辆的性能甚至危害人身安全,所以雅迪向广大车主提供了定期免费保养服务,如
    </p>

    <div class="table1">
      <div class="title">{{ config.name }}</div>
      <client-only>
        <a-table
          v-show="config.name === '保养周期'"
          class="maintenance-interval-pc-table"
          :data-source="dataSource"
          :columns="columns"
          :pagination="false"
        >
        </a-table>
        <div v-show="config.name === '蓄电池使用和保养'" class="storage-battery-container">
          <div class="storage-battery-container-img">
            <div class="img-introduce-tips">
              <img :src="replaceImgUrl(tipsIcon)" alt="" />
              <div class="tips-title">警告：</div>
              <div class="tips-desc">1、蓄电池是电动轻便摩托车的重要部件，请正确使用并妥善保护</div>
            </div>
            <div class="storage-battery-container-img-flex-content">
              <div v-for="(item, index) in safetyPrecautionsList" :key="index" class="storage-battery-container-img-flex-content-item">
                <img class="storage-battery-container-img-flex-content-item-image" :src="item.imgUrl" alt="图片" />
                <p class="storage-battery-container-img-flex-content-item-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-show="config.name === '充电器使用和保养'" class="charger-container">
          <div class="charger-container-img">
            <div class="img-introduce-tips">
              <img :src="replaceImgUrl(tipsIcon)" alt="" />
              <div class="tips-title">警告：</div>
              <div class="tips-desc">1、充电前应当检查充电器的电池类型和充电器规格是否相互匹配</div>
            </div>
            <div class="charger-container-img-flex-content">
              <div v-for="(item, index) in ChargerList" :key="index" class="charger-container-img-flex-content-item">
                <img class="charger-container-img-flex-content-item-image" :src="item.imgUrl" alt="图片" />
                <p class="charger-container-img-flex-content-item-desc">{{ item.desc }}</p>
              </div>
            </div>
            <div class="img-introduce-tips img-introduce-tips-mt">
              <img :src="replaceImgUrl(tipsIcon)" alt="" />
              <div class="tips-title">警告：</div>
              <div class="surplus-container">
                <p>4、 当绿灯亮起应及时切断电源，禁止在不充电的情况下，长时间将充电器空载连接在交流电源上；</p>
                <p class="p-fw-bold">
                  5、 在充电过程中，如指示灯异常、出现异味或充电器外壳过热，应立即停止充电，并送至雅迪授权服务商处检修或更换；
                </p>
                <p>6、充电器在使用和保管过程中，注意避免异物进入，特别是避免流入水或其他液体，谨防雨淋，以免造成充电器内部短路；</p>
                <p>7、充电器尽量不要随车携带，如确需携带的，应在做好减震处理后放置于工具箱内；</p>
                <p class="p-fw-bold">8、充电器内含有高压电路，不得自行拆卸或更换充电器内的器件；</p>
                <p class="p-fw-bold">9、如果电源或充电系统出现故障，请前往雅迪授权服务商处进行更换和维修。</p>
              </div>
            </div>
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="jsx">
import maintenance from '@/assets/svg/maintenance-interval.svg'

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

const columns = [
  {
    title: '保养明细',
    dataIndex: 'item',
    width: '12%'
  },
  {
    title: '详细动作',
    dataIndex: 'detailAction',
    width: '18%'
  },
  {
    title: '1500公里/6个月',
    dataIndex: 'sixMonth',
    width: '17%',
    align: 'center',
    customRender: ({ text, record, index, column }) => {
      if (text) {
        return <img src={maintenance} class="svg-icon" />
      }
    }
  },
  {
    title: '3000公里/12个月',
    dataIndex: 'twelveMonth',
    width: '17%',
    align: 'center',
    customRender: ({ text, record, index, column }) => {
      if (text) {
        return <img src={maintenance} class="svg-icon" />
      }
    }
  },
  {
    title: '4500公里/18个月',
    dataIndex: 'eighteenMonth',
    width: '17%',
    align: 'center',
    customRender: ({ text, record, index, column }) => {
      if (text) {
        return <img src={maintenance} class="svg-icon" />
      }
    }
  },
  {
    title: '6000公里/24个月',
    dataIndex: 'twentyFourMonth',
    width: '19%',
    align: 'center',
    customRender: ({ text, record, index, column }) => {
      if (text) {
        return <img src={maintenance} class="svg-icon" />
      }
    }
  }
]

const dataSource = reactive([
  {
    item: '线路',
    detailAction: '电缆线检查、控制器插头检查、电源连头检查',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    item: '外观',
    detailAction: '轮胎检查、分析检查、整车塑件外观',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    item: '刹车系统',
    detailAction: '刹车油量检查、 刹车线检查刹车盘检查、制动器油管检有弹簧片检查、刹车片检查、刹车外观检查、刹车效果检查',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    item: '结构件',
    detailAction: '轮辋检查、各安装支架紧固、前后轮紧固、中撑/边撐整车螺丝螺栓螺丹紧固件',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    item: '电器件',
    detailAction: '智能APP功能检查、电机检查、防盗器检查、喇叭检查开关检查、仪表显示检查、灯光检查、电源锁检查',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    item: '悬挂+转向系统',
    detailAction: '车把转向检查,前后减震检查、钢柱和轴承检查、前轮检查后平叉检查',
    sixMonth: true,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    item: '整车骑行',
    detailAction: '驻车检查、整车异响检查、整车运行检查',
    sixMonth: false,
    twelveMonth: true,
    eighteenMonth: true,
    twentyFourMonth: true
  },
  {
    item: '电池',
    detailAction: '电池插孔检查、充电检测、防水性检查、电池盒外观检查电池检测',
    sixMonth: false,
    twelveMonth: false,
    eighteenMonth: true,
    twentyFourMonth: true
  }
])

const safetyPrecautionsList = ref([
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/69_4x_2x_2a3f41dd84_dffe2aa60a.png?updated_at=2023-03-16T03:17:45.717Z',
    desc: '2、充电时请务必使用本公司配置的专用充电器'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/74_4x_2x_7ec583a35a_bf1818af13.png?updated_at=2023-03-16T03:20:06.329Z',
    desc: '3、电池长时间存放会引起电池亏电， 建议每隔30天进行一次充电，以免影响电池性能和寿命'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/73_4x_2x_4da666e202_2c4c769d07.png?updated_at=2023-03-16T03:19:46.168Z',
    desc: '4、不要在电池电量过低或完全用尽后再补充电 了避免因“过放电”而造成电池寿命缩短'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/72_4x_2x_cd5f60b1e4_9c77fe80bf.png?updated_at=2023-03-16T03:19:15.338Z',
    desc: '5、电池不可靠近火源、热源，严禁在阳光下暴晒、 放入火中、投入水中或弄湿电池；'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/71_4x_2x_1a33c582db_47f1a6e52c.png?updated_at=2023-03-16T03:18:50.530Z',
    desc: '6、严禁电池正负极反接、短路'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/70_4x_2x_1d64f58256_bec119d55e.png?updated_at=2023-03-16T03:18:15.553Z',
    desc: '7、严禁电池倒置、卧放、重压、穿刺，以及使电池受到剧烈震动．碰撞'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/75_4x_2x_bd85c0b3b4_d33e061e5f.png?updated_at=2023-03-16T03:20:26.950Z',
    desc: '8、不要随意丢弃废旧蓄电池，也不可擅自拆解蓄电池，以免污染坏境。本产品的废蓄电池由雅迪授权经销商协助回收或相关专业部门组织回收'
  }
])

const ChargerList = ref([
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/69_4x_2x_1_08752ba91b.png?updated_at=2023-03-25T06:49:57.593Z',
    desc: '2、充电时，①先插充电孔 ②再连接电源；充足后 ③先断开电源 ④再拔充电孔连接线'
  },
  {
    imgUrl: 'https://osswebsite.yadea.com.cn/70_4x_956908e4e3.png?updated_at=2023-03-25T06:52:08.124Z',
    desc: '3、充电时应放置在通风环境下，严禁在室内或烈日及高温环境下充电，不得将充电器放在座桶或尾箱内充电'
  }
])

const tipsIcon = 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/7_4x_2_2x_ab35218d15.png?updated_at=2023-03-27T06:21:16.655Z'
// ---function---
</script>

<style lang="less">
.page-use-guide-maintain {
  .breadcrumb {
    .pt(50);
    // .pb(40);
    .fs(18);
    display: flex;
    flex-direction: row;
    align-items: center;

    .breadcrumb-first {
      color: #000000;
      text-decoration: none !important;
    }

    .ant-breadcrumb-separator {
      display: flex;
      justify-content: center;
    }

    .svg-icon {
      width: 6pxvw;
      height: 6pxvw;
      color: #000;
    }

    .breadcrumb-second {
      color: #000000;
    }
  }

  .title {
    .txt-c;
    .fs(42);
    .pb(60);
    // font-family: Source Han Sans SC-Medium, Source Han Sans SC;
    font-weight: 500;
  }

  .maintenance-interval-decs {
    margin-bottom: 0;
  }

  .table1 {
    .pb(80);
    .title {
      .fs(42);
      .pt(40);
      .pb(40);
      font-weight: 500;
    }

    .maintenance-interval-pc-table {
      padding-bottom: 60pxvw;
    }

    .storage-battery-container {
      padding: 0 46pxvw 70pxvw;
      background-color: #ffffff;
      &-img {
        margin: 0 auto;
        width: 1400pxvw;

        .img-introduce-tips {
          display: flex;
          align-items: center;
          padding: 40pxvw 0 32pxvw;
          & > img {
            width: 16pxvw;
            height: 14pxvw;
          }

          .tips-title {
            font-size: 16pxvw;
            color: #ff5f00;
            margin: 0 0 0 9pxvw;
            white-space: nowrap;
          }

          .tips-desc {
            font-size: 14pxvw;
          }
        }

        &-flex-content {
          display: flex;
          flex-wrap: wrap;

          &-item {
            width: 310pxvw;
            margin-left: 20pxvw;
            &:nth-of-type(5n),
            &:first-of-type {
              margin-left: 0;
            }

            &-image {
              width: 100%;
              padding-bottom: 20pxvw;
            }

            &-desc {
              .fs(16);
              .lh(25);
              margin-bottom: 62pxvw;
            }

            &:nth-last-child(-n + 3) .storage-battery-container-img-flex-content-item-desc {
              margin-bottom: 0 !important;
            }
          }
        }
      }
    }

    .charger-container {
      background-color: #ffffff;
      &-img {
        width: 1400pxvw;
        margin: 0 auto;
        padding: 45pxvw 0 37pxvw 196pxvw;

        .img-introduce-tips {
          display: flex;
          align-items: baseline;
          margin: 0 0 32pxvw;
          & > img {
            width: 16pxvw;
            height: 14pxvw;
          }

          .tips-title {
            font-size: 16pxvw;
            color: #ff5f00;
            margin: 0 0 0 9pxvw;
          }

          .tips-desc {
            font-size: 14pxvw;
          }

          .surplus-container {
            background-color: #ffffff;
            p {
              .fs(16);
              .pb(10);
              margin-bottom: 0 !important;
            }

            .p-fw-bold {
              font-weight: bold;
            }
          }
        }

        .img-introduce-tips-mt {
          margin: 60pxvw 0 0 0;
        }

        &-flex-content {
          display: flex;
          justify-content: space-between;
          padding: 0 196pxvw 0 0;

          &-item {
            width: 458pxvw;

            &-image {
              width: 100%;
              padding-bottom: 20pxvw;
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
  }
}
</style>
<style lang="less">
.page-use-guide-pc-maintain {
  .svg-icon {
    width: 20.5pxvw;
    height: 13pxvw;
  }
}
</style>
