<template>
  <div class="table-list">
    <el-table v-loading="tableLoading" :data="productList" border>
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="产品名称" prop="name" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品条码" prop="barCode" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品库存" prop="stock" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="售价(元)" prop="price" width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ Math.round(scope.row.price) / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="原价(元)" prop="originalPrice" width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ Math.round(scope.row.originalPrice) / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="上下架" width="140" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isShow" style="color: #67C23A">已上架</span> <span v-else style="color: #F56C6C">已下架</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getVendingMachineBindProd } from '@/api/system'

export default {
  data() {
    return {
      productList: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getMachineBindProd()
  },
  methods: {
    getMachineBindProd() {
      let params = {
        vmcode: this.$route.query.vmCode,
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
      getVendingMachineBindProd(params)
        .then(res => {
          this.tableLoading = false
          this.productList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getMachineBindProd()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getMachineBindProd()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
  margin-top: 20px;
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
