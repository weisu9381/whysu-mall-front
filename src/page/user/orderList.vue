<template>
  <div>
    <y-shelf title="我的订单">
      <div slot="content">
        <div v-loading="loading" element-loading-text="加载中..." v-if="orderList.length" style="min-height: 10vw;">
          <div v-for="(item,index) of orderList" :key="index">
            <!--标题-->
            <div class="gray-sub-title cart-title">
              <div class="first">
                <div>
                  <span class="date" v-text="item.createDate"></span>
                  <span class="order-id">订单号：{{item.orderId}}</span>
                <!--  <span class="order-id">订单号：<a @click="orderDetail(item.orderId)">{{item.orderId}}</a></span>-->
                </div>
                <div class="f-bc">
                  <span class="price">单价</span>
                  <span class="num">数量</span>
                  <span class="operation">商品操作</span>
                </div>
              </div>
              <div class="last">
                <span class="sub-total">实付金额</span>
                <!--<span class="order-detail"><a @click="orderDetail(item.orderId)">查看详情 &gt; <em class="icon-font"></em></a></span>-->
                <span class="order-detail">订单状态</span>
              </div>
            </div>
            <!--第二行，内容-->
            <div class="pr">
              <div class="cart" v-for="(good,j) of item.goodsList" :key="'goods:'+j">
                <div class="cart-l" :class="{bt:j>0}">
                  <div class="car-l-l">
                    <div class="img-box"><a @click="goodsDetails(good.productId)"><img :src="good.productImg" alt=""></a></div>
                    <div class="ellipsis"><a style="color: #626262;" @click="goodsDetails(good.productId)">{{good.productName}}</a></div>
                  </div>
                  <div class="cart-l-r">
                    <div>¥ {{good.salePrice.toFixed(2)}}</div>
                    <div class="num">{{good.productNum}}</div>
                    <div class="type">
                      <el-button style="margin-left:20px" @click="_delOrder(item.orderId, index)" type="danger" size="small" v-if="j<1" class="del-order">删除此订单</el-button>
                    </div>
                  </div>
                </div>

                <div class="cart-r">
                  <span></span>
                  <span></span>
                </div>

              </div>

              <div class="prod-operation pa" style="right: 0;top: 0;">
                <div class="total">￥ {{item.orderTotal}}</div>
                <div v-if="item.orderStatus === '0'">
                  <el-button @click="choosePayType(item.orderId)" type="primary" size="small">现在付款</el-button>
                </div>
                <div class="status" v-if="item.orderStatus !== '0'"
                     :class="{red: item.orderStatus === '1' || item.orderStatus === '2' || item.orderStatus === '3',blue: item.orderStatus === '4',orange: item.orderStatus === '5' || item.orderStatus === '6'}">
                  {{getOrderStatus(item.orderStatus)}}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div v-loading="loading" element-loading-text="加载中..." class="no-info" v-else>
          <div style="padding: 100px 0;text-align: center">
            你还未创建过订单
          </div>
        </div>
      </div>
    </y-shelf>
    <div style="float:right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

    <!--选择支付方式-->
    <y-popup :open="popupOpen" @close='popupOpen=false' :title="popupTitle">
      <div slot="content">
        <div class="pay-type">
          <div class="pay-item">
            <div :class="{active:payType==1}" @click="toPay(1)"><img src="/static/images/alipay@2x.png" alt=""></div>
            <div :class="{active:payType==2}" @click="toPay(2)"><img src="/static/images/weixinpay@2x.png" alt=""></div>
          </div>
        </div>
      </div>
    </y-popup>
  </div>
</template>

<script>
  import YShelf from '/components/shelf'
  import YPopup from '/components/popup'
  import { orderList, delOrder } from '/api'
  import { getStore } from '/utils/storage'
  export default {
    data () {
      return {
        orderList: [], //订单列表
        userId: '', //用户
        orderStatus: '', //订单状态，其中0表示未付款
        loading: true,
        currentPage: 1, //当前第几页
        pageSize: 5, //每页多少个
        total: 0, //订单总数,
        popupOpen: false,//点击【现在付款】会弹出popup窗口
        popupTitle: '请选择支付方式',//popup窗口标题
        payType: 1,//支付方式
        chooseOrderId: '',//选中的orderId
      }
    },
    methods:{
      handleSizeChange (val) {
        this.pageSize = val
        this._orderList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this._orderList()
      },
      messageError (m) {
        this.$message.error({
          message: m
        })
      },
      messageSuccess(m){
        this.$message({
          message: m,
          type: 'success'
        })
      },
      _orderList(){
        //获取全部订单
        let param =  {
          params: {
            userId: this.userId.toString(),
            currentPage: this.currentPage.toString(),
            pageSize: this.pageSize.toString()
          }
        }
        orderList(param).then(res => {
          this.orderList = res.result.data;
          this.total = res.result.total;
          this.loading = false;
        })
      },
      orderDetail (orderId) {
        //跳转到订单详情页
        this.$router.push({
          path: 'orderDetail',
          query: {
            orderId: orderId
          }
        })
      },
      goodsDetails(productId){
        window.open(window.location.origin + '#/goodsDetails?productId=' + productId);
      },
      _delOrder (orderId, i) {
        let params = {
          params: {
            orderId: orderId
          }
        }
        delOrder(params).then(res => {
          if (res.success === true) {
            this.orderList.splice(i, 1)
            this.messageSuccess('删除成功！');
          } else {
            this.messageError('删除失败');
          }
        })
      },
      getOrderStatus (status) {
        if (status === '1') {
          return '订单审核中'
        } else if (status === '2') {
          return '待发货'
        } else if (status === '3') {
          return '待收货'
        } else if (status === '4') {
          return '交易成功'
        } else if (status === '5') {
          return '交易关闭'
        } else if (status === '6') {
          return '支付失败'
        }
      },
      choosePayType (chooseOrderId){
        this.popupOpen = true;
        this.chooseOrderId = chooseOrderId;
      },
      toPay(payType) {
        //前往支付
        if (payType === 1) {
          this.$router.push({path: '/order/alipay',query: {'orderId': this.chooseOrderId}});
        } else if (payType === 2) {
          this.$router.push({path: '/order/wechat',query: {'orderId': this.chooseOrderId}})
        } else {
          this.$router.push({path: '/order/alipay',query: {'orderId': this.chooseOrderId}})
        }
      }
    },
    created() {
      this.userId = getStore('userId');
      this._orderList();
    },
    components: {
      YShelf,
      YPopup
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .red {
    color: red;
    font-weight:bold;
  }

  .blue {
    color: #1316ce;
    font-weight:bold;
  }

  .orange {
    color: #9e6314;
    font-weight:bold;
  }

  .gray-sub-title {
    height: 38px;
    padding: 0 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    display: flex;
    span {
      display: inline-block;
      height: 100%;
    }
    .first {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .f-bc {
        > span {
          width: 112px;
          text-align: center;
        }
      }
    }
    .last {
      width: 230px;
      text-align: center;
      display: flex;
      border-left: 1px solid #ccc;
      span {
        flex: 1;
      }
    }
  }

  .bt {
    border-top: 1px solid #EFEFEF;
  }

  .date {
    padding-left: 0px;
  }

  .order-id {
    margin-left: 25px;
  }

  .cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    &:hover {
      .del-order {
        display: block;
      }
    }
    .del-order {
      display: none;
    }
    .cart-l {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 15px 0;
      justify-content: space-between;
      position: relative;
      &:before {
        position: absolute;
        content: ' ';
        right: -1px;
        top: 0;
        width: 1px;
        background-color: #EFEFEF;
        height: 100%;
      }
      .ellipsis {
        margin-left: 20px;
        width: 220px;
      }
      .img-box {
        border: 1px solid #EBEBEB;
      }
      img {
        display: block;
        @include wh(80px);
      }
      .cart-l-r {
        display: flex;
        > div {
          text-align: center;
          width: 112px;
        }
      }
      .car-l-l {
        display: flex;
        align-items: center;
      }
    }
    .cart-r {
      width: 230px;
      display: flex;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }

  .prod-operation {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 254px;
    div {
      width: 100%;
      text-align: center;
    }
    div:last-child {
      padding-right: 24px;
    }
  }

  /*支付类型*/
  .pay-type {
    display: inline-block;
    margin: 0 auto;
    width: 80%;
    padding-top:10px;
    padding-bottom: 30px;
  }

  .pay-type {
    .pay-item {
      display: flex;
      align-items: center;
      div {
        margin-top: 20px;
        width: 200px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #E5E5E5;
        cursor: pointer;
        border-radius: 6px;
        margin-right: 20px;
        background: #FAFAFA;
        &.active {
          border-color: #6A8FE5;
          background: #fff;
        }
        img {
          display: block;
          height: 34px;
          width: 125px;
          margin: 8px auto;
        }
      }
    }
  }
</style>

