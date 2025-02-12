<template>
  <div class="table-list">
    <el-table v-loading="listLoading" :data="receiveList" border>
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="领取人" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.userName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="领取人电话" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.userphone || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="领取卡券" min-width="180" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.cardBag" :key="index">{{ item.title }}（<span v-if="item.isReceive" style="color: #67C23A">领取成功</span><span v-else style="color: #F56C6C">领取失败</span>）</div>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" prop="createTime" min-width="180" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
      style="text-align: right;margin-top: 10px"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getShareCardUserList } from '@/api/system'

export default {
  data() {
    return {
      receiveList: [],
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getUserReceiveList()
  },
  methods: {
    getUserReceiveList() {
      let params = {
        shareId: this.$route.query.id,
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
      getShareCardUserList(params)
        .then(res => {
          this.listLoading = false
          this.receiveList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserReceiveList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getUserReceiveList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
