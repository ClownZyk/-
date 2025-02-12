<template>
  <div class="order">
    <el-table :data="cardsList" border style="width: 100%" v-loading="loading">
      <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
      <el-table-column prop="orderId" align="center" label="订单编号" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="customer.userName" align="center" label="买家姓名" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="customer.phone" align="center" label="买家手机号" min-width="140" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="logisticsInfo.logisticsCompany" align="center" label="物流公司" min-width="140" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="支付状态" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.payStatus.payState | payStateFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.orderStatus | orderPresentStateFilter }}</template>
      </el-table-column>
      <el-table-column label="积分类型" align="center" min-width="140">
        <template slot-scope="scope">{{ scope.row.orderType === 1 ? '实物' : '虚拟商品' }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="this.cardsList.length !== 0"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      background
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { IntegralOrderGetListByProductId } from '@/api/system'
import Filter from '@/components/js/Filters'
export default {
  mixins: [Filter],
  data() {
    return {
      cardsList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      loading: false
    }
  },
  methods: {
    init() {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          orderId: this.$route.query.id,
          phone: '',
          orderStatus: 0,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        IntegralOrderGetListByProductId(parmas).then(
          res => {
            this.loading = true
            if (res.success) {
              this.loading = false
              this.cardsList = res.data
              this.total = res.total
            } else this.$message.error(res.msg)
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.setData()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.setData()
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.order {
  .pagination {
    float: right;
    margin-top: 10px;
  }
}
</style>
