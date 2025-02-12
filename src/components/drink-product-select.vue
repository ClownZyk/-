<template>
  <el-dialog :visible.sync="isShow" title="饮品产品" width="1000px" @closed="closed" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form size="small" :model="searchForm" ref="searchFormRef" :inline="true">
      <el-form-item><el-input v-model.trim="searchForm.productName" placeholder="请输入产品名称检索" clearable></el-input></el-form-item>
      <el-form-item v-show="!cateId"> <el-cascader v-model="searchForm.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
      <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
      <el-form-item><el-button type="warning" @click="savedData">确 定</el-button></el-form-item>
    </el-form>
    <div class="table-list">
      <el-table ref="listTableRef" size="small" v-loading="listLoading" :data="productList" @selection-change="selectedRow" :row-key="getRowKey" border>
        <el-table-column type="selection" reserve-selection width="55" align="center"></el-table-column>
        <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="categoryName" label="产品分类" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="isSync">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </div>
            <div v-else>{{ scope.row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="stock" label="库存" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="isSync">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.stock + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </div>
            <div v-else>{{ scope.row.stock }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="isSync">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </div>
            <div v-else>{{ scope.row.price }}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
  </el-dialog>
</template>

<script>
import { GetAllCategory, getDrinkProduct } from '@/api/system'

export default {
  props: {
    isDrinkProductShow: {
      type: Boolean,
      default: false
    },
    isSync: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isDrinkProductShow(val) {
      this.isShow = val
    },
    isSync: {
      handler(val) {
        if (val) {
          this.commonParams = {
            creater: localStorage.getItem('creater'),
            roleId: localStorage.getItem('roleId'),
            cid: localStorage.getItem('cid')
          }
        } else {
          this.commonParams = {
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      searchForm: {
        productName: '',
        categoryId: ''
      },
      cateId: '',
      type: 'prod',
      categoryList: [],
      productList: [],
      selectedProduct: [],
      isShow: false,
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      commonParams: {}
    }
  },
  methods: {
    initData(cateId, type) {
      this.cateId = cateId
      this.type = type
      this.searchForm.categoryId = cateId
      this.getProductCategory()
      this.getProductList()
    },
    // 获取自制产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/drink-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        ...this.commonParams
      }
      GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    getProductList() {
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        ...this.commonParams
      }
      this.listLoading = true
      getDrinkProduct(params)
        .then(res => {
          if (res.success) {
            this.listLoading = false
            this.productList = this.isSync ? res.data : this.handleData(res.data)
            this.total = res.total
          }
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
        this.$emit('savedDrinkData', this.selectedProduct, this.cateId, this.type)
        this.closed()
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    closed() {
      this.$emit('closedDrinkDialog', false)
      this.$refs['listTableRef'].clearSelection()
    },
    getRowKey(row) {
      if (this.isSync) {
        return row.uniqueCode
      } else {
        return row.barCode
      }
    },
    searchCondition() {
      this.pageIndex = 1
      this.getProductList()
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
