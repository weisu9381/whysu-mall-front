import {getStore, setStore} from "../utils/storage"
import {
  INIT_BUYCART,
  ADD_CART,
  GET_USERINFO,
  RECORD_USERINFO,
  ADD_ANIMATION,
  SHOW_CART,
  REDUCE_CART,
  EDIT_CART
} from './mutation-types'
export default {
  //state是共享的，调用的时候，这个state是不用输入的
  //网页初始化时，从本地缓存获取购物车数据
  [INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  //加入购物车
  [ADD_CART] (state, {productId, salePrice, productName, productImg, productNum = 1}){
    let cart = state.cartList
    let isAdd = false //该productId是否加入了购物车
    let goods = {
      productId,
      salePrice,
      productName,
      productImg
    }
    if(cart.length){ //购物车不为空
      cart.forEach(item => {
        if(item.productId === productId){
          console.log("item.productId =" + item.productId);
          if(item.productNum >= 0){
            isAdd = true;
            //该商品数量加1
            item.productNum += productNum;
          }
        }
      })
    }
    if(!cart.length || !isAdd){
      //购物车为空，或者productId的商品未加入购物车
      goods.productNum = productNum;
      //选中商品
      goods.checked = '1';
      cart.push(goods);
    }
    //保存购物车到 state
    state.cartList = cart;
    //存入LocalStorage
    setStore('buyCart', cart);

  },
  //是否显示购物车
  [SHOW_CART] (state, {showCart}){
    state.showCart = showCart;
  },
  //移除
  [REDUCE_CART] (state){

  },
  //修改
  [EDIT_CART] (state, {productId, productNum, checked}){
    let cart = state.cartList
    if (productNum) {
      //修改商品数量
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          item.productNum = productNum
          item.checked = checked
        }
      })
    } else if (productId) {
      //只传入productId说明从购物车移除该商品
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => {
        item.checked = checked ? '1' : '0'
      })
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  //记录用户信息
  [RECORD_USERINFO] (state, info){
    state.userInfo = info;
    state.login = true;
    setStore('userInfo', info);
  },
  //获取用户信息
  [GET_USERINFO] (state, info){
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {...info} /*这是什么写法？我明白..mapState([ ]) 但不明白这个*/
    } else {
      state.userInfo = null
    }
  }
}


