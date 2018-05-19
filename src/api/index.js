import http from './public.js'
/*登陆*/
export const userLogin = (params) => {
  return http.fetchPost('/member/login', params)
}
/*注册账号*/
export const register = (params) => {
  return http.fetchPost('/member/register', params)
}
/*退出登陆*/
export const loginOut = (params) => {
  return http.fetchGet('/member/loginOut', params)
}

/*用户信息*/
export const userInfo = (params) => {
  return http.fetchGet('/member/checkLogin', params)
}
/*极验验证码*/
export const geetest = (params) => {
  return http.fetchGet('/member/geetestInit?t='+ new Date().getTime(), params)
}
/*上传图片*/
export const upload = (params) => {
  return http.fetchPost('/member/imgaeUpload', params)
}

/*获取用户地址*/
export const addressList = (params) => {
  return http.fetchPost('/member/addressList', params)
}
/*修改收货地址*/
export const addressUpdate = (params) => {
  return http.fetchPost('/member/updateAddress', params)
}
/*添加收货地址*/
export const addressAdd = (params) => {
  return http.fetchPost('/member/addAddress', params)
}
/*删除收货地址*/
export const addressDel = (params) => {
  return http.fetchPost('/member/delAddress', params)
}

/*获得首页所有商品数据*/
export const productHome = (parmas) => {
  return http.fetchGet('/goods/home', parmas)
}

/*获得所有商品*/
export const getAllProduct = (params) => {
  return http.fetchGet('/goods/getAllProduct', params)
}

/*获得商品详情*/
export const productDetail = (params) => {
  return http.fetchGet('/goods/productDetail', params)
}

/*加入购物车*/
export const addCart = (params) => {
  return http.fetchPost('/cart/addCart', params)
}

/*删除购物车*/
export const cartDel = (params) => {
  return http.fetchPost('/cart/cartDel', params)
}
/*编辑购物车*/
export const cartEdit = (params) => {
  return http.fetchPost('/cart/cartEdit', params)
}
/*购物车全部选中，或者全不选中*/
export const editCheckAll = (params) => {
  return http.fetchPost('/cart/editCheckAll', params)
}

/*获取购物车列表*/
export const getCartList = (params) => {
  return http.fetchPost('/cart/cartList', params)
}

/*添加订单*/
export const addOrder = (params) => {
  return http.fetchPost('/order/addOrder', params)
}

/*获取用户订单*/
export const orderList = (params) => {
  return http.fetchGet('/order/orderList', params)
}

/*删除订单*/
export const delOrder = (params) => {
  return http.fetchGet('/order/delOrder', params)
}

/*获取单个订单详情*/
export const getOrderDet = (params) => {
  return http.fetchGet('/order/orderDetail', params)
}

/*修改订单状态*/
export const setOrderStatus = (params) => {
  return http.fetchPost('/order/setOrderStatus',params)
}


// 支付
export const payMent = (params) => {
  return http.fetchPost('/order/payOrder', params)
}

// 商品列表
export const getSearch = (params) => {
  return http.fetchGet('/goods/search', params)
}

// 推荐板块
export const recommend = (params) => {
  return http.fetchGet('/goods/recommend', params)
}

// 快速搜索
export const getQuickSearch = (key) => { //在config/index.js中转到该路径：http://192.168.125.131:9200
  return http.fetchQuickSearch(`/item/itemList/_search?q=productName: ${key}`)
}
