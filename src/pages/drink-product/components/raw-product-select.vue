<template>
  <el-dialog :visible.sync="isShow" title="原料产品选择器" width="1000px" @closed="closed" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form :model="recipeForm" :inline="true">
      <el-form-item><el-input v-model.trim="recipeForm.productName" placeholder="请输入原料名称检索"></el-input></el-form-item>
      <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
      <el-form-item><el-button type="warning" @click="saveSelectedRecipe">保 存</el-button></el-form-item>
    </el-form>
    <el-table v-loading="tableLoading" ref="listTable" :data="recipeList" border style="width: 100%" @selection-change="handleSelectionChange" row-key="_id">
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column label="产品条码" min-width="140" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.barCode + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.stock }}({{ scope.row.unitName }})</div>
        </template>
      </el-table-column>
      <el-table-column label="采购价(元)" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.oriPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="供货价(元)" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.costPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="零售指导价(元)" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[15, 25, 35, 45]"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
      background
    >
    </el-pagination>
    <div slot="footer" class="dialog-footer"></div>
  </el-dialog>
</template>

<script>
import { getDrinkRawProduct } from '@/api/system'

export default {
  props: {
    isShowProductSelect: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShowProductSelect(newValue) {
      this.isShow = newValue
    }
  },
  data() {
    return {
      recipeForm: {
        productName: '',
        categoryId: ''
      },
      recipeList: [],
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      isShow: false,
      tableLoading: false
    }
  },
  created() {
    this.getRawProduct()
  },
  methods: {
    // 获取原料产品
    getRawProduct() {
      let params = {
        ...this.recipeForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getDrinkRawProduct(params)
        .then(res => {
          if (res.success) {
            this.tableLoading = false
            this.recipeList = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 选择辅料产品
    handleSelectionChange(val) {
      this.selectedList = val
    },
    // 保存辅料
    saveSelectedRecipe() {
      if (this.selectedList.length > 0) {
        this.$confirm('确认保存已选中的数据吗？', '提示', { type: 'warning' }).then(() => {
          this.$emit('saveSelected', this.selectedList)
          this.closed()
        })
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    // 关闭弹窗
    closed() {
      // this.handleCurrentChange(1)
      this.pageIndex = 1
      this.$refs.listTable.clearSelection()
      this.$emit('handleProductSelect', false)
    },
    // 搜索配料
    searchCondition() {
      this.pageIndex = 1
      this.getRawProduct()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getRawProduct()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRawProduct()
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
