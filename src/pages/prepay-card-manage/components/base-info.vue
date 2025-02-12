<template>
  <div>
    <el-descriptions :column="4" border>
      <template slot="extra">
        <el-button type="primary" size="small" @click="handlePrepayCardWriteOff" :disabled="cardDetail.balance === 0">核销</el-button>
      </template>
      <el-descriptions-item label="预付卡号"> {{ cardDetail.card_id }} </el-descriptions-item>
      <el-descriptions-item label="商户系统订单号"> {{ cardDetail.out_trade_no }} </el-descriptions-item>
      <el-descriptions-item label="商户号"> {{ cardDetail.mch_id }} </el-descriptions-item>
      <el-descriptions-item label="持有者id"> {{ cardDetail.uid }} </el-descriptions-item>
      <el-descriptions-item label="余额"> {{ Math.round(cardDetail.balance * 0.01 * 100) / 100 }} 元 </el-descriptions-item>
      <el-descriptions-item label="核销中金额"> {{ Math.round(cardDetail.settling_fee * 0.01 * 100) / 100 }} 元</el-descriptions-item>
      <el-descriptions-item label="核销成功金额"> {{ Math.round(cardDetail.settle_success_fee * 0.01 * 100) / 100 }} 元</el-descriptions-item>
      <el-descriptions-item label="卡状态">
        <div v-if="cardDetail.status === 1" style="color:#67C23A">正常</div>
        <div v-else-if="cardDetail.status === 2" style="color:#E6A23C">退卡中</div>
        <div v-else-if="cardDetail.status === 3" style="color:#909399">已退卡</div>
        <div v-else-if="cardDetail.status === 4" style="color:#409EFF">已冻结</div>
        <div v-else-if="cardDetail.status === 5" style="color:#F56C6C">已注销</div>
      </el-descriptions-item>
      <el-descriptions-item label="卡描述"> {{ cardDetail.description || '--' }} </el-descriptions-item>
    </el-descriptions>

    <!-- 核销弹框 -->
    <el-dialog title="预付卡核销" :visible.sync="isCardWriteOffShow" width="500px" :close-on-click-modal="false">
      <el-form ref="writeOffFormRef" :model="writeOffForm" :rules="writeOffFormRules" label-width="96px" label-position="right">
        <el-form-item label="预付卡号：">{{ writeOffForm.card_id }}</el-form-item>
        <el-form-item label="用户id：">{{ writeOffForm.uid }}</el-form-item>
        <el-form-item label="核销金额：" prop="total_fee"> <el-input-number v-model="writeOffForm.total_fee" :controls="false" :min="0" :max="cardDetail.balance" :step="0.01" step-strictly></el-input-number> </el-form-item>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitWriteOffInfo">核 销</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPrepayCardDetail, settlePrepayCard } from '@/api/system'

export default {
  data() {
    return {
      cardDetail: {},
      writeOffForm: {
        total_fee: 0
      },
      isCardWriteOffShow: false,
      submitLoading: false,
      writeOffFormRules: {
        total_fee: [{ required: true, message: '核销金额不能为空', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getPrepayCardDetail()
  },
  methods: {
    getPrepayCardDetail() {
      let params = {
        card_id: this.$route.query.cardId,
        out_trade_no: this.$route.query.outTradeNo
      }
      this.detailLoading = true
      getPrepayCardDetail(params)
        .then(res => {
          this.detailLoading = false
          this.cardDetail = res.data
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    handlePrepayCardWriteOff() {
      this.isCardWriteOffShow = true
      this.$nextTick(() => {
        this.writeOffForm = {
          card_id: this.cardDetail.card_id,
          uid: this.cardDetail.uid,
          total_fee: Math.round(this.cardDetail.balance * 0.01 * 100) / 100
        }
      })
    },
    submitWriteOffInfo() {
      this.$refs['writeOffFormRef'].validate(valid => {
        if (valid) {
          let params = {
            ...this.writeOffForm,
            total_fee: parseFloat((this.writeOffForm.total_fee * 100).toFixed(0))
          }
          this.submitLoading = true
          settlePrepayCard(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.getPrepayCardDetail()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
