<template>
  <div class="table-list">
    <el-table v-loading="tableLoading" :data="recordList" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table size="mini" :data="props.row.goodsList" border style="width: 80%;margin: 0 0 0 30px">
            <el-table-column label="产品名称" prop="itemName"></el-table-column>
            <el-table-column label="产品条码" prop="qrCodes"></el-table-column>
            <el-table-column label="补货前数量" prop="beforeCount" align="center"></el-table-column>
            <el-table-column label="补货数量" prop="addCount" align="center"></el-table-column>
            <el-table-column label="总库存" align="center">
              <template slot-scope="scopes">
                <div>{{ Math.round(scopes.row.beforeCount + scopes.row.addCount) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="补货单号" prop="orderCode" min-width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作人" min-width="140" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.name || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作人电话" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.phone || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="180" align="center"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getVendingProdRecord } from '@/api/system'

export default {
  data() {
    return {
      searchForm: {
        vmCode: ''
      },
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
        vmCode: this.$route.query.vmCode,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true
      }
      this.tableLoading = true
      getVendingProdRecord(params)
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

<style lang="scss" scoped>
.table-list {
  margin-top: 20px;
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
