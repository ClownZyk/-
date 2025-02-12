<template>
  <div class="orders">
    <el-table v-loading="listLoading" :data="orderList" border>
      <el-table-column label="编号" type="index" align="center" width="55"></el-table-column>
      <el-table-column prop="orderid" label="订单编号" align="center" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="购买人姓名" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.buyUser.nickName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="购买人手机号" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.buyUser.userPhone || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="setMeal.recharge" label="充值金额" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="setMeal.giving" label="赠送金额" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="支付方式" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.pays.payType | payTypeStateFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="订单时间" min-width="180" show-overflow-tooltip></el-table-column>
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
  </div>
</template>

<script>
import { getVipOrders } from '@/api/system.js'
import Filters from '@/components/js/Filters.js'

export default {
  mixins: [Filters],
  data() {
    return {
      orderList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      align: 'center',
      listLoading: false
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      let params = {
        orderid: '',
        userPhone: '',
        payState: 'ok',
        payType: 99,
        source: '',
        sTime: `${this.$route.query.date}~${this.$route.query.date}`,
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
      getVipOrders(params).then(
        res => {
          if (res.success) {
            this.listLoading = false
            this.orderList = res.data.list
            this.total = res.total
          }
        },
        () => {
          this.listLoading = false
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
