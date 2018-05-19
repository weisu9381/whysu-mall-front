// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import VueCookie from 'vue-cookie'
import 'element-ui/lib/theme-default/index.css'/*引用element-ui需要添加该句，引入主题*/
import { getStore} from "./utils/storage"
import { userInfo} from "./api/index.js"
import { Button, Pagination, Checkbox, Icon, Autocomplete, Loading, Message, Notification, Steps, Step, Table, TableColumn, Input, Dialog, Select, Option } from 'element-ui'
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.use(infiniteScroll)
Vue.use(VueCookie)
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/images/load.gif'
  // attempt: 1
})
const whiteList = ['/home', '/goods', '/login', '/register', '/goodsDetails', '/thanks', '/search', '/refreshSearch', '/refreshGoods'] // 不需要登陆的页面


Vue.config.productionTip = false

router.beforeEach(function (to, from, next){
  let params = {
    params: {
      token: getStore('token')
    }
  }
  userInfo(params).then(res => {
    if(res.result.state !== 1){//未登录
      if(whiteList.indexOf(to.path) !== -1){//白名单
        next()
      }else{
        next('/login')
      }
    }else{
      //将用户信息保存到Vuex
      store.commit('RECORD_USERINFO',{info: res.result});
      if(to.path === '/login'){
        next('/')
      }
      next()
    }
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
