<template>
  <el-dialog :visible.sync="isShow" title="查看已选择商品" width="1000px" @closed="closed">
    <el-table class="table-main"
              ref="listTable"
              :data="productList.slice((pageIndex-1) * pageSize, pageIndex * pageSize)"
              border
              tooltip-effect="dark"
              v-loading="listLoading"
    >
      <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="pname" label="产品名称" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :page-sizes="[10, 15, 20, 25]"
                    :total="total"
                    layout="total, sizes, prev, pager, next"
                    background
                    style="float:right;margin:10px 0;">
      </el-pagination>
    </el-col>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'productSelectView',
  props: {
    selectedListViewLoading: Boolean,
    isShowProductSelectView: Boolean,
    selectedListView: Array
  },
  watch: {
    selectedListViewLoading: function (newValue, oldValue) {
      this.listLoading = newValue
    },
    isShowProductSelectView: function (newValue, oldValue) {
      this.isShow = newValue
    },
    // 监听已选中的数组，如果有新的过来，更新回显已勾选的数据
    selectedListView: {
      handler: function (newValue, oldValue) {
        this.productList = JSON.parse(JSON.stringify(newValue))
        this.total = this.productList.length
      },
      deep: true
    }
  },
  data () {
    return {
      isShow: false,
      productList: [],
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    // 关闭弹窗
    closed () {
      this.handleCurrentChange(1)
      this.$emit('handleProductSelectView', false)
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
