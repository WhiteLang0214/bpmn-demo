import { createApp } from 'vue'
import App from './App.vue'
import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import router from "./router/index"

// bpmn
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// 右边工具栏样式
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

createApp(App).use(elementPlus, {
  locale: zhCn,
}).use(router).mount('#app')
