<template>
  <!-- 供兑换券、代金券、折扣券使用的商品选择器 -->
  <el-dialog :visible.sync="isShow" title="商品选择器" width="1000px" @closed="closed">
    <!--搜索部分-->
    <el-form class="filters" ref="searchForm" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item>
          <el-cascader v-model="search.categoryIds" :options="categoryList" change-on-select clearable expand-trigger="hover" placeholder="请选择产品分类"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.productName" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          <el-button type="primary" @click="GetListByPage">搜索</el-button>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    <el-table class="table-main" ref="listTable" :row-key="getRowKeys" :data="productList" border @selection-change="selectTableRow" v-loading="listLoading">
      <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="categoryName" label="产品类别" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" show-overflow-tooltip  min-width="180"></el-table-column>
      <el-table-column prop="title" label="型号" min-width="100"></el-table-column>
      <el-table-column prop="barCode" label="产品条码" min-width="180"></el-table-column>
      <el-table-column prop="stock" label="库存" min-width="100"></el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :page-sizes="[10, 15, 20, 25]"
                    :total="total"
                    layout="total, sizes, prev, pager, next"
                    background
                    style="float:right;margin:10px 0;">
      </el-pagination>
    </el-col>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {ShopGetListByPage, GetAllCategory} from '@/api/system'
export default {
  name: 'card-product-select-radio',
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
        productName: ''
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
    getRowKeys (row) {
      return row.barCode
    },
    // 保存选中数据
    save () {
      if (this.newSelectedList.length > 0) {
        this.$confirm('确认保存已选中的数据吗？', '提示', {}).then(() => {
          this.$emit('saveSelected', this.newSelectedList)
        })
      } else {
        this.$message({
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
    // 选中数据
    selectTableRow (selList) {
      this.newSelectedList = selList
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
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
    // 加载数据
    async GetListByPage () {
      if (this.search.categoryIds.length > 0) {
        this.search.categoryId = this.search.categoryIds[this.search.categoryIds.length - 1]
      } else {
        this.search.categoryId = ''
      }
      let params = {
        _id: '',
        barCode: '',
        productName: this.search.productName,
        categoryId: this.search.categoryId,
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
        this.productList = this.handleData(res.data)
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    // 处理列表数据，拆分sku
    handleData (data) {
      let newList = []
      data.forEach(e => {
        if (e.sku && e.sku.length > 0) {
          e.sku.forEach(sku => {
            let obj = { ...e, ...sku }
            newList.push(obj)
          })
        }
      })
      return newList
    }
  },
  mounted() {
    this.GetListByPage()
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
