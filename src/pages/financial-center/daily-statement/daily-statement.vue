<template>
  <div class="vote-list-container">
    <div class="vote-list" v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" :model="filterParam" :inline="true">
        <div class="filters-left">
          <el-form-item v-if="isManage">
            <el-select v-model="filterParam.queryCid" placeholder="请选择门店"> <el-option v-for="item in shopList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="filterParam.sTime" type="daterange" format="yyyy/MM/dd" value-format="yyyy/MM/dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"> </el-date-picker>
          </el-form-item>
          <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
        </div>
        <div class="filters-right">
          <el-form-item><el-button type="primary" @click="dailyCountAddOrEdit('', 1)" v-permission="['/daily-statement:insert']">新增</el-button></el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table v-loading="listLoading" class="table-main" :data="lists" border tooltip-effect="dark" show-summary :summary-method="getSummaries">
          <el-table-column align="center" prop="createTime" label="日期" min-width="130" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="订单数" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="retailTotal" label="零售总额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="makeFoodTotal" label="餐食总额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="makeDrinkTotal" label="饮品总额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="memberDiscountTotal" label="会员折扣总额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="cardTotal" label="卡劵折扣额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="promotionTotal" label="组合产品优惠" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="onePromotionTotal" label="单品促销优惠" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="payTotal" label="实付金额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="feeTotal" label="手续费" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="accountTotal" label="实际到账" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="costPriceTotal" label="销售成本" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="purchaseCostTotal" label="采购成本" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="otherCosts" label="其他进货成本(快驴)" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="basePrice" label="基本消费" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="grossProfit" label="毛利" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="cargoDamage" label="零售货损" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="foodDamage" label="餐食货损" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="drinkDamage" label="饮品货损" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="stockValue" label="当日货值" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="depositBalance" label="保证金余额" min-width="130" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column align="center" prop="foodTotal" label="餐食金额" min-width="130" show-overflow-tooltip></el-table-column> -->
          <el-table-column align="center" prop="vipTotal" label="会员购买金额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="chargeTotal" label="充值金额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="moling" label=" 抹零优惠额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="zhengdandazhe" label="整单折扣额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="zhengdanyouhui" label="整单优惠额" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="dailyCountAddOrEdit(scope.row, 2)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="total"
            v-show="lists.length !== 0"
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          >
          </el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { DailyPayReportList, getAllStore } from '@/api/system'
import { formatDate } from '@/components/js/data'

export default {
  watch: {
    '$route' (to, from) {
      if (to.name === 'daily-statement') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      filterParam: {
        sTime: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')],
        queryCid: this.$store.state._cid
      },
      lists: [],
      shopList: [],
      listLoading: false,
      containerIsShow: true,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    if (this.isManage) {
      this.getAllShop()
    } else {
      this.GetListByPage()
    }
  },
  methods: {
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.shopList = res.data.map(item => {
            return {
              value: item.cid,
              label: item.companyName
            }
          })
          this.filterParam.queryCid = this.shopList.length > 0 ? this.shopList[0].value : this.$store.state._cid
          this.GetListByPage()
        }
      })
    },
    GetListByPage () {
      let params = {
        startTime: this.filterParam.sTime && this.filterParam.sTime.length > 0 ? this.filterParam.sTime[0] : '',
        endTime: this.filterParam.sTime && this.filterParam.sTime.length > 0 ? this.filterParam.sTime[1] : '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.filterParam.queryCid
      }
      this.listLoading = true
      DailyPayReportList(params).then(res => {
        this.listLoading = false
        this.lists = res.data.map(item => {
          let basePrice = parseFloat((item.othersCostTotal + item.dianfei + item.wuyefei + item.fangzu + item.shuifei + item.wangfei).toFixed(2))
          return {
           ...item,
           basePrice: basePrice
          }
        })
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    dailyCountAddOrEdit(row, action) {
      this.$router.push({
        path: '/daily-statement-detail',
        query: {
          cid: row.cid,
          time: row.date,
          id: row._id,
          action: action
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]));
         if (!values.every(value => isNaN(value))) {
           sums[index] = values.reduce((prev, curr) => {
             const value = Number(curr);
             if (!isNaN(value)) {
               return parseFloat((prev + curr).toFixed(2));
             } else {
               return prev;
             }
           }, 0);
         } else {
           sums[index] = '--';
         }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.vote-list-container {
  padding: 20px;
}
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
