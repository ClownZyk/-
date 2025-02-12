<template>
  <div class="points-rule-setting">
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
      <div class="form-contain-item">
        <el-form-item prop="vipIntegrals">
          <div class="form-item-title">VIP积分<span class="border"></span><span class="EnName">VIPINTEGRALS</span></div>
          <el-input-number :controls="false" v-model="form.vipIntegrals" placeholder="请输入VIP积分"></el-input-number>
        </el-form-item>
        <el-form-item prop="ordinaryIntegrals">
          <div class="form-item-title">普通用户积分<span class="border"></span><span class="EnName">ORDINARYINTEGRALS</span></div>
          <el-input-number :controls="false" v-model="form.ordinaryIntegrals" placeholder="请输入普通用户积分"></el-input-number>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="activeStartTime">
          <div class="form-item-title">特殊活动开始时间<span class="border"></span><span class="EnName">ACTIVESTARTTIME</span></div>
          <el-date-picker v-model="form.activeStartTime" type="datetime" placeholder="选择开始时间" :picker-options="pickerOptionsStart"></el-date-picker>
        </el-form-item>
        <el-form-item prop="activeEndTime">
          <div class="form-item-title">特殊活动结束时间<span class="border"></span><span class="EnName">ACTIVEENDTIME</span></div>
          <el-date-picker v-model="form.activeEndTime" type="datetime" placeholder="选择结束时间" :picker-options="pickerOptionsEnd"></el-date-picker>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item prop="activeVIPIntegrals">
          <div class="form-item-title">活动期间VIP积分<span class="border"></span><span class="EnName">VIPINTEGRALS</span></div>
          <el-input-number :controls="false" v-model="form.activeVIPIntegrals" placeholder="请输入活动期间VIP积分"></el-input-number>
        </el-form-item>
        <el-form-item prop="activeOrdinaryIntegrals">
          <div class="form-item-title">活动期间普通用户积分<span class="border"></span><span class="EnName">ORDINARYINTEGRALS</span></div>
          <el-input-number :controls="false" v-model="form.activeOrdinaryIntegrals" placeholder="请输入活动期间普通用户积分"></el-input-number>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {DefineIntegralGetByCid, DefineIntegralOperation} from '@/api/system'
export default {
  name: 'points-rule-setting',
  data () {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endTime = this.form.activeEndTime
          if (endTime) {
            return time.getTime() > new Date(endTime).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginTime = this.form.activeStartTime
          if (beginTime) {
            return (time.getTime() < new Date(beginTime).getTime())
          }
        }
      },
      // form校验规则
      formRules: {
        vipIntegrals: [
          {required: true, message: '请输入VIP积分', trigger: 'blur'}
        ],
        ordinaryIntegrals: [
          {required: true, message: '请输入普通用户积分', trigger: 'blur'}
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
            DefineIntegralOperation(params).then(res => {
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
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.formLoading = true
      await DefineIntegralGetByCid(params).then(res => {
        if (res.success) {
          // console.log(res.data)
          let data = res.data
          if (data !== {}) {
            // 有值，设为编辑
            this.operateAction = 1
            this.form = data
            this.formLoading = false
          }
        } else {
          this.formLoading = false
          this.$message.error(res.msg)
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
  .points-rule-setting {
    padding: 20px;
    .form {
      // /deep/ .el-input {
      //   width: 400px !important;
      // }
      /deep/ .el-form-item__content {
        width: 280px;
      }
      .form-contain-item {
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
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
