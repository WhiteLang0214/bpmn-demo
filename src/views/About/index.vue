<template>
  <div>
    about
    <h1>子组件：</h1>
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
        /* webpackChunkName: "Setting" */
        "../Setting/index.vue"
      )
    ),
  },
  setup() {},
};
</script>

<style>
</style>