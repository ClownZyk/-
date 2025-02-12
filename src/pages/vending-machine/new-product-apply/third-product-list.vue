<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form :model="filterParam" inline>
      <el-form-item label="产品名称" prop="name"> <el-input v-model.trim="filterParam.name" placeholder="请输入产品名称检索" clearable @keyup.enter.native="getThirdProductList('refresh')"></el-input> </el-form-item>
      <el-form-item label="产品条码" prop="barcode"> <el-input v-model.trim="filterParam.barcode" placeholder="请输入产品条码检索" clearable @keyup.enter.native="getThirdProductList('refresh')"></el-input> </el-form-item>
      <el-form-item> <el-button type="primary" @click="getThirdProductList('refresh')">搜索</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="productList" border>
      <el-table-column align="center" label="产品图片" width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-image v-if="scope.row.imgUrl" style="width: 35px; height: 35px" :src="scope.row.imgUrl" fit="fill" :preview-src-list="[scope.row.imgUrl]"></el-image>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="产品名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="产品类型" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.collType === 1" style="color:#909399">单品</div>
          <div v-else-if="scope.row.collType === 2" style="color:#E6A23C">合集</div>
          <div></div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="itemCode" label="产品编码" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="qrCodes" label="产品条码" min-width="160" show-overflow-tooltip> </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[15, 25, 35, 45]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin:10px 0;"
      >
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import { getThirdBaseProductList } from '@/api/system'

export default {
  data() {
    return {
      filterParam: {
        name: '',
        barcode: ''
      },
      productList: [],
      listLoading: false,
      pageIndex: 1,
      pageSize: 15,
      total: 0
    }
  },
  mounted() {
    this.getThirdProductList()
  },
  methods: {
    getThirdProductList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
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
      getThirdBaseProductList(params)
        .then(res => {
          this.listLoading = false
          this.productList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getThirdProductList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getThirdProductList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
