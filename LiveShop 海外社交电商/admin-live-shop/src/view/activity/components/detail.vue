<template>
  <n-modal
      :show="visible"
      transform-origin="center"
      preset="dialog"
      style="width: 1050px"
      :show-icon="false"
      @close="handleCancel"
  >
    <n-descriptions label-placement="top" label-style="color: rgb(164, 164, 164);">
      <template #header>
        <div class="modelCustomHead flex">
          <span></span>
          基础信息
        </div>
      </template>
      <n-descriptions-item label="活动名称">
        {{ currentRow.name }}
      </n-descriptions-item>
      <n-descriptions-item label="活动简介">
        {{ currentRow.shortDesc }}
      </n-descriptions-item>
      <n-descriptions-item label="活动类型">
        <p v-if="currentRow.activityType == 1">众筹活动</p>
        <p v-if="currentRow.activityType == 2">拼团活动</p>
      </n-descriptions-item>
      <n-descriptions-item label="人数上限">
        {{ currentRow.peopleMax }}
      </n-descriptions-item>
      <n-descriptions-item label="自动开始" v-if="typeFlag == 3">
        {{ currentRow.isAutoStart ? '是' : '否' }}
      </n-descriptions-item>
      <n-descriptions-item label="活动周期" :span="2">
        始：{{ currentRow.startTime}}<br/>
        末：{{currentRow.endTime}}
      </n-descriptions-item>
      <n-descriptions-item label="参与人数" v-if="typeFlag != 3">
        {{ currentRow.participants }}
      </n-descriptions-item>
      <n-descriptions-item label="预约人数" v-else>
        {{ currentRow.bookingUser }}
      </n-descriptions-item>
      <n-descriptions-item label="兑换规则">
        {{ {1: '金币兑换', 2: '积分兑换', 3: '积分或金币兑换'}[currentRow.ruleType] }}
      </n-descriptions-item>
      <n-descriptions-item label="预约结束日期" v-if="typeFlag == 3">
        {{ currentRow.bookingDeadline }}
      </n-descriptions-item>
      <n-descriptions-item label="物流费用">
        {{ currentRow.freight }}
      </n-descriptions-item>
      <n-descriptions-item label="发布人">
        {{ currentRow.creatorName }}
      </n-descriptions-item>
      <n-descriptions-item label="发布时间">
        {{ currentRow.createdAt }}
      </n-descriptions-item>
    </n-descriptions>
    <div class="modelCustomHead flex">
      <span></span>
      活动图片
    </div>
    <div class="rowsCustomArrange">
      <div class="lenCoverBox">
        <p>封面图</p>
        <div class="coverImg">
          <n-image width="400" height="160" :src="getUrl(currentRow.banner)"/>
        </div>
      </div>
      <div class="goodHeadImgbox">
        <p>奖品头图</p>
        <div class="headmglist">
          <div class="imgBox" v-for="(item, index) in currentRow.reward" :key="index">
            <n-image width="110" height="110" :src="getUrl(item)"/>
          </div>
        </div>
      </div>
    </div>
    <div class="modelCustomHead flex">
      <span></span>
      数据统计
    </div>
    <div class="rowsCustomArrange">
      <div class="echartsInfo">
        <p>预约人数男女数量</p>
        <div class="echartsContentBox" id="detailEcharts"></div>
      </div>

      <div class="numsCardInfo flex">
        <p>参与成交总数</p>
        <div class="cardsBox flex">
          <n-statistic label="成交总积分">
            {{ customNumberFn(currentRow.integralTotal) }}
          </n-statistic>
          <n-statistic label="成交总金币" style="margin-left: 20px">
            {{ customNumberFn(currentRow.coinTotal) }}
          </n-statistic>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import {getUrl} from '@/utils/utils';
import * as echarts from 'echarts';

const detailEcharts = echarts;
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentRow: {
    type: Object,
    default: () => ({})
  },
  typeFlag: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits();

watch(
    () => props.visible,
    n => {
      if (n) {
        //弹窗打开 执行你的操作
        nextTick(() => {
          initChart(props.currentRow.gender);
        });
      }
    }
);

function initChart(genderList: Array<any>) {
  let chart = detailEcharts.init(document.getElementById('detailEcharts'));
  chart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 20,
      left: 'right'
    },
    series: [
      {
        name: '预约人数',
        type: 'pie',
        radius: ['0', '60%'],
        data: [
          {value: genderList[0] || 0, name: '男生'},
          {value: genderList[1] || 0, name: '女生'}
        ],
        center: ['45%', '40%'],
        label: {
          formatter: '{c}'
        },
        labelLine: {
          show: true,
          position: 'outside',
          length: 5,
          length2: 5
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
  window.onresize = function () {
    chart.resize();
  };
}

function customNumberFn(num: number) {
  if (num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return '0';
}

function handleCancel() {
  detailEcharts.dispose;
  emit('handleCancel');
}
</script>

<style lang="less" scoped>
.modelCustomHead {
  font-size: 16px;
  font-weight: 600;
  align-items: center;
  height: 30px;
  margin-bottom: 5px;
  margin-top: 10px;

  span {
    display: inline-block;
    width: 3px;
    height: 14px;
    background-color: #105cfb;
    margin-right: 5px;
  }
}

.rowsItems {
  display: flex;
  flex-wrap: wrap;

  .items_content {
    width: 33.3%;
    margin-bottom: 10px;
    color: #333333;

    p {
      display: flex;
      align-items: center;
    }

    p:last-child {
      width: calc(100% - 130px);
      overflow: hidden;
      // white-space: nowrap;
      text-overflow: ellipsis;
    }

    .items_label {
      width: 80px;
      text-align: left;
      color: rgb(164, 164, 164);
    }
  }
}

.rowsCustomArrange {
  display: flex;
  flex-wrap: wrap;

  p {
    color: rgb(164, 164, 164);
  }

  .echartsInfo {
    display: flex;
    flex-direction: column;
    width: 33.3%;

    .echartsContentBox {
      width: 240px;
      height: 200px;
    }
  }

  .lenCoverBox {
    // width: 33.3%;
    .coverImg {
      margin-top: 10px;
      width: 400px;
      height: 160px;
      // background: #ccc;
    }
  }

  .numsCardInfo {
    width: 40%;
    flex-direction: column;

    .cardsBox {
      margin-top: 10px;

      :deep(.n-statistic) {
        width: 170px;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 0px 0px 7px rgba(181, 181, 181, 0.3);

        .n-statistic-value__content {
          color: #169bd5;
          font-weight: bold;
        }
      }
    }
  }

  .goodHeadImgbox {
    flex: 1;
    margin-left: 20px;

    .headmglist {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;

      .imgBox {
        width: 110px;
        height: 110px;
        // background: #ccc;
        margin-right: 20px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
