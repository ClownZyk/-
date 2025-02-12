<template>
  <div class="alipay-setting">
    <!-- <div class="top-tip">支付宝的支付配置仅适用于收银台</div> -->
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
      <div class="form-contain-item">
        <el-form-item prop="alipay_public_key">
          <div class="form-item-title">支付宝公钥<span class="border"></span><span class="EnName">ALIPAYPUBLICKEY</span></div>
          <el-input v-model="form.alipay_public_key" placeholder="请输入支付宝公钥"></el-input>
        </el-form-item>
        <el-form-item prop="merchant_private_key">
          <div class="form-item-title">开发者私钥<span class="border"></span><span class="EnName">MERCHANTPRIVATEKEY</span></div>
          <el-input v-model="form.merchant_private_key" placeholder="请输入开发者私钥"></el-input>
        </el-form-item>
        <el-form-item prop="merchant_public_key">
          <div class="form-item-title">开发者公钥<span class="border"></span><span class="EnName">MERCHANTPUBLICKEY</span></div>
          <el-input v-model="form.merchant_public_key" placeholder="请输入开发者公钥"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="appId">
          <div class="form-item-title">AppId<span class="border"></span><span class="EnName">APPID</span></div>
          <el-input v-model="form.appId" placeholder="请输入AppId"></el-input>
        </el-form-item>
        <el-form-item prop="pid">
          <div class="form-item-title">帐号PID(partner id)<span class="border"></span><span class="EnName">PID</span></div>
          <el-input v-model="form.pid" placeholder="请输入帐号PID"></el-input>
        </el-form-item>
        <el-form-item prop="pid">
          <div class="form-item-title">AES秘钥<span class="border"></span><span class="EnName">AES</span></div>
          <el-input v-model="form.aes" placeholder="请输入AES秘钥"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item> <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button> </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {AliPayGetByCid, AliPayOperation} from '@/api/system'
export default {
  name: 'alipay-setting',
  data () {
    return {
      // form校验规则
      formRules: {
        alipay_public_key: [
          {required: true, message: '请输入支付宝公钥', trigger: 'blur'}
        ],
        merchant_private_key: [
          {required: true, message: '请输入开发者私钥', trigger: 'blur'}
        ],
        merchant_public_key: [
          {required: true, message: '请输入开发者公钥', trigger: 'blur'}
        ],
        appId: [
          {required: true, message: '请输入AppId', trigger: 'blur'}
        ],
        pid: [
          {required: true, message: '请输入帐号PID', trigger: 'blur'}
        ],
        aes: [
          {required: true, message: '请输入AES秘钥', trigger: 'blur'}
        ]
      },
      // 控制提交按钮是否禁用
      disabledSubmit: false,
      form: {},
      formLoading: false,
      submitLoading: false,
      // 默认是添加
      operateAction: 0
    }
  },
  methods: {
    // 各种清空
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
      this.form = {}
      this.init()
    },
    // 提交
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
            AliPayOperation(params).then(res => {
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
    async init () {
      let params = {
          pageSize: 0,
          pageIndex: 0,
          isPage: false,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
      }
      this.formLoading = true
      await AliPayGetByCid(params).then(res => {
        this.formLoading = false
        if (res.success) {
          // console.log(res.data)
          let data = res.data
          if (data) {
            // 有值，设为编辑
            this.operateAction = 1
            this.form = data
          }
        }
      }, err => {
        this.formLoading = false
        this.$message.error(err.msg)
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.alipay-setting {
  .top-tip {
    height: 50px;
    line-height: 50px;
    background-color: #fcf8e3;
    padding-left: 15px;
    font-size: 14px;
    color: #8a6d3b;
    border: 1px solid #faebcc;
    margin-bottom: 20px;
  }
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
