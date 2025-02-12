<template>
  <div class="detail-container">
    <!-- 订单基本信息 -->
    <div class="detail-item">
      <div class="main-title">基本信息</div>
      <!-- 订单状态 -->
      <div class="order-status">
        订单状态：
        <span v-if="orderDetail.orderStatus !== 5 && orderDetail.orderStatus !== 6 && orderDetail.orderStatus !== 9 && orderDetail.orderStatus !== 10">
          <el-select v-model="orderStatus">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">{{ item.label }}</el-option>
          </el-select>
          <el-button type="primary" @click="orderStateChange">保存</el-button>
        </span>
        <span v-else>{{ orderDetail.orderStatus | orderTypeStateFilter }}</span>
      </div>
      <div class="base-info">
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单编号：{{ orderDetail.orderId }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>预订人：{{ orderDetail.customer.userName || '--' }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>预订人电话：{{ orderDetail.customer.phone || '--' }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>
              支付状态：{{
                orderDetail.payStatus === null
                  ? ''
                  : orderDetail.payStatus.payState === 'ok'
                  ? '支付成功'
                  : orderDetail.payStatus.payState === 'cancel'
                  ? '取消支付'
                  : orderDetail.payStatus.payState === 'prepay'
                  ? '待支付'
                  : orderDetail.payStatus.payState === 'fail'
                  ? '支付失败'
                  : '错误订单'
              }}
            </div>
          </div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单来源：{{ orderDetail.source }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>支付方式：{{ orderDetail.pay.payType | payTypeStateFilter }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>打包完成时间：{{ orderDetail.payStatus.time }}</div>
          </div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单原价：{{ orderDetail.pay.oriTotal }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>优惠方式：{{ orderDetail.pay.discountType | formatDisCountFilter }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>优惠价：{{ orderDetail.pay.discountAmount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>会员优惠金额：{{ orderDetail.pay.memberDiscount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>卡券优惠金额：{{ orderDetail.pay.cardDiscountAmount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单实付金额：{{ orderDetail.pay.buyTotal }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>用户备注：{{ orderDetail.customerRemark }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 普通商品 -->
    <div class="detail-item" v-show="orderDetail.product && orderDetail.product.length > 0">
      <div class="main-title">普通产品</div>
      <el-table :data="orderDetail.product" border style="width: 100%" :summary-method="getCommonSummaries" show-summary>
        <el-table-column prop="sku.barCode" label="商品条码" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品图片" width="160" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.sku.skuImg && scope.row.sku.skuImg.url" style="width: 35px; height: 35px" :src="scope.row.sku.skuImg.url" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.productName }}</div>
            <div v-if="scope.row.drinkLabels && scope.row.drinkLabels.length > 0">
              (<span v-for="(label, i) in scope.row.drinkLabels" :key="i">{{ label.labelTypeName + '：' + label.labelName[0] + (i + 1 !== scope.row.drinkLabels.length ? '，' : '') }}</span
              >)
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sku.name" label="商品规格" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="加料" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.batchings && scope.row.batchings.length > 0">
              <div v-for="(batch, index) in scope.row.batchings" :key="index">{{ batch.prodName }}(￥{{ batch.price }}x{{ batch.count * (scope.row.type ? scope.row.buyCount : scope.row.sku.count) }}份)</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="sku.nowPrice" sortable label="商品价格" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sku.memberPrice" sortable label="商品实付价格" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sku.count" sortable label="数量" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column sortable label="实付总价" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ Math.round((scope.row.sku.memberPrice * scope.row.sku.count + scope.row.batchPrice) * 100) / 100 }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 促销商品 -->
    <div class="detail-item" v-show="orderDetail.promotion && orderDetail.promotion.length > 0">
      <div class="main-title">促销产品</div>
      <el-table :data="orderDetail.promotion" border style="width: 100%" :summary-method="getPromotionSummaries" show-summary>
        <el-table-column type="expand" width="55" align="center">
          <template slot-scope="props">
            <el-table :data="props.row.aProduct" style="width: 80%;">
              <el-table-column prop="productName" label="商品名称" min-width="150" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="barCode" label="商品条码" min-width="180" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="price" label="商品价格" min-width="150" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="count" label="商品数量" min-width="100" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="促销类型" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.type === 4">选购套餐</div>
            <div v-else>其他</div>
          </template>
        </el-table-column>
        <el-table-column prop="pName" label="商品名称" align="center" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="retailPrice" label="应付总价" align="center" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actualPrice" sortable label="实付总价" align="center" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="discountPrice" sortable label="优惠总价" align="center" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="buyCount" sortable label="数量" align="center" min-width="100" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getDrinkOrderDetail, updateDrinkOrderStatus } from '@/api/system'
import Filters from '@/components/js/Filters'
import { toDecimal } from '@/filters/filters'

export default {
  mixins: [Filters],
  data() {
    return {
      orderStatus: null,
      orderDetail: {
        customer: {},
        payStatus: {},
        pay: {},
        sendInfo: {}
      },
      stateList: [{ value: 8, label: '待接单' }, { value: 13, label: '制作中' }, { value: 11, label: '待取货' }, { value: 6, label: '已完成' }]
    }
  },
  mounted() {
    this.getOrderDetail()
  },
  methods: {
    // 获取订单详情
    getOrderDetail() {
      let params = {
        _id: this.$route.query.id
      }
      getDrinkOrderDetail(params).then(
        res => {
          if (res.success) {
            res.data.product.forEach(item => {
              item.batchPrice = 0
              if (item.batchings && item.batchings.length > 0) {
                item.batchings.forEach(batch => {
                  item.batchPrice += Math.round(batch.count * batch.price * 100) / 100
                })
              }
            })
            this.orderDetail = res.data
            this.orderStatus = res.data.orderStatus
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 订单状态改变
    orderStateChange() {
      this.$confirm('是否修改订单状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            _id: this.orderDetail._id,
            orderStatus: this.orderStatus
          }
          updateDrinkOrderStatus(params).then(
            res => {
              if (res.success) {
                this.$router.go(-1)
              }
            },
            err => {
              console.log(err.msg)
            }
          )
        })
        .catch(() => {})
    },
    // 普通产品合计
    getCommonSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 7) {
          let count = 0
          data.forEach(item => {
            count += item.sku.count
          })
          sums[index] = count
        } else if (index === 8) {
          let total = 0
          data.forEach(item => {
            total += Math.round((item.sku.memberPrice * item.sku.count + item.batchPrice) * 100) / 100
          })
          sums[index] = toDecimal(total)
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },
    // 促销产品合计
    getPromotionSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 6) {
          let count = 0
          data.forEach(item => {
            item.aProduct.forEach(v => {
              count += v.count
            })
          })
          sums[index] = count
        } else {
          sums[index] = '--'
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  .detail-item {
    margin-bottom: 15px;
    .main-title {
      font-weight: bolder;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .order-status {
      margin-bottom: 10px;
    }
    .base-info {
      background-color: #f2f6fc;
      padding: 0 10px 10px 10px;
      .main-l-row {
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        .main-l-l {
          flex: 0 0 25%;
          display: flex;
          display: -webkit-flex;
          margin-top: 10px;
          .border {
            width: 3px;
            height: 20px;
            background-color: #409eff;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
