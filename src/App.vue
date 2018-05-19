<template>
  <div id="app">
    <router-view class="main"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" rel="stylesheet/scss">
   @import "assets/style/index.scss";
  #app {
    height: 100%
  }
  .main {
    background: #ededed;
  }

</style>
