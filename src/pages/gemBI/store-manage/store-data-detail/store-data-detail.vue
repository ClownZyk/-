<template>
  <div class="data-count">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="`${$route.query.companyName}-${$route.meta.name}`"> </el-page-header></div>
    <el-form class="filters" :model="searchForm" :inline="true">
      <div class="filter-left">
        <el-form-item>
          <el-date-picker
            v-model="searchForm.filterTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="getSomeShopData('refresh')">搜索</el-button> </el-form-item>
        <el-form-item> <el-button :loading="exportLoading" type="primary" @click="exportBankStatement">对账单导出</el-button> </el-form-item>
      </div>
      <div class="filter-right">
        <el-form-item> <el-button type="primary" @click="_export" :disabled="!listData.length">店铺数据导出</el-button> </el-form-item>
      </div>
    </el-form>
    <div class="alert"><el-alert title="对账单是按照选定时间进行导出，建议选择整月" type="warning" :closable="false"> </el-alert></div>
    <!-- 数据统计列表区 -->
    <el-table v-loading="tableLoading" :data="listData" style="width: 100%" :default-sort="{ prop: 'date', order: 'ascending' }" border show-summary :summary-method="getSummaries">
      <el-table-column align="center" prop="date" label="日期" sortable width="160" fixed show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.date | formatTime }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="retailTotal" label="零售总额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="count" label="订单数" sortable width="120"> </el-table-column>
      <el-table-column align="center" prop="customerUnitPrice" label="客单价" sortable width="140"> </el-table-column>
      <el-table-column align="center" prop="payTotal" label="实付金额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="retailIncomeTotal" label="营收总额" sortable width="140"> </el-table-column>
      <el-table-column align="center" prop="feeTotal" label="手续费" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="accountTotal" label="实收金额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="bank" label="银行到账" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="cashTotal" label="现金到账" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="other" label="其它金额" sortable width="160">
        <template slot-scope="scope">
          <span class="other" @click="handleOtherMoney(scope.row)">{{ scope.row.other }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="payTotalProfit" label="实收分润金额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="bankProfit" label="银行到账分润金额" sortable width="180"> </el-table-column>
      <el-table-column align="center" prop="costTotal" label="销售成本" sortable width="140"> </el-table-column>
      <el-table-column align="center" prop="shimaolie" label="实毛利额" sortable width="140"> </el-table-column>
      <el-table-column align="center" prop="shimaolilv" label="实毛利率" sortable width="140">
        <template slot-scope="scope">
          <div>{{ scope.row.retailIncomeTotal ? ((scope.row.shimaolie / scope.row.retailIncomeTotal) * 100).toFixed(2) : 0 }}%</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="lingshoumaolie" label="零售毛利额" sortable width="140"> </el-table-column>
      <el-table-column align="center" prop="lingshoumaolilv" label="零售毛利率" sortable width="140">
        <template slot-scope="scope">
          <div>{{ scope.row.retailTotal ? ((scope.row.lingshoumaolie / scope.row.retailTotal) * 100).toFixed(2) : 0 }}%</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="memberDiscountTotal" label="会员折扣总额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="cardTotal" label="卡劵折扣额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="promotionTotal" label="营销活动优惠" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="zhengdanyouhui" label="整单优惠额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="zhengdandazhe" label="整单折扣额" sortable width="160"> </el-table-column>
      <el-table-column align="center" prop="moling" label="抹零优惠额" sortable width="160"> </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </div>

    <el-dialog :title="`其它金额（不包含银行，现金到账）- ${otherDate}`" :visible.sync="isOtherMoneyShow" width="65%" @close="isOtherMoneyShow = false" :close-on-click-modal="false">
      <el-table v-loading="listLoading" ref="listTableRef" :data="payTypeList" border show-summary>
        <el-table-column align="center" prop="payType" label="支付方式" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="count" label="交易笔数" sortable min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="retailTotal" label="零售额" sortable min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payTotal" label="实付金额" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="feeTotal" label="手续费" min-width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="accountTotal" label="实际到账" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="memberDiscountTotal" label="会员优惠" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="moling" label="抹零优惠额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="zhengdandazhe" label="整单折扣额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="zhengdanyouhui" label="整单优惠额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="promotionTotal" label="其他营销活动优惠" min-width="170" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="onePromotionTotal" label="单品折扣优惠" min-width="160" sortable show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWeekStartDateAndEndDateRange, getMonthStartDateAndDateRange, getDataString } from '@/filters/filters'
import { getDayStoreStatistics, dayStoreStatisticsExportExcel, GetDailyPayReportOriginDataNoSum, bankStatementExport } from '@/api/system'
export default {
  data() {
    return {
      searchForm: {
        companyName: '',
        filterTime: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')]
      },
      otherDate: null,
      listData: [],
      payTypeList: [],
      tableLoading: false,
      listLoading: false,
      exportLoading: false,
      isOtherMoneyShow: false,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
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
  watch: {
    isOtherMoneyShow(val) {
      if (!val) {
        this.payTypeList = []
      }
    }
  },
  created() {
    this.getSomeShopData()
  },
  methods: {
    getSomeShopData(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.$route.query.cid,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.tableLoading = true
      getDayStoreStatistics(params)
        .then(res => {
          this.tableLoading = false
          this.listData = res.data.map(item => {
            return {
              ...item,
              retailIncomeTotal: parseFloat((item.payTotal + item.promotionTotal).toFixed(2)),
              shimaolie: parseFloat((item.payTotal + item.promotionTotal - item.costTotal).toFixed(2)),
              lingshoumaolie: parseFloat((item.retailTotal - item.costTotal).toFixed(2)),
              customerUnitPrice: parseFloat(item.count) ? parseFloat((item.retailTotal / item.count).toFixed(2)) : 0
            }
          })
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 导出
    _export() {
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.$route.query.cid,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      dayStoreStatisticsExportExcel(params)
        .then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '销售数据统计(每天).xls'
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
        // queryCid: this.$store.state._cid,
        queryCid: this.$route.query.cid,
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
    handleOtherMoney(row) {
      this.isOtherMoneyShow = true
      this.otherDate = row.date
      this.getDailyPayStateData(row)
    },
    // 其它支付方式数据
    getDailyPayStateData(row) {
      let params = {
        date: row.date,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: this.$route.query.cid
      }
      this.listLoading = true
      GetDailyPayReportOriginDataNoSum(params)
        .then(res => {
          this.listLoading = false
          this.payTypeList = res.data.filter(item => item.payType !== '宁波银行易收宝' && item.payType !== '现金支付')
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        let total1 = 0
        let total2 = 0
        data.forEach(item => {
          if (column.property === 'customerUnitPrice') {
            total1 += item.retailTotal
            total2 += item.count
          } else if (column.property === 'shimaolilv') {
            total1 += item.shimaolie
            total2 += item.retailIncomeTotal
          } else if (column.property === 'lingshoumaolilv') {
            total1 += item.lingshoumaolie
            total2 += item.retailTotal
          } else {
            total1 += item[column.property]
          }
        })
        sums[index] =
          column.property === 'customerUnitPrice'
            ? Math.round((total1 / total2) * 100) / 100
            : column.property === 'shimaolilv' || column.property === 'lingshoumaolilv'
            ? parseFloat(((total1 / total2) * 100).toFixed(2)) + '%'
            : Math.round(total1 * 100) / 100
      })
      return sums
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSomeShopData()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getSomeShopData()
    }
  },
  filters: {
    formatTime(time) {
      let year = time.toString().substring(0, 4)
      let month = time.toString().substring(4, 6)
      let day = time.toString().substring(6)
      let dataTimeLine = `${year}-${month}-${day}`
      return dataTimeLine
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_element-reset.scss';

.data-count {
  .filters {
    display: flex;
    justify-content: space-between;
  }
  .alert {
    margin-bottom: 10px;
  }
  .other {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
  /deep/ .el-table--border th:first-child .cell {
    color: #000;
    font-size: 15px;
    font-weight: 700;
  }
  /deep/ .el-table__fixed-header-wrapper table thead tr th {
    background: unset;
  }
  /deep/ .el-table__body-wrapper {
    td {
      padding: 12px 0;
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
