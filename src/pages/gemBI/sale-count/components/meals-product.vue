<template>
  <div>
    <el-table class="table-main" v-loading="loading" :data="productList" size="mini" border>
      <el-table-column align="center" type="index" label="编号" width="80"></el-table-column>
      <el-table-column align="center" prop="firstCategoryName" label="一级分类" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="barCode" label="产品条码" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="count" label="销量" width="150" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMealsProductStatistics } from '@/api/system'
export default {
  data() {
    return {
      productList: [],
      loading: false
    }
  },
  mounted() {
    this.getProdcuctList()
  },
  methods: {
    getProdcuctList() {
      let params = {
        stage: 1,
        sTime: '',
        category: '',
        nameOrBarCode: '',
        queryCid: this.$store.state._cid,
        pageSize: 10,
        pageIndex: 1,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.loading = true
      getMealsProductStatistics(params).then(
        res => {
          if (res.success) {
            this.loading = false
            this.productList = res.data
          }
        },
        err => {
          this.loading = false
          console.log(err.msg)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
