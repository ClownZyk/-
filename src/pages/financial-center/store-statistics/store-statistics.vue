<template>
  <div class="container">
    <el-form :model="searchForm" :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="searchForm.filterTime"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      <el-form-item> <el-button type="warning" @click="_export" :disabled="listData.length <= 0">数据导出</el-button> </el-form-item>
      <!-- <el-form-item> <el-button :loading="exportLoading" type="success" @click="exportBankStatement">对账单导出</el-button> </el-form-item> -->
    </el-form>
    <!-- <div class="alert"><el-alert title="对账单是按照选定时间进行导出，建议选择整月" type="warning" :closable="false"> </el-alert></div> -->
    <div class="table-list">
      <!-- 数据统计列表区 -->
      <el-table v-loading="listLoading" :data="listData" style="width: 100%" border>
        <el-table-column align="center" prop="queryName" label="店铺名称" width="200" fixed show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="retailTotal" label="零售总额" width="140"> </el-table-column>
        <el-table-column align="center" prop="count" label="订单数" width="130"> </el-table-column>
        <el-table-column align="center" prop="customerUnitPrice" label="客单价" width="130"> </el-table-column>
        <el-table-column align="center" prop="payTotal" label="实付金额" width="140"> </el-table-column>
        <el-table-column align="center" prop="retailIncomeTotal" label="营收总额" width="140"> </el-table-column>
        <el-table-column align="center" prop="feeTotal" label="手续费" width="120"> </el-table-column>
        <el-table-column align="center" prop="accountTotal" label="实收金额" width="140"> </el-table-column>
        <el-table-column align="center" prop="costTotal" label="销售成本" width="140"> </el-table-column>
        <el-table-column align="center" prop="shimaolie" label="实毛利额" width="140"> </el-table-column>
        <el-table-column align="center" prop="shimaolilv" label="实毛利率" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.shimaolilv }}%</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="lingshoumaolie" label="零售毛利额" width="140"> </el-table-column>
        <el-table-column align="center" prop="lingshoumaolilv" label="零售毛利率" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.lingshoumaolilv }}%</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productCostTotal" label="库存净值" width="160"> </el-table-column>
        <el-table-column align="center" prop="productSalesPriceTotal" label="零售净值" width="160"> </el-table-column>
        <el-table-column align="center" prop="pankuTotal" label="盘库值" width="160"> </el-table-column>
        <el-table-column align="center" prop="memberDiscountTotal" label="会员折扣总额" width="160"> </el-table-column>
        <el-table-column align="center" prop="cardTotal" label="卡劵折扣额" width="150"> </el-table-column>
        <el-table-column align="center" prop="promotionTotal" label="营销活动优惠额" width="160"> </el-table-column>
        <el-table-column align="center" prop="zhengdanyouhui" label="整单优惠额" width="150"> </el-table-column>
        <el-table-column align="center" prop="zhengdandazhe" label="整单折扣额" width="150"> </el-table-column>
        <el-table-column align="center" prop="moling" label="抹零优惠额" width="150"> </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getWeekStartDateAndEndDateRange, getMonthStartDateAndDateRange, getDataString } from '@/filters/filters'
import { getStoreStatistics, saleCountExportExcel, bankStatementExport } from '@/api/system'

export default {
  data() {
    return {
      searchForm: {
        filterTime: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')]
      },
      listData: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      listLoading: false,
      exportLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              let time = getWeekStartDateAndEndDateRange()
              picker.$emit('pick', time)
            }
          },
          {
            text: '本月',
            onClick(picker) {
              let time = getMonthStartDateAndDateRange()
              picker.$emit('pick', time)
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getStoreData()
  },
  methods: {
    // 获取店铺数据
    getStoreData() {
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.$store.state._cid,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getStoreStatistics(params).then(res => {
        if (res.success) {
          this.listLoading = false
          this.listData = res.data.map(item => {
            return {
              ...item,
              customerUnitPrice: (parseFloat(item.retailTotal) / parseFloat(item.count)).toFixed(2)
            }
          })
          this.total = res.total
        }
      })
    },
    // 导出
    _export() {
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.$store.state._cid,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      saleCountExportExcel(params)
        .then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '销售数据统计.xls'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, {
              type: 'application/vnd.ms-excel'
            })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 对账单导出
    exportBankStatement() {
      if (!this.searchForm.filterTime || this.searchForm.filterTime.length <= 0) {
        return this.$message.warning('请选择导出数据的日期时间，建议整月！')
      }
      let time = this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1]
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.$store.state._cid,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.exportLoading = true
      bankStatementExport(params)
        .then(res => {
          this.exportLoading = false
          const content = res
          const blob = new Blob([content])
          const fileName = `${this.searchForm.filterTime[0].split(' ')[0]}~${this.searchForm.filterTime[1].split(' ')[0]}对账单数据.xls`
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, {
              type: 'application/vnd.ms-excel'
            })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getStoreData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getStoreData()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getStoreData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .alert {
    margin-bottom: 10px;
  }
  .pagination {
    text-align: right;
    margin-top: 15px;
  }
}
</style>
