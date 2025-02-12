<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">原订单收件人名称<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input v-model="form.oriOrder.sendInfo.receiverInfo.name" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">原订单收件人手机号<span class="border"></span><span class="EnName">PHONE</span></div>
            <el-input v-model="form.oriOrder.sendInfo.receiverInfo.phone" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">原订单号<span class="border"></span><span class="EnName">ORDERID</span></div>
            <el-input v-model="form.oriOrder.orderId" disabled></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">退款金额<span class="border"></span><span class="EnName">REFUNDFEE</span></div>
            <el-input v-model="form.refund_fee" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">退款日期<span class="border"></span><span class="EnName">APPLYTIME</span></div>
            <el-input v-model="form.createTime" disabled></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item class="item-long">
            <div class="form-item-title">退款说明<span class="border"></span><span class="EnName">REFUNDDESC</span></div>
            <el-input v-model="form.refund_desc" disabled type="textarea" :rows="4"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">快递公司<span class="border"></span><span class="EnName">EXPRESSCOMPANY</span></div>
            <el-input v-model="form.expressCompany" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">快递单号<span class="border"></span><span class="EnName">EXPRESSNO</span></div>
            <el-input v-model="form.expressNo" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">寄件人手机号<span class="border"></span><span class="EnName">MOBILE</span></div>
            <el-input v-model="form.mobile" disabled></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="replyContent">
            <div class="form-item-title">审核<span class="border"></span><span class="EnName">STATE</span></div>
            <el-select v-model="form.state" placeholder="请选择">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="replyContent" class="item-long">
            <div class="form-item-title">回复<span class="border"></span><span class="EnName">REPLYCONTENT</span></div>
            <el-input v-model="form.replyContent" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" @click="formSubmit" :loading="submitLoading" :disabled="disabledSubmit" class="submit-btn">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    form: Object,
    formDisabled: {
      type: Boolean,
      default: false
    },
    submitLoading: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabledSubmit: {
      type: Boolean,
      default: false
    },
    operateTitle: {
      type: String,
      default: ''
    },
    operateAction: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      stateList: [
        { value: 1, label: '待审核' },
        { value: 2, label: '同意退款' },
        { value: 3, label: '拒绝退款' }
      ],
      rules: {
        state: [
          {required: true, message: '请选择退款状态', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    formSubmit () {
      if (this.form.state === 1) {
        this.$message({
          message: '审核状态不能为待审核',
          type: 'warning'
        })
        return false
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$emit('formSubmit')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .base-info {
    width: 100%;
    .page-contain {
      width: 100%;
      background-color: #ffffff;
      .form-contain {
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
            }
          }
          .item-long {
            width: 440px;
          }
          .item-middle {
            width: 210px;
          }
        }
      }
    }
  }
  .submit-btn{
    margin-left: 20px;
  }
</style>
