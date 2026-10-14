import { createApp } from 'vue'
import 'animate.css'
import './style/index.less'
import App, { init, router } from '@/App.vue'
// 页面布局
import PageLayout from '@/view/components/page-layout/index.vue'
// 分页组件
import Pagination from '@/view/components/pagination/index.vue'
// 引入 echarts
import ECharts from 'vue-echarts'
// 导入 ECharts 核心组件和渲染器
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
// 导入需要的图例
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent
} from 'echarts/components';
const app = createApp(App)
// 注册必要的组件
echarts.use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent
]);

app.component('v-chart', ECharts)
// 全局组件挂载
app.component('PageLayout', PageLayout)
app.component('Pagination', Pagination)

// 全局错误处理器
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误捕获:', err, info);

  // 如果需要，可以在这里进行全局错误处理，如跳转到错误页面
  if (err.message.includes('Network Error')) {
    router.push({ name: '500' });
  }
};

app.use(init).use(router)
router.isReady().then(() => {
  app.mount('#app')
})
