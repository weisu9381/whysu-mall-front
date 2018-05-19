<template>
 <div class="goods" >

   <div class="nav">
     <div class="w">
       <a href="javascript:;" :class="{active : orderCol === 'created'}" @click="sort('created','desc')" >综合排序</a>
       <a href="javascript:;" :class="{active : orderCol === 'price' && orderDir === 'asc'}" @click="sort('price','asc')">价格从低到高</a>
       <a href="javascript:;" :class="{active : orderCol === 'price' && orderDir === 'desc'}" @click="sort('price','desc')">价格从高到低</a>
       <div class="price-interval">
         <input type="number" class="input" placeholder="价格" v-model="minPrice">
         <span style="margin: 0 5px"> - </span>
         <input type="number" class="input" placeholder="价格" v-model="maxPrice">
         <y-button text="确定" classStyle="main-btn" style="margin-left: 10px;" @btnClick="confirm()"></y-button>
         <y-button text="重置价格" classStyle="main-btn" style="margin-left: 10px;" @btnClick="resetPrice()"></y-button>
       </div>
     </div>
   </div>

   <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;" >

     <!--商品-->
     <div class="img-item" v-if="!noResult && !error">
       <div class="goods-box w">
         <mall-goods v-for="(item, index) of product" :key="index" :product="item"></mall-goods>
       </div>
       <el-pagination
         v-if="!noResult&&!error"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         :page-sizes="[8, 20, 40, 80]"
         :page-size="pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
       </el-pagination>
     </div>

     <!--请求到数据，但是没有商品-->
     <div class="no-info" v-if="noResult && !error">
       <div class="no-data">
         <img src="/static/images/no-search.png">
         <br> 抱歉！暂时还没有商品
       </div>
     </div>

     <!--发生错误-->
     <div class="no-info" v-if="error">
       <div class="no-data">
         <img src="/static/images/error.png">
       </div>
     </div>
   </div>

 </div>
</template>

<script>
  import MallGoods from '/components/mallGood'
  import YButton from '/components/YButton'
  import YShelf from '/components/shelf'
  import {getAllProduct } from '/api'
  export default {
    data () {
      return {
        product: [], //所有商品信息
        total: 0, //返回的商品总个数
        currentPage: 1,//当前页
        pageSize: 20, //每页多少个
        minPrice: '', //最低价格
        maxPrice: '',  //最高价格
        orderCol: 'created',//按什么排序
        orderDir: 'desc', //降序或升序
        noResult: false, // false表示有数据， true表示请求到数据，但是没有商品
        error: false, //是否请求到数据， true表示发生错误
        loading: true //为了更好的视觉效果，不然点了“确定”按钮，数据发生了变化，但肉眼却看不出来变化了
      }
    },
    methods: {
      _getAllProduct () {
        let cid = this.$route.query.cid;
        if(this.minPrice !== ''){
          this.minPrice = Math.floor(this.minPrice); // 向下取整
        }
        if(this.maxPrice !== ''){
          this.maxPrice = Math.floor(this.maxPrice);
        }
        let params = {
          params: {
            pageNum: this.currentPage,
            size: this.pageSize,
            cid: cid,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            orderCol: this.orderCol,
            orderDir: this.orderDir
          }
        }
          getAllProduct(params).then(res => {
            if(res.success === false){
              this.error = true;
            }else{
              this.total = res.result.total;
              this.product = res.result.data;
              this.noResult = false;
              if(this.total === 0){
                this.noResult = true;//total为0的话，noResult就为true
              }
              this.error = false;
            }
            this.loading = false; //停止加载动画显示
          })
      },
      handleSizeChange (v){
        this.pageSize = v; //页数发生变化
        this.loading = true;
        this._getAllProduct();
      },
      handleCurrentChange(v){
        this.currentPage = v; //当前页发生变化
        this.loading = true;
        this._getAllProduct();
      },
      sort(orderCol,orderDir){
        this.orderCol = orderCol;
        this.orderDir = orderDir;
        this.currentPage = 1; //分页回到第一页
        this.loading = true;
        this._getAllProduct();
      },
      confirm(){
        //因为minPrice和maxPrice使用了v-model动态绑定，所以这里直接重新加载就好了
        this.currentPage = 1;
        this.loading = true;
        this._getAllProduct();
      },
      resetPrice(){
        //重置价格
        this.currentPage = 1;
        this.minPrice = "";
        this.maxPrice = "";
        this.loading = true;
        this._getAllProduct();
      }
    },
    mounted() {
      this._getAllProduct();
    },
    components: {
      YButton,
      MallGoods,
      YShelf
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/style/mixin";
  @import "../../assets/style/theme";

  .nav {
    height: 60px;
    line-height: 60px;
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #5683EA;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }

  .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }

  .no-info {
    padding: 100px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    .no-data{
      align-self: center;
    }
  }

  .img-item{
    display: flex;
    flex-direction: column;
  }

  .el-pagination{
    align-self: flex-end;
    margin: 3vw 10vw 2vw;
  }

  .section {
    padding-top: 8vw;
    margin-bottom: -5vw;
    width: 1218px;
    align-self: center;
  }

  .recommend {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }



</style>
