<template>
  <div class="west-setting">
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
      <div class="form-contain-item">
        <el-form-item prop="openpL_APPID">
          <div class="form-item-title">开放平台唯一标识<span class="border"></span><span class="EnName">OPENPL_APPID</span></div>
          <el-input v-model="form.openpL_APPID" placeholder="请输入开放平台唯一标识"></el-input>
        </el-form-item>
        <el-form-item prop="openpL_APPSECRET">
          <div class="form-item-title">开放平台秘钥<span class="border"></span><span class="EnName">OPENPL_APPSECRET</span></div>
          <el-input v-model="form.openpL_APPSECRET" placeholder="请输入开放平台秘钥"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="rsapublickey">
          <div class="form-item-title">RSA公钥<span class="border"></span><span class="EnName">RSAPUBLICKEY</span></div>
          <el-input v-model="form.rsapublickey" placeholder="请输入RSA公钥" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item prop="rsaprivatekey">
          <div class="form-item-title">RSA私钥<span class="border"></span><span class="EnName">RSAPRIVATEKEY</span></div>
          <el-input v-model="form.rsaprivatekey" placeholder="请输入RSA私钥" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="dooR_ID">
          <div class="form-item-title">门店编号<span class="border"></span><span class="EnName">dooR_ID</span></div>
          <el-input v-model="form.dooR_ID" placeholder="请输入门店编号"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item> <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button> </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {WestGetByCid, WestOperation} from '@/api/system'
export default {
  name: 'west-setting',
  data () {
    return {
      // form校验规则
      formRules: {
        openpL_APPID: [
          {required: true, message: '请输入开放平台唯一标识', trigger: 'blur'}
        ],
        openpL_APPSECRET: [
          {required: true, message: '请输入开放平台秘钥', trigger: 'blur'}
        ],
        rsapublickey: [
          {required: true, message: '请输入RSA公钥', trigger: 'blur'}
        ],
        rsaprivatekey: [
          {required: true, message: '请输入RSA私钥', trigger: 'blur'}
        ],
        dooR_ID: [
          {required: true, message: '请输入门店编号', trigger: 'blur'}
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
            WestOperation(params).then(res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
              this.clear()
            }).catch(() => {
              this.submitLoading = false
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
      await WestGetByCid(params).then(res => {
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
.west-setting {
  .form {
    /deep/ .el-input,
    .el-textarea {
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
