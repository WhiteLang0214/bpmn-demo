<template>
  <div>
    <h1>关于中的设置组件：</h1>
    <Setting />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    Setting: defineAsyncComponent(() =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "AboutSetting" */
        "../Setting/index.vue"
      )
    ),
  },
  setup() {},
};
</script>

<style>
</style>