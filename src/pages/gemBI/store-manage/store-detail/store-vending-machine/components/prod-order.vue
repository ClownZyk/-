<template>
  <div class="order-container">
    <el-form :model="searchForm" inline>
      <el-form-item label="开门编码"> <el-input type="text" v-model.trim="searchForm.orderCode" placeholder="请输入开门编码检索" clearable></el-input> </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态"> <el-option v-for="item in vendingOrderState" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="订单时间">
        <el-date-picker
          v-model="timeFrame"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition('refresh')">搜索</el-button> </el-form-item>
    </el-form>
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>总销售额(元)</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ totalSales }}</div>
        </div>
      </div>
    </div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="orderList" border>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column prop="orderId" label="订单编号" min-width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderCode" label="开门编码" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.customer.userName || '--' }}</template>
        </el-table-column>
        <el-table-column label="手机号" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.customer.phone || '--' }}</template>
        </el-table-column>
        <el-table-column label="订单金额" min-width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.pay">{{ scope.row.pay.buyTotal ? (scope.row.pay.buyTotal / 100).toFixed(2) : scope.row.pay.buyTotal }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" min-width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.pay">{{ scope.row.pay.payType | payTypeStateFilter }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus">{{ scope.row.payStatus.payState | payStateFilter }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="100" align="center">
          <template slot-scope="scope">{{ scope.row.orderStatus | vendingOrderStateFilter }}</template>
        </el-table-column>
        <el-table-column prop="pay.payType" label="退款状态" min-width="100" align="center">
          <template slot-scope="scope">{{ scope.row.orderRefundStatus | vendingOrderRefundStateFilter }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>

        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleOrderDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handlePayScoreOrder(scope.row)">支付分订单信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
        </el-pagination>
      </div>
    </div>

    <!-- 订单详情弹框 -->
    <el-dialog title="订单详情" :visible.sync="isOrderDetailShow" width="800px" @close="isOrderDetailShow = false" :close-on-click-modal="false">
      <el-form :model="orderDetail">
        <el-form-item label="订单编号：">{{ orderDetail.orderId }}</el-form-item>
        <el-form-item label="订单视频：">
          <div class="video-main"><video :src="orderDetail.videoUrl" controls muted></video></div>
        </el-form-item>
        <el-form-item label="购买商品信息：">
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
        </el-form-item>
      </el-form>
      <span slot="footer"> </span>
    </el-dialog>

    <!-- 支付分订单信息 -->
    <el-dialog title="支付分订单" :visible.sync="isPayScoreOrderShow" width="1000px" @close="isPayScoreOrderShow = false" :close-on-click-modal="false">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="微信支付分订单" name="first">
          <el-table v-loading="tableLoading" :data="payScoreWxOrderList" border style="margin-top: 10px">
            <el-table-column label="商户服务订单号" prop="out_order_no" min-width="200" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="订单总金额" width="120" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ Math.round(scope.row.total_amount) / 100 }}
              </template>
            </el-table-column>
            <el-table-column label="服务时间段" min-width="280" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.time_range.start_time">{{ scope.row.time_range.start_time.split('+')[0] }}- {{ scope.row.time_range.end_time.split('+')[0] }}</div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column label="服务订单状态" min-width="180" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.state === 'CREATED'">商户已创建服务订单</div>
                <div v-else-if="scope.row.state === 'DOING'">服务订单进行中</div>
                <div v-else-if="scope.row.state === 'DONE'">服务订单完成</div>
                <div v-else-if="scope.row.state === 'REVOKED'">商户取消服务订单</div>
                <div v-else-if="scope.row.state === 'EXPIRED'">服务订单已失效</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="handleWxPayScoreDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog width="1000px" title="微信支付分订单详情" :visible.sync="isWxPayScoreOrderDetailShow" append-to-body>
            <el-form :model="wxPayScoreOrderDetail">
              <el-row>
                <el-divider content-position="left">订单信息</el-divider>
                <el-form-item label="商户服务订单号：">{{ wxPayScoreOrderDetail.out_order_no }}</el-form-item>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="订单状态：">
                      <div v-if="wxPayScoreOrderDetail.state === 'CREATED'">商户已创建服务订单</div>
                      <div v-else-if="wxPayScoreOrderDetail.state === 'DOING'">服务订单进行中</div>
                      <div v-else-if="wxPayScoreOrderDetail.state === 'DONE'">服务订单完成</div>
                      <div v-else-if="wxPayScoreOrderDetail.state === 'REVOKED'">商户取消服务订单</div>
                      <div v-else-if="wxPayScoreOrderDetail.state === 'EXPIRED'">服务订单已失效</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="订单状态说明：">
                      <div v-if="wxPayScoreOrderDetail.state_description === 'USER_CONFIRM'">用户确认</div>
                      <div v-else-if="wxPayScoreOrderDetail.state_description === 'MCH_COMPLETE'">商户完结</div>
                      <div v-else>--</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
              <el-row v-if="wxPayScoreOrderDetail.collection">
                <div v-if="wxPayScoreOrderDetail.collection.state">
                  <el-divider content-position="left">收款信息</el-divider>
                  <el-row :gutter="20">
                    <el-col :span="6">
                      <el-form-item label="收款状态：">
                        <div v-if="wxPayScoreOrderDetail.collection.state === 'USER_PAYING'">待支付</div>
                        <div v-else-if="wxPayScoreOrderDetail.collection.state === 'USER_PAID'">已支付</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="总收款金额：">{{ wxPayScoreOrderDetail.collection.total_amount }}</el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="待收金额：">{{ wxPayScoreOrderDetail.collection.paying_amount }}</el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="已收金额：">{{ wxPayScoreOrderDetail.collection.paid_amount }}</el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="收款明细表">
                      <el-table :data="wxPayScoreOrderDetail.collection.details" border>
                        <el-table-column label="微信支付交易单号" prop="transaction_id" min-width="200" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="单笔收款金额" prop="amount" min-width="160" align="center" show-overflow-tooltip></el-table-column>
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
                        <el-table-column label="退款状态" min-width="140" align="center" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <div v-if="scope.row.refundState === 'SUCCESS'" style="color: #67C23A">退款成功</div>
                            <div v-else-if="scope.row.refundState === 'ABNORMAL'" style="color: #F56C6C">退款异常</div>
                            <div v-else-if="scope.row.refundState === 'CLOSED'" style="color: #909399">退款关闭</div>
                            <div v-else-if="scope.row.refundState === ''">--</div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-row>
                </div>
              </el-row>
            </el-form>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="支付宝支付分订单" name="second">
          <el-table v-loading="tableLoading" :data="payScoreAliOrderList" border style="margin-top: 10px">
            <el-table-column label="订单号" prop="orderId" min-width="180" align="center" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column label="支付宝账号" prop="phone" width="160" align="center" show-overflow-tooltip></el-table-column> -->
            <el-table-column label="订单总金额" prop="total" width="140" align="center" show-overflow-tooltip> </el-table-column>
            <el-table-column label="协议状态" width="160" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.status === 'NORMAL'" style="color:#67C23A">已签约</div>
                <div v-else-if="scope.row.status === 'TEMP'" style="color:#E6A23C">暂存，协议未生效过</div>
                <div v-else-if="scope.row.status === 'STOP'" style="color:#909399">暂停</div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column label="交易状态" width="140" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.trade_status === 'TRADE_SUCCESS'" style="color:#67C23A">已支付</div>
                <div v-else style="color:#909399">未支付</div>
              </template>
            </el-table-column>
            <el-table-column label="退款状态" width="140" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button v-if="scope.row.refundState" type="text">已退款</el-button>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="handleAliPayScoreDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog width="1000px" title="支付宝支付分订单详情" :visible.sync="isAliPayScoreOrderDetailShow" append-to-body>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="订单号"> {{ aliPayScoreOrderDetail.orderId }} </el-descriptions-item>
              <el-descriptions-item label="订单金额"> {{ aliPayScoreOrderDetail.total }} 元</el-descriptions-item>
              <el-descriptions-item label="订单创建时间"> {{ aliPayScoreOrderDetail.createTime }} </el-descriptions-item>
              <el-descriptions-item label="协议状态">
                <div v-if="aliPayScoreOrderDetail.status === 'NORMAL'" style="color:#67C23A">已签约</div>
                <div v-else-if="aliPayScoreOrderDetail.status === 'TEMP'" style="color:#E6A23C">暂存，协议未生效过</div>
                <div v-else-if="aliPayScoreOrderDetail.status === 'STOP'" style="color:#909399">暂停</div>
                <div v-else>--</div>
              </el-descriptions-item>
              <el-descriptions-item label="协议签约场景"> {{ aliPayScoreOrderDetail.sign_scene || '--' }} </el-descriptions-item>
              <el-descriptions-item label="协议产品码"> {{ aliPayScoreOrderDetail.personal_product_code || '--' }} </el-descriptions-item>
              <el-descriptions-item label="签约编号"> {{ aliPayScoreOrderDetail.agreement_no || '--' }} </el-descriptions-item>
              <el-descriptions-item label="代扣协议签约号"> {{ aliPayScoreOrderDetail.external_agreement_no || '--' }} </el-descriptions-item>
              <el-descriptions-item label="签约支付宝用户号"> {{ aliPayScoreOrderDetail.alipay_user_id || '--' }} </el-descriptions-item>
              <el-descriptions-item label="代扣协议签约时间"> {{ aliPayScoreOrderDetail.sign_time || '--' }} </el-descriptions-item>
              <el-descriptions-item label="代扣协议生效时间"> {{ aliPayScoreOrderDetail.valid_time || '--' }} </el-descriptions-item>
              <el-descriptions-item label="代扣协议失效时间"> {{ aliPayScoreOrderDetail.invalid_time || '--' }} </el-descriptions-item>
              <el-descriptions-item label="交易状态">
                <div v-if="aliPayScoreOrderDetail.trade_status === 'TRADE_SUCCESS'" style="color:#67C23A">已支付</div>
                <div v-else style="color:#909399">未支付</div>
              </el-descriptions-item>
              <el-descriptions-item label="支付宝交易凭证号"> {{ aliPayScoreOrderDetail.trade_no || '--' }} </el-descriptions-item>
              <el-descriptions-item label="退款状态">
                <div v-if="aliPayScoreOrderDetail.trade_status === 'TRADE_SUCCESS' && aliPayScoreOrderDetail.total > 0">
                  <el-button v-if="!aliPayScoreOrderDetail.refundState" size="mini" type="warning">--</el-button>
                  <div v-else style="color: #F56C6C">已退款</div>
                </div>
                <div v-else>--</div>
              </el-descriptions-item>
            </el-descriptions>
            <div class="table-list">
              <el-divider content-position="left">产品信息</el-divider>
              <el-table :data="aliPayScoreOrderDetail.post_payments" border>
                <el-table-column label="产品名称" prop="name" min-width="220" show-overflow-tooltip></el-table-column>
                <el-table-column label="产品数量" prop="count" min-width="200" align="center"></el-table-column>
                <el-table-column label="产品价格" prop="amount" min-width="240" align="center"> </el-table-column>
              </el-table>
            </div>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getVendingMachineAllOrder, getVendingMachineOrderDetail, getVendingMachineOrderVideo, getPayScoreOrder, getPayScoreOrderDetail, getAlipayScoreOrderList, getAlipayScoreOrderDetail } from '@/api/system'
import Filters from '@/components/js/Filters'
import { formatDate } from '@/components/js/data'

export default {
  mixins: [Filters],
  data() {
    return {
      searchForm: {
        orderCode: '',
        orderStatus: 0
      },
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd 00:00:00'), formatDate(new Date(), 'yyyy-MM-dd 23:59:59')],
      orderList: [],
      totalSales: 0,
      orderDetail: {},
      payScoreWxOrderList: [],
      payScoreAliOrderList: [],
      wxPayScoreOrderDetail: {
        collection: {},
        post_payments: []
      },
      aliPayScoreOrderDetail: {},
      activeName: 'first',
      tableLoading: false,
      isOrderDetailShow: false,
      isPayScoreOrderShow: false,
      isWxPayScoreOrderDetailShow: false,
      isAliPayScoreOrderDetailShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    isOrderDetailShow(val) {
      if (!val) {
        this.orderDetail = {}
      }
    },
    isPayScoreOrderShow(val) {
      if (!val) {
        this.payScoreWxOrderList = []
        this.payScoreAliOrderList = []
      }
    },
    isWxPayScoreOrderDetailShow(val) {
      if (!val) {
        this.wxPayScoreOrderDetail = {
          collection: {},
          post_payments: []
        }
      }
    },
    isAliPayScoreOrderDetailShow(val) {
      if (!val) {
        this.aliPayScoreOrderDetail = {}
      }
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        vmCode: this.$route.query.vmCode,
        orderId: '',
        orderCode: this.searchForm.orderCode,
        phone: '',
        orderStatus: this.searchForm.orderStatus,
        start: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[0] : '',
        end: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[1] : '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      this.tableLoading = true
      getVendingMachineAllOrder(params)
        .then(res => {
          this.tableLoading = false
          this.orderList = res.data.list
          this.totalSales = parseFloat((res.data.total / 100).toFixed(2))
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleOrderDetail(row) {
      this.isOrderDetailShow = true
      let params = {
        orderCode: row.orderCode
      }
      getVendingMachineOrderDetail(params).then(res => {
        this.orderDetail = res.data
        if (!res.data.videoUrl) {
          // 获取订单视频
          this.getVideoDetail(res.data.tradeRequestId)
        }
      })
    },
    getVideoDetail(tradeRequestId) {
      getVendingMachineOrderVideo(tradeRequestId).then(res => {
        this.orderDetail.videoUrl = res.data.videoUrl
      })
    },
    handlePayScoreOrder(row) {
      this.isPayScoreOrderShow = true
      this.getWxPayScoreOrder(row)
      this.getAliPayScoreOrder(row)
    },
    getWxPayScoreOrder(row) {
      let params = {
        orderId: row.orderId,
        pageIndex: 1,
        pageSize: 10,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      getPayScoreOrder(params).then(res => {
        this.payScoreWxOrderList = res.data.listData
      })
    },
    getAliPayScoreOrder(row) {
      let params = {
        orderId: row.orderId,
        pageIndex: 1,
        pageSize: 10,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      getAlipayScoreOrderList(params).then(res => {
        this.payScoreAliOrderList = res.data.listData
      })
    },
    handleWxPayScoreDetail(row) {
      this.isWxPayScoreOrderDetailShow = true
      let params = {
        _id: row._id
      }
      getPayScoreOrderDetail(params).then(res => {
        this.wxPayScoreOrderDetail = {
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
    handleAliPayScoreDetail(row) {
      this.isAliPayScoreOrderDetailShow = true
      let params = {
        _id: row._id
      }
      getAlipayScoreOrderDetail(params).then(res => {
        this.orderDetail = {
          ...res.data,
          prod: res.data.prod ? res.data.prod : []
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-container {
  margin-top: 20px;
  .home-count {
    width: 100%;
    padding-bottom: 10px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    .home-count-item {
      flex: 0 0 19%;
      background-color: #ffffff;
      box-shadow: 0 0 10px #dddddd;
      padding: 10px 15px;
      max-height: 112.81px;
      .conut-l-title {
        color: #aaaaaa;
        font-size: 14px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
      }
      .count-l-total {
        font-size: 20px;
        font-weight: bold;
        display: flex;
        display: -webkit-flex;
        align-items: baseline;
        div.count-value {
          font-size: 26px;
          font-weight: bold;
          color: #2c2c2c;
        }
        .iconfont {
          margin-right: 10px;
        }
      }
    }
  }
}
.table-list {
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
.video-main {
  width: 80%;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
