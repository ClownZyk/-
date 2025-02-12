<template>
  <div class="orders">
    <el-table v-loading="listLoading" :data="orderList" border>
      <el-table-column label="编号" type="index" align="center" width="55"></el-table-column>
      <el-table-column prop="orderId" label="订单编号" align="center" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="姓名" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.customer.userName || '--' }}</template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.customer.phone || '--' }}</template>
      </el-table-column>
      <el-table-column prop="pay.buyTotal" label="订单金额" min-width="100" align="center"></el-table-column>
      <el-table-column prop="source" label="订单来源" min-width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="pay.payType" label="订单状态" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.orderStatus | orderTypeStateFilter }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
      <el-table-column label="支付状态" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-show="scope.row.payStatus !== null">
            <div v-if="scope.row.payStatus.payState === 'ok'" style="color: #13CE66;">支付成功</div>
            <div v-else-if="scope.row.payStatus.payState === 'cancel'" style="color: #909399;">取消支付</div>
            <div v-else-if="scope.row.payStatus.payState === 'prepay'" style="color: #e6b321;">待支付</div>
            <div v-else-if="scope.row.payStatus.payState === 'fail'" style="color: #FF4949;">支付失败</div>
            <div v-else-if="scope.row.payStatus.payState === 'error'" style="color: #FF4949;">错误订单</div>
            <div v-else></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="checkOrderDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next"
      :total="total"
      background
    ></el-pagination>

    <!-- 订单包含产品弹框 -->
    <el-dialog title="订单详情" :visible.sync="orderdialogVisible" width="50%" @close="orderdialogVisible = false">
      <div class="product-info">
        <div class="name">基本信息</div>
        <el-row>
          <el-col :span="10">
            <div class="order-info">订单号：{{ orderDetail.orderId }}</div>
          </el-col>
          <el-col :span="8">
            <div class="order-info">实付金额：{{ orderDetail.pay.buyTotal }} 元</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <div class="order-info">购买人：{{ orderDetail.customer.userName || '--' }}</div>
          </el-col>
          <el-col :span="10">
            <div class="order-info">购买人手机号：{{ orderDetail.customer.phone || '--' }}</div>
          </el-col>
        </el-row>
      </div>
      <!-- 普通商品 -->
      <div class="product-info" v-if="product.length > 0">
        <div class="name">普通产品</div>
        <el-table :data="product" border style="width: 100%">
          <el-table-column prop="sku.barCode" label="商品条码" min-width="180" :align="align" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productName" label="商品名称" :align="align" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sku.name" label="商品规格" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sku.nowPrice" label="商品价格" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="price" label="商品实付价格" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sku.count" label="数量" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column label="实付总价" :align="align" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{ Math.round(scope.row.price * scope.row.sku.count * 100) / 100 }}</template>
          </el-table-column> -->
        </el-table>
      </div>
      <!-- 促销产品 -->
      <div class="product-info" v-if="promotion.length > 0">
        <div class="name">促销产品</div>
        <el-table :data="promotion" border style="width: 100%">
          <el-table-column type="expand" width="60">
            <template slot-scope="props">
              <el-table :data="props.row.aProduct" style="width: 80%" border>
                <el-table-column prop="productName" label="商品名称" min-width="150" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="barCode" label="商品条码" min-width="220" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="price" label="商品原价" min-width="150" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="count" label="商品数量" min-width="100" align="center" show-overflow-tooltip></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="sku.barCode" label="促销类型" min-width="180" :align="align" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.type === 1">单品</div>
              <div v-if="scope.row.type === 2">组合</div>
              <div v-if="scope.row.type === 3">选购组合</div>
            </template>
          </el-table-column>
          <el-table-column prop="pName" label="商品名称" :align="align" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="retailPrice" label="应付总价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="actualPrice" label="实付总价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="discountPrice" label="优惠总价" :align="align"></el-table-column>
          <el-table-column prop="buyCount" label="数量" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <!-- 临期产品 -->
      <div class="product-info" v-if="batchList.length > 0">
        <div class="name">临期产品</div>
        <el-table :data="batchList" border style="width: 100%">
          <el-table-column prop="batchBarCode" label="临期码" width="180" :align="align"></el-table-column>
          <el-table-column prop="productName" label="商品名称" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="price" label="原价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="batchPrice" label="临期价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="count" label="数量" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column label="总价" :align="align" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.batchPrice * scope.row.count }}</template>
          </el-table-column> -->
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProductOrders, GetOrderDetail } from '@/api/system.js'
import Filters from '@/components/js/Filters.js'

export default {
  mixins: [Filters],
  data() {
    return {
      orderList: [],
      orderDetail: {
        pay: {},
        customer: {}
      },
      product: [],
      promotion: [],
      batchList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      align: 'center',
      listLoading: false,
      orderdialogVisible: false
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      let params = {
        start: this.$route.query.date,
        end: this.$route.query.date,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        cid: this.$route.query.cid
      }
      this.listLoading = true
      getProductOrders(params).then(
        res => {
          if (res.success) {
            this.listLoading = false
            this.orderList = res.data.listData
            this.total = res.data.total
          }
        },
        () => {
          this.listLoading = false
        }
      )
    },
    // 查看订单详情
    checkOrderDetail(row) {
      this.orderdialogVisible = true
      this.getOrderDetail(row._id)
    },
    // 查询订单详情
    getOrderDetail(id) {
      let params = {
        _id: id
      }
      GetOrderDetail(params).then(
        res => {
          if (res.success) {
            this.orderDetail = res.data
            this.product = res.data.product
            this.promotion = res.data.promotion
            this.batchList = res.data.batchProduct.map(item => {
              return {
                ...item,
                skuImg: item.skuImg ? item.skuImg.url : ''
              }
            })
          }
        },
        err => {
          console.log(err.msg)
        }
      )
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
.orders {
  .pagination {
    margin-top: 15px;
    text-align: right;
  }
  .product-info {
    margin-bottom: 15px;
    .name {
      font-weight: bolder;
      font-size: 18px;
    }
    .order-info {
      font-size: 16px;
      margin-top: 10px;
    }
  }
}
</style>
