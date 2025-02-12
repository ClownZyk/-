<template>
  <el-dialog :visible.sync="isShow" title="耗材产品选择器" width="1000px" @closed="closed">
    <!-- 搜索部分 -->
    <el-form :model="filterParam" inline>
      <el-form-item> <el-cascader v-model="filterParam.categoryId" :options="categoryList" :props="cateProps" clearable placeholder="请选择产品分类"></el-cascader> </el-form-item>
      <el-form-item> <el-input v-model="filterParam.productName" placeholder="请输入商品名检索" class="filters-filterParam" clearable @keyup.enter.native="getMaterialProduct"></el-input> </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      <el-form-item> <el-button type="warning" @click="save">保存</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" ref="listTable" :data="productList" border @selection-change="selectTableRow" :row-key="getRowKeys">
      <el-table-column type="selection" reserve-selection width="55" align="center"></el-table-column>
      <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="220" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="categoryName" label="产品分类" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="barCode" label="产品条码" min-width="150" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="title" label="产品单位" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.unitName }}（{{ scope.row.convertCount }}{{ scope.row.baseUnitName }}）
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prodStock" label="库存" min-width="120" show-overflow-tooltip> </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        size="small"
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
import {getMaterialProductList, GetAllCategory} from '@/api/system'
export default {
  name: 'productSelect',
  props: {
    isShowProductSelect: Boolean,
    selectedList: Array
  },
  watch: {
    isShowProductSelect(newValue, oldValue) {
      this.isShow = newValue
    }
  },
  data () {
    return {
      filterParam: {
        categoryId: '',
        productName: ''
      },
      productList: [],
      categoryList: [],
      newSelectedList: [],
      isShow: false,
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      cateProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  mounted() {
    this.GetAllCategory()
    this.getMaterialProduct()
  },
  methods: {
     GetAllCategory() {
      let params = {
        belongMenu: '/material-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(
        res => {
          this.categoryList = [{
              value: '',
              label: '所有产品'
            }, ...res.data]
        }
      )
    },
    getMaterialProduct() {
      let params = {
        categoryId: this.filterParam.categoryId,
        productName: this.filterParam.productName,
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
      getMaterialProductList(params).then(
        res => {
          this.listLoading = false
          this.productList = this.handleData(res.data)
          this.total = res.total
        }
      ).catch(() => {
        this.listLoading = false
      })
    },
    // 处理列表数据，拆分sku
    handleData (data) {
      let newList = []
      data.forEach(e => {
        if (e.sku && e.sku.length > 0) {
          e.sku.forEach(sku => {
            let obj = { ...e, ...sku, prodStock: e.stock, baseUnitName: e.unitName }
            newList.push(obj)
          })
        }
      })
      return newList
    },
    // 保存选中数据
    save () {
      if (this.newSelectedList.length > 0) {
        this.$emit('saveSelected', this.newSelectedList)
        this.closed()
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    getRowKeys (row) {
      return row._id
    },
    // 选中数据
    selectTableRow (row) {
      this.newSelectedList = JSON.parse(JSON.stringify(row))
    },
    // 关闭弹窗
    closed () {
      this.handleCurrentChange(1)
      this.$refs.listTable.clearSelection()
      this.$emit('handleProductSelect', false)
    },
    searchCondition() {
      this.pageIndex = 1
      this.getMaterialProduct()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getMaterialProduct()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getMaterialProduct()
    }
  }
}
</script>

<style lang="scss" scoped></style>
