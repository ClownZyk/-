<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="订单详情"> </el-page-header></div>
    <div class="order-detail">
      <el-row>
        <el-divider content-position="left">基本信息</el-divider>
        <div class="order-base-info">
          <div class="base-info-item">
            <span class="border"></span><span>订单编号：{{ orderDetail.orderId }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>售卖机名称：{{ orderDetail.vmName }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>售卖机编码：{{ orderDetail.vmCode }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>购买人：{{ orderDetail.customer.userName || '--' }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>购买人电话：{{ orderDetail.customer.phone }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span
            ><span
              >支付方式：<span v-if="orderDetail.pay">{{ orderDetail.pay.payType | payTypeStateFilter }}</span
              ><span v-else>--</span></span
            >
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>支付状态：{{ orderDetail.payStatus.payState | payStateFilter }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>订单状态：{{ orderDetail.orderStatus | vendingOrderStateFilter }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>退款状态：{{ orderDetail.orderRefundStatus | vendingOrderRefundStateFilter }}</span>
          </div>
          <div class="base-info-item">
            <span class="border"></span>
            <span
              >订单原价： <span v-if="orderDetail.pay">{{ (orderDetail.pay.oriTotal / 100).toFixed(2) }}</span> <span v-else>--</span>
            </span>
          </div>
          <div class="base-info-item">
            <span class="border"></span>
            <span
              >实付金额： <span v-if="orderDetail.pay">{{ (orderDetail.pay.buyTotal / 100).toFixed(2) }}</span> <span v-else>--</span>
            </span>
          </div>
          <div class="base-info-item">
            <span class="border"></span><span>创建时间：{{ orderDetail.createTime }}</span>
          </div>
        </div>
      </el-row>
      <!-- 订单视频 -->
      <el-row>
        <el-divider content-position="left">订单视频</el-divider>
        <div class="video-main" v-if="orderDetail.videoUrls && orderDetail.videoUrls.length > 0"><video v-for="(item, index) in orderDetail.videoUrls" :key="index" :src="item" controls muted></video></div>
        <div class="video-main" v-else><video :src="orderDetail.videoUrl" controls muted></video></div>
      </el-row>
      <el-row>
        <el-divider content-position="left">商品信息</el-divider>
        <el-table size="mini" :data="orderDetail.orderGoodsList" border>
          <el-table-column label="商品图片" width="150" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.imageUrl" style="width: 40px; height: 40px" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]" fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="itemName" label="商品名称" min-width="100"></el-table-column>
          <el-table-column label="商品价格" align="center">
            <template slot-scope="scope">
              <div>{{ (scope.row.itemPrice / 100).toFixed(2) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量" align="center"></el-table-column>
          <el-table-column label="实付总价" align="center">
            <template slot-scope="scope">{{ ((scope.row.itemPrice * scope.row.count) / 100).toFixed(2) }}</template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getVendingMachineOrderDetail, getVendingMachineOrderVideo } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      orderDetail: {
        customer: {},
        payStatus: {},
        pay: {}
      }
    }
  },
  mounted() {
    this.getAbnormalOrderDetail()
  },
  methods: {
    getAbnormalOrderDetail() {
      let params = {
        orderCode: this.$route.query.orderCode
      }
      getVendingMachineOrderDetail(params).then(res => {
        this.orderDetail = res.data
        if (!res.data.videoUrls && res.data.videoUrls.length <= 0 && !res.data.videoUrl) {
          // 获取订单视频
          this.getVideoDetail(res.data.tradeRequestId)
        }
      })
    },
    getVideoDetail(tradeRequestId) {
      getVendingMachineOrderVideo(tradeRequestId).then(res => {
        this.orderDetail.videoUrl = res.data.videoUrl
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  .order-base-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 15px 15px;
    background: #f2f6fc;
    border-radius: 10px;
    .base-info-item {
      flex: 25%;
      margin-top: 15px;
      .border {
        display: inline-block;
        width: 3px;
        height: 15px;
        background-color: #409eff;
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }
  .video-main {
    display: flex;
    flex-wrap: wrap;
    video {
      width: 49%;
      height: 100%;
      margin: 0 3px 6px 0;
    }
  }
}
</style>
