<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="goBack" content="充值退款订单"> </el-page-header></div>
    <el-form :model="searchForm" inline>
      <el-form-item label="充值订单号"> <el-input type="text" v-model.trim="searchForm.oriOrderid" placeholder="请输入充值订单号" clearable></el-input> </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="refundOrderList" border>
        <el-table-column label="退款单号" prop="out_refund_no" min-width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="原充值订单号" prop="orderId" min-width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单金额" prop="total" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="退款金额" prop="refund_fee" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="退款状态" prop="state" min-width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center"></el-table-column>
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
import { RefoundGetListByPage } from '@/api/system'

export default {
  data() {
    return {
      searchForm: {
        oriOrderid: this.$route.query.oriOrderId || ''
      },
      refundOrderList: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getRefundOrderList()
  },
  methods: {
    getRefundOrderList() {
      let params = {
        ...this.searchForm,
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
      RefoundGetListByPage(params)
        .then(res => {
          this.tableLoading = false
          this.refundOrderList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    goBack() {
      this.$router.push({ path: '/recharge-list' })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getRefundOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRefundOrderList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getRefundOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.gem-back-header {
  margin-bottom: 15px;
}
</style>
