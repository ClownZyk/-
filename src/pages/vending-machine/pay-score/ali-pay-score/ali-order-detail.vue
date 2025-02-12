<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="支付宝支付分订单详情"> </el-page-header></div>
    <el-descriptions :column="3" border>
      <el-descriptions-item label="订单号"> {{ orderDetail.orderId }} </el-descriptions-item>
      <el-descriptions-item label="订单金额"> {{ orderDetail.total }} 元</el-descriptions-item>
      <el-descriptions-item label="订单创建时间"> {{ orderDetail.createTime }} </el-descriptions-item>
      <el-descriptions-item label="协议状态">
        <div v-if="orderDetail.status === 'NORMAL'" style="color:#67C23A">已签约</div>
        <div v-else-if="orderDetail.status === 'TEMP'" style="color:#E6A23C">暂存，协议未生效过</div>
        <div v-else-if="orderDetail.status === 'STOP'" style="color:#909399">暂停</div>
        <div v-else>--</div>
      </el-descriptions-item>
      <el-descriptions-item label="协议签约场景"> {{ orderDetail.sign_scene || '--' }} </el-descriptions-item>
      <el-descriptions-item label="协议产品码"> {{ orderDetail.personal_product_code || '--' }} </el-descriptions-item>
      <el-descriptions-item label="签约编号"> {{ orderDetail.agreement_no || '--' }} </el-descriptions-item>
      <el-descriptions-item label="代扣协议签约号"> {{ orderDetail.external_agreement_no || '--' }} </el-descriptions-item>
      <el-descriptions-item label="签约支付宝用户号"> {{ orderDetail.alipay_user_id || '--' }} </el-descriptions-item>
      <el-descriptions-item label="代扣协议签约时间"> {{ orderDetail.sign_time || '--' }} </el-descriptions-item>
      <el-descriptions-item label="代扣协议生效时间"> {{ orderDetail.valid_time || '--' }} </el-descriptions-item>
      <el-descriptions-item label="代扣协议失效时间"> {{ orderDetail.invalid_time || '--' }} </el-descriptions-item>
      <el-descriptions-item label="交易状态">
        <div v-if="orderDetail.trade_status === 'TRADE_SUCCESS'" style="color:#67C23A">已支付</div>
        <div v-else style="color:#909399">未支付</div>
      </el-descriptions-item>
      <el-descriptions-item label="支付宝交易凭证号"> {{ orderDetail.trade_no || '--' }} </el-descriptions-item>
      <el-descriptions-item label="退款状态">
        <div v-if="orderDetail.trade_status === 'TRADE_SUCCESS' && orderDetail.total > 0">
          <el-button v-if="!orderDetail.refundState" size="mini" type="warning" @click="handlePayScoreRefund()">退款</el-button>
          <div v-else style="color: #F56C6C">已退款</div>
        </div>
        <div v-else>--</div>
      </el-descriptions-item>
    </el-descriptions>
    <div class="table-list">
      <el-divider content-position="left">产品信息</el-divider>
      <el-table :data="orderDetail.prod" border>
        <el-table-column label="产品名称" prop="name" min-width="220" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品数量" prop="count" min-width="200" align="center"></el-table-column>
        <el-table-column label="产品价格(元)" prop="amount" min-width="240" align="center">
          <template slot-scope="scope">
            {{ parseFloat(((scope.row.amount * scope.row.count) / 100).toFixed(2)) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row v-if="orderDetail.status === 'NORMAL' && !orderDetail.trade_status">
      <el-form>
        <el-form-item label="订单完结备注："> <el-input type="textarea" v-model="reason" :rows="2" placeholder="请输入订单完结备注"></el-input> </el-form-item>
        <el-form-item> <el-button type="danger" @click="completePayOrder">完结订单</el-button> </el-form-item>
      </el-form>
    </el-row>

    <!-- 退款弹框 -->
    <el-dialog title="订单退款" :visible.sync="isRefundShow" width="500px" @close="isRefundShow = false" :close-on-click-modal="false">
      <el-form ref="refundFormRef" :model="refundForm" :rules="refundFormRules" label-position="right" label-width="100px">
        <el-form-item label="订单号：">{{ refundForm.orderId }} </el-form-item>
        <el-form-item label="订单金额：">{{ refundForm.total }} 元</el-form-item>
        <el-form-item label="退款金额：" prop="refund"> <el-input-number v-model="refundForm.refund" :min="0" :max="refundForm.total" :controls="false" :step="0.01" step-strictly></el-input-number> </el-form-item> </el-form
      ><span slot="footer"> <el-button :loading="refundLoading" type="primary" @click="submitRefundInfo">退 款</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAlipayScoreOrderDetail, completeAlipayScoreOrder, refundAlipayScoreOrder } from '@/api/system'
import { getDataString } from '@/filters/filters'

export default {
  data() {
    return {
      orderDetail: {},
      reason: '',
      refundForm: {},
      isRefundShow: false,
      refundLoading: false,
      refundFormRules: {
        refund: [{ required: true, message: '请输入退款金额', trigger: 'change' }]
      }
    }
  },
  watch: {},
  mounted() {
    this.getAliPayScoreOrderDetail()
  },
  methods: {
    getAliPayScoreOrderDetail() {
      let params = {
        _id: this.$route.query._id
      }
      getAlipayScoreOrderDetail(params).then(res => {
        this.orderDetail = {
          ...res.data,
          prod: res.data.prod ? res.data.prod : []
        }
      })
    },
    handlePayScoreRefund() {
      this.isRefundShow = true
      this.$nextTick(() => {
        let { orderId, total } = this.orderDetail
        this.refundForm = { orderId, total, refund: total, _id: '' }
      })
    },
    submitRefundInfo() {
      this.$refs['refundFormRef'].validate(valid => {
        if (valid) {
          this.$confirm('确认退款操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let params = {
                orderId: this.refundForm.orderId,
                refund: this.refundForm.refund,
                _id: this.refundForm._id
              }
              // console.log(params)
              this.refundLoading = true
              refundAlipayScoreOrder(params)
                .then(res => {
                  this.isRefundShow = false
                  this.refundLoading = false
                  this.getAliPayScoreOrderList()
                  this.$message.success(res.data.message || '退款成功！')
                })
                .catch(() => {
                  this.refundLoading = false
                })
            })
            .catch(() => {})
        }
      })
    },
    // 完结订单
    completePayOrder() {
      if (!this.reason) {
        return this.$message.warning('请填写订单完结原因！')
      }
      this.$confirm('确定完结此支付订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            orderId: this.orderDetail.orderId,
            totalAmount: parseInt(this.orderDetail.total * 100),
            reason: this.reason,
            endTime: getDataString(new Date(), 'yyyy/MM/dd hh:mm:ss'),
            prod: this.orderDetail.prod.map(item => {
              return {
                ...item,
                amount: parseInt(item.amount * 100)
              }
            })
          }
          // console.log(params)
          completeAlipayScoreOrder(params).then(res => {
            this.$message.success('完结订单操作成功！')
            this.$router.back()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped></style>
