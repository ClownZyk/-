<template>
  <div v-loading="configLoading">
    <el-form ref="appletConfigRef" :model="appletConfig" :rules="appletConfigRules" label-position="top">
      <el-form-item label="功能设置模式：" prop="featureSet">
        <el-radio-group v-model="appletConfig.featureSet">
          <el-radio :label="1" border>点餐+支付</el-radio>
          <el-radio :label="2" border>支付</el-radio>
          <el-radio :label="3" border>点餐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付模式：" prop="payMode">
        <el-radio-group v-model="appletConfig.payMode">
          <el-radio :label="1" border>先支付后下单</el-radio>
          <el-radio :label="2" border>先下单后支付</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="接单方式：" prop="acceptMode">
        <el-radio-group v-model="appletConfig.acceptMode">
          <el-radio :label="1" border>手动接单</el-radio>
          <el-radio :label="2" border>自动接单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitAppletConfigInfo">确定并提交</el-button> </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAppletConfigDetails, appletConfigOperation } from '@/api/system'

export default {
  data() {
    return {
      appletConfig: {},
      formState: 0,
      configLoading: false,
      submitLoading: false,
      appletConfigRules: {
        featureSet: [{ required: true, message: '请选择功能设置模式', trigger: 'change' }],
        payMode: [{ required: true, message: '请选择支付模式', trigger: 'change' }],
        acceptMode: [{ required: true, message: '请选择接单方式', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getAppletConfig()
  },
  methods: {
    getAppletConfig() {
      let params = {
        cid: this.$store.state._cid
      }
      this.configLoading = true
      getAppletConfigDetails(params)
        .then(res => {
          this.configLoading = false
          if (res.data._id === '000000000000000000000000') {
            this.formState = 0
          } else {
            this.formState = 1
            this.appletConfig = res.data
          }
        })
        .catch(() => {
          this.configLoading = false
        })
    },
    submitAppletConfigInfo() {
      this.$refs['appletConfigRef'].validate(valid => {
        if (valid) {
          let params = {
            dto: {
              ...this.appletConfig,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.formState
          }
          this.submitLoading = true
          appletConfigOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.getAppletConfig()
            })
            .catch(() => {
              this.configLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
