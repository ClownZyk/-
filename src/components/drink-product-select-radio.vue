<template>
  <el-dialog :visible.sync="isShow" title="饮品产品" width="1000px" @closed="closed" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form size="small" :model="searchForm" ref="searchFormRef" :inline="true">
      <el-form-item><el-input v-model.trim="searchForm.productName" placeholder="请输入产品名称检索" clearable></el-input></el-form-item>
      <el-form-item> <el-cascader v-model="searchForm.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
      <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
      <el-form-item><el-button type="warning" @click="savedData">保存</el-button></el-form-item>
    </el-form>
    <div class="table-list">
      <el-table size="small" v-loading="listLoading" :data="productList" border>
        <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="categoryName" label="产品分类" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="型号" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="库存" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.stock + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="savedData(scope.row)">选择此产品</el-button>
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
    }
  },
  watch: {
    isDrinkProductShow(val) {
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
      isShow: false,
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  mounted() {
    this.getProductCategory()
    this.getProductList()
  },
  methods: {
    // 获取自制产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/drink-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
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
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getDrinkProduct(params)
        .then(res => {
          if (res.success) {
            this.listLoading = false
            // this.productList = this.handleData(res.data)
            this.productList = res.data
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
    savedData(row) {
      this.$emit('savedDrinkData', row)
      this.closed()
    },
    closed() {
      this.$emit('handleDrinkDialog', false)
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
