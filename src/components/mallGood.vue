<template>
  <div class="good-item">
    <div style="">
      <div class="good-img">
        <a target="_blank" :href="'/#/goodsDetails?productId='+product.productId">
          <img v-lazy="product.productImageBig" :alt="product.productName"/>
        </a>
        <h6 class="good-title" v-html="product.productName">{{product.productName}}</h6>
        <h3 class="sub-title ellipsis">{{product.subTitle}}</h3>

        <div class="good-price pr">
          <div class="ds pa">
            <a target="_blank" :href="'/#/goodsDetails?productId='+product.productId">
              <y-button text="查看详情" style="margin: 0 5px;"></y-button>
            </a>
            <y-button text="加入购物车" style="margin: 0 5px;" classStyle="main-btn"
                      @btnClick="addCart(product.productId,product.salePrice,product.productName,product.productImageBig)">

            </y-button>
          </div>
          <p v-if="product.salePrice != null"><span style="font-size:14px;">￥</span>{{product.salePrice.toFixed(2)}}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import YButton from '/components/YButton'
  import {mapState, mapMutations} from 'vuex'
  import {addCart} from '/api'
  import {getStore} from "../utils/storage"

  export default {
    props: {
      product: {
        salePrice: 0
      }
    },
    data() {
      return {}
    },
    computed: {
      ...mapState(['login', 'showCart'])
    },
    methods: {
      ...mapMutations(['ADD_CART', 'SHOW_CART']),
      addCart(id, price, name, img) {
          if (this.login) { //登录的话，将购物车记在用户名下
            //添加购物车
            addCart({userId: getStore('userId'), productId: id, productNum: 1}).then(res => {
              this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img});
            })
          } else {
            //未登录的话，只添加，没有用户id
            this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img});
          }
          //如果此时购物车没显示的话，就显示出来
          if (!this.showCart) {
            this.SHOW_CART({showCart: true})
          }
      }
    },
    components: {
      YButton
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/mixin";
  @import "../assets/style/theme";

  .good-item {
    background: #fff;
    width: 25%;
    transition: all .5s;
    height: 430px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .ds {
      @extend %block-center;
      width: 100%;
      display: none;
    }

    .good-img {
      img {
        margin: 50px auto 10px;
        @include wh(206px);
        display: block;
      }
    }
    .good-price {
      margin: 15px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #d44d44;
      font-family: Arial;
      font-size: 18px;
      font-weight: 700;
    }
    .good-title {
      line-height: 1.2;
      font-size: 16px;
      color: #424242;
      margin: 0 auto;
      padding: 0 14px;
      text-align: center;
      overflow: hidden;
    }
    h3 {
      text-align: center;
      line-height: 1.2;
      font-size: 12px;
      color: #d0d0d0;
      padding: 10px;
    }

  }
</style>

