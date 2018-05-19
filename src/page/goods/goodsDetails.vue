<template>
  <div class="w store-content">
    <!--上部-->
    <div class="gray-box">
      <!--左边-->
      <div class="gallery-wrapper">
        <div class="gallery">
          <!--图片小图-->
          <div class="thumbnail">
            <ul>
              <li v-for="(item, index) of smallPic" :key="index" :class="{on: bigPic=== item}" @click="bigPic = item">
                <img v-lazy="item" :alt="product.productName">
              </li>
            </ul>
          </div>
          <!--图片大图-->
          <div class="thumb">
            <div class="big">
              <img :src="bigPic" :alt="product.productName">
            </div>
          </div>
        </div>
      </div>

      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
           <h4>{{product.productName}}</h4>
           <h6>
             <span>{{product.subTitle}}</span>
             <span class="price">
               <em>￥</em><i>{{product.salePrice.toFixed(2)}}</i>
             </span>
           </h6>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum" :limit="product.limitNum"></buy-num>
        </div>
        <div class="buy">
          <y-button text="加入购物车" classStyle="main-btn"  style="width: 145px;height: 50px;line-height: 48px"
                    @btnClick="addCart(product.productId,product.salePrice,product.productName,product.productImageBig)">
          </y-button>
          <y-button text="购买" style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"
                    @btnClick="checkout(product.productId)">
          </y-button>
        </div>
      </div>
    </div>

    <!--下部-->
    <div class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item" v-if="productMsg">
            <div v-html="productMsg">{{ productMsg }}</div>
          </div>
          <div class="no-info" v-else>
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无内容数据
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>

<script>
  import YButton from '/components/YButton'
  import YShelf from '/components/shelf'
  import {productDetail } from '/api'
  import BuyNum from '/components/buynum'
  import { mapMutations, mapState } from 'vuex'
  export default {
    data () {
      return {
        smallPic: [], //图片小图
        bigPic: '', //图片大图
        product: {
          salePrice: 0 //商品信息，默认价格为0
        },
        productMsg: {}, //商品详细信息
      }
    },
    methods: {
      ...mapMutations(['ADD_CART', 'SHOW_CART']),
      editNum (num) {
        //BuyNum组件得到的商品数量
        this.productNum = num
      },
      addCart(id, price, name, img) {
        if (this.login) { //登录的话，将购物车记在用户名下
          //添加购物车
          addCart({userId: this.userId, productId: id, productNum: this.productNum}).then(res => {
            this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img});
          })
        } else {
          //未登录的话，只添加，没有用户id
          this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img,productNum: this.productNum});
        }
        //如果此时购物车没显示的话，就显示出来
        if (!this.showCart) {
          this.SHOW_CART({showCart: true})
        }
      }
    },
    created(){
      //传来的商品id
      let productId = this.$route.query.productId;
      productDetail({params: { productId }}).then(res => {
        let result = res.result
        this.product = result
        this.productMsg = result.detail || ''
        this.smallPic = result.productImageSmall
        this.bigPic = this.smallPic[0]
      })

    },
    components: {
      YButton,
      YShelf,
      BuyNum
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            @include wh(440px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>

