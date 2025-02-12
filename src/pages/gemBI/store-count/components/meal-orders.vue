<template>
  <div class="orders">
    <el-table v-loading="listLoading" :data="orderList" border>
      <el-table-column label="编号" type="index" align="center" width="55"></el-table-column>
      <el-table-column prop="orderId" label="订单编号" align="center" min-width="170" show-overflow-tooltip></el-table-column>
      <el-table-column label="买家姓名" :align="align" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">{{ scope.row.customer.userName || '--' }}</template>
      </el-table-column>
      <el-table-column label="手机号" :align="align" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.customer === null ? '--' : scope.row.customer.phone === '' ? '--' : scope.row.customer.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pay.buyTotal" label="订单金额" min-width="110" :align="align" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" min-width="100" :align="align" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="下单时间" :align="align" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="160" align="center" fixed="right">
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
      <!-- 基本信息 -->
      <div class="product-info">
        <div class="name">基本信息</div>
        <el-row>
          <el-col :span="10">
            <div class="order-info">订单号：{{ orderDetail.orderId }}</div>
          </el-col>
          <el-col :span="8">
            <div class="order-info">实付金额：{{ orderDetail.pay.buyTotal }}</div>
          </el-col>
        </el-row>
      </div>
      <!-- 普通商品 -->
      <div class="product-info" v-if="product.length > 0">
        <div class="name">产品列表</div>
        <el-table :data="product" border style="width: 100%">
          <el-table-column prop="d_sku.barcode" label="商品条码" min-width="180" :align="align" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="商品名称" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="d_sku.title" label="商品规格" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="price" label="现价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="d_sku.price" label="原价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="d_sku.vipPrice" label="会员价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="d_sku.dayCount" label="数量" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFoodOrders, DailyVShopFoodOrderId } from '@/api/system.js'
import Filters from '@/components/js/Filters.js'

export default {
  mixins: [Filters],
  data() {
    return {
      orderList: [],
      orderDetail: {
        pay: {}
      },
      product: [],
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
        userID: '',
        paystatus: '',
        phone: '',
        orderStatus: '',
        beginTime: this.$route.query.date,
        endTime: this.$route.query.date,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      this.listLoading = true
      getFoodOrders(params).then(
        res => {
          if (res.statu) {
            this.listLoading = false
            this.orderList = res.data
            this.total = res.total
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
      DailyVShopFoodOrderId(params).then(
        res => {
          if (res.success) {
            this.orderDetail = res.data
            this.product = res.data.product
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
      margin-bottom: 10px;
    }
    .order-info {
      font-size: 16px;
    }
  }
}
</style>
