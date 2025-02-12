<template>
  <div class="west-setting">
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
      <div class="form-contain-item">
        <el-form-item prop="mchnt_cd">
          <div class="form-item-title">商户号<span class="border"></span><span class="EnName">mchnt_cd</span></div>
          <el-input v-model="form.mchnt_cd" placeholder="请输入商户号"></el-input>
        </el-form-item>
        <el-form-item prop="staff_id">
          <div class="form-item-title">员工号<span class="border"></span><span class="EnName">staff_id</span></div>
          <el-input v-model="form.staff_id" placeholder="请输入员工号"></el-input>
        </el-form-item>
        <el-form-item prop="shop_id">
          <div class="form-item-title">门店号<span class="border"></span><span class="EnName">shop_id</span></div>
          <el-input v-model="form.shop_id" placeholder="请输入门店号"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="javaPublicKey">
          <div class="form-item-title">公钥参数<span class="border"></span><span class="EnName">javaPublicKey</span></div>
          <el-input v-model="form.javaPublicKey" placeholder="请输入公钥参数" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item prop="javaPrivateKey">
          <div class="form-item-title">私钥参数<span class="border"></span><span class="EnName">javaPrivateKey</span></div>
          <el-input v-model="form.javaPrivateKey" placeholder="请输入RSA私钥" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item> <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button> </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {ningboGetByCid, ningboOperation} from '@/api/system'
export default {
  name: 'ningbo-setting',
  data () {
    return {
      // form校验规则
      formRules: {
        mchnt_cd: [
          {required: true, message: '请输入商户号', trigger: 'blur'}
        ],
        staff_id: [
          {required: true, message: '请输入员工号', trigger: 'blur'}
        ],
        javaPublicKey: [
          {required: true, message: '请输入公钥参数', trigger: 'blur'}
        ],
        javaPrivateKey: [
          {required: true, message: '请输入私钥参数', trigger: 'blur'}
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
              Dto: {...this.form, dotnetPrivateKey: '', dotnetPublicKey: ''},
              Action: this.operateAction
            }
            ningboOperation(params).then(res => {
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
      await ningboGetByCid(params).then(res => {
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
