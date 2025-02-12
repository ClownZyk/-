<template>
  <div>
    <el-table v-loading="listLoading" :data="transferRecordList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="转移时间" prop="createTime" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="资产来源" prop="sourceInfo.storeName" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="转入门店" prop="storeInfo.storeName" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="资产状态" width="140" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.propertyState === 1" style="color:#E6A23C">使用中</div>
          <div v-else-if="scope.row.propertyState === 2" style="color:#67C23A">已转移</div>
        </template>
      </el-table-column>
      <el-table-column label="资产转移备注" width="240">
        <template slot-scope="scope">
          {{ scope.row.remarks || '--' }}
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
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
    </el-col>
  </div>
</template>

<script>
import { getPropertyTransferRecordList } from '@/api/system'
export default {
  data() {
    return {
      transferRecordList: [],
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getTransferRecordList()
  },
  methods: {
    getTransferRecordList() {
      let params = {
        propertyId: this.$route.query.id,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getPropertyTransferRecordList(params)
        .then(res => {
          this.listLoading = false
          this.transferRecordList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTransferRecordList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTransferRecordList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
