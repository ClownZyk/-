<template>
  <div class="not-stock-container">
    <div class="not-stock" v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.orderNum" placeholder="请输入单号检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
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
          <el-table-column align="center" prop="ordermony" label="订单总金额" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="procureType" label="入库类别" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.procureType | procureTypeFilter }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="采购单状态" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <span style="color: #909399;">{{ scope.row.status | supplyOrderStateToString }}</span> -->
              <div v-if="!scope.row.supplierId" style="color: #909399;">{{ scope.row.status | supplyOrderStateToString }}</div>
              <div v-else style="color: #909399;">
                <span v-if="scope.row.status === 3">待入库</span> <span v-else>{{ scope.row.status | supplyOrderStateToString }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="orderName" label="下单人" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="orderTime" label="下单时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="230" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="operateFunc(scope.row)">入库操作</el-button>
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
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          >
          </el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getPhurchaseOrderList} from '@/api/systemForV8'
import Filters from '@/components/js/Filters.js'
export default {
  name: 'supply-not-stock',
  mixins: [Filters],
  watch: {
    '$route' (to, from) {
      if (to.name === 'supply-not-stock') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      // 控制列表显示还是子内容显示
      containerIsShow: true,
      // 查询条件
      search: {
        // 名称
        orderNum: ''
      },
      // 列表
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 增删改查
    operateFunc (row) {
      this.$router.push({path: '/supply-not-stock-detail', query: {id: row._id, oddNumbers: row.oddNumbers, operate: 'view', orderType: row.orderType}})
    },
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
      let params = {
        type: 0, // 0全部，1待入库
        orderType: 0,
        status: 99,
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
      await getPhurchaseOrderList(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.not-stock-container {
  padding: 20px;
}
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
