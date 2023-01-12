<template>
  <div>
    about
    <h1>子组件：</h1>
    <Setting />
  </div>
</template>

<script>

import Setting from '../Setting/index.vue';

export default {
  components: {
    Setting,
  },
  setup() {
  }
};
</script>

<style>
</style>