<template>
  <div class="fuiou-setting">
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
      <div class="form-contain-item">
        <el-form-item prop="mchnt_cd">
          <div class="form-item-title">二级商户的商户号<span class="border"></span><span class="EnName">MCHNT_CD</span></div>
          <el-input v-model="form.mchnt_cd" placeholder="请输入二级商户的商户号"></el-input>
        </el-form-item>
        <el-form-item prop="mchnt_key">
          <div class="form-item-title">商户秘钥<span class="border"></span><span class="EnName">MCHNT_KEY</span></div>
          <el-input v-model="form.mchnt_key" placeholder="请输入商户秘钥"></el-input>
        </el-form-item>
        <el-form-item prop="version">
          <div class="form-item-title">版本号<span class="border"></span><span class="EnName">VERSION</span></div>
          <el-input v-model="form.version" placeholder="请输入版本号"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="term_id">
          <div class="form-item-title">终端号<span class="border"></span><span class="EnName">TERM_ID</span></div>
          <el-input v-model="form.term_id" placeholder="请输入终端号"></el-input>
        </el-form-item>
        <el-form-item prop="term_ip">
          <div class="form-item-title">终端IP<span class="border"></span><span class="EnName">TERM_IP</span></div>
          <el-input v-model="form.term_ip" placeholder="请输入终端IP"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item> <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button> </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {FuiouGetByCid, FuiouOperation} from '@/api/system'
export default {
  name: 'fuiou-setting',
  data () {
    return {
      // form校验规则
      formRules: {
        mchnt_cd: [
          {required: true, message: '请输入二级商户的商户号', trigger: 'blur'}
        ],
        mchnt_key: [
          {required: true, message: '请输入商户秘钥', trigger: 'blur'}
        ],
        version: [
          {required: true, message: '请输入版本号', trigger: 'blur'}
        ],
        term_id: [
          {required: true, message: '请输入终端号', trigger: 'blur'}
        ],
        term_ip: [
          {required: true, message: '请输入终端IP', trigger: 'blur'}
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
            FuiouOperation(params).then(res => {
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
      await FuiouGetByCid(params).then(res => {
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
.fuiou-setting {
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
