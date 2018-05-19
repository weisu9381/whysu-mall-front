<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block; margin-top: -362px;">
        <div class="title">
          <h4>使用 WhysuMall 账号 登录官网</h4>
        </div>
        <div class="content">
          <ul class="common-form">
            <li class="username border-1p">
              <div class="input">
                <input type="text" v-model="loginForm.userName" placeholder="账号">
              </div>
            </li>
            <li>
              <div class="input">
                <input type="password" v-model="loginForm.userPwd" @keyup.enter="login" placeholder="密码">
              </div>
            </li>
            <li>
              <div id="captcha">
                <p id="wait">正在加载验证码...</p>
              </div>
            </li>
            <li style="text-align: right" class="pr">
              <el-checkbox class="auto-login" v-model="autoLogin">记住密码</el-checkbox>
              <!-- <span class="pa" style="top: 0;left: 0;color: #d44d44">{{loginForm.errMsg}}</span> -->
              <a href="javascript:;" class="register"  @click="toRegister">注册账号</a>
            </li>
          </ul>
          <!--登陆-->
          <div style="margin-top: 25px">
            <y-button :text="logintxt"
                      :classStyle="loginForm.userPwd&& loginForm.userName&& logintxt === '登录'?'main-btn':'disabled-btn'"
                      @btnClick="login"
                      style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"></y-button>
          </div>
          <!--返回-->
          <div>
            <y-button text="返回" @btnClick="login_back"
                      style="marginTop: 10px;marginBottom: 15px;width: 100%;height: 48px;font-size: 18px;line-height: 48px">
            </y-button>
          </div>
          <div class="border"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import YButton from '/components/YButton'
  import { geetest, userLogin, addCart } from '/api'
  import { setStore, getStore, removeStore} from "../../utils/storage"


  require('../../../static/geetest/gt.js')
  var captcha;
  export default {
    data () {
      return {
        cart: [],
        loginForm: {
          userName: this.$route.query.registerUserName,
          userPwd: this.$route.query.registerUserPwd
        },
        autoLogin: false,
        logintxt: '登录'
      }
    },
    components: {
      YButton
    },
    methods: {
      open (t, m){
        this.$notify.info({
          title: t,
          message: m
        })
      },
      message (m){
        this.$message.error({
          message: m,
        })
      },
      getRemembered (){ /*在mounted()后调用该方法，获得“记住密码”保存的内容，如果remember为true的话说明保存了内容*/
        var remember = getStore('remember');
        if(remember === "true"){
          this.autoLogin = true;
          this.loginForm.userName = getStore('rememberUserName');
          this.loginForm.userPwd = getStore('rememberUserPwd');
        }
      },
      rememberPwd (){ /*因为getRemembered()在mounted()已经执行了，通过判断autoLogin是否勾选来决定是否保存密码*/
        if(this.autoLogin === true){
          setStore('remember','true');
          setStore('rememberUserName',this.loginForm.userName);
          setStore('rememberUserPwd',this.loginForm.userPwd);
        }else{
          setStore('remember','false');
          removeStore('rememberUserName');
          removeStore('rememberUserPwd');
        }
      },
      login() {
        this.logintxt = "登录中";
        if(!this.loginForm.userName || !this.loginForm.userPwd){
          this.message("用户名和密码不能为空");
          return false;
        }
        var result = captcha.getValidate();
        if (!result) {
          this.message("请完成验证");
          this.logintxt = "登录";
          return false;
        }
        var params = {
          userName: this.loginForm.userName,
          userPwd: this.loginForm.userPwd,
          challenge: result.geetest_challenge,
          validate: result.geetest_validate,
          seccode: result.geetest_seccode
        }
        userLogin(params).then(res => {
          if(res.result.state === 1){
            /*因为main.js中进行了拦截，没有token信息的话会转到login页面，所以这里要保存用户信息*/
            setStore('token',res.result.token);
            setStore('userId',res.result.id);
            /*点击了“记住密码”的话，就保存*/
            this.rememberPwd();
            /*登录后添加当前缓存中的购物车*/
            if(this.cart.length){
              for(var i = 0; i < this.cart.length; i++){
                addCart(this.cart[i]).then(res => {

                })
              }
              //将缓存中的购物车信息清空
              removeStore('buyCart');
            }
            /*跳转到 首页*/
            this.$router.push({path: '/'});
          }else{
            this.logintxt = '登录';
            this.message(res.result.message);
            captcha.reset();
            return false;
          }
        })
      },
      toRegister(){
        this.$router.push({
          path: '/register'
        })
      },
      login_back() {
        this.$router.go(-1);
      },
      // 登陆时将本地的添加到用户购物车
      login_addCart() {
        let cartArr = [];
        let locaCart = JSON.parse(getStore("buyCart"));
        if (locaCart && locaCart.length) {
          locaCart.forEach(item => {
            cartArr.push({
              userId: getStore("userId"),
              productId: item.productId,
              productNum: item.productNum
            });
          });
        }
        this.cart = cartArr;
      },
      init_geetest() {
        /*极验验证码*/
        geetest().then(res => {
          window.initGeetest({
            gt: res.gt,
            challenge: res.challenge,
            new_captcha: res.new_captcha,
            offline: !res.success,
            product: "popup",
            width: "100%"
          }, function(captchaObj){
            captcha = captchaObj;
            captchaObj.appendTo('#captcha');
            captchaObj.onReady(function(){
              document.getElementById('wait').style.display = 'none';
            });
          })
        })
      }
    },
    mounted() {
      /*vue生命周期函数，模板被加载的时候执行*/
      /*小心：不要写在methods里面啊*/
      this.getRemembered();
      this.login_addCart();
      this.init_geetest();
    }
  }
</script>

<style lang="scss" rel="stylesheet" scoped>
  * {
    box-sizing: content-box;
  }

  .login {
    overflow-x: hidden;
    overflow-y: hidden;
    .input {
      height: 50px;
      display: flex;
      align-items: center;
      input {
        font-size: 16px;
        width: 100%;
        height: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
    }
    .wrapper {
      background: url(/static/images/bg_9b9dcb65ff.png) repeat;
      background-size: 100px;
      min-height: 800px;
      min-width: 630px;
    }
  }

  .v2 .dialog {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    margin-left: -225px;
    position: absolute;
    .title {
      background: linear-gradient(#fff, #f5f5f5);
      height: auto;
      overflow: visible;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      position: relative;
      background-image: url(/static/images/smartisan_4ada7fecea.png);
      background-size: 100px;
      background-position: top center;
      background-repeat: no-repeat;
      height: 92px;
      margin: 50px 0 50px;
      padding: 50px 0 0;
      box-shadow: none;
      h4 {
        padding: 0;
        text-align: center;
        color: #666;
        border-bottom: 1px solid #dcdcdc;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        font-weight: 700;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 0;
        border-bottom: 0;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        line-height: 1em;
        height: auto;
        color: #333;
        font-weight: 400;
      }
    }
    .content {
      padding: 0 40px 22px;
      height: auto;
      .common-form {
        li {
          clear: both;
          margin-bottom: 15px;
          position: relative;
        }
      }
    }
  }

  .dialog-shadow,
  .v2 .bbs .dialog-shadow,
  .v2 .dialog-shadow {
    -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
    -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  }

  @media screen and (min-width: 737px),
  screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
    .wrapper {
      background: url(/static/images/con-bg_04f25dbf8e.jpg) repeat-x;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .dialog {
      background: url(/static/images/dialog-gray-bg.png) #fff bottom repeat-x;
      border-radius: 12px;
      display: none;
      margin: -163px 0 0 -218px;
      width: 436px;
      position: fixed;
      left: 50%;
      top: 50%;
    }
    .dialog .title h4 {
      border-bottom: #d1d1d1 solid 1px;
      box-shadow: 0 2px 6px #d1d1d1;
      color: #666;
      font-size: 20px;
      height: 61px;
      line-height: 61px;
      padding: 0 0 0 35px;
    }
    .common-form li {
      clear: both;
      margin-bottom: 15px;
      position: relative;
    }
    .auto-login {
      position: absolute;
      top: 0px;
      left: 2px;
      color: #999;
    }
    .register {
      padding: 1px 10px 0;
      border-right: 1px solid #ccc;
    }
    .border {
      margin-top: 10px;
      border-bottom: 1px solid #ccc;
    }
    .other {
      margin: 20px 5px 0 0;
      width: auto;
      color: #bbb;
      font-size: 12px;
      cursor: default;
      color: #999;
    }
    .footer {
      display: flex;
      flex-direction: row;
    }
    .agree {
      margin-bottom: 30px;
      color: #999;
    }
  }

  .registered {
    h4 {
      padding: 0;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      font-weight: 700;
      font-size: 20px;
      height: 60px;
      line-height: 60px;
    }
  }

  #wait {
    text-align: left;
    color: #999;
    margin: 0;
  }
</style>
