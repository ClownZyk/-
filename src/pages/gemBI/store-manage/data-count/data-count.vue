<template>
  <div class="data-count">
    <div v-if="containerIsShow">
      <div class="gem-back-header"><el-page-header @back="$router.back()" content="所有门店数据统计信息"> </el-page-header></div>
      <div class="filter-data">
        <!-- 搜索筛选区域 -->
        <div class="search-filter">
          <el-form :model="searchForm" :inline="true">
            <el-form-item label="门店名称">
              <el-select v-model="searchForm.companyCid" placeholder="请选择门店" clearable style="width:350px"> <el-option v-for="(item, index) in shopList" :key="index" :label="item.label" :value="item.value"> </el-option> </el-select
            ></el-form-item>
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
            <el-form-item> <el-button type="primary" @click="getAllShopData(refresh)">搜索</el-button> </el-form-item>
            <el-form-item label="开启刷新"> <el-switch v-model="isAutoRefresh"> </el-switch> </el-form-item>
          </el-form>
        </div>
        <!-- 导出 -->
        <div class="btn"><el-button type="primary" @click="_export" :disabled="!listData.length">导出</el-button></div>
      </div>
      <!-- 数据统计列表区 -->
      <el-table v-loading="listLoading" :data="listData" :default-sort="{ prop: 'retailTotal', order: 'descending' }" show-summary :summary-method="getSummaries" border>
        <el-table-column align="center" prop="queryName" label="店铺名称" width="200" fixed show-overflow-tooltip>
          <template slot-scope="scope">
            <div @click="onHandleCheckDetail(scope.row)">{{ scope.row.queryName }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="retailTotal" label="零售总额" sortable width="140"> </el-table-column>
        <el-table-column align="center" prop="count" label="订单数" sortable width="130"> </el-table-column>
        <el-table-column align="center" prop="customerUnitPrice" label="客单价" sortable width="130"> </el-table-column>
        <el-table-column align="center" prop="payTotal" label="实付金额" sortable width="140"> </el-table-column>
        <el-table-column align="center" prop="retailIncomeTotal" label="营收总额" sortable width="140"> </el-table-column>
        <el-table-column align="center" prop="feeTotal" label="手续费" sortable width="120"> </el-table-column>
        <el-table-column align="center" prop="accountTotal" label="实收金额" sortable width="140"> </el-table-column>
        <el-table-column align="center" prop="bank" label="银行到账" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="entityCardBank" label="云点卡充值（银行）" sortable width="180"> </el-table-column>
        <el-table-column align="center" prop="entityCardCash" label="云点卡充值（现金）" sortable width="180"> </el-table-column>
        <el-table-column align="center" prop="cashTotal" label="现金到账" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="other" label="其它金额" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="costTotal" label="销售成本" sortable width="140"> </el-table-column>
        <el-table-column align="center" prop="shimaolie" label="实毛利额" sortable width="140"> </el-table-column>
        <el-table-column align="center" prop="shimaolilv" label="实毛利率" sortable width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.shimaolilv }}%</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="lingshoumaolie" label="零售毛利额" sortable width="140"> </el-table-column>
        <el-table-column align="center" prop="lingshoumaolilv" label="零售毛利率" sortable width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.lingshoumaolilv }}%</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productCostTotal" label="库存净值" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="productSalesPriceTotal" label="零售净值" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="pankuTotal" label="盘库值" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="memberDiscountTotal" label="会员折扣总额" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="cardTotal" label="卡劵折扣额" sortable width="150"> </el-table-column>
        <el-table-column align="center" prop="promotionTotal" label="营销活动优惠额" sortable width="160"> </el-table-column>
        <el-table-column align="center" prop="zhengdanyouhui" label="整单优惠额" sortable width="150"> </el-table-column>
        <el-table-column align="center" prop="zhengdandazhe" label="整单折扣额" sortable width="150"> </el-table-column>
        <el-table-column align="center" prop="moling" label="抹零优惠额" sortable width="150"> </el-table-column>
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
          style="margin-top: 15px;text-align:right"
        >
        </el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getWeekStartDateAndEndDateRange, getMonthStartDateAndDateRange, getDataString } from '@/filters/filters'
import { AllotGetUserDropDownList, getStoreStatistics, saleCountExportExcel } from '@/api/system'
import AutoRefresh from '@/utils/autoRefresh'

export default {
  mixins: [AutoRefresh],
  computed: {
    isAutoRefresh: {
      get() {
        return this.$store.state.isAutoRefresh
      },
      set(val) {
        this.$store.commit('setPageRefreshState', val)
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'data-count') {
        this.getAllShopData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isOtherMoneyShow(val) {
      if (!val) {
        this.payTypeList = []
      }
    }
  },
  data() {
    return {
      searchForm: {
        companyCid: '',
        filterTime: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')]
      },
      listData: [],
      shopList: [],
      listLoading: false,
      isOtherMoneyShow: false,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      containerIsShow: true,
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
  created() {
    this.getShopList()
    this.getAllShopData()
  },
  methods: {
    getAndInitPageData() {
      this.getAllShopData()
    },
    // 获取店名列表
    getShopList() {
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      AllotGetUserDropDownList(params).then(res => {
        this.shopList = res.data
      })
    },

    // 获取所有店铺信息
    getAllShopData(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.searchForm.companyCid,
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
      getStoreStatistics(params)
        .then(res => {
          this.listLoading = false
          this.listData = res.data.map(item => {
            return {
              ...item,
              customerUnitPrice: item.count ? (parseFloat(item.retailTotal) / parseFloat(item.count)).toFixed(2) : 0
            }
          })
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    // 导出
    _export() {
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.searchForm.companyCid,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
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

    onHandleCheckDetail(row) {
      this.$router.push({
        path: '/store-detail',
        query: { cid: row.queryCid }
      })
      this.$store.commit('setStoreCid', row.queryCid)
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
            ? Math.round((total1 / total2) * 100) + '%'
            : Math.round(total1 * 100) / 100
      })
      return sums
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllShopData()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllShopData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_element-reset.scss';

.data-count {
  .filter-data {
    display: flex;
    justify-content: space-between;
    .search-filter {
      display: flex;
      flex-wrap: wrap;
    }
  }
  /deep/ .el-table--border th:first-child .cell {
    color: #000 !important;
    font-size: 15px !important;
    font-weight: 700 !important;
  }
  /deep/ .el-table__fixed-right .el-table__fixed-header-wrapper table thead tr th {
    background: unset;
  }
}
</style>
