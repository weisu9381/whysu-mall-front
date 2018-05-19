<template>
  <div class="w">
    <y-shelf title="支付结果" style="text-align: center">
      <div slot="content" class="content">
        <p>
          <i class="el-icon-circle-check icon-success"></i> 恭喜您支付成功，系统审核中，请稍候，我们即将为您发货
          <br/><span v-model="time" style="color: #ac3124;">{{time}} </span>秒后即将跳转至 <a @click="toUser()">详情页面</a>
        </p>
        <div style="margin-top: 20px;">
          <router-link to="/user">
            <y-button text="查看订单" style="width: 150px;height: 50px;line-height: 48px;font-size: 20px"
                      classStyle="main-btn"></y-button>

          </router-link>
          <router-link to="/home">
            <y-button text="继续选购" style="width: 150px;height: 50px;line-height: 48px;font-size: 20px"
                      classStyle="main-btn"></y-button>

          </router-link>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  import YButton from '/components/YButton'
  export default {
    data () {
      return {
        time: 5
      }
    },
    components: {
      YShelf,
      YButton
    },
    methods: {
      countDown() {

      },
      toUser(){
        this.$router.push({path: '/user'});
      }
    },
    created () {
      let interval = setInterval(() => {
        if(this.time === 0){
          clearInterval(interval);
          this.$router.push({path: '/user'})
        }else{
          this.time --;
        }
      }, 1000);
    }
  }
</script>
<style lang="scss" scoped>
  .content {
    padding: 150px 0;
    font-size: 30px;
  }

  .icon-success {
    font-size: 33px;
    color: #01b401;
  }

  span.price {
    color: #d44d44;
    font-weight: 700;
    line-height: 20px;
    text-align: right;
  }
</style>
