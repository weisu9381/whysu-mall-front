<template>
  <div class="footer">
    <div class="container">
      <div class="siteinfo">
        <ul class="c0">
          <h3 class="c1">订单服务</h3>
          <ul>
            <li class="c2"><a class="c3">购买指南</a></li>
            <li class="c2"><a class="c3">支付方式</a></li>
            <li class="c2"><a class="c3">送货政策</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">服务支持</h3>
          <ul>
            <li class="c2"><a class="c3">售后服务</a></li>
            <li class="c2"><a class="c3">维修门店</a></li>
            <li class="c2"><a class="c3">零售门店</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">自助服务</h3>
          <ul>
            <li class="c2"><a class="c3">热点咨询</a></li>
            <li class="c2"><a class="c3">预约购买</a></li>
            <li class="c2"><a class="c3">订单物流</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">媒体中心</h3>
          <ul>
            <li class="c2"><a class="c3">新闻动态</a></li>
            <li class="c2"><a class="c3">官方视频</a></li>
            <li class="c2"><a class="c3">图片资源</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">关于公司</h3>
          <ul>
            <li class="c2"><a class="c3">公司简介</a></li>
            <li class="c2"><a class="c3">加入我们</a></li>
            <li class="c2"><a class="c3">联系我们</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">关注我们</h3>
          <ul>
            <li class="c2"><a class="c3">新浪微博</a></li>
            <li class="c2"><a class="c3">官方微信</a></li>
            <li class="c2"><a class="c3">官方贴吧</a></li>
          </ul>
        </ul>

        <ul class="c4">
          <li class="tel"><a class="c5">185 5975 9381</a></li>
          <li class="time">周一至周日 9:00-18:00</li>
        </ul>
      </div>

      <div class="copyright">
        <h4 class="content-c2">Copyright ©2018, whysu.top Co., Ltd. All Rights Reserved.本网站设计内容大部分属锤子科技</h4>
        <ul class="privacy">
          <li class="content-c1"><a class="content-c0">法律声明</a></li>
          <li class="content-c1"><a class="content-c0">隐私条款</a></li>
        </ul>
      </div>
      <div class="cop">
        <a class="content-c3" href="http://www.miibeian.gov.cn/" target="_blank">
          <span class="content-c3">蜀ICP备16030308号-1</span>
          <span class="content-c3">蜀ICP证16030308号</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .footer {
    padding: 50px 0 20px;
    border-top: 1px solid #e6e6e6;
    background: #fafafa;
    margin-top: 60px;
    height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container {
    width: 1220px;
  }

  .siteinfo {
    height: 100px;
    padding: 50px 0 130px;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
  }

  .c0 {
    width: 149px;
    line-height: 1;
    float: left;
  }

  .c1 {
    color: #646464;
    font-size: 12px;
    padding: 0 0 14px;
  }

  .c2 {
    color: #c3c3c3;
    font-size: 12px;
    padding: 6px 0;
  }

  .c3 {
    color: #969696;
  }

  .c4 {
    position: absolute;
    right: 0;
    overflow: hidden;
    line-height: 34px;
  }

  .tel {
    font-size: 30px;
    line-height: 1;
    color: #646464;
    top: -2px;
    position: relative;
  }

  .c5 {
    color: #646464;
    right: 0;
    position: relative;
  }

  .time {
    margin-top: 5px;
    right: 50px;
    position: relative;
    clear: both;
    width: 250px;
    font-size: 12px;
    line-height: 18px;
    color: #c3c3c3;
    text-align: right;
  }

  .online {
    clear: both;
    width: 241px;
    font-size: 12px;
    line-height: 18px;
    color: #c3c3c3;
    text-align: right;
  }

  .button {
    width: 130px;
    height: 34px;
    font-size: 14px;
    color: #5079d9;
    border: 1px solid #dcdcdc;
    margin-top: 8px;
  }

  .copyright {
    color: #434d55;
    font-size: 12px;
    padding: 40px 0 0;
    display: flex;
    align-items: left;
  }

  .privacy {
    float: left;
    margin: 0 0 0 12px;
  }

  .content-c0 {
    color: #5079d9;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      color: #3A5FCD;
    }
  }

  .content-c1 {
    float: left;
    line-height: 12px;
    padding: 1px 10px 0;
    border-left: 1px solid #ccc;
  }

  .content-c2 {
    float: left;
    height: 15px;
    line-height: 15px;
    color: #757575;
  }

  .cop {
    clear: both;
    padding: 10px 0 0;
    height: 15px;
  }

  .content-c3 {
    margin-right: 20px;
    color: #bdbdbd;
    font-size: 12px;
    height: 12px;
    line-height: 1;
  }
</style>

