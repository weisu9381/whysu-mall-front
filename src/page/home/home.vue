<template>
  <div class="home">
    <div style="min-height: 35vw;" v-if="!error">

      <!--3D轮播图-->
      <div class="banner" @mouseover="stopTimer" @mouseout="startTimer">
        <!--图片，三张图片合成一张-->
        <div class="bg">
          <transition name="fade">
            <!--v-if="index === mark" 选择第mark个，就显示第index个轮播图-->
            <div v-for="(item, index) of banner" v-if="index === mark" :key="'aaa:'+index" style="position:absolute;" @click="linkTo(item)">
              <img v-if="item.picUrl" class="img1" :src="item.picUrl"/>
              <img v-if="item.picUrl2" class="img2 a" :src="item.picUrl2"/>
              <img v-if="item.picUrl3" class="img3 b" :src="item.picUrl3"/>
            </div>
          </transition>
        </div>
        <!--显示有多少个轮播图-->
        <div class="page">
          <ul class="dots">
            <li class="dot-active" v-for="(item, index) of banner" :key="'bbb:'+index" :class="{'dot': index !== mark }"
                @click="change(index)"></li>
          </ul>
        </div>
      </div>

      <!--以下的position都为0,表示首页-->
      <div v-for="(item, index) of home" :key="index">

        <!--type等于1 是 活动板块1和活动版块2-->
        <div class="activity-panel" v-if="item.type === 1">
          <ul class="box">
            <li class="content" v-for="(iitem, iidex) of item.panelContents" :key="'ccc:'+iidex"  @click="linkTo(iitem)">
              <img class="i" :src="iitem.picUrl"/>
              <a class="cover-link"></a>
            </li>
          </ul>
        </div>


        <!--type等于2 是热门商品-->
        <section class="w mt30 clearfix" v-if="item.type === 2">
          <y-shelf :title="item.name">
            <div slot="content" class="hot">
              <mall-good v-for="(iitem, iindex) of item.panelContents" :product="iitem" :key=" 'ddd:' + iindex"></mall-good>
            </div>
          </y-shelf>
        </section>

        <!--type等于3是“官方精选”，“品牌周边”，“品牌精选”-->
        <section class="w mt30 clearfix" v-if="item.type === 3">
          <y-shelf :title="item.name">
            <div slot="content" class="floors">
              <!--tbPanelContent中的type等于2是“封面（关联商品）”，type等于3是“封面（其它链接）”-->
              <div class="imgbanner" v-for="(iitem, iindex) of item.panelContents" :key=" 'fff:' + iindex" v-if="iitem.type === 2 || iitem.type === 3"  @click="linkTo(iitem)">
                <img v-lazy="iitem.picUrl">
                <a class="cover-link"></a>
              </div>
              <mall-good :product="iitem" v-for="(iitem,iindex) of item.panelContents" :key=" 'ggg:' + iindex" v-if="iitem.type !== 2 || iitem.type !== 3"></mall-good>
            </div>
          </y-shelf>
        </section>
      </div>
    </div>

    <!--出错-->
    <div class="no-info" v-if="error">
      <div class="no-data">
        <img src="/static/images/error.png">
      </div>
    </div>

  </div>
</template>

<script>
  import {productHome} from "../../api"
  import YShelf from '../../components/shelf'
  import MallGood from "../../components/mallGood"

  export default {
    data() {
      return {
        error: false, /*error:true表示数据请求失败*/
        home: [], /*首页请求来的所有数据*/
        banner: [], /*轮播图*/
        mark: 0, /*用来标记轮播图是第几个，索引从0开始*/
        timer: '', /*轮播图 计时器*/
      }
    },
    methods: {
      change(index) {
        /*改变轮播图*/
        this.mark = index;
      },
      autoPlay() {
        /*轮播图自动切换，改变mark,到最后一张时置为0*/
        this.mark++;
        if (this.mark >= this.banner.length) {
          this.mark = 0;
        }
      },
      startTimer() {
        /*轮播图2.5秒自动切换*/
        /*当第一次进入执行created() 生命周期时执行*/
        /*当鼠标从 轮播图 移开 mouseout 的时候执行*/
        this.timer = setInterval(this.autoPlay, 2500);
      },
      stopTimer() {
        /*当鼠标 移到 轮播图 中 停止切换*/
        clearInterval(this.timer);
      },
      linkTo(item){
        //跳转到商品详情页
        if(item.type === 0 || item.type === 2){
          //关联商品
          this.$router.push({
            path: '/goodsDetails',
            query: {
              productId: item.productId
            }
          })
        }else{
          //跳转到完整路径
          window.location.href = item.fullUrl
        }
      }
    },
    created() {
      this.startTimer();
    },
    mounted() {
      productHome().then(res => {
        if (res.success === false) {
          this.error = true;
          return
        }
        let data = res.result;
        this.home = data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === 0) {
            //type等于0的是轮播图
            this.banner = data[i].panelContents;
          }
        }
      })
    },
    components: {
      YShelf,
      MallGood
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
  }

  .no-info {
    padding: 30px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    .no-data {
      align-self: center;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .page {
    position: absolute;
    width: 100%;
    top: 470px;
    z-index: 30;
    .dots {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .dot-active {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-color: whitesmoke;
        border-radius: 8px;
        margin-right: 10px;
        cursor: pointer;
      }
      .dot {
        opacity: 0.2;
      }
    }
  }

  .activity-panel {
    width: 1220px;
    margin: 0 auto;
    .box {
      overflow: hidden;
      position: relative;
      z-index: 0;
      margin-top: 25px;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, .14);
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);
    }
    .content {
      float: left;
      position: relative;
      box-sizing: border-box;
      width: 25%;
      height: 200px;
      text-align: center;
    }
    .content ::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      box-sizing: border-box;
      border-left: 1px solid #f2f2f2;
      border-left: 1px solid rgba(0, 0, 0, .1);
      width: 100%;
      height: 100%;
      content: "";
      pointer-events: none;
    }
    .i {
      width: 305px;
      height: 200px;
    }
    .cover-link {
      cursor: pointer;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 4;
      background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==) repeat;
    }
    a {
      color: #5079d9;
      cursor: pointer;
      transition: all .15s ease-out;
      text-decoration: none;
    }
    a:hover {
      box-shadow: inset 0 0 38px rgba(0, 0, 0, .08);
      transition: all .15s ease;
    }
  }

  .banner, .banner span, .banner div {
    font-family: "Microsoft YaHei";
    transition: all .3s;
    transition-timing-function: linear;
  }

  .banner {
    cursor: pointer;
    perspective: 3000px;
    position: relative;
    z-index: 19;
    margin: 0 auto;
    width: 1220px;
  }

  .bg {
    position: relative;
    width: 1220px;
    height: 500px;
    margin: 20px auto;
    background-size: 100% 100%;
    border-radius: 10px;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: rotateY(0deg) rotateX(0deg);
    & div {
      position: relative;
      height: 100%;
      width: 100%;
    }
  }

  .img1 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .img2 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 5px;
    left: 0;
    background-size: 95% 100%;
    border-radius: 10px;
  }

  .img3 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .a {
    z-index: 20;
    transform: translateZ(40px);
  }

  .b {
    z-index: 20;
    transform: translateZ(30px);
  }

  .c {
    transform: translateZ(0px);
  }

  .sk_item {
    width: 170px;
    height: 225px;
    padding: 0 14px 0 15px;
    > div {
      width: 100%;
    }
    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all .3s;
      &:hover {
        transform: translateY(-5px);
      }
    }
    img {
      width: 130px;
      height: 130px;
      margin: 17px 0;
    }
    .sk_item_name {
      color: #999;
      display: block;
      max-width: 100%;
      _width: 100%;
      overflow: hidden;
      font-size: 12px;
      text-align: left;
      height: 32px;
      line-height: 16px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .sk_item_price {
      padding: 3px 0;
      height: 25px;
    }
    .price_new {
      font-size: 18px;
      font-weight: 700;
      margin-right: 8px;
      color: #f10214;
    }
    .price_origin {
      color: #999;
      font-size: 12px;
    }
  }

  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 29px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);

  }

  ul.box {
    display: flex;
    li {
      flex: 1;
      img {
        display: block;
        width: 305px;
        height: 200px;
      }
    }
  }

  .mt30 {
    margin-top: 30px;
  }

  .hot {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }

  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .imgbanner {
      width: 50%;
      height: 430px;
      .cover-link {
        cursor: pointer;
        display: block;
        position: absolute;
        top: 60px;
        left: 0;
        width: 50%;
        height: 430px;
        z-index: 4;
        background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==) repeat;
      }
      .cover-link:hover {
        box-shadow: inset 0 0 38px rgba(0, 0, 0, .08);
        transition: all .15s ease;
      }
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

</style>
