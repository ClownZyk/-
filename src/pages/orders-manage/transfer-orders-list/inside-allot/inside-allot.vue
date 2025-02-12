<template>
  <div class="inside-allot-container">
    <div class="filter">
      <el-form ref="filterParamRef" :model="filterParam" :inline="true">
        <el-form-item label="订单时间">
          <el-date-picker v-model="filterParam.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCondition">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
        <el-table-column label="调出产品类型" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.oldProductType | allotProductType2Str }}</div>
          </template>
        </el-table-column>
        <el-table-column label="调入产品类型" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.nowProductType | allotProductType2Str }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="barCode" label="产品条码" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="产品型号" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.unitName}}({{scope.row.convertCount}}{{scope.row.smallUnitName}})</div>
          </template>
        </el-table-column>
        <el-table-column label="调拨数量(型号单位)" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.unitCount }}{{ scope.row.unitName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="调拨数量(最小单位)" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.smallUnitCount }}{{ scope.row.smallUnitName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[15, 25, 35, 45]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getInsideAllotOrderList } from '@/api/system'
import { formatDate } from '@/components/js/data'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      filterParam: {
        time: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      },
      orderList: [],
      pageSize: 15,
      pageIndex: 1,
      total: 0,
      tableLoading: false
    }
  },
  created() {
    this.getInsideAllotOrderList()
  },
  methods: {
    // 获取内部调拨订单列表
    getInsideAllotOrderList() {
      let params = {
        sTime: this.filterParam.time ? `${this.filterParam.time[0]}~${this.filterParam.time[1]}` : '',
        oldProductType: 1,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getInsideAllotOrderList(params).then(
        res => {
          if (res.success) {
            this.orderList = res.data
            this.total = res.total
            this.tableLoading = false
          }
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    // 调拨订单搜索
    searchCondition() {
      this.pageIndex = 1
      this.getInsideAllotOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getInsideAllotOrderList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getInsideAllotOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.inside-allot-container {
  padding: 20px;
  .pagination {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
