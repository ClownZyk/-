<template>
  <div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="recordList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="操作人" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.name || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作人电话" min-width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.phone || '--' }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="产品名称" prop="product.itemName" min-width="180" align="center" show-overflow-tooltip> </el-table-column> -->
        <!-- <el-table-column label="产品条码" prop="product.qrCodes" min-width="160" align="center" show-overflow-tooltip> </el-table-column> -->
        <el-table-column label="补货前数量" prop="product.beforeCount" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="补货数量" prop="product.addCount" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="补货后数量" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scopes">
            <div>{{ Math.round(scopes.row.product.beforeCount + scopes.row.product.addCount) }}</div>
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
import { getVendingRecordByProduct } from '@/api/system'

export default {
  data() {
    return {
      recordList: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getProdRecordList()
  },
  methods: {
    getProdRecordList() {
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
      getVendingRecordByProduct(params)
        .then(res => {
          this.tableLoading = false
          this.recordList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProdRecordList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProdRecordList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
