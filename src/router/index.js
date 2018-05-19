import Vue from 'vue'
import Router from 'vue-router'
import Login from '/page/Login/login'
import Index from '/page/index'
import Goods from '/page/goods/goods'
import GoodsDetails from '/page/goods/goodsDetails'
import RefreshGoods from '/page/goods/refreshGoods'
import Register from '/page/login/register'
import Home from '/page/home/home'
import User from '/page/user/user'
import OrderList from '/page/user/orderList'
import OrderDetail from '/page/user/orderDetail'
import Avatar from '/page/user/avatar'
import AddressList from '/page/user/addressList'
import Cart from '/page/cart/cart'
import checkout from '/page/cart/checkout'
import order from '/page/Order/order.vue'
import paysuccess from '/page/Order/paysuccess.vue'
import Alipay from '/page/order/alipay.vue'
import Wechat from '/page/order/wechat.vue'
import RefreshSearch from '/page/search/refreshSearch'
import Search from '/page/search/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/home',
      children: [
        {path: 'home', component: Home},
        {path: 'goods',component: Goods},
        {path: 'goodsDetails', component: GoodsDetails},
        {path: 'refreshGoods', component: RefreshGoods}
      ]
    },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    {
      path: '/user/',
      name: 'user',
      component: User,
      redirect: '/user/orderList',
      children: [
        {path: 'orderList', name: '订单列表', component: OrderList},
        {path: 'orderDetail', name: '订单详情', component: OrderDetail},
        {path: 'avatar', name: '上传头像', component: Avatar},
        {path: 'addressList', name: '收货地址', component: AddressList}
      ]
    },
    {path: '/cart', name: 'cart', component: Cart},
    {path: '/checkout', name: 'checkout', component: checkout},
    {path: '/search', name: 'search', component: Search},
    {path: '/refreshSearch', name: 'refreshSearch', component: RefreshSearch},
    {
      path: '/order',
      name: 'order',
      component: order,
      children: [
        {path: 'paysuccess', name: 'paysuccess', component: paysuccess},
        {path: 'alipay', name: 'alipay', component: Alipay},
        {path: 'wechat', name: 'wechat', component: Wechat},
      ]
    },
    {path: '*', redirect: '/home'},
   ]
})
