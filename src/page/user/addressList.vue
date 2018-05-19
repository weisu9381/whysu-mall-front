<template>
  <div>
    <y-shelf title="收货地址">
      <span slot="right">
        <y-button text="添加收货地址" style="margin: 0;" @btnClick="update()"></y-button>
      </span>
      <div slot="content">
        <!--标题-->
        <div class="table-title">
          <span class="name">姓名</span><span class="address">地址</span><span class="tel">电话</span>
        </div>
        <!--显示地址-->
        <div v-if="addressList.length">
          <div class="address-item" v-for="(item,index) of addressList" :key="index">
            <div class="name">{{item.userName}}</div>
            <div class="address-msg">{{item.streetName}}</div>
            <div class="telephone">{{item.tel}}</div>
            <div class="defalut">
              <a @click="changeDefault(item)" href="javascript:;" v-text="item.isDefault?'=默认地址=':'设为默认'" :class="{'defalut-address': item.isDefault}"></a>
            </div>
            <!--修改，删除按钮-->
            <div class="operation">
              <el-button type="primary" icon="edit" size="small"  @click="update(item)"></el-button>
              <el-button type="danger" icon="delete" size="small" :data-id="item.addressId" @click="del(item.addressId,index)"></el-button>
            </div>
          </div>
        </div>
        <!--未添加地址-->
        <div v-else>
          <div style="padding: 80px 0;text-align: center">
            <div style="font-size: 20px">你还未添加收货地址</div>
            <div style="margin: 20px ">
              <y-button text="添加地址" @btnClick="update()"></y-button>
            </div>
          </div>
        </div>
      </div>
    </y-shelf>
    <!--弹出窗口，添加/更新收货地址-->
    <y-popup :open="popupOpen" @close="popupOpen=false" :title="popupTitle">
      <div slot="content" class="md" :data-id="msg.addressId">
        <div>
          <input type="text" placeholder="收货人姓名" v-model="msg.userName">
        </div>
        <div>
          <input type="number" placeholder="手机号码" v-model="msg.tel">
        </div>
        <div>
          <input type="text" placeholder="收货地址" v-model="msg.streetName">
        </div>
        <div>
          <el-checkbox class="auto-login" v-model="msg.isDefault">设为默认</el-checkbox>
        </div>
        <y-button class="btn" text="保存" :classStyle="btnHighlight?'main-btn':'disabled-btn'"
                  @btnClick="save({userId:userId,addressId:msg.addressId,userName:msg.userName,tel:msg.tel,streetName:msg.streetName,isDefault:msg.isDefault})">
        </y-button>
      </div>
    </y-popup>
  </div>
</template>

<script>
  import YShelf from '/components/shelf'
  import YButton from '/components/YButton'
  import YPopup from '/components/popup'
  import { getStore } from '/utils/storage'
  import { addressList, addressUpdate, addressAdd, addressDel } from '/api'
  export default {
    data () {
      return {
        userId: '',//用户
        addressList: [],//收货地址
        popupOpen: false, //是否弹出popup窗口
        popupTitle: '修改收货地址',//popup窗口标题
        msg: {
          addressId: '', //地址id
          userName: '', //用户名
          tel: '',  //电话
          streetName: '', //地址
          isDefault: false //是否默认地址
        },
      }
    },
    computed: {
      btnHighlight () { //如果都不为空，则“保存”按钮可以点击
        let msg = this.msg
        return msg.userName && msg.tel && msg.streetName
      }
    },
    methods: {
      messageError (m) {
        this.$message.error({
          message: m
        })
      },
      messageSuccess(m){
        this.$message({
          message: m,
          type: 'success'
        })
      },
      _addressList() {
        //获取地址信息
        addressList({userId: this.userId}).then(res => {
          if(res.result.length > 0){
            this.addressList = res.result;
            this.addressId = res.result[0].addressId || '1';
          }else{
            this.addressList = []
          }
        })
      },
      _addressUpdate (params) {
        addressUpdate(params).then(res => {
          this._addressList();
          this.messageSuccess('修改成功！');
        })
      },
      _addressAdd (params) {
        addressAdd(params).then(res => {
          if (res.success === true) {
            this._addressList()
            this.messageSuccess('添加成功！')
          } else {
            this.messageError(res.message)
          }
        })
      },
      update(item) {
        //更新收货地址
        this.popupOpen = true;
        if(item){
          //修改
          this.popupTitle = '修改收货地址'
          this.msg.userName = item.userName
          this.msg.tel = item.tel
          this.msg.streetName = item.streetName
          this.msg.isDefault = item.isDefault
          this.msg.addressId = item.addressId
        }else{
          //新增
          this.popupTitle = '新增收货地址'
          this.msg.userName = ''
          this.msg.tel = ''
          this.msg.streetName = ''
          this.msg.isDefault = false
          this.msg.addressId = ''
        }
      },
      changeDefault (item) {
        //修改默认地址
        if (!item.isDefault) {
          item.isDefault = true
          this._addressUpdate(item)
        }
      },
      save(p){
        //保存地址
        this.popupOpen = false
        if (p.addressId) {
          this._addressUpdate(p)
        } else {
          delete p.addressId
          this._addressAdd(p)
        }
      },
      del(addressId, index){
        //删除地址
        addressDel({addressId: addressId}).then(res => {
          if (res.success === true) {
            this.addressList.splice(index, 1);
            this.messageSuccess('删除成功！');
          } else {
            this.messageError('删除失败')
          }
        })
      }
    },
    created() {
      this.userId = getStore('userId');
      this._addressList();
    },
    components: {
      YShelf,
      YButton,
      YPopup
    }
  }
</script>

<style scoped lang="scss">
  .table-title {
    position: relative;
    z-index: 1;
    line-height: 38px;
    height: 38px;
    padding: 0 0 0 38px;
    font-size: 12px;
    background: #eee;
    border-bottom: 1px solid #dbdbdb;
    border-bottom-color: rgba(0, 0, 0, .08);
    .name {
      float: left;
      text-align: left;
    }
    span {
      width: 137px;
      float: left;
      text-align: center;
      color: #838383;
    }
    .address {
      margin-left: 115px;
    }
    .tel {
      margin-left: 195px;
    }
  }

  .address-item {
    display: flex;
    align-items: center;
    height: 115px;
    text-align: center;
    .name {
      width: 106px;
    }
    .address-msg {
      flex: 1;
    }
    .telephone {
      width: 160px;
    }
    .defalut {
      width: 80px;
      > a {
        text-align: center;
        /*display: none;*/
      }
    }
    .operation {
      width: 135px;
      a {
        padding: 10px 5px;
      }
    }
    &:hover {
      .defalut > a {
        display: block;
      }
    }
  }

  .address-item + .address-item {
    border-top: 1px solid #CFCFCF;
  }

  .defalut-address {
    color: #626262;
    display: block;
    pointer-events: none;
    cursor: default;
  }

  .md {
    > div {
      text-align: left;
      margin-bottom: 15px;
      > input {
        width: 100%;
        height: 50px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
        line-height: 46px;
      }
    }
  }

  .btn {
    margin: 0;
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 48px
  }
</style>
