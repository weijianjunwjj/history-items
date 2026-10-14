// components/echarts-bar/index.js
import * as echarts from '../../components/ec-canvas/echarts';

const app = getApp();

let chart;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  chart.setOption(option);
  return chart;
}

const yData = [60, 100,70, 40, 30, 55, 65]
const yData2 = [120, 200, 150, 80, 70, 110, 130]

const option = {
  color: ['#3670FF','#29BDFF'],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['面积', '耗水']
  },
  grid: {
    left: '30rpx',
    right: '30rpx',
    bottom: '1%',
    containLabel: true
  },
  xAxis: {
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
  },
  yAxis: {
    axisTick: {
      show: false
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#999',
      }
    },
    axisLabel: {
      color: '#666',
      fontSize: 13
    }
  },
  series: [
    {
      name: '面积',
      type: 'bar',
      data: yData
    },
    {
      name: '耗水',
      type: 'bar',
      data: yData2
    },
 
  ]

}


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
  },
  lifetimes: {
    attached() {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
