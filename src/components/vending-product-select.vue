<template>
  <el-dialog :visible.sync="isShow" title="售卖机产品选择器" width="1000px" @closed="closed">
    <!-- 搜索部分 -->
    <el-form :model="filterParam" inline>
      <el-form-item label="产品条码" prop="barCode"> <el-input type="text" v-model.trim="filterParam.barCode" placeholder="请输入条码检索"></el-input> </el-form-item>
      <el-form-item><el-button type="primary" @click="getMachineBindProd('refresh')">搜索</el-button></el-form-item>
      <el-form-item> <el-button type="warning" @click="save">保存</el-button> </el-form-item>
    </el-form>
    <el-table size="small" ref="listTable" v-loading="tableLoading" :data="productList" border tooltip-effect="dark" @selection-change="selectTableRow" :row-key="getRowKeys">
      <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column label="产品图片" min-width="120" align="center">
        <template slot-scope="scope">
          <el-image v-if="scope.row.imageUrl" style="width: 50px; height: 50px" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]" fit="cover"></el-image>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="name" min-width="280" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品条码" prop="barCode" min-width="200" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品库存" prop="stock" min-width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="价格(元)" prop="price" min-width="140" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ Math.round(scope.row.price) / 100 }}
        </template>
      </el-table-column>
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
import {getVendingMachineBindProdOnSale} from '@/api/system'
export default {
  name: 'productSelect',
  props: {
    isShowProductSelect: Boolean,
    selectedList: Array
  },
  watch: {
    isShowProductSelect: function (newValue, oldValue) {
      this.isShow = newValue
    }
  },
  data () {
    return {
      filterParam: {
        barCode: ''
      },
      productList: [],
      newSelectedList: [],
      isShow: false,
      tableLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
    mounted() {
    this.getMachineBindProd()
  },
  methods: {
    getMachineBindProd(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        vmcode: this.$route.query.vmCode,
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.queryCid || this.$store.state._cid
      }
      this.tableLoading = true
      getVendingMachineBindProdOnSale(params)
        .then(res => {
          this.tableLoading = false
          this.productList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
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
    handleSizeChange(val) {
      this.pageSize = val
      this.getMachineBindProd()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getMachineBindProd()
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
