<template>
  <div id="layout">
    <!-- <header>header</header> -->
    <div class="container">
      <!-- <div class="menu">menu</div> -->
      <div class="content">
        <!-- <el-button type="primary" @click="goTest">点我显示测试页面</el-button> -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goTest() {
      this.$router.push("/test/demo1")
    }
  }
}
</script>

<style>

</style>