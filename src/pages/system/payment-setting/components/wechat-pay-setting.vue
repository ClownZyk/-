<template>
  <div class="wechat-pay-setting">
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
      <div class="form-contain-item">
        <el-form-item prop="appid">
          <div class="form-item-title">AppId<span class="border"></span><span class="EnName">APPID</span></div>
          <el-input v-model="form.appid" placeholder="请输入AppId"></el-input>
        </el-form-item>
        <el-form-item prop="appsecret">
          <div class="form-item-title">公众账号secert<span class="border"></span><span class="EnName">APPSECRET</span></div>
          <el-input v-model="form.appsecret" placeholder="请输入公众账号secert"></el-input>
        </el-form-item>
        <el-form-item prop="mchid">
          <div class="form-item-title">商户号<span class="border"></span><span class="EnName">MCHID</span></div>
          <el-input v-model="form.mchid" placeholder="请输入商户号"></el-input>
        </el-form-item>
        <el-form-item prop="key">
          <div class="form-item-title">商户支付密钥<span class="border"></span><span class="EnName">KEY</span></div>
          <el-input v-model="form.key" placeholder="请输入商户支付密钥"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="wxappid">
          <div class="form-item-title">云极小超小程序绑定支付的AppId<span class="border"></span><span class="EnName">WXAPPID</span></div>
          <el-input v-model="form.wxappid" placeholder="请输入云极小超小程序绑定支付的AppId"></el-input>
        </el-form-item>
        <el-form-item prop="wxappsecret">
          <div class="form-item-title">云极小超小程序的secret<span class="border"></span><span class="EnName">WXAPPSECRET</span></div>
          <el-input v-model="form.wxappsecret" placeholder="请输入云极小超小程序的secret"></el-input>
        </el-form-item>
        <el-form-item prop="wxappid">
          <div class="form-item-title">云极咖啡小程序绑定支付的AppId<span class="border"></span><span class="EnName">DRINKWXAPPID</span></div>
          <el-input v-model="form.drinkWXAPPID" placeholder="请输入云极咖啡小程序绑定支付的AppId"></el-input>
        </el-form-item>
        <el-form-item prop="wxappsecret">
          <div class="form-item-title">云极咖啡小程序的secret<span class="border"></span><span class="EnName">DRINKWXAPPSECRET</span></div>
          <el-input v-model="form.drinkWXAPPSECRET" placeholder="请输入云极咖啡小程序的secret"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="sSlCertPath">
          <div class="form-item-title">证书路径<span class="border"></span><span class="EnName">SSLCERTPATH</span></div>
          <el-input v-model="form.sSlCertPath" placeholder="请输入证书路径"></el-input>
        </el-form-item>
        <el-form-item prop="sSlCertPassword">
          <div class="form-item-title">证书密码<span class="border"></span><span class="EnName">SSLCERTPASSWORD</span></div>
          <el-input v-model="form.sSlCertPassword" placeholder="请输入证书密码" type="password"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item> <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button> </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {WeChatPayGetByCid, WeChatPayOperation} from '@/api/system'
export default {
  name: 'wechat-pay-setting',
  data () {
    return {
      form: {},
      formLoading: false,
      submitLoading: false,
      disabledSubmit: false,
      operateAction: 0,
      formRules: {
        appId: [
          {required: true, message: '请输入AppId', trigger: 'blur'}
        ],
        mchid: [
          {required: true, message: '请输入商户号', trigger: 'blur'}
        ],
        key: [
          {required: true, message: '请输入商户支付密钥', trigger: 'blur'}
        ],
        sSlCertPath: [
          {required: true, message: '请输入证书路径', trigger: 'blur'}
        ],
        sSlCertPassword: [
          {required: true, message: '请输入证书密码', trigger: 'blur'}
        ]
      }
    }
  },
   mounted () {
    this.init()
  },
  methods: {
    init () {
      let params = {
          isPage: false,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
      }
      this.formLoading = true
      WeChatPayGetByCid(params).then(res => {
        this.formLoading = false
        if (res.success) {
          let data = res.data
          if (data) {
            // 有值，设为编辑
            this.operateAction = 1
            this.form = data
          }
        }
      }, () => {
        this.formLoading = false
      })
    },
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            let params = {
              Dto: Object.assign({}, this.form),
              Action: this.operateAction
            }
            WeChatPayOperation(params).then(res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
              this.clear()
            })
          })
        }
      })
    },
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
      this.form = {}
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-pay-setting {
  .form {
    /deep/ .el-input {
      width: 400px !important;
    }
    .form-contain-item {
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      margin-left: -20px;
      .el-form-item {
        margin-left: 20px;
        .el-form-item__content {
          .form-item-title {
            font-weight: bolder;
            font-size: 16px;
            position: relative;
            .border {
              width: 1px;
              height: 16px;
              position: absolute;
              background-color: #000000;
              display: inline-block;
              top: 10px;
              margin-left: 8px;
            }
            .EnName {
              font-weight: normal;
              font-size: 14px;
              position: absolute;
              bottom: 0;
              margin-left: 17px;
            }
          }
          .el-input {
            width: 210px;
          }
        }
      }
    }
  }
}
</style>
