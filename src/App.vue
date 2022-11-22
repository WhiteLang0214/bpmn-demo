<!--
 * @file name: 
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-10-14 21:20:10
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-22 11:42:12
-->
<template>
  <router-view />
</template>

<script>

export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* 自定义工具栏样式 */
.custom-icon-red::before {
  color: red !important;
}
.bjs-powered-by {
  display: none;
}
.bio-properties-panel-label {
  text-align: left;
}
</style>
