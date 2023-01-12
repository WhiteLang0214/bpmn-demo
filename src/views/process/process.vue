<!--
 * @file name: 使用 ht-component 流程设计器组件测试页面
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-12-01 14:15:40
 * @LastEditors: langxue
 * @LastEditTime: 2022-12-02 09:10:13
-->
<template>
  <div class="demo">
    <h1>流程中的设置组件</h1>
    <Setting />
    <!-- <ht-process id="container" style="height: 100%"></ht-process> -->
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
const Setting = defineAsyncComponent(() =>
  import(
    "../Setting/index.vue"
  )
);
</script>


<style scoped>
/* bpmn */
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
/* 右边工具栏样式 */
@import "~bpmn-js-properties-panel/dist/assets/properties-panel.css";

.demo {
  height: 100vh;
}
.el-row {
  height: 500px;
}
.panel {
  height: 100%;
}

:deep(.customProvider-driver-header) {
  font-weight: bold;
  font-size: 16px;
  line-height: 35px;
  padding: 0 10px;
  text-align: left;
}
</style>