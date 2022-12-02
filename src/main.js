import { createApp } from 'vue'
import App from './App.vue'
import elementPlus from 'element-plus';
import HtComponent from 'ht-component';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import router from "./router/index"

createApp(App).use(elementPlus, {
  locale: zhCn,
}).use(HtComponent).use(router).mount('#app')
