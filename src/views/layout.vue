<template>
  <div id="layout">
    <header>header</header>
    <div class="container">
      <div class="menu">menu</div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
const utils = import(
  "../utils/index" 
  /* webpackPrefetch: true */ 
  /* webpackChunkName: "utils" */
);
export default {
  methods: {},
};
</script>

<style>
</style>