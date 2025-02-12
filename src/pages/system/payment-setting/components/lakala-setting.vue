<template>
  <el-form v-loading="formLoading" ref="configFormRef" :model="configForm" :rules="configFormRules" label-position="top">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="appid" prop="appid"> <el-input type="text" v-model.trim="configForm.appid" placeholder="请输入appid"></el-input> </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="商户证书序列号" prop="serial_no"> <el-input type="text" v-model.trim="configForm.serial_no" placeholder="请输入商户证书序列号"></el-input> </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="被扫商户号" prop="merchant_no"> <el-input type="text" v-model.trim="configForm.merchant_no" placeholder="请输入被扫商户号"></el-input> </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="终端号" prop="term_no"> <el-input type="text" v-model.trim="configForm.term_no" placeholder="请输入终端号"></el-input> </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="机构代码" prop="orgCode"> <el-input type="text" v-model.trim="configForm.orgCode" placeholder="请输入机构代码"></el-input> </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="手续费比例" prop="fee">
          <el-input-number v-model.trim="configForm.fee" :controls="false" :min="0" placeholder="请输入手续费比例" style="width:100%"></el-input-number> <span class="tips">例：0.002 = 千分之二</span>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="常规结算方式" prop="settle_type">
          <el-input type="text" v-model.trim="configForm.settle_type" placeholder="请输入常规结算方式"></el-input> <span class="tips">如需接拉卡拉分账传“1”，商户未开通分账之前不可用此参数</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="商户私钥" prop="merchant_pri_key"> <el-input type="textarea" v-model.trim="configForm.merchant_pri_key" :rows="4" placeholder="请输入商户私钥"></el-input> </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="平台公钥" prop="plateform_key"> <el-input type="textarea" v-model.trim="configForm.plateform_key" :rows="4" placeholder="请输入平台公钥"></el-input> </el-form-item>
      </el-col>
    </el-row>

    <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitConfigInfo">提交</el-button> </el-form-item>
  </el-form>
</template>

<script>
import { getLakalaConfigByCid, lakalaConfigOperation } from '@/api/system'

export default {
  data() {
    return {
      configForm: {
        settle_type: '0',
        orgCode: 1
      },
      operateAction: 0,
      formLoading: false,
      submitLoading: false,
      configFormRules: {
        appid: [{ required: true, message: '请输入appid', trigger: 'blur' }],
        serial_no: [{ required: true, message: '请输入商户证书序列号', trigger: 'blur' }],
        merchant_no: [{ required: true, message: '请输入被扫商户号', trigger: 'blur' }],
        term_no: [{ required: true, message: '请输入终端号', trigger: 'blur' }],
        merchant_pri_key: [{ required: true, message: '请输入商户私钥', trigger: 'blur' }],
        plateform_key: [{ required: true, message: '请输入平台公钥', trigger: 'blur' }],
        orgCode: [{ required: true, message: '请输入机构代码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getLakalaPayConfig()
  },
  methods: {
    getLakalaPayConfig() {
      let params = {
        isPage: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.formLoading = true
      getLakalaConfigByCid(params)
        .then(res => {
          this.formLoading = false
          let data = res.data
          if (data) {
            this.operateAction = 1
            this.configForm = data
          }
        })
        .catch(() => {
          this.formLoading = false
        })
    },
    submitConfigInfo() {
      this.$refs['configFormRef'].validate(valid => {
        if (valid) {
          let params = {
            dto: {
              ...this.configForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.operateAction
          }
          this.submitLoading = true
          lakalaConfigOperation(params)
            .then(res => {
              this.$message.success(res.msg)
              this.clear()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    clear() {
      this.$refs['configFormRef'].clearValidate()
      this.$refs['configFormRef'].resetFields()
      this.configForm = {
        settle_type: '0'
      }
      this.getLakalaPayConfig()
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #e6a23c;
}
</style>
