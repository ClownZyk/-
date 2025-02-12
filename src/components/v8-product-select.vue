<template>
  <!-- v8商品选择器 -->
  <el-dialog :visible.sync="isShow" title="总库商品选择器" width="1000px" @closed="closed" :close-on-press-escape="false" :close-on-click-modal="false">
    <!-- 搜索部分 -->
    <el-form class="filters" ref="searchForm" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item> <el-cascader v-model="search.categorys" :props="casProps" :options="categoryList" clearable placeholder="请选择产品分类"></el-cascader> </el-form-item>
        <el-form-item> <el-input v-model="search.productName" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input> </el-form-item>
        <el-form-item> <el-input v-model="search.barCode" placeholder="请输入商品条码" class="filters-search" @keyup.enter.native="GetListByPage"></el-input> </el-form-item>
        <el-button type="primary" @click="GetListByPage">搜索</el-button>
      </div>
      <el-form-item> <el-button type="primary" @click="save">保存</el-button> </el-form-item>
    </el-form>
    <el-table class="table-main" ref="listTable" size="small" :row-key="getRowKeys" :data="productList" border @selection-change="selectTableRow" v-loading="listLoading">
      <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column align="center" label="编号" width="60" type="index"></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" show-overflow-tooltip min-width="180"></el-table-column>
      <el-table-column align="center" prop="barCode" label="产品条码" min-width="160"></el-table-column>
      <el-table-column align="center" prop="costPrice" label="供货价" min-width="90"></el-table-column>
      <el-table-column align="center" prop="title" label="规格" min-width="70" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column align="center" prop="baseUnitName" label="主单位" min-width="70" show-overflow-tooltip></el-table-column> -->
      <el-table-column align="center" prop="unitName" label="单位" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.unitName }}（{{ scope.row.convertCount }}{{ scope.row.baseUnitName }}）
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="市场参考价" min-width="100"></el-table-column>
      <el-table-column align="center" prop="categorysName" label="产品类别" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="stock" label="库存" min-width="90"></el-table-column>
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
import {getProductInfoListByPage, getCategoryForV6} from '@/api/systemForV8'
export default {
  name: 'product-select-radio',
  props: {
    isShowProductSelect: Boolean
  },
  watch: {
    isShowProductSelect(newValue, oldValue) {
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
        categorys: '',
        productName: '',
        barCode: '',
        isStock: null
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
    getRowKeys (row) {
      return row.barCode
    },
    // 保存选中数据
    save () {
      if (this.newSelectedList.length > 0) {
        this.$emit('saveSelected', this.newSelectedList)
        // this.$confirm('确认保存已选中的数据吗？', '提示', {}).then(() => {
        //   this.$emit('saveSelected', this.newSelectedList)
        // })
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
      this.newSelectedList = selList.map(v => {
        v.totalCount = 0
        v.image = v.mainImg
        v.myDetil = {
          costPrice: v.costPrice
        }
        return v
      })
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
        belongMenu: '',
        categoryName: '',
        belong: '',
        cid: this.$route.query.whCid || this.$store.state.retailWarehouseId,
        whCid: this.$route.query.whCid || this.$store.state.retailWarehouseId
      }
      await getCategoryForV6(params).then(res => {
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
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        ...this.search,
        whCid: this.$route.query.whCid || this.$store.state.retailWarehouseId,
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
      await getProductInfoListByPage(params).then(res => {
        this.listLoading = false
        this.productList = this.handleData(res.data)
        this.total = res.total
      }, () => {
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
