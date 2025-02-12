<template>
  <el-dialog :visible.sync="isShow" title="菜品选择" width="1000px" @closed="handleDialogIsShow" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form size="small" ref="searchFormRef" :model="searchForm" :inline="true">
      <el-form-item prop="productName"><el-input v-model.trim="searchForm.productName" placeholder="请输入产品名称检索" clearable></el-input></el-form-item>
      <el-form-item v-if="!selectCateId" prop="categoryId">
        <el-select v-model="searchForm.categoryId" placeholder="请选择菜品分类"> <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="getProductList('refresh')">搜索</el-button></el-form-item>
      <el-form-item><el-button type="warning" @click="savedData">保 存</el-button></el-form-item>
    </el-form>
    <el-table ref="listTableRef" size="small" v-loading="listLoading" :data="productList" @selection-change="selectedRow" :row-key="getRowKey" border>
      <el-table-column type="selection" reserve-selection width="55" align="center"></el-table-column>
      <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="categoryName" label="产品分类" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="stock" label="库存" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.stock + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="价格" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </el-row>
  </el-dialog>
</template>

<script>
import { GetAllCategory, getTableProductList } from '@/api/system'

export default {
  props: {
    isTableProductShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isTableProductShow(val) {
      this.isShow = val
    }
  },
  data() {
    return {
      searchForm: {
        productName: '',
        categoryId: ''
      },
      categoryList: [],
      productList: [],
      selectedProduct: [],
      selectCateId: '',
      isShow: false,
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    initProdData(cateId) {
      this.selectCateId = cateId
      this.getProductCategory()
      this.getProductList()
    },
    // 获取自制产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/table-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
      })
    },
    getProductList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        productName: this.searchForm.productName,
        categoryId: this.selectCateId ? this.selectCateId : this.searchForm.categoryId,
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
      getTableProductList(params)
        .then(res => {
          this.listLoading = false
          this.productList = this.handleData(res.data)
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleData(data) {
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
    },
    selectedRow(val) {
      this.selectedProduct = JSON.parse(JSON.stringify(val))
    },
    savedData() {
      if (this.selectedProduct.length > 0) {
        this.$emit('savedTableProdData', this.selectedProduct)
        this.handleDialogIsShow()
      } else {
        return this.$message.warning('至少选中一条数据')
      }
    },
    handleDialogIsShow() {
      this.$emit('handleDialogIsShow', false)
      this.$refs['searchFormRef'].resetFields()
      this.$refs['listTableRef'].clearSelection()
    },
    getRowKey(row) {
      return row.barCode
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProductList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
