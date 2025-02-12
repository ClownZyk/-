<template>
  <div class="allot-out-container">
    <div class="allot-out">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item label="订单时间">
            <el-date-picker v-model="timeFrame" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="产品条码">
            <el-input type="text" v-model="filterParam.barCode" placeholder="请输入产品条码检索" clearable></el-input>
          </el-form-item>
          <el-form-item label="盘点类型">
            <el-select v-model="filterParam.type" placeholder="请选择类型">
              <el-option v-for="item in checkType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="_search">搜索</el-button>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="55" type="index"></el-table-column>
          <el-table-column align="center" prop="productName" label="产品名称" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="title" label="规格" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="barCode" label="产品条码" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="stcok" label="盘点前数量" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="pdCount" label="盘点数量" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="addCount" label="差异数量" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="健康值" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.addCount >= 0" style="color:#67C23A">健康</div>
              <div v-else style="color:#F56C6C">预警</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="160" show-overflow-tooltip></el-table-column>
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
import Filters from '@/components/js/Filters'
import { GetTimeTrueInventoryRecordByCode, NewInventoryExportExcel } from '@/api/system'
export default {
  mixins: [Filters],
  name: 'allot-out',
  data() {
    return {
      // 查询条件
      filterParam: {
        barCode: '',
        type: 0
      },
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
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
        // barCode: '',
        // type: 0,
        ...this.filterParam,
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
      await GetTimeTrueInventoryRecordByCode(params).then(
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
        // barCode: '',
        // type: 0,
        ...this.filterParam,
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
      NewInventoryExportExcel(parmas).then(
        res => {
          const content = res
          const blob = new Blob([content])
          const fileName = `${parmas.sTime}的盘点记录.xls`
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
