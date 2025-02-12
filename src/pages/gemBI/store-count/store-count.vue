<template>
  <div class="count">
    <div v-if="containerIsShow">
      <el-form :model="searchForm" :inline="true">
        <el-form-item>
          <el-date-picker v-model="searchForm.stime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="expireTimeOption">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCondition">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="table-list">
        <el-table v-loading="listLoading" :data="listData" style="width:100%" border>
          <el-table-column label="编号" type="index" width="55" align="center"></el-table-column>
          <el-table-column label="日期" prop="date" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column label="店铺名称" prop="name" min-width="250" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="实际到账" prop="accountTotal" min-width="180" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="支付方式" prop="payType" min-width="180" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="180" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="goToOrderDetail(scope.row)">订单查询</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="store-count">
          <div class="store-count-item" v-for="(item, index) in sumList" :key="index">
            <span>{{ item.name }}：¥ {{ item.sum }}{{ index + 1 === sumList.length ? '' : '，' }}</span>
          </div>
        </div>
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
        >
        </el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getDataString } from '@/filters/filters'
import { getStoreIncomeData } from '@/api/system.js'
export default {
  watch: {
    $route(to, from) {
      if (to.name === 'store-count') {
        this.getIncomeData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      searchForm: {
        stime: [getDataString(new Date()), getDataString(new Date())]
      },
      dataList: [],
      listData: [],
      sumList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      listLoading: false,
      containerIsShow: true,
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= new Date('2022-05-10 00:00') - 24 * 60 * 60 * 1000
        }
      }
    }
  },
  mounted() {
    this.getIncomeData()
  },
  methods: {
    // 获取门店经营数据
    getIncomeData() {
      let params = {
        start: this.searchForm.stime.length > 0 ? this.searchForm.stime[0] : '',
        end: this.searchForm.stime.length > 0 ? this.searchForm.stime[1] : ''
      }
      this.listLoading = true
      getStoreIncomeData(params).then(
        res => {
          if (res.success) {
            this.listLoading = false
            this.dataList = res.data.data.map(item => {
              return {
                ...item,
                date: this.dateFilter(item.date)
              }
            })
            this.sumList = res.data.sum
            // this.total = res.data.data.length
            this.dataLocalPage()
          }
        },
        () => {
          this.listLoading = false
        }
      )
    },
    // 数据本地分页
    dataLocalPage() {
      this.listData = JSON.parse(JSON.stringify(this.dataList)).splice((this.pageIndex - 1) * this.pageSize, this.pageSize)
      this.total = this.dataList.length
    },
    // 点单查询页
    goToOrderDetail(row) {
      this.$router.push({
        path: '/store-count-detail',
        query: { cid: row.cid, date: row.date }
      })
    },
    dateFilter(val) {
      return String(val).substr(0, 4) + '-' + String(val).substr(4, 2) + '-' + String(val).substr(6, 2)
    },
    searchCondition() {
      this.pageIndex = 1
      this.getIncomeData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.dataLocalPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.dataLocalPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.count {
  padding: 20px;
  .table-list {
    .store-count {
      margin-top: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-items: center;
      .store-count-item {
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
    .pagination {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
