<template>

</template>

<script>
  /*因为从 /goods 跳转到 /goods?cid=1184 ，因为是同一个模块所以没刷新，通过该介质来刷新*/
  export default {
    data () {
      return {

      }
    },
    mounted() {
      this.$router.push({
        path: '/goods',
        query: {
          cid: this.$route.query.cid
        }
      })
    }
  }
</script>

<style scoped>

</style>
