<template>
  <el-dialog :visible.sync="isShow" title="售卖机产品选择器" width="1000px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @closed="closed">
    <!-- 搜索部分 -->
    <el-form :model="filterParam" inline>
      <el-form-item label="产品名称" prop="barCode"> <el-input type="text" v-model.trim="filterParam.name" placeholder="请输入名称检索"></el-input> </el-form-item>
      <el-form-item label="产品条码" prop="barCode"> <el-input type="text" v-model.trim="filterParam.barCode" placeholder="请输入条码检索"></el-input> </el-form-item>
      <el-form-item><el-button type="primary" @click="initData">搜索</el-button></el-form-item>
      <el-form-item> <el-button type="warning" @click="save">保存</el-button> </el-form-item>
    </el-form>
    <el-table size="small" ref="listTable" v-loading="tableLoading" :data="productList" border tooltip-effect="dark" @selection-change="selectTableRow" :row-key="getRowKeys">
      <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column label="产品图片" min-width="120" align="center">
        <template slot-scope="scope">
          <el-image v-if="scope.row.imgUrl" style="width: 50px; height: 50px" :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover"></el-image>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="name" min-width="280" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品条码" prop="qrCodes" min-width="200" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品编码" prop="itemCode" min-width="140" align="center" show-overflow-tooltip></el-table-column>
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
import { getThirdBaseProductList } from '../api/system'
export default {
  name: 'productSelect',
  props: {
    isVendingProductShow: Boolean,
    selectedList: Array
  },
  watch: {
    isVendingProductShow: function (newValue, oldValue) {
      this.isShow = newValue
    }
  },
  data () {
    return {
      filterParam: {
        barCode: '',
        name: ''
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
  },
  methods: {
    initData() {
      this.pageIndex = 1
      this.getDataList()
    },
    getDataList() {
      let params = {
        ...this.filterParam,
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
      getThirdBaseProductList(params)
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
        this.$emit('savedVendingData', this.newSelectedList)
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
      this.$emit('closedVendingDialog', false)
      this.$refs.listTable.clearSelection()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getDataList()
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
