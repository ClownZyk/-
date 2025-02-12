<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="微信支付分订单详情"> </el-page-header></div>
    <el-form :model="orderDetail">
      <el-row>
        <el-divider content-position="left">订单信息</el-divider>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="商户服务订单号"> {{ orderDetail.out_order_no }} </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <div v-if="orderDetail.state === 'CREATED'">商户已创建服务订单</div>
            <div v-else-if="orderDetail.state === 'DOING'">服务订单进行中</div>
            <div v-else-if="orderDetail.state === 'DONE'">服务订单完成</div>
            <div v-else-if="orderDetail.state === 'REVOKED'">商户取消服务订单</div>
            <div v-else-if="orderDetail.state === 'EXPIRED'">服务订单已失效</div>
          </el-descriptions-item>
          <el-descriptions-item label="订单状态说明">
            <div v-if="orderDetail.state_description === 'USER_CONFIRM'">用户确认</div>
            <div v-else-if="orderDetail.state_description === 'MCH_COMPLETE'">商户完结</div>
            <div v-else>--</div>
          </el-descriptions-item>
        </el-descriptions>
        <!--
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="商户服务订单号：">{{ orderDetail.out_order_no }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态：">
                <div v-if="orderDetail.state === 'CREATED'">商户已创建服务订单</div>
                <div v-else-if="orderDetail.state === 'DOING'">服务订单进行中</div>
                <div v-else-if="orderDetail.state === 'DONE'">服务订单完成</div>
                <div v-else-if="orderDetail.state === 'REVOKED'">商户取消服务订单</div>
                <div v-else-if="orderDetail.state === 'EXPIRED'">服务订单已失效</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态说明：">
                <div v-if="orderDetail.state_description === 'USER_CONFIRM'">用户确认</div>
                <div v-else-if="orderDetail.state_description === 'MCH_COMPLETE'">商户完结</div>
                <div v-else>--</div>
              </el-form-item>
            </el-col>
          </el-row>
        -->
        <el-form-item label="产品信息">
          <el-table :data="orderDetail.post_payments" border>
            <el-table-column label="产品名称" prop="name" min-width="220" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.name }}-{{ scope.row.description }}
              </template>
            </el-table-column>
            <el-table-column label="产品数量" prop="count" min-width="200" align="center"></el-table-column>
            <el-table-column label="产品价格(元)" min-width="240" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="orderDetail.collection && orderDetail.collection.state && orderDetail.collection.state === 'USER_PAYING'"
                  size="small"
                  v-model="scope.row.amount"
                  :min="0"
                  :controls="false"
                  :step="0.01"
                  step-strictly
                  style="width: 100%"
                ></el-input-number>
                <span v-else>{{ scope.row.amount }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px">总金额：{{ total_amount }} 元</div>
        </el-form-item>
      </el-row>
      <el-row v-if="orderDetail.collection">
        <div v-if="orderDetail.collection.state">
          <el-divider content-position="left">收款信息</el-divider>
          <el-row>
            <el-descriptions :column="4" border>
              <el-descriptions-item label="收款状态">
                <div v-if="orderDetail.collection.state === 'USER_PAYING'">待支付</div>
                <div v-else-if="orderDetail.collection.state === 'USER_PAID'">已支付</div>
              </el-descriptions-item>
              <el-descriptions-item label="总收款金额"> {{ orderDetail.collection.total_amount }} 元</el-descriptions-item>
              <el-descriptions-item label="待收金额"> {{ orderDetail.collection.paying_amount }} 元</el-descriptions-item>
              <el-descriptions-item label="已收金额"> {{ orderDetail.collection.paid_amount }} 元</el-descriptions-item>
            </el-descriptions>
          </el-row>
          <!--
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="收款状态：">
                  <div v-if="orderDetail.collection.state === 'USER_PAYING'">待支付</div>
                  <div v-else-if="orderDetail.collection.state === 'USER_PAID'">已支付</div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总收款金额：">{{ orderDetail.collection.total_amount }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待收金额：">{{ orderDetail.collection.paying_amount }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已收金额：">{{ orderDetail.collection.paid_amount }}</el-form-item>
              </el-col>
            </el-row>
          -->
          <el-row>
            <el-form-item label="收款明细表">
              <el-table :data="orderDetail.collection.details" border>
                <el-table-column label="序号" type="index" width="90" align="center"></el-table-column>
                <el-table-column label="微信支付交易单号" prop="transaction_id" min-width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="单笔收款金额(元)" prop="amount" min-width="160" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="收款成功渠道" min-width="160" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div v-if="scope.row.paid_type === 'NEWTON'">微信支付分</div>
                    <div v-else-if="scope.row.paid_type === 'MCH'">商户渠道</div>
                  </template>
                </el-table-column>
                <el-table-column label="收款成功时间" min-width="180" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>{{ scope.row.paid_time.split('+')[0] }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="退款状态" min-width="160" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div v-if="scope.row.refundState === 'SUCCESS'" style="color: #67C23A">退款成功</div>
                    <div v-else-if="scope.row.refundState === 'ABNORMAL'" style="color: #F56C6C">退款异常</div>
                    <div v-else-if="scope.row.refundState === 'CLOSED'" style="color: #909399">退款关闭</div>
                    <div v-else-if="scope.row.refundState === ''">--</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.refundState === ''" size="mini" type="primary" @click="refundPayScoreOrder(scope.row)">退款</el-button>
                    <el-button v-else size="mini" type="warning" @click="refundPayScoreOrderDeatil">退款详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-row>
        </div>
      </el-row>
      <el-row v-if="(orderDetail.collection && orderDetail.collection.state && orderDetail.collection.state === 'USER_PAYING') || (orderDetail.state === 'DOING' && orderDetail.state_description === 'USER_CONFIRM')">
        <el-col :span="12">
          <el-form-item label="原因："> <el-input type="textarea" v-model="reason" :rows="2"></el-input> </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <span v-if="orderDetail.collection"> <el-button v-if="orderDetail.collection.state && orderDetail.collection.state === 'USER_PAYING'" type="warning" @click="updatePayOrder">修改订单金额</el-button> </span>
        <el-button v-if="orderDetail.state === 'DOING' && orderDetail.state_description === 'USER_CONFIRM'" type="danger" @click="completePayOrder">完结订单</el-button>
      </el-form-item>
    </el-form>

    <!-- 退款弹框 -->
    <el-dialog title="退款信息" :visible.sync="isRefundShow" width="500px" @close="isRefundShow = false" :close-on-click-modal="false">
      <el-form ref="refundFormRef" :model="refundForm" :rules="refundFormRules" label-position="right" label-width="140px">
        <el-form-item label="微信支付交易单号：">{{ refundForm.transaction_id }} </el-form-item>
        <el-form-item label="订单总金额：">{{ refundForm.total }} </el-form-item>
        <el-form-item label="退款金额：" prop="refund"> <el-input-number v-model="refundForm.refund" :min="0" :max="refundForm.total" :controls="false" :step="0.01" step-strictly></el-input-number> </el-form-item>
      </el-form>
      <span slot="footer"> <el-button :loading="refundLoading" type="primary" @click="submitRefundInfo">退 款</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPayScoreOrderDetail, updatePayScoreOrder, completePayScoreOrder, refundPayScoreOrder } from '@/api/system'
import { getDataString } from '@/filters/filters'

export default {
  filters: {
    formatTime(time) {
      let year = time.toString().substring(0, 4)
      let month = time.toString().substring(4, 6)
      let day = time.toString().substring(6, 8)
      let hour = time.toString().substring(8, 10)
      let minute = time.toString().substring(10, 12)
      let seconds = time.toString().substring(12)
      let dataTimeLine = `${year}/${month}/${day} ${hour}:${minute}:${seconds}`
      return dataTimeLine
    }
  },
  data() {
    return {
      orderDetail: {
        collection: {},
        post_payments: []
      },
      reason: '',
      refundForm: {
        transaction_id: '',
        out_refund_no: '',
        refund: 0,
        total: 0,
        _id: '' // 退款失败传失败订单的_id
      },
      isRefundShow: false,
      refundLoading: false,
      refundFormRules: {
        refund: [{ required: true, message: '请输入退款金额', trigger: 'change' }]
      }
    }
  },
  watch: {
    isRefundShow(val) {
      if (!val) {
        this.refundForm = {
          transaction_id: '',
          out_refund_no: '',
          refund: 0,
          total: 0,
          _id: ''
        }
      }
    }
  },
  computed: {
    total_amount() {
      let total = 0
      this.orderDetail.post_payments.forEach(item => {
        total = parseFloat((total + item.amount).toFixed(2))
      })
      return total
    }
  },
  mounted() {
    this.getPayScoreOrderDetail()
  },
  methods: {
    getPayScoreOrderDetail() {
      let params = {
        _id: this.$route.query._id
      }
      getPayScoreOrderDetail(params).then(res => {
        this.orderDetail = {
          ...res.data,
          collection:
            res.data.collection && res.data.collection.state
              ? {
                  ...res.data.collection,
                  total_amount: parseFloat((res.data.collection.total_amount / 100).toFixed(2)),
                  paid_amount: parseFloat((res.data.collection.paid_amount / 100).toFixed(2)),
                  paying_amount: parseFloat((res.data.collection.paying_amount / 100).toFixed(2)),
                  details: res.data.collection.details.map(val => {
                    return {
                      ...val,
                      amount: parseFloat((val.amount / 100).toFixed(2))
                    }
                  })
                }
              : res.data.collection,
          total_amount: parseFloat((res.data.total_amount / 100).toFixed(2)),
          post_payments: res.data.post_payments.map(item => {
            return {
              ...item,
              amount: parseFloat((item.amount / 100).toFixed(2))
            }
          })
        }
      })
    },
    // 修改订单金额
    updatePayOrder() {
      if (!this.reason) {
        return this.$message.warning('请填写订单金额修改原因！')
      }
      this.$confirm('确定修改此支付订单金额?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            orderId: this.orderDetail.out_order_no,
            totalAmount: Math.round(this.total_amount * 100),
            reason: this.reason,
            endTime: getDataString(new Date(), 'yyyy/MM/dd hh:mm:ss'),
            prod: this.orderDetail.post_payments.map(item => {
              return {
                ...item,
                amount: Math.round(item.amount * 100)
              }
            })
          }
          // console.log(params)
          updatePayScoreOrder(params).then(res => {
            this.$message.success('修改订单金额操作成功！')
            this.$router.back()
          })
        })
        .catch(() => {})
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
            orderId: this.orderDetail.out_order_no,
            totalAmount: Math.round(this.total_amount * 100),
            reason: this.reason,
            endTime: getDataString(new Date(), 'yyyy/MM/dd hh:mm:ss'),
            prod: this.orderDetail.post_payments.map(item => {
              return {
                ...item,
                amount: Math.round(item.amount * 100)
              }
            })
          }
          // console.log(params)
          completePayScoreOrder(params).then(res => {
            this.$message.success('完结订单操作成功！')
            this.$router.back()
          })
        })
        .catch(() => {})
    },
    // 订单退款
    refundPayScoreOrder(row) {
      this.isRefundShow = true
      this.$nextTick(() => {
        this.refundForm = {
          transaction_id: row.transaction_id,
          out_refund_no: '',
          total: row.amount,
          refund: row.amount,
          _id: ''
        }
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
                ...this.refundForm,
                refund: Math.round(this.refundForm.refund * 100),
                total: Math.round(this.refundForm.total * 100)
              }
              // console.log(params)
              this.refundLoading = true
              refundPayScoreOrder(params)
                .then(res => {
                  this.isRefundShow = false
                  this.refundLoading = false
                  this.getPayScoreOrderDetail()
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
    refundPayScoreOrderDeatil() {
      this.$router.push({ path: '/pay-score-refund-order', query: { oriOrderId: this.orderDetail.out_order_no, refundType: 1 } })
    }
  }
}
</script>

<style lang="scss" scoped></style>
