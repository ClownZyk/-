<template>
  <div class="product-container">
    <el-form :model="searchForm" :inline="true">
      <el-form-item><el-input v-model.trim="searchForm.productName" placeholder="请输入产品名称检索" clearable></el-input></el-form-item>
      <el-form-item> <el-cascader v-model="searchForm.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
      <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
      <el-form-item><el-button type="warning" @click="saveSelected">保存</el-button></el-form-item>
    </el-form>
    <!-- 列表区域 -->
    <div class="table-list">
      <el-table ref="multipleTable" v-loading="listLoading" :data="productList" border style="width: 100%" @selection-change="handleSelectionChange" row-key="barCode">
        <el-table-column type="selection" align="center" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="200" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="categoryName" label="产品分类" min-width="140" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="title" label="型号" min-width="120" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="stock" label="库存" min-width="120" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="price" label="价格" min-width="100" show-overflow-tooltip> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { GetAllCategory, getDrinkProduct, ManyAddRule } from '@/api/system'

export default {
  data() {
    return {
      searchForm: {
        productName: '',
        categoryId: ''
      },
      productList: [],
      categoryList: [],
      newList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      listLoading: false,
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  mounted() {
    this.getProductCategory()
    this.getDrinkList()
  },
  methods: {
    getDrinkList() {
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
            this.productList = this.handleData(res.data)
            this.total = res.total
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 产品数据处理
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
    // 获取产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/drink-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        // creater: localStorage.getItem('creater'),
        // roleId: localStorage.getItem('roleId'),
        // cid: localStorage.getItem('cid')
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
    // 选中数据处理
    handleSelectionChange(val) {
      this.newList = JSON.parse(JSON.stringify(val)).map(item => {
        return {
          categoryid: item.categoryId,
          categoryName: item.categoryName,
          uniqueCode: item.uniqueCode,
          productName: item.productName,
          title: item.title,
          barCode: item.barCode,
          price: item.price,
          Productid: item._id,
          modifyPrice: item.price
        }
      })
    },
    // 保存选中的数据
    saveSelected() {
      if (this.newList.length === 0) {
        this.$message.error('请选择商品')
        return false
      }
      this.$confirm('是否添加商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            identityRoleid: this.$route.query.ruleId,
            SpecialProduct: this.newList,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          ManyAddRule(params).then(
            res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.$emit('closeDialog', 'drink')
              }
            },
            err => {
              console.log(err)
            }
          )
        })
        .catch(() => {})
    },
    clear() {
      this.newList = []
      this.$refs.multipleTable.clearSelection()
    },
    searchCondition() {
      this.pageIndex = 1
      this.getDrinkList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getDrinkList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getDrinkList()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
