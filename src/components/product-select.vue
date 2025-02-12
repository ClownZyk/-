<template>
  <el-dialog :visible.sync="isShow" title="商品选择器" width="1000px" @closed="closed">
    <!-- 搜索部分 -->
    <el-form class="filters" ref="searchForm" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item> <el-cascader v-model="search.categoryIds" :options="categoryList" :props="casProps" clearable placeholder="请选择产品分类"></el-cascader> </el-form-item>
        <el-form-item>
          <el-input v-model="search.productName" placeholder="请输入产品名检索" class="filters-search" @keyup.enter.native="ShopGetListByPage"></el-input>
          <el-input v-model="search.barCode" placeholder="请输入条形码检索" class="filters-search" @keyup.enter.native="ShopGetListByPage"></el-input>
          <el-button type="primary" @click="ShopGetListByPage">搜索</el-button>
        </el-form-item>
      </div>
      <el-form-item> <el-button type="primary" @click="save">保存</el-button> </el-form-item>
    </el-form>
    <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" @selection-change="selectTableRow" :row-key="getRowKeys" v-loading="listLoading">
      <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="productCode" label="产品条码" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.sku !== 0 ? scope.row.sku[0].barCode : '' }}</template>
      </el-table-column>
      <el-table-column align="center" prop="sales" label="销量" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="storage" label="库存" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.sku !== 0 ? scope.row.sku[0].stock : '' }}</template>
      </el-table-column>
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
  name: 'productSelect',
  props: {
    isShowProductSelect: Boolean,
    selectedList: Array
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
      categoryList: [],
      search: {
        categoryId: '',
        productName: '',
        barCode: ''
      },
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 新的已选中数据
      newSelectedList: [],
      casProps: {
        checkStrictly: true,
        emitPath: false,
        expandTrigger: 'hover'
      }
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
      return row._id
    },
    // 选中数据
    selectTableRow (row) {
        this.newSelectedList = row.map(v => {
          return v._id
        })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.ShopGetListByPage()
    },
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
        }
      })
    },
    // 加载数据
    async ShopGetListByPage () {
      let params = {
        isStock: 0,
        isShow: 0,
        queryStock: '',
        barCode: this.search.barCode,
        sellWell: false,
        categoryId: this.search.categoryId,
        productName: this.search.productName,
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
        if (Object.keys(this.$refs).length > 0) {
          this.returnViewSelected(this.selectedList)
        }
      }, () => {
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
