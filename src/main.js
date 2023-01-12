import { createApp } from 'vue'
import App from './App.vue'
import elementPlus from 'element-plus';
import HtComponent from 'ht-component';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import router from "./router/index"
import AbrainPcComponent from 'abrain-web-component';
import "abrain-web-component/dist/AbrainPcComponent.css";
console.log('AbrainPcComponent---', AbrainPcComponent)

createApp(App).use(elementPlus, {
  locale: zhCn,
}).use(AbrainPcComponent).use(HtComponent).use(router).mount('#app')
