<template>
  <div>
    <div class="table-title-more" @click="goToMoreProductSort">更多<i class="el-icon-arrow-right"></i></div>
    <el-table v-loading="listLoading" size="mini" :data="productList" border>
      <el-table-column label="编号" align="center" type="index" width="55"></el-table-column>
      <el-table-column prop="prodName" label="产品名称" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column prop="barCode" label="产品条码" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.barCode || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="产品分类" width="140">
        <template slot-scope="scope">
          {{ scope.row.firstCategoryName }}/{{ scope.row.secCategoryName }}
        </template>
      </el-table-column>
      <el-table-column prop="count" label="销量" align="center" width="90"></el-table-column>
      <el-table-column prop="retailPriceTotal" label="销售总额/元" align="center" width="120"></el-table-column>
      <el-table-column prop="vmCode" label="售卖机编码" width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getVendingMachineProductStatistics } from '@/api/system'

export default {
  data() {
    return {
      productList: [],
      listLoading: false
    }
  },
  mounted() {
    this.getVendingMachineProduct()
  },
  methods: {
    getVendingMachineProduct() {
      let params = {
        stage: 1,
        sTime: '',
        vmcode: '',
        prodName: '',
        pageSize: 10,
        pageIndex: 1,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getVendingMachineProductStatistics(params)
        .then(res => {
          this.listLoading = false
          this.productList = res.data.list
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    goToMoreProductSort() {
      this.$router.push({ path: '/more-product-sort' })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-title-more {
  text-align: right;
  font-size: 14px;
  color: #409eff;
  margin-bottom: 8px;
  cursor: pointer;
}
</style>
