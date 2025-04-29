import './assets/styles/login.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'

// 导入 ECharts
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { BarChart } from "echarts/charts"
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from "echarts/components"
import VChart from "vue-echarts"

// 注册 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
])

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

// 全局挂载 $message
app.config.globalProperties.$message = ElMessage

// 全局注册 v-chart 组件
app.component('v-chart', VChart)

app.mount('#app')
