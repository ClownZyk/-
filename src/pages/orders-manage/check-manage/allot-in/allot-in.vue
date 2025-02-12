<template>
  <div class="allot-in-container">
    <div class="allot-in">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item label="订单时间">
            <el-date-picker v-model="timeFrame" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="_search">搜索</el-button>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="product.productName" label="产品名称" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="product.barCode" label="产品条码" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="product.title" label="产品型号" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="product.count" label="调配数量" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="orderStatus" label="调配状态" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus === 1" style="color: #e6b321;">未完成</div>
              <div v-else-if="scope.row.orderStatus === 2" style="color: #13CE66;">已完成</div>
              <div v-else-if="scope.row.orderStatus === 3" style="color: #FF4949;">已取消</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="companyName" label="调出门店" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="confirmAllot(scope.row)" :disabled="scope.row.orderStatus !== 1">确认收货</el-button>
              <el-button type="primary" size="mini" @click="cancelAllot(scope.row)" :disabled="scope.row.orderStatus !== 1">取消收货</el-button>
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
          ></el-pagination>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/components/js/data'
import { AlllotOrderList, CancelAllotOrder, ConfirmAllotOrder, allocationExport } from '@/api/system'
export default {
  name: 'allot-in',
  data() {
    return {
      // 查询条件
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
      storeList: [],
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    // 确认收货
    confirmAllot(row) {
      this.$confirm('确认收货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row._id,
          companyCid: '',
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        ConfirmAllotOrder(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.GetListByPage()
        })
      })
    },
    // 取消收货
    cancelAllot(row) {
      this.$confirm('确认取消收货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row._id,
          companyCid: '',
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        CancelAllotOrder(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.GetListByPage()
        })
      })
    },
    _search() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    // 选中行
    selectTableRow(row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage() {
      let params = {
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        companyCid: this.$store.state._cid,
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
      await AlllotOrderList(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.list = res.data
            this.total = res.total
          } else {
            this.$message.warning(res.msg)
          }
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    },
    exportExcel() {
      let parmas = {
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        companyCid: this.$store.state._cid,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      allocationExport(parmas).then(
        res => {
          const content = res
          const blob = new Blob([content])
          const fileName = `${parmas.sTime}的入库表.xls`
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, { type: 'application/vnd.ms-excel' })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        },
        err => {
          this.$message.err(err.msg)
        }
      )
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.allot-in-container {
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
.form {
  .item-long {
    width: 492px;
  }
}
</style>
