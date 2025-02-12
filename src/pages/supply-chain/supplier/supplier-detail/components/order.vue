<template>
  <div class="order-container">
    <div class="order">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.oddNumbers" placeholder="请输入单号检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="oddNumbers" label="采购单号" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="supName" label="供应商" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="productName" label="产品名称" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="barCode" label="产品条码" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="costPrice" label="供货价" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="count" label="供货数量" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="inCount" label="已入库数量" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="remark" label="备注" min-width="180" show-overflow-tooltip></el-table-column>
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
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {GetSupplierGoodsList} from '@/api/system'
export default {
  name: 'order',
  data () {
    return {
      // 查询条件
      search: {
        oddNumbers: ''
      },
      // 列表
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
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
    // 加载数据
    async GetListByPage () {
      if (this.$route.query.id !== undefined) {
        let params = {
          oddNumbers: this.search.oddNumbers,
          supid: this.$route.query.id,
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
        await GetSupplierGoodsList(params).then(res => {
          this.listLoading = false
          this.list = res.data
          this.total = res.total
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .list-table {
    color: #666666;
    padding: 20px 0;
    .table-main {
      text-align: center;
      margin-bottom: 15px;
    }
  }
</style>
