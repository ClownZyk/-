<template>
  <!-- v8商品选择器（单选版本） -->
  <el-dialog :visible.sync="isShow" title="总库商品选择器 (点击行选择商品)" width="1000px" @closed="closed">
    <!-- 搜索部分 -->
    <el-form class="filters" ref="searchForm" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item> <el-cascader v-model="search.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
        <el-form-item>
          <el-input v-model="search.productName" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          <el-button type="primary" @click="GetListByPage">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" class="table-main" ref="listTable" :data="productList" border highlight-current-row @current-change="selectTableRow">
      <el-table-column align="center" prop="serial" label="编号" width="55" type="index"></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" show-overflow-tooltip min-width="180"></el-table-column>
      <el-table-column align="center" prop="categorysName" label="产品类别" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="baseUnitName" label="主单位" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="unitName" label="单位" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.unitName }}（{{ scope.row.convertCount }}{{ scope.row.baseUnitName }}）
        </template>
      </el-table-column>
      <el-table-column align="center" prop="barCode" label="产品条码" min-width="180"></el-table-column>
      <el-table-column align="center" prop="stock" label="库存" min-width="100"></el-table-column>
      <el-table-column align="center" prop="costPrice" label="供货价" min-width="100"></el-table-column>
      <el-table-column align="center" prop="price" label="市场参考价" min-width="100"></el-table-column>
      <el-table-column align="center" label="保质期时间" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.shelfLife > 0">{{ scope.row.shelfLife }}{{ scope.row.shelfState === 1 ? '年' : scope.row.shelfState === 2 ? '月' : scope.row.shelfState === 3 ? '日' : '' }}</span> <span v-else>无保质期</span>
        </template>
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
        layout="total, prev, pager, next"
        background
        style="float:right;margin:10px 0;"
      >
      </el-pagination>
    </el-col>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {getProductInfoListByPage, getCategoryForV6} from '@/api/systemForV8'
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
      categoryList: [],
      search: {
        categoryId: '',
        productName: '',
        barCode: '',
        isStock: null
      },
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.GetListByPage()
    this.GetAllCategory()
  },
  methods: {
   // 加载商品分类
   GetAllCategory () {
      let params = {
        belongMenu: '',
        categoryName: '',
        belong: ''
      }
      getCategoryForV6(params).then(res => {
        if (res.success) {
         this.categoryList = res.data.map(item => {
            return {
              label: item.categoryName,
              value: item._id,
              children: item.children.map(child => {
                return {
                  label: child.categoryName,
                  value: child._id
                }
            })
            }
          })
        }
      }, err => {
        console.log(err)
      })
    },
    // 加载数据
    GetListByPage () {
      let params = {
        ...this.search,
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
      getProductInfoListByPage(params).then(res => {
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
            let obj = { ...e, ...sku, baseUnitName: e.unitName }
            newList.push(obj)
          })
        }
      })
      return newList
    },
    selectTableRow(row) {
      this.$confirm('确认选择 (' + row.productName + ') 吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('saveSelected', row)
          this.closed()
        }).catch(() => {
          this.$refs.listTable.setCurrentRow()
        })
    },
    // 选中数据
    // selectTableRow (row, fatherRow) {
    //   let that = this
    //   if (row) {
    //     that.$confirm('确认选择 (' + row.title + ') 吗？', '提示', {}).then(() => {
    //       this.$emit('saveSelected', row, fatherRow)
    //       that.closed()
    //     }, () => {
    //       this.$refs.listTable.setCurrentRow()
    //     })
    //   }
    // },
    // 关闭弹窗
    closed () {
      this.$emit('handleProductSelect', false)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    }
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
