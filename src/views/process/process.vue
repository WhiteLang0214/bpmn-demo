<template>
  <div class="demo">
    <section>
      <el-button type="primary" @click="exportFun">导出</el-button>
    </section>
    <el-row>
      <el-col :span="16">
        <div id="container" style="height: 100%"></div>
      </el-col>
      <el-col :span="8">
        <!-- <div id="other-properties" class="panel"></div> -->
        <div id="js-properties-panel" class="panel"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="demo1">
import { onMounted, defineExpose, ref, reactive } from 'vue'
// import Modeler from 'bpmn-js/lib/Modeler'
// 自定义左侧工具栏
import  CustomModeler from './palette/customModeler'
import initDiagram from './diagram/initDiagram.bpmn'
// 这里引入的是右侧属性栏这个框
import {
  BpmnPropertiesPanelModule,
  // 引入的是右侧属性栏里的内容
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
  CloudElementTemplatesPropertiesProviderModule,
  CloudElementTemplatesValidator,
  ElementTemplatesPropertiesProviderModule,
  ZeebeDescriptionProvider,
  ZeebePropertiesProviderModule,
  useService } from 'bpmn-js-properties-panel'

import CamundaExtensionModule from 'camunda-bpmn-moddle/lib'
import camundaModdleDescriptors from 'camunda-bpmn-moddle/resources/camunda'
import customTranslate from "./translation/customTranslate";

// 自定义描述
import baseGeneralDescriptors from "./descriptors/general.json"

// 自定义属性
import FormGroupProvider from './provider/FormGroupProvider'
import TaskListenerProvider from './provider/TaskListenerProvider'
import ExecutionListenerProvider from './provider/ExecutionListenerProvider'



let bpmnModeler = null;
const init = () => {
  const dom = document.getElementById("container");
  bpmnModeler = new CustomModeler({
    container: dom,
    //添加控制板
    propertiesPanel: {
      parent: '#js-properties-panel'
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      // 控制属性栏
      BpmnPropertiesProviderModule,
      // CamundaPlatformPropertiesProviderModule,
      // CamundaExtensionModule,
      // CloudElementTemplatesPropertiesProviderModule,
      // CloudElementTemplatesValidator,
      // ElementTemplatesPropertiesProviderModule,
      // ZeebeDescriptionProvider,
      // ZeebePropertiesProviderModule,
      // useService,
      // 汉化
      customTranslateModule,
      // 自定义属性
      // 表单组
      FormGroupProvider,
      // 任务监听器
      TaskListenerProvider,
      // 执行监听器
      ExecutionListenerProvider
    ],
    moddleExtensions: {
      camunda: camundaModdleDescriptors,
      self: baseGeneralDescriptors,
    }
  });
  // 让流程图自适应屏幕
  const canvas = bpmnModeler.get("canvas");
  canvas.zoom('fit-viewport')

  console.log('bpmnModeler---', bpmnModeler, canvas)
  // console.log("获取 BpmnPropertiesProviderModule：", bpmnModeler.get('eventBus'))

  // const propertiesPanel = bpmnModeler.get('propertiesPanel');
  // console.log('----propertiesPanel-----', propertiesPanel)
  // propertiesPanel.attachTo('#other-properties');

  bpmnModeler.importXML(initDiagram).then(() => {
    addBpmnListener();
    addModelerListener();
    addElementListener();
  }).catch(err => {
    return console.error('failed to load diagram', err);
  })
}

// 监听图形变化时间
const addBpmnListener = () => {
  bpmnModeler.on('commandStack.changed', e => {
    console.log('commandStack.changed-----',e)
    // that.saveSVG(function(err, svg) {
    //     that.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
    // })
    // that.saveDiagram(function(err, xml) {
    //     that.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
    // })
  })
}

// 监听modeler并绑定事件
const addModelerListener = () => {
  // 添加流程节点；移动流程节点；移除流程节点；节点连接结束；节点连接中
  const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move']
  events.forEach((event) => {
    bpmnModeler.on(event, e => {
      // console.log(event, e, bpmnModeler.get)
      const elementRegistry = bpmnModeler.get('elementRegistry')
      const shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
      // 操作的图形 label 、Shape
      // console.log(shape)
      if (event === 'shape.added') {
        console.log('新增了shape', shape);
        // 存储当前新增的节点
        sessionStorage.setItem("newShape", shape)
      } else if (event === 'shape.move.end') {
        // console.log('移动了shape')
      } else if (event === 'shape.removed') {
        // console.log('删除了shape')
      }
    })
  })
}

// 监听element并绑定事件
const addElementListener = () => {
  const eventBus = bpmnModeler.get('eventBus')
  const eventTypes = ['element.click', 'element.changed'];
  eventTypes.forEach(type => {
    eventBus.on(type, e => {
      // 点击节点事件
      // console.log(e)
      if (!e || !e.element.type || e.element.type == 'bpmn:Process') return // 这里我的根元素是bpmn:Process
      const elementRegistry = bpmnModeler.get('elementRegistry')
      var shape = elementRegistry.get(e.element.id) // 传递id进去
      // 节点信息和shape信息
      // console.log(shape)
      if (type === 'element.changed') {
        exportFun()
      } else if (type === 'element.click') {
        // console.log('点击了element')
      }
    })
  })
}

// 将汉化包装成一个模块
const customTranslateModule = {
  translate: ['value', customTranslate]
}

const exportFun = async () => {
  const { xml } = await bpmnModeler.saveXML({ format: true })
  // 每次操作流程图都会更新数据
  console.log('export---', xml)
}

defineExpose({
  exportFun,
})

onMounted(() => {
  init()
})

</script>

<style scoped>
/* bpmn */
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
/* 右边工具栏样式 */
@import '~bpmn-js-properties-panel/dist/assets/properties-panel.css';

.demo {
  height: 100vh;
}
.el-row {
  height: 500px;
}
.panel {
  height: 100%;
}
</style>