<template>

</template>

<script>
  /* 跳转到 /search, 虽然更新了数据，但肉眼看不出来，加个“刷新” */
  export default {
    data () {
      return {

      }
    },
    mounted() {
      this.$router.push({
        path: '/search',
        query: {
          key: this.$route.query.key //传递的搜索内容
        }
      })
    }
  }
</script>

<style scoped>

</style>
