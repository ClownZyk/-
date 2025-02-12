<template>
  <div class="allot-out-container">
    <div class="allot-out" v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item label="订单时间">
            <el-date-picker v-model="timeFrame" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="_search">搜索</el-button>
            <el-button type="primary" @click="exportExcel" :disabled="list.length === 0">导出</el-button>
          </el-form-item>
        </div>
        <el-form-item class="allot-btn"> <el-button type="primary" @click="$router.push({ path: '/allot-out-detail' })">批量调拨</el-button> </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column type="expand" prop="product">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.product" :key="index" class="procuct-item">
                <div class="product-title">{{ `出库产品 ${index + 1}` }}</div>
                <div class="product-info">
                  <span>{{ item.productName + '（' + item.title + '）' }} x {{ item.count + '，' }}</span> <span>{{ item.barCode + '，' }}</span> <span>{{ item.datetime ? item.datetime.split(' ')[0] + '，' : ' ' }}</span>
                  <span v-if="item.onlyStatus === 1" style="color:#e6b321;">未完成</span> <span v-if="item.onlyStatus === 2" style="color: #13CE66;">已完成</span> <span v-if="item.onlyStatus === 3" style="color: #FF4949;">已作废</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="orderId" label="出库编号" width="220"></el-table-column>
          <el-table-column align="center" prop="orderStatus" label="调配状态" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus === 1" style="color: #e6b321;">未完成</div>
              <div v-else-if="scope.row.orderStatus === 2" style="color: #13CE66;">已完成</div>
              <div v-else-if="scope.row.orderStatus === 3" style="color: #FF4949;">已作废</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="companyName" label="调入门店" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
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
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/components/js/data'
import { AlllotOrderList, allocationExport } from '@/api/system'
import Filters from '@/components/js/Filters.js'
export default {
  name: 'allot-out',
  mixins: [Filters],
  data() {
    return {
      // 查询条件
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      containerIsShow: true
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'allot-out') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  methods: {
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
    _search() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage() {
      let params = {
        companyCid: '',
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
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
        companyCid: '',
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
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
.allot-out-container {
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
  .allot-btn {
    margin-left: auto;
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
.procuct-item {
  display: flex;
  margin-bottom: 10px;
  .product-title {
    margin-right: 20px;
  }
}
</style>
