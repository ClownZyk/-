<template>
  <div class="product-list">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="`${$route.query.companyName}-${$route.query.type === 1 ? '零售产品' : $route.query.type === 2 ? '餐食产品' : '饮品产品'}销售统计`"> </el-page-header></div>
    <el-form class="filters" :model="searchForm" :inline="true">
      <div>
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
        <el-form-item> <el-cascader v-model="searchForm.categoryId" :options="categoryList" :props="categoryProps" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
        <el-form-item> <el-input v-model="searchForm.nameOrBarCode" placeholder="请输入产品名称或产品条码" clearable></el-input></el-form-item>
        <el-form-item> <el-button type="primary" @click="getProductList('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div>
        <el-form-item> <el-button type="primary" @click="_export" :disabled="!listData.length">导出</el-button> </el-form-item>
      </div>
    </el-form>

    <!-- 数据汇总区 -->
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>总销售额</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.yzTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>总成本</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.gzTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>总利润</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.lzTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>客单价</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ parseFloat(price.guestPrice).toFixed(2) }}</div>
        </div>
      </div>
    </div>
    <!-- 数据统计列表区 -->
    <el-table v-loading="listLoading" :data="listData" style="width: 100%" :default-sort="{ prop: 'count', order: 'descending' }" border>
      <el-table-column align="center" type="index" label="编号" width="85"> </el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" width="300" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类" width="180">
        <template slot-scope="scope">
          <div v-if="type === 1">{{ scope.row.firstCategoryName }} / {{ scope.row.secCategoryName }}</div>
          <div v-else>{{ scope.row.firstCategoryName }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="barCode" label="产品条码" width="220"> </el-table-column>
      <el-table-column align="center" prop="retailPrice" label="商品价格" sortable width="165"> </el-table-column>
      <el-table-column align="center" prop="count" label="销售数量" sortable width="180"> </el-table-column>
      <el-table-column align="center" prop="retailTotal" label="销售总额" sortable width="180"> </el-table-column>
      <el-table-column align="center" prop="costTotal" label="销售成本总额" sortable width="180"> </el-table-column>
      <el-table-column align="center" prop="profit" label="销售利润" sortable width="180"> </el-table-column>
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
  </div>
</template>

<script>
import { getWeekStartDateAndEndDateRange, getMonthStartDateAndDateRange, getDataString } from '@/filters/filters'
import { mapState } from 'vuex'
import { getNewOrderStatistics, GetAllCategory, orderStatisticsExportExcel, getMealsProductStatistics, mealsOrderExport, getDrinkProductStatistics, drinksOrderExport } from '@/api/system'
export default {
  data() {
    return {
      searchForm: {
        nameOrBarCode: '',
        categoryId: '',
        filterTime: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')]
      },
      listData: [],
      price: {
        yzTotal: 0,
        gzTotal: 0,
        lzTotal: 0,
        guestPrice: 0
      },
      categoryList: [],
      listLoading: false,
      type: null, // 1 零售，2 餐食，3 饮品
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      categoryProps: {
        checkStrictly: true,
        emitPath: false
      },
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
  computed: {
    ...mapState(['storeInfo'])
  },
  mounted() {
    this.type = parseInt(this.$route.query.type)
    this._initData()
  },
  methods: {
    _initData() {
      this.getAllCategory()
      this.getProductList()
    },
    // 商品分类
    getAllCategory() {
      let params = {
        belongMenu: this.type === 1 ? '/product-category' : this.type === 2 ? '/homemade-product-category' : '/drink-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: this.$route.query.cid
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
      })
    },
    getProductList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        category: this.searchForm.categoryId,
        nameOrBarCode: this.searchForm.nameOrBarCode,
        queryCid: this.$route.query.cid,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      let getOrderStatistics = this.type === 1 ? getNewOrderStatistics : this.type === 2 ? getMealsProductStatistics : getDrinkProductStatistics
      getOrderStatistics(params)
        .then(res => {
          this.listLoading = false
          this.listData = res.data
          this.price = res
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
        category: this.searchForm.categoryId,
        nameOrBarCode: this.searchForm.nameOrBarCode,
        queryCid: this.$route.query.cid,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      let exportOrderStatistics = this.type === 1 ? orderStatisticsExportExcel : this.type === 2 ? mealsOrderExport : drinksOrderExport
      exportOrderStatistics(params)
        .then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '订单数据统计.xls'
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

.product-list {
  height: 100vh;
  .filters {
    display: flex;
    justify-content: space-between;
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
}
</style>
