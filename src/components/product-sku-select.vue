<template>
  <el-dialog :visible.sync="isShow" title="商品选择器" width="1000px" @closed="closed">
    <!-- 搜索部分 -->
    <el-form class="filters" ref="searchForm" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item>
          <el-cascader v-model="search.categoryId" :options="categoryList" :props="{ checkStrictly: true, emitPath: false }" change-on-select clearable expand-trigger="hover" placeholder="请选择产品分类"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.productName" placeholder="请输入产品名称" class="filters-search" clearable @keyup.enter.native="ShopGetListByPage"></el-input>
          <el-input v-model="search.barCode" placeholder="请输入产品条形码" class="filters-search" clearable @keyup.enter.native="ShopGetListByPage"></el-input>
          <el-button type="primary" @click="ShopGetListByPage">搜索</el-button>
        </el-form-item>
      </div>
      <el-form-item> <el-button type="primary" @click="save">保存</el-button> </el-form-item>
    </el-form>
    <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" @selection-change="selectTableRow" :row-key="getRowKeys" v-loading="listLoading">
      <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="title" label="规格" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="barCode" label="条码" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="stock" label="库存" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="price" label="原价" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="sales" label="销量" width="180" show-overflow-tooltip></el-table-column>
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
import {GetProductByPage, GetAllCategory} from '@/api/system'
export default {
  name: 'productSelect',
  props: {
    isShowProductSelect: Boolean,
    selectedList: Array,
    ruleId: String
  },
  watch: {
    isShowProductSelect: function (newValue, oldValue) {
      this.isShow = newValue
    },
    // 监听已选中的数组，如果有新的过来，更新回显已勾选的数据
    selectedList: {
      handler: function (newValue, oldValue) {
        this.returnViewSelected(newValue)
      },
      deep: true
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
        barCode: ''
      },
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 新的已选中数据
      newSelectedList: []
    }
  },
  methods: {
    // 回显已勾选数据对钩
    returnViewSelected (newValue) {
      this.$nextTick(() => {
        newValue.forEach(v => {
          this.productList.forEach(y => {
            if (v === y._id) {
              if (this.$refs !== undefined) {
                this.$refs.listTable.toggleRowSelection(y, true)
              }
            }
          })
        })
      })
    },
    // 保存选中数据
    save () {
      let that = this
      if (that.newSelectedList.length > 0) {
        that.$confirm('确认保存已选中的数据吗？', '提示', {}).then(() => {
          console.log(that.newSelectedList)
          that.$emit('saveSelected', that.newSelectedList)
        })
      } else {
        that.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    // 关闭弹窗
    closed () {
      this.handleCurrentChange(1)
      this.$refs.listTable.clearSelection()
      this.$emit('handleProductSelect', false)
    },
    getRowKeys (row) {
      return row.barCode
    },
    // 选中数据
    selectTableRow (row) {
        this.newSelectedList = row
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
          // this.search.categoryId = res.data[0].children.length === 0 ? res.data[0].value : res.data[0].children[0].value
          this.ShopGetListByPage()
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 加载数据
    async ShopGetListByPage () {
      let params = {
        identityRoleid: this.ruleId,
        categoryId: this.search.categoryId,
        productName: this.search.productName.trim(),
        barCode: this.search.barCode.trim(),
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
      await GetProductByPage(params).then(res => {
        this.listLoading = false
        this.productList = res.data
        this.total = res.total
        if (Object.keys(this.$refs).length > 0) {
          this.returnViewSelected(this.selectedList)
        }
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
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
