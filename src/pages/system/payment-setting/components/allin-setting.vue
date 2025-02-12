<template>
  <div class="allin-setting">
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
      <div class="form-contain-item">
        <el-form-item prop="appid">
          <div class="form-item-title">应用ID<span class="border"></span><span class="EnName">APPID</span></div>
          <el-input v-model="form.appid" placeholder="请输入应用ID"></el-input>
        </el-form-item>
        <el-form-item prop="cusid">
          <div class="form-item-title">商户号<span class="border"></span><span class="EnName">CUSID</span></div>
          <el-input v-model="form.cusid" placeholder="请输入商户号"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="appkey">
          <div class="form-item-title">交易密钥<span class="border"></span><span class="EnName">APPKEY</span></div>
          <el-input v-model="form.appkey" placeholder="请输入交易密钥"></el-input>
        </el-form-item>
        <el-form-item prop="apiversion">
          <div class="form-item-title">版本号<span class="border"></span><span class="EnName">APIVERSION</span></div>
          <el-input v-model="form.apiversion" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item prop="subbranch">
          <div class="form-item-title">门店编号<span class="border"></span><span class="EnName">SUBBRANCH</span></div>
          <el-input v-model="form.subbranch" placeholder="请输入门店编号"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item> <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button> </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {AllinpayGetByCid, AllinpayOperation} from '@/api/system'
export default {
  name: 'allin-setting',
  data () {
    return {
      // form校验规则
      formRules: {
        appid: [
          {required: true, message: '请输入应用ID', trigger: 'blur'}
        ],
        cusid: [
          {required: true, message: '请输入商户号', trigger: 'blur'}
        ],
        appkey: [
          {required: true, message: '请输入交易密钥', trigger: 'blur'}
        ],
        apiversion: [
          {required: true, message: '请输入版本号', trigger: 'blur'}
        ],
        subbranch: [
          {required: true, message: '请输入版本号', trigger: 'blur'}
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
            this.$set(this.form, 'roleId', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            let params = {
              Dto: Object.assign({}, this.form),
              Action: this.operateAction
            }
            AllinpayOperation(params).then(res => {
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
      await AllinpayGetByCid(params).then(res => {
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
.allin-setting {
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
