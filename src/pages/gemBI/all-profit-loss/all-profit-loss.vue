<template>
  <div class="page-container">
    <el-form :model="filterParam" inline>
      <el-form-item label="月份" prop="month"> <el-date-picker v-model="filterParam.month" type="month" placeholder="选择月" format="yyyyMM" value-format="yyyyMM" :clearable="false"> </el-date-picker> </el-form-item>
      <el-form-item label="门店" prop="queryCid">
        <el-select v-model="filterParam.queryCid" placeholder="请选择门店" clearable> <el-option v-for="(item, index) in shopList" :key="index" :label="item.label" :value="item.value"> </el-option> </el-select
      ></el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition('refresh')">搜索</el-button> </el-form-item>
    </el-form>
    <div>
      <el-table v-loading="listLoading" :data="profitLossList" border>
        <el-table-column label="门店" prop="shopName" width="200" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="门店房租" prop="rentAmount" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="门店工资" prop="salary" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="运营费用" prop="operationCost" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="水电燃气费用" prop="utilityCosts" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="浮动盈亏值" prop="profitAndLoss" min-width="140" align="center" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            {{ parseFloat(scope.row.profitAndLoss.toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="盈值" prop="profitValue" min-width="100" align="center" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            {{ parseFloat(scope.row.profitValue.toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="净毛利额" prop="netProfit" min-width="100" align="center" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            {{ parseFloat(scope.row.netProfit.toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="实毛利率" prop="profitRate" min-width="100" align="center" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            {{ parseFloat((scope.row.profitRate * 100).toFixed(2)) }}%
          </template>
        </el-table-column>
        <el-table-column label="净销售额" prop="accountTotal" min-width="100" align="center" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            {{ parseFloat(scope.row.accountTotal.toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="零售差额" prop="retailDiff" min-width="100" align="center" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            {{ parseFloat(scope.row.retailDiff.toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row._id !== '000000000000000000000000'" size="mini" type="warning" @click="handleProfitAndLossEdit(scope.row)">修改</el-button>
            <span v-else></span>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 门店浮动盈亏对比 -->
    <div class="compare-container">
      <div class="compare-title">
        <div class="title">门店浮动盈亏对比</div>
        <div>月份：<el-date-picker size="small" v-model="compareMonth" type="month" placeholder="选择月" format="yyyyMM" value-format="yyyyMM" :clearable="false"> </el-date-picker></div>
      </div>
      <div class="compare-info">
        <div class="compare-info-left"><compare-info ref="compareLeftInfoRef" toRef="compareLeftInfoRef" :compareMonth="compareMonth" :isProfitAndLossShow.sync="isProfitAndLossShow" @getBaseData="getBaseData"></compare-info></div>
        <div class="compare-info-right"><compare-info ref="compareRightInfoRef" toRef="compareRightInfoRef" :compareMonth="compareMonth" :isProfitAndLossShow.sync="isProfitAndLossShow" @getBaseData="getBaseData"></compare-info></div>
      </div>
    </div>
    <!-- 浮动盈亏基础数据弹框 -->
    <el-dialog title="门店基础数据" :visible.sync="isProfitAndLossShow" width="600px" @close="isProfitAndLossShow = false" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店房租" prop="rentAmount"> <el-input-number v-model="addForm.rentAmount" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店工资" prop="salary"> <el-input-number v-model="addForm.salary" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="运营费用" prop="operationCost"> <el-input-number v-model="addForm.operationCost" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水电燃气费用" prop="utilityCosts"> <el-input-number v-model="addForm.utilityCosts" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer"> <el-button :loading="submitLoading" type="primary" @click="submitProfitAndLossInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDataString } from '@/filters/filters'
import { AllotGetUserDropDownList, queryProfitAndLoss, profitAndLossOperation } from '@/api/system'
import CompareInfo from './compare-info.vue'

export default {
  components: {
    CompareInfo
  },
  data() {
    return {
      filterParam: {
        month: getDataString(new Date(), 'yyyyMM'),
        queryCid: ''
      },
      compareMonth: '',
      shopList: [],
      profitLossList: [],
      addForm: {
        rentAmount: 0,
        salary: 0,
        operationCost: 0,
        utilityCosts: 0,
        floatingProfitAndLoss: 0,
        profitValue: 0,
        netProfit: 0
      },
      activeRef: '',
      addFormState: 0,
      listLoading: false,
      submitLoading: false,
      isProfitAndLossShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    isProfitAndLossShow(val) {
      if (!val) {
        this.addForm = {
          rentAmount: 0,
          salary: 0,
          operationCost: 0,
          utilityCosts: 0,
          floatingProfitAndLoss: 0,
          profitValue: 0,
          netProfit: 0
        }
        this.activeRef = ''
      }
    }
  },
  mounted() {
    this.getAllShop()
  },
  methods: {
    getAllShop() {
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      AllotGetUserDropDownList(params).then(res => {
        if (res.data && res.data.length > 0) {
          this.shopList = res.data
          this.compareMonth = this.filterParam.month
          this.queryProfitAndLoss('refresh')
        }
      })
    },
    queryProfitAndLoss(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        month: Number(this.filterParam.month),
        queryCid: this.filterParam.queryCid,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      queryProfitAndLoss(params)
        .then(res => {
          this.profitLossList = res.data.listData
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    getBaseData(val) {
      this.addFormState = val.action
      this.addForm = {
        ...this.addForm,
        month: Number(this.compareMonth),
        cid: val.queryCid
      }
      this.activeRef = val.type
    },
    handleProfitAndLossEdit(row) {
      this.addFormState = 1
      this.isProfitAndLossShow = true
      this.$nextTick(() => {
        let { rentAmount, salary, operationCost, utilityCosts, profitAndLoss, profitValue, netProfit, cid, _id } = row
        this.addForm = {
          rentAmount,
          salary,
          operationCost,
          utilityCosts,
          floatingProfitAndLoss: profitAndLoss,
          profitValue,
          netProfit,
          month: Number(this.filterParam.month),
          cid,
          _id
        }
      })
    },
    submitProfitAndLossInfo() {
      if (!this.addForm.month) {
        return this.$message.warning('请选择月份信息！')
      }
      if (!this.addForm.cid) {
        return this.$message.warning('请选择门店信息！')
      }
      let params = {
        dto: {
          ...this.addForm,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.addForm.cid
        },
        action: this.addFormState
      }
      // console.log(params)
      this.submitLoading = true
      profitAndLossOperation(params)
        .then(res => {
          this.submitLoading = false
          this.queryProfitAndLoss()
          this.$refs[this.activeRef].handleProfitLossSearch(JSON.parse(JSON.stringify(this.addForm.cid)))
          this.isProfitAndLossShow = false
          this.$message.success(res.msg)
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    searchCondition() {
      this.pageIndex = 1
      this.queryProfitAndLoss()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryProfitAndLoss()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.queryProfitAndLoss()
    }
  }
}
</script>

<style lang="scss" scoped>
.compare-container {
  .compare-title {
    display: flex;
    align-items: center;
    margin: 15px 0;
    font-size: 14px;
    .title {
      margin-right: 15px;
      font-size: 16px;
      font-weight: 700;
      color: #409eff;
    }
  }
  .compare-info {
    display: flex;
    .compare-info-left {
      flex: 1;
    }
    .compare-info-right {
      flex: 1;
    }
  }
}
</style>
