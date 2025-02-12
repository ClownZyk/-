<template>
  <div class="supplier-list-container">
    <div class="supplier-list" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.orderNum" placeholder="请输入单号检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
          <!-- <el-button type="danger" @click="operateDeleteMany">批量删除</el-button> -->
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <!-- <el-table-column align="center" prop="orderType" label="采购单类型" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.orderType === 1 ? 'V6向V8下采购单' : scope.row.orderType === 2 ? 'V8向供应商下采购单' : ''}}
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="oddNumbers" label="采购单号" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="ordermony" label="订单总金额" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="status" label="采购单状态" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.status === 1" style="color: #909399;">未完成</div>
              <div v-else-if="scope.row.status === 2" style="color: #13CE66;">已完成</div>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="visitCount" label="已入订单产品总金额" width="150" show-overflow-tooltip></el-table-column> -->
          <el-table-column align="center" prop="orderName" label="下单人" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="orderTime" label="下单时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="230" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button> -->
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">订单详情</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)" :disabled="scope.row.orderType !== 2">删除</el-button>
            </template>
          </el-table-column>
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
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {SupplierOrderGetListByPage, SupplierOrderOperation} from '@/api/system'
export default {
  name: 'supply-purchase-sup',
  watch: {
    '$route' (to, from) {
      if (to.name === 'supply-purchase-sup') {
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
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push({path: '/supply-purchase-sup-detail', query: {operate: 'add'}})
          break
        case '编辑': // 编辑
          this.$router.push({path: '/supply-purchase-sup-detail', query: {id: row._id, oddNumbers: row.oddNumbers, orderType: row.orderType, orderStatus: row.status}})
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '查看': // 查看
          this.$router.push({path: '/supply-purchase-sup-detail', query: {id: row._id, oddNumbers: row.oddNumbers, operate: 'view', orderType: row.orderType}})
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      SupplierOrderOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
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
        orderType: 2, // 全部, 1自营采购, 2向供应商采购
        type: 0, // 0全部，1待入库
        orderNum: this.search.orderNum,
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
      await SupplierOrderGetListByPage(params).then(res => {
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
  .supplier-list-container {
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
