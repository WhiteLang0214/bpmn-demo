<template>
  <div>
    <el-button @click="goProcess">流程</el-button>
    <el-button @click="goAbout">关于</el-button>
    <div>
      <h1>全屏组件测试</h1>
      <div ref="parentRef" class="fullscreenBox">
        <MetaFullscreen :parent="parentRef"></MetaFullscreen>
        全屏组件测试
      </div>
    </div>
    <div>
      <h1>form表单组件测试</h1>
      <MetaForm
        ref="refForm"
        :rules="formObj.rules"
        :options="{
          formData: formObj.formData,
          formConfig: formObj.formConfig,
          listInfoObj: formObj.listInfoObj,
        }"
        @deleteFiles="onDeleteFiles"
        @changeEvent="changeEvent"
      />
    </div>
    <div>
      <h1>echarts组件</h1>
      <MetaEchartsBox style="width: 200px; height: 200px">
        <MetaLineBarChart
          height="100%"
          :series="chartData"
          :type="'bar'"
          :orient="'horizontal'"
          :axisData="axisData"
          :y="{ axisLabel: { color: '#fff' } }"
          :x="{ axisLabel: { color: '#fff' } }"
        />
      </MetaEchartsBox>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
const Router = useRouter();

const parentRef = ref(null);
const refForm = ref(null);

const formObj = reactive({
  formData: {
    casename: "",
    caseno: "",
    casetime: "",
    docIdList: [],
  },
  formConfig: [
    {
      label: "提案名称",
      span: 12,
      prop: "casename",
      type: "text",
      component: "el-input",
      labelWidth: "140px",
      bind: {
        maxlength: 100,
      },
    },
    {
      label: "提案编号",
      span: 12,
      prop: "caseno",
      type: "text",
      component: "el-input",
      labelWidth: "140px",
      bind: {
        placeholder: "可自动生成",
        maxlength: 50,
      },
    },
    {
      label: "提出人员",
      span: 12,
      prop: "raiseperson",
      type: "select",
      component: "el-select",
      labelWidth: "140px",
      list: "proposalPeopleList",
      bind: {
        placeholder: "问题发现人",
        noDataText: "暂无数据",
        filterable: true,
      },
    },
    {
      label: "改善前",
      span: 12,
      prop: "docIdList",
      type: "upload",
      component: "meta-upload",
      labelWidth: "140px",
      bind: {
        listType: "picture-card",
        fileType: "png,jpeg,jpg",
        limit: 5,
        apiType: "uploadImg",
        multiple: true,
      },
    },
  ],
  rules: {
    casename: [{ required: true, message: "请输入提案名称", trigger: "blur" }],
    casetypeid: [
      { required: true, message: "请选择提案类型", trigger: "blur" },
    ],
    casetime: [{ required: true, message: "请选择提案日期", trigger: "blur" }],
  },
  listInfoObj: {
    proposalPeopleList: [],
  },
});

const chartData = [
  {
    data: [10, 20, 30, 20, 15],
    name: "提案申请数",
    itemStyle: { color: "#29EDDD" },
    barWidth: 15,
  },
];

const axisData = ["周一", "周二", "周三", "周四", "周五"];

const goProcess = () => {
  Router.push("/process");
};

const goAbout = () => {
  Router.push("/about");
};

// 附件删除方法
const onDeleteFiles = ({ data, config }) => {
  console.log("附件删除方法----", data, config);
};

const changeEvent = (data, config) => {
  console.log("表单改变事件----", data, config);
};
</script>

<style>
.fullscreenBox {
  width: 200px;
  height: 150px;
  background-color: pink;
}
</style>