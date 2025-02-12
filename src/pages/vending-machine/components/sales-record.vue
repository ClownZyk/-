<template>
  <div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="salesRecordList" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table size="mini" :data="props.row.orderGoodsList" border style="width: 80%;margin-left: 30px">
              <el-table-column label="产品名称" prop="itemName"></el-table-column>
              <el-table-column label="产品价格" align="center">
                <template slot-scope="scopes">
                  <div>{{ parseFloat((scopes.row.itemPrice / 100).toFixed(2)) }}</div>
                </template>
              </el-table-column>
              <el-table-column label="购买数量" prop="count" align="center"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="订单号" prop="orderId" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="购买人姓名" min-width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.customer.userName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="购买人电话" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.customer.phone || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus">{{ scope.row.payStatus.payState | payStateFilter }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.orderStatus | vendingOrderStateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.orderRefundStatus | vendingOrderRefundStateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="180" align="center"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getVendingSalesByProduct } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      salesRecordList: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getProductSalesRecordList()
  },
  methods: {
    getProductSalesRecordList() {
      let params = {
        vmCode: this.$route.query.vmcode,
        itemCode: this.$route.query.itemCode,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getVendingSalesByProduct(params)
        .then(res => {
          this.tableLoading = false
          this.salesRecordList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductSalesRecordList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProductSalesRecordList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
