<template>
  <div>
    <el-form class="filters" ref="form" :model="searchForm" label-width="80px" :inline="true">
      <div>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.time"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.vmcode" placeholder="请选择售卖机" clearable style="width: 260px"> <el-option v-for="item in vendingMachineList" :key="item._id" :label="item.name" :value="item.vUnionCode"> </el-option> </el-select>
        </el-form-item>
        <el-form-item> <el-input placeholder="请输入商品名称" v-model="searchForm.prodName" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition()">搜索</el-button> </el-form-item>
      </div>
      <div>
        <el-form-item> <el-button :loading="exportLoading" type="primary" :disabled="listData.length <= 0" @click="exportData">导出</el-button> </el-form-item>
      </div>
    </el-form>
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>总销售额</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.allRetailTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>总成本</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.allCostTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>总利润</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.allProfitTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>利润率</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.grossMargin }}</div>
        </div>
      </div>
    </div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="listData" border @sort-change="sortChange">
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column prop="prodName" label="产品名称" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="barCode" label="产品条码" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.barCode || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品分类" min-width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.firstCategoryName || '--' }}/{{ scope.row.secCategoryName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="销售数量" align="center" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="retailPriceTotal" label="销售总额/元" align="center" min-width="140"></el-table-column>
        <el-table-column prop="costPrice" label="销售成本总额/元" align="center" min-width="140"></el-table-column>
        <el-table-column prop="vmCode" label="售卖机编码" min-width="180" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[15, 25, 35, 45]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin-top: 10px;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getDataString } from '@/filters/filters'
import { getShopBindVendingMachine, getVendingMachineProductStatistics, vendingMachineProductStatisticsExport } from '@/api/system'

export default {
  data() {
    return {
      searchForm: {
        time: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')],
        stage: 4, // 1 当日 2 当周 3 当月 4 自定义时间
        vmcode: '',
        prodName: '',
        isAsc: true
      },
      vendingMachineList: [],
      listData: [],
      price: {
        allRetailTotal: 0,
        allCostTotal: 0,
        allProfitTotal: 0,
        grossMargin: ''
      },
      tableLoading: false,
      exportLoading: false,
      pageIndex: 1,
      pageSize: 15,
      total: 0
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.getShopBindVendingMachine()
      this.getProductList()
    },
    getShopBindVendingMachine() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      getShopBindVendingMachine(params).then(res => {
        this.vendingMachineList = res.data.listData.filter(item => item.code)
      })
    },
    // 获取产品信息
    getProductList() {
      let params = {
        sTime: this.searchForm.time && this.searchForm.time.length > 0 ? this.searchForm.time[0] + '~' + this.searchForm.time[1] : '',
        stage: this.searchForm.stage,
        vmcode: this.searchForm.vmcode,
        prodName: this.searchForm.prodName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: this.searchForm.isAsc,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      this.tableLoading = true
      getVendingMachineProductStatistics(params)
        .then(res => {
          this.tableLoading = false
          let { allRetailTotal, allCostTotal, allProfitTotal, grossMargin } = res.data
          this.listData = res.data.list
          this.total = res.total
          this.price = {
            allRetailTotal,
            allCostTotal,
            allProfitTotal,
            grossMargin
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 导出
    exportData() {
      let params = {
        sTime: this.searchForm.time && this.searchForm.time.length > 0 ? this.searchForm.time[0] + '~' + this.searchForm.time[1] : '',
        stage: this.searchForm.stage,
        vmcode: this.searchForm.vmcode,
        prodName: this.searchForm.prodName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      this.exportLoading = true
      vendingMachineProductStatisticsExport(params)
        .then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '售卖机产品销售数据统计.xls'
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
          this.exportLoading = false
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    // 列表排序
    sortChange({ column, prop, order }) {
      this.searchForm.isAsc = !(order === 'ascending')
      this.getProductList()
    },
    // 搜索
    handleFixedSearchCondition(stage) {
      this.pageIndex = 1
      this.searchForm.stage = stage
      this.searchForm.time = []
      this.getProductList()
    },
    searchCondition() {
      this.pageIndex = 1
      if (!this.searchForm.isFixedSearch) {
        this.searchForm.stage = 4
      }
      this.getProductList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProductList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_element-reset.scss';
.filters {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.home-count {
  width: 100%;
  padding-bottom: 10px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  .home-count-item {
    flex: 0 0 24.5%;
    background-color: #ffffff;
    box-shadow: 0 0 10px #eee;
    padding: 10px;
    max-height: 112.81px;
    .conut-l-title {
      color: #aaaaaa;
      font-size: 14px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
    }
    .count-l-total {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      display: -webkit-flex;
      align-items: baseline;
      border-bottom: 1px solid #e6e5e5;
      div.count-value {
        font-size: 26px;
        font-weight: bold;
        color: #2c2c2c;
      }
      .iconfont {
        margin-right: 10px;
      }
    }
    .count-l-bottom {
      padding: 10px 0;
      font-size: 14px;
      color: #434343;
      border-top: 1px solid #e6e5e5;
    }
    .two-total {
      position: relative;
      .total-count {
        font-weight: normal;
        font-size: 14px;
        position: absolute;
        right: 0;
      }
    }
  }
}
/deep/ .el-table__body-wrapper {
  td {
    border-bottom: 1px solid #ebeef5;
    padding: 12px 0;
  }

  th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
