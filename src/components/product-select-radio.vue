<template>
  <!-- 商品选择器（单选版本） -->
  <el-dialog :visible.sync="isShow" title="商品选择器 (点击行选择商品)" width="1000px" @closed="closed">
    <!--搜索部分-->
    <el-form class="filters" ref="searchForm" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item>
          <el-cascader v-model="search.categoryIds" :options="categoryList" change-on-select clearable expand-trigger="hover" placeholder="请选择产品分类"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.productName" placeholder="请输入产品名称检索" class="filters-search" @keyup.enter.native="_valSearch"></el-input>
          <el-input v-model="search.barcode" placeholder="请输入产品条码检索" class="filters-search" @keyup.enter.native="_valSearch" clearable></el-input>
          <el-button type="primary" @click="_valSearch">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" highlight-current-row @current-change="selectTableRow" v-loading="listLoading">
      <el-table-column align="center" prop="productName" label="产品名称" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="productCode" label="产品条码" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.sku !== 0 ? scope.row.sku[0].barCode : '' }}</template>
      </el-table-column>
      <el-table-column align="center" prop="sku[0].price" label="原价" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="sku[0].vipPrice" label="会员价" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="stock" label="库存" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="sales" label="销量" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="isTop" label="是否设置店长推荐" width="180" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.isTop ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column align="center" prop="isShow" label="是否上架" width="180" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.isShow ? '是' : '否' }}</template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 15, 20, 25]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin:10px 0;"
      >
      </el-pagination>
    </el-col>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {ShopGetListByPage, GetAllCategory} from '@/api/system'
export default {
  name: 'product-select-radio',
  props: {
    isShowProductSelect: Boolean
  },
  watch: {
    isShowProductSelect: function (newValue, oldValue) {
      this.isShow = newValue
    }
  },
  data () {
    return {
      isShow: false,
      productList: [],
      listLoading: false,
      // 分类列表
      categoryList: [],
      // 查询条件
      search: {
        // 分类
        category: '',
        categoryId: '',
        categoryIds: [],
        // 产品名称
        productName: '',
        barcode: ''
      },
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    // 关闭弹窗
    closed () {
      this.$emit('handleProductSelect', false)
    },
    // 选中数据
    selectTableRow (row) {
      let that = this
      if (row) {
        that.$confirm('确认选择 (' + row.productName + ') 吗？', '提示', {}).then(() => {
          this.$emit('saveSelected', row)
          that.closed()
        }, () => {
          this.$refs.listTable.setCurrentRow()
        })
      }
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.ShopGetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.ShopGetListByPage()
    },
    // 加载商品分类
    async GetAllCategory () {
      let params = {
        belongMenu: '/product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetAllCategory(params).then(res => {
        if (res.success) {
          this.categoryList = res.data
          this.categoryList.unshift({
            value: '',
            label: '所有产品'
          })
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    _valSearch() {
      this.pageIndex = 1
      this.ShopGetListByPage()
    },
    // 加载数据
    async ShopGetListByPage () {
      if (this.search.categoryIds.length > 0) {
        this.search.categoryId = this.search.categoryIds[this.search.categoryIds.length - 1]
      } else {
        this.search.categoryId = ''
      }
      let params = {
        isStock: 0,
        isShow: 1,
        queryStock: '',
        categoryId: this.search.categoryId,
        productName: this.search.productName,
        barCode: this.search.barcode,
        sellWell: false,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      await ShopGetListByPage(params).then(res => {
        this.listLoading = false
        this.productList = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.ShopGetListByPage()
    this.GetAllCategory()
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
