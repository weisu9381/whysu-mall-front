<template>
  <div class="header-box">
    <header class="w">
      <div class="w-box">
        <div class="nav-logo">
          <h1 @click="changePage(1)">
            <router-link to="/" title="WhysuMall商城">WhysuMall商城</router-link>
          </h1>
        </div>
        <!--顶部右侧-->
        <div class="right-box">
          <div class="nav-list">

            <el-autocomplete
              placeholder="查询商品"
              icon="search"
              v-model="input"
              minlength=1
              maxlength=100
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
              :on-icon-click="handleIconClick">
            </el-autocomplete>

            <router-link to="/goods"><a @click="changePage(2)">全部商品</a></router-link>
          </div>
          <div class="nav-aside" :class="{fixed: isFixed}">
            <!--个人中心-->
            <div class="user pr">
              <router-link to="/user" title="个人中心" v-if="!login">个人中心</router-link>
              <router-link to="/user" v-if="login">个人中心</router-link><!--登录以后，就不显示提示信息-->
              <!--注销，只有登录的情况才出现-->
              <div class="nav-user-wrapper pa" v-if="login">
                <div class="nav-user-list">
                  <ul>
                    <!--头像-->
                    <li class="nav-user-avatar" @click="toUser()">
                        <div>
                           <span class="avatar" :style="{backgroundImage:'url('+userInfo.info.file+')'}"></span>
                        </div>
                        <p class="name">{{userInfo.info.username}}</p>
                    </li>
                    <li>
                      <a href="javascript:;" @click="_loginOut">退出登录</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!--购物车-->
            <div class="shop pr" @mouseover="cartShow(true)" @mouseout="cartShow(false)">
              <router-link to="/cart"></router-link>
              <span class="cart-num">
                <i class="num" :class="{no: cartTotalNum <= 0 }">{{cartTotalNum}}</i>
              </span>
              <!--鼠标移到购物车图标，显示-->
              <div class="nav-user-wrapper pa active" v-show="showCart">
                <div class="nav-user-list">
                  <!--购物车商品数量>0时显示-->
                  <div class="full" v-show="cartTotalNum">
                    <!--购物车列表-->
                    <div class="nav-cart-items">
                      <ul>
                        <li class="clearfix" v-for="(item,index) of cartList" :key="index">
                          <div class="cart-item">
                            <div class="cart-item-inner">
                              <router-link :to="'goodDetails?productId='+ item.productId">
                                <div class="item-thumb">
                                  <img :src="item.productImg">
                                </div>
                                <div class="item-desc">
                                  <div class="cart-cell">
                                    <h4><a href="" v-text="item.productName"></a></h4>
                                    <h6>
                                      <span class="price-icon">￥</span>
                                      <span class="price-num">{{item.salePrice}}</span>
                                      <span class="item-num">x {{item.productNum}}</span>
                                    </h6>
                                  </div>
                                </div>
                              </router-link>
                              <div class="del-btn del" @click="delGoods(item.productId)">删除</div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <!--总共商品多少件-->
                    <div class="nav-cart-total">
                      <p>总共<strong>{{cartTotalNum}}</strong> 件商品</p>
                      <h5>
                        合机: <span class="price-icon">￥</span>
                        <span class="price-num">{{cartTotalPrice}}</span>
                      </h5>
                      <h6>
                        <y-button classStyle="main-btn"
                                  style="height: 40px;width: 100%;margin: 0;color: #fff;font-size: 14px;line-height: 38px"
                                  text="去购物车" @btnClick="toCart">
                        </y-button>
                      </h6>
                    </div>
                  </div>
                  <!--购物车商品数量=0时显示-->
                  <div class="cart-con" v-show="!cartTotalNum" style="height: 313px;text-align: center">
                    <p>您的购物车是空的！</p>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!--第二行-->
    <slot name="nav">
      <div class="nav-sub" :class="{fixed: isFixed}">
        <div class="nav-sub-bg"></div>
        <div class="nav-sub-wrapper" :class="{fixed: isFixed}">
          <div class="w">
            <ul class="nav-list2">
              <li>
                <router-link to="/"><a @click="changePage(1)" :class="{active: choosePage === 1}">首页</a></router-link>
              </li>
              <li>
                <a @click="changePage(2)" :class="{active: choosePage === 2}">全部商品</a>
              </li>
              <li>
                <a @click="changePage(3)" :class="{active: choosePage === 3}">品牌周边</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
  import 'element-ui/lib/theme-default/index.css'
  import YButton from "../components/YButton"
  import { mapMutations, mapState } from 'vuex'
  import { getCartList, cartDel, getQuickSearch } from '/api'
  import { setStore, getStore, removeStore } from '/utils/storage'
  import { loginOut } from '/api'
  export default {
    components: {YButton},
    data () {
      return {
        isCartShow: false, //鼠标移动到右上角购物车图标，是否显示购物车简略信息
        choosePage: 1,//点击导航栏文字，样式改变
        isFixed: false, //鼠标往下滑动的时候，true表示导航栏一直固定在顶部
        token: '', //用户
        input: '', //搜索栏输入信息
        searchResults: [],//搜索结果
      }
    },
    computed: {
      ...mapState(['cartList', 'login', 'receiveInCart', 'showCart', 'userInfo']),
      //购物车的商品总数量
      cartTotalNum () {
        var cartTotalNum = 0;
        this.cartList && this.cartList.forEach(item => {
          cartTotalNum += item.productNum;
        })
        return cartTotalNum;
      },
      cartTotalPrice () {
        var totalPrice = 0
        this.cartList && this.cartList.forEach(item => {
          totalPrice += (item.productNum * item.salePrice)
        })
        return totalPrice
      }
    },
    methods: {
      ...mapMutations(['ADD_CART', 'INIT_BUYCART', 'ADD_ANIMATION', 'SHOW_CART', 'REDUCE_CART', 'RECORD_USERINFO', 'EDIT_CART']),
      //移到购物车图标，是否显示购物车简略信息
      cartShow (isShow) {
        this.SHOW_CART({showCart: isShow})
      },
      //导航栏文字样式改变， v-bind:class="{active: true/false}"
      changePage (page){
        this.choosePage = page;
        if(page === 2){
          //选中“全部商品”
          this.$router.push({
            path: '/refreshGoods'
          })
        }else if(page === 3){
          //选中“品牌周边”
          this.$router.push({
            path: '/refreshGoods',
            query: {
              cid: 1184 /*这个是“品牌周边”类别的cid*/
            }
          })
        }
      },
      changePageByUrl () {
        //通过访问的 Url 选择nav需要选中的是“首页”“全部商品”还是“品牌周边”
        let path = this.$route.path;
        let fullPath = this.$route.fullPath; //包含参数
        if(path === '/' || path === '/home'){
          this.changePage(1); //首页
        }else if(fullPath.indexOf('/goods?cid=1184') >= 0){
          this.changePage(3); //品牌周边。 cid为1184的是品牌周边
        }else if(path === '/goods'){
          this.changePage(2); //全部商品
        }else{
          this.changePage(0); //没有就不选中
        }
      },
      navFixed() {
        /*控制顶部*/
        let path = this.$route.path;
        if(path === '/goods' || path === '/home' || path === '/goodsDetails'){
          let _scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //计算当前向上滑动的高度
          _scrollTop > 100 ? this.isFixed = true : this.isFixed = false;
        }
      },
      toCart () {
        this.$router.push({path: '/cart'})
      },
      toUser(){
        this.$router.push({path: '/user'})
      },
      delGoods (productId) {
        // 删除商品
        if (this.login) { // 登陆了
          cartDel({userId: getStore('userId'), productId}).then(res => {
            this.EDIT_CART({productId})
          })
        } else {
          this.EDIT_CART({productId})
        }
      },
      _getCartList () {
        //登录时，获取购物车商品
        getCartList({userId: getStore('userId')}).then(res => {
          if(res.success === true){
            setStore('buyCart', res.result)
          }
          // 重新初始化一次本地数据
        }).then(this.INIT_BUYCART)
      },
      // 退出登陆
      _loginOut () {
        let params = {
          params: {
            token: this.token
          }
        }
        loginOut(params).then(res => {
          removeStore('buyCart')
          window.location.href = '/'
        })
      },
      querySearchAsync (queryString, callback){
        //queryString 为在框中输入的值
        //callback 回调函数,将处理好的数据推回
        if(this.input === undefined){
          callback([])
          return
        }
        this.input = this.input.trim()
        if (this.input === '') {
          callback([])
          return
        } else {
          this.loadAll();
          setTimeout(() => {
            callback(this.searchResults)
          }, 300)
        }
      },
      handleSelect (item) {
        //选中某一列触发的事件,在这里item为选中字段所在的对象
        this.input = item.value
        this.handleIconClick();
      },
      handleIconClick (ev) {
        if (this.$route.path === '/search') {
          this.$router.push({
            path: '/refreshSearch',
            query: {
              key: this.input
            }
          })
        } else {
          this.$router.push({
            path: '/search',
            query: {
              key: this.input
            }
          })
        }
      },
      //搜索框提示
      loadAll () {
        getQuickSearch(this.input).then(res => {
          var array = []
          var maxSize = 5
          if (res.hits.hits.length <= 5) {
            maxSize = res.hits.hits.length
          }
          for (var i = 0; i < maxSize; i++) {
            var obj = {}
            obj.value = res.hits.hits[i]._source.productName
            array.push(obj)
          }
          if (array.length !== 0) {
            this.searchResults = array
          } else {
            this.searchResults = []
          }
        })
      }
    },
    mounted() {
      this.token = getStore('token')
      if(this.login){
        this._getCartList();
      }else{
        this.INIT_BUYCART();
      }
      this.changePageByUrl();
      /*固定导航栏在顶部，并监听*/
      this.navFixed();
      window.addEventListener('scroll', this.navFixed)
      window.addEventListener('resize', this.navFixed)

    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/theme";
  @import "../assets/style/mixin";

  .move_in_cart {
    animation: mymove .5s ease-in-out;
  }

  @keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  @-moz-keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  @-webkit-keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  @-o-keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  .header-box {
    background: $head-bgc;
    background-image: -webkit-linear-gradient(#000, #121212);
    background-image: linear-gradient(#000, #121212);
    width: 100%;

  }

  header {
    height: 100px;
    z-index: 30;
    position: relative;
  }

  .w-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    // position: relative;
    h1 {
      height: 100%;
      display: flex;
      align-items: center;
      > a {
        background: url(/static/images/S-home.png) no-repeat 50%;
        background-size: contain;
        display: block;
        @include wh(50px, 40px);
        text-indent: -9999px;
        background-position: 0 0;
      }
    }
    .nav-list {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 22px;
      .el-autocomplete{
        width: 20vw;
      }
      a {
        width: 110px;
        color: #c8c8c8;
        display: block;
        font-size: 14px;
        padding: 0 25px;
        &:hover {
          color: #fff;
        }
      }
      a:nth-child(2){
        // width: 5vw;
        margin-left: -10px;
      }
      // a:nth-child(3){
      //   width: 5vw;
      // }
    }
    .nav-aside {
      position: relative;
      &:before {
        background: #333;
        background: hsla(0, 0%, 100%, .2);
        content: " ";
        @include wh(1px, 13px);
        overflow: hidden;
        // position: absolute;
        display: flex;
        align-items: center;
        // top: 4px;
        left: 0;
      }
      &.fixed {
        width: 262px;
        position: fixed;
        left: 50%;
        top: 19px;
        margin-left: 451px;
        margin-top: 0;
        z-index: 32;
        top: -40px;
        -webkit-transform: translate3d(0, 59px, 0);
        transform: translate3d(0, 59px, 0);
        -webkit-transition: -webkit-transform .3s cubic-bezier(.165, .84, .44, 1);
        transition: transform .3s cubic-bezier(.165, .84, .44, 1);
        .user {
          &:hover {
            a:before {
              background-position: -215px 0;
            }
          }
        }
        .shop {
          &:hover {
            a:before {
              background-position: -210px -22px;
            }
          }
        }
      }
    }

    .right-box {
      display: flex;
    }
    .nav-aside {
      display: flex;
      align-items: center;
    }
    // 用户
    .user {
      margin-left: 41px;
      width: 36px;
      &:hover {
        a:before {
          background-position: -5px 0;
        }
        .nav-user-wrapper {
          top: 18px;
          visibility: visible;
          opacity: 1;
          -webkit-transition: opacity .15s ease-out;
          transition: opacity .15s ease-out;
        }
      }
      > a {
        position: relative;
        @include wh(36px, 20px);
        display: block;
        text-indent: -9999px;
        &:before {
          content: " ";
          position: absolute;
          left: 8px;
          top: 0;
          @include wh(20px);
          background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) -155px 0;
          background-size: 240px 107px;
          transition: none;
        }

      }
      li + li {
        text-align: center;
        position: relative;
        border-top: 1px solid #f5f5f5;
        line-height: 44px;
        height: 44px;
        color: #616161;
        font-size: 12px;
        &:hover {
          background: #fafafa;
        }
        a {
          display: block;
          color: #616161;
        }
      }
      .nav-user-avatar {
        > div {
          position: relative;
          margin: 0 auto 8px;
          @include wh(46px);
          text-align: center;
          &:before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            border-radius: 50%;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
          }
          .avatar {
            border-radius: 50%;
            display: block;
            @include wh(100%);
            background-repeat: no-repeat;
            background-size: contain;
          }

        }
        .name {
          margin-bottom: 16px;
          font-size: 12px;
          line-height: 1.5;
          text-align: center;
          color: #757575;
        }
      }
      .nav-user-wrapper {
        width: 168px;
        transform: translate(-50%);
        left: 50%;
      }
      .nav-user-list {
        width: 168px;
        &:before {
          left: 50%;
        }

      }
    }
    .shop {
      position: relative;
      float: left;
      margin-left: 21px;
      width: 61px;
      z-index: 99;
      &:hover {
        a:before {
          content: " ";
          background-position: 0 -22px;
        }
      }
      .nav-user-wrapper.active {
        top: 18px;
        visibility: visible;
        opacity: 1;
        -webkit-transition: opacity .15s ease-out;
        transition: opacity .15s ease-out;
      }
      > a {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        display: block;
        right: 0;
        z-index: 1;
        &:before {
          display: block;
          @include wh(30px, 100%);
          content: " ";
          background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) 0 -22px;
          background-size: 240px 107px;
          background-position: -150px -22px;
        }
      }
      .cart-num {
        position: relative;
        display: block;
        margin-left: 31px;
        margin-top: -1px;
        min-width: 30px;
        text-indent: 0;
        line-height: 20px;
        > i {
          background: #eb746b;
          background-image: -webkit-linear-gradient(#eb746b, #e25147);
          background-image: linear-gradient(#eb746b, #e25147);
          box-shadow: inset 0 0 1px hsla(0, 0%, 100%, .15), 0 1px 2px hsla(0, 0%, 100%, .15);
          text-align: center;
          font-style: normal;
          display: inline-block;
          @include wh(20px);
          line-height: 20px;
          border-radius: 10px;
          color: #fff;
          font-size: 12px;
          &.no {
            background: #969696;
            background-image: -webkit-linear-gradient(#A4A4A4, #909090);
            background-image: linear-gradient(#A4A4A4, #909090);
            box-shadow: inset 0 0 1px #838383, 0 1px 2px #838383;
          }
        }

      }
      .nav-user-wrapper {
        right: 0;
        width: 360px;
        .nav-user-list {
          &:before {
            right: 34px;
          }
        }
      }
      .nav-user-list {
        padding: 0;
        width: 100%;
        .full {
          border-radius: 8px;
          overflow: hidden;
        }
        .nav-cart-items {
          max-height: 363px;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .cart-item {
          height: 120px;
          width: 100%;
          overflow: hidden;
          border-top: 1px solid #f0f0f0;
          &:hover {
            background: #fcfcfc;
            .del {
              display: block;
            }
          }

        }
        li:first-child .cart-item:first-child {
          border-top: none;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
        }
        .cart-item-inner {
          padding: 20px;
          position: relative;
        }
        .item-thumb {
          position: relative;
          float: left;
          width: 80px;
          height: 80px;
          border-radius: 3px;
          &:before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 2;
            border: 1px solid #f0f0f0;
            border: 0 solid transparent;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
            border-radius: 3px;
          }
          img {
            display: block;
            @include wh(80px, 80px);
            border-radius: 3px;
            overflow: hidden;
          }
        }
        .item-desc {
          margin-left: 98px;
          display: table;
          @include wh(205px, 80px);
          h4 {
            color: #000;
            width: 185px;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            line-height: 16px;
            margin-bottom: 10px;
          }
          .attrs span {
            position: relative;
            display: inline-block;
            margin-right: 20px;
            font-size: 14px;
            line-height: 14px;
            color: #999;
          }
          .attrs span:last-child {
            margin-right: 0;
          }
          h6 {
            color: #cacaca;
            font-size: 12px;
            line-height: 14px;
            margin-top: 20px;
            span {
              display: inline-block;
              font-weight: 700;
              color: #cacaca;
            }
            .price-icon, .price-num {
              color: #d44d44;
            }
            .price-num {
              margin-left: 5px;
              font-size: 14px;
            }
            .item-num {
              margin-left: 10px;
            }
          }

        }
        .cart-cell {
          display: table-cell;
          vertical-align: middle;
        }
        .del {
          display: none;
          overflow: hidden;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .nav-cart-total {
        box-sizing: content-box;
        position: relative;
        padding: 20px;
        height: 40px;
        background: #fafafa;
        border-top: 1px solid #f0f0f0;
        border-radius: 0 0 8px 8px;
        box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, .5), 0 -3px 8px rgba(0, 0, 0, .04);
        background: -webkit-linear-gradient(#fafafa, #f5f5f5);
        background: linear-gradient(#fafafa, #f5f5f5);
        p {
          margin-bottom: 4px;
          line-height: 16px;
          font-size: 12px;
          color: #c1c1c1;
        }
        h5 {
          line-height: 20px;
          font-size: 14px;
          color: #6f6f6f;
          span {
            font-size: 18px;
            color: #de4037;
            display: inline-block;
            font-weight: 700;
          }
          span:first-child {
            font-size: 12px;
            margin-right: 5px;
          }
        }
        h6 {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 108px;
        }
      }
    }
  }

  @media (max-height: 780px) {
    .nav-cart-items {
      max-height: 423px !important;
    }
  }

  @media (max-height: 900px) {
    .nav-cart-items {
      max-height: 544px !important;
    }
  }

  @media (max-height: 1080px) {
    .nav-cart-items {
      max-height: 620px !important;
    }
  }

  // 用户信息弹出
  .nav-user-wrapper {
    position: absolute;
    z-index: 30;
    padding-top: 18px;
    opacity: 0;
    visibility: hidden;
    top: -3000px;
    .nav-user-list {
      position: relative;
      padding-top: 20px;
      background: #fff;
      border: 1px solid #d6d6d6;
      border-color: rgba(0, 0, 0, .08);
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, .15);
      z-index: 10;
      &:before {
        position: absolute;
        content: " ";
        background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) no-repeat -49px -43px;
        background-size: 240px 107px;
        @include wh(20px, 8px);
        top: -8px;
        margin-left: -10px;
      }
    }
  }

  .nav-sub {
    position: relative;
    z-index: 20;
    height: 90px;
    background: #f7f7f7;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .04);
    &.fixed {
      position: fixed;
      z-index: 21;
      height: 60px;
      top: 0;
      left: 0;
      right: 0;
      border-bottom: 1px solid #dadada;
      background-image: -webkit-linear-gradient(#fff, #f1f1f1);
      background-image: linear-gradient(#fff, #f1f1f1);
    }
    .nav-sub-wrapper {
      padding: 31px 0;
      height: 90px;
      position: relative;
      &.fixed {
        padding: 0;
        height: 100%;
        display: flex;
        align-items: center;
      }
      &:after {
        content: " ";
        position: absolute;
        top: 89px;
        left: 50%;
        margin-left: -610px;
        width: 1220px;
        background: #000;
        height: 1px;
        display: none;
        opacity: 0;
        -webkit-transition: opacity .3s ease-in;
        transition: opacity .3s ease-in;
      }
    }
    .w {
      display: flex;
      justify-content: space-between;
    }
    .nav-list2 {
      height: 28px;
      line-height: 28px;
      display: flex;
      align-items: center;
      height: 100%;
      li:first-child {
        padding-left: 0;
        a {
          padding-left: 10px;
        }
      }
      li {
        position: relative;
        float: left;
        padding-left: 2px;
        a {
          display: block;
          padding: 0 10px;
          color: #666;
          &.active {
            font-weight: bold;
          }
        }
        a:hover {
          color: #5683EA;
        }
      }
      li:before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 13px;
        width: 2px;
        height: 2px;
        background: #bdbdbd;
      }
    }
  }

  @media (min-width: 1px) {
    .nav-sub .nav-sub-wrapper:after {
      display: block;
    }
  }

  .cart-con {
    /*display: flex;*/
    text-align: center;
    position: relative;
    p {
      padding-top: 185px;
      color: #333333;
      font-size: 16px;
    }
  }

  .cart-con:before {
    position: absolute;
    content: ' ';
    left: 50%;
    transform: translate(-50%, -70%);
    top: 50%;
    width: 76px;
    height: 62px;
    background: url("/static/images/cart-empty-new.png") no-repeat;
    background-size: cover;

  }
</style>

