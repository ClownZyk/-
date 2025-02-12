<template>
  <div class="page-container profit-loss-container">
    <div v-if="containerIsShow">
      <el-form class="filters" :model="filterParam" inline>
        <div class="filters-left">
          <el-form-item label="月份" prop="month">
            <el-date-picker v-model="filterParam.month" type="month" placeholder="选择月份" format="yyyyMM" value-format="yyyyMM" :clearable="false" @change="getProfitAndLoss"> </el-date-picker>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="getProfitAndLoss('refresh')">搜索</el-button> </el-form-item>
          <el-form-item v-if="!profitAndLossData"> <el-button type="warning" @click="handleProfitAndLossAdd" :disabled="!filterParam.month">添加基础数据</el-button> </el-form-item>
          <el-form-item v-else> <el-button type="warning" @click="handleProfitAndLossEdit(profitAndLossData)" :disabled="!filterParam.month">修改基础数据</el-button> </el-form-item>
        </div>
      </el-form>
      <div v-loading="listLoading" class="table-list">
        <div v-if="profitAndLossData">
          <div class="profit-loss-msg-info-item">
            <div class="msg-item">
              <div class="msg-icon">R</div>
              <div class="msg-info-main">
                <div class="msg-name">门店房租</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.rentAmount.toFixed(2)) }}</div>
              </div>
            </div>
            <div class="msg-item">
              <div class="msg-icon">S</div>
              <div class="msg-info-main">
                <div class="msg-name">门店工资</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.salary.toFixed(2)) }}</div>
              </div>
            </div>
            <div class="msg-item">
              <div class="msg-icon">O</div>
              <div class="msg-info-main">
                <div class="msg-name">运营费用</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.operationCost.toFixed(2)) }}</div>
              </div>
            </div>
            <div class="msg-item">
              <div class="msg-icon">U</div>
              <div class="msg-info-main">
                <div class="msg-name">水电燃气费用</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.utilityCosts.toFixed(2)) }}</div>
              </div>
            </div>
          </div>
          <div class="profit-loss-msg-info-item">
            <div class="msg-item">
              <div class="msg-icon">F</div>
              <div class="msg-info-main">
                <div class="msg-name">浮动盈亏值</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.profitAndLoss.toFixed(2)) }}</div>
              </div>
            </div>
            <div class="msg-item">
              <div class="msg-icon">P</div>
              <div class="msg-info-main">
                <div class="msg-name">盈值</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.profitValue.toFixed(2)) }}</div>
              </div>
            </div>
          </div>
          <div class="profit-loss-msg-info-item">
            <div class="msg-item">
              <div class="msg-icon">N</div>
              <div class="msg-info-main">
                <div class="msg-name">净毛利额</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.netProfit.toFixed(2)) }}</div>
              </div>
            </div>
            <div class="msg-item">
              <div class="msg-icon">P</div>
              <div class="msg-info-main">
                <div class="msg-name">实毛利率</div>
                <div class="msg-value">{{ parseFloat((profitAndLossData.profitRate * 100).toFixed(2)) }}%</div>
              </div>
            </div>
            <div class="msg-item">
              <div class="msg-icon">A</div>
              <div class="msg-info-main">
                <div class="msg-name">净销售额</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.accountTotal.toFixed(2)) }}</div>
              </div>
            </div>
            <div class="msg-item">
              <div class="msg-icon">R</div>
              <div class="msg-info-main">
                <div class="msg-name">零售差额</div>
                <div class="msg-value"><span>￥</span>{{ parseFloat(profitAndLossData.retailDiff.toFixed(2)) }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-else description="该门店暂未提交该月门店基础数据"></el-empty>
      </div>
      <!-- 浮动盈亏基础数据弹框 -->
      <el-dialog title="门店基础数据" :visible.sync="isProfitAndLossShow" width="600px" @close="isProfitAndLossShow = false" :close-on-click-modal="false">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
          <el-row>
            <el-col :span="12">
              <el-form-item label="月份" prop="dateTime">
                <el-date-picker v-model="addForm.dateTime" type="month" placeholder="选择月份" format="yyyyMM" value-format="yyyyMM" :clearable="false" style="width: 100%" :disabled="addFormState === 1"> </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
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
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { queryProfitAndLoss, profitAndLossOperation } from '@/api/system'
import { getDataString } from '@/filters/filters'

export default {
  data() {
    return {
      filterParam: {
        month: getDataString(new Date(), 'yyyyMM')
      },
      profitAndLossData: null,
      addForm: {
        dateTime: getDataString(new Date(), 'yyyyMM'),
        rentAmount: 0,
        salary: 0,
        operationCost: 0,
        utilityCosts: 0,
        floatingProfitAndLoss: 0,
        profitValue: 0,
        netProfit: 0
      },
      addFormState: 0,
      listLoading: false,
      submitLoading: false,
      containerIsShow: true,
      isProfitAndLossShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        dateTime: [{ required: true, message: '请选择月份', trigger: 'change' }]
      }
    }
  },
  filters: {
    formatTime(time) {
      let year = time.toString().substring(0, 4)
      let month = time.toString().substring(4, 6)
      let dataTimeLine = `${year}-${month}`
      return dataTimeLine
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'profit-loss') {
        this.getProfitAndLoss()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isProfitAndLossShow(val) {
      if (!val) {
        this.addForm = {
          dateTime: getDataString(new Date(), 'yyyyMM'),
          rentAmount: 0,
          salary: 0,
          operationCost: 0,
          utilityCosts: 0,
          floatingProfitAndLoss: 0,
          profitValue: 0,
          netProfit: 0
        }
      }
    }
  },
  mounted() {
    this.getProfitAndLoss()
  },
  methods: {
    getProfitAndLoss(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        month: Number(this.filterParam.month),
        queryCid: this.$store.state._cid,
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
      this.profitAndLossData = null
      queryProfitAndLoss(params)
        .then(res => {
          this.listLoading = false
          if (res.data && res.data.listData.length > 0) {
            this.profitAndLossData = res.data.listData[0]
          }
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleProfitAndLossAdd() {
      this.addFormState = 0
      this.isProfitAndLossShow = true
      this.addForm.dateTime = this.filterParam.month
    },
    handleProfitAndLossEdit(row) {
      this.addFormState = 1
      this.isProfitAndLossShow = true
      this.$nextTick(() => {
        let { rentAmount, salary, operationCost, utilityCosts, profitAndLoss, profitValue, netProfit, _id } = row
        this.addForm = {
          dateTime: this.filterParam.month,
          rentAmount,
          salary,
          operationCost,
          utilityCosts,
          floatingProfitAndLoss: profitAndLoss,
          profitValue,
          netProfit,
          _id
        }
      })
    },
    submitProfitAndLossInfo() {
      if (!this.addForm.dateTime) {
        return this.$message.warning('请选择月份信息！')
      }
      let params = {
        dto: {
          ...this.addForm,
          month: Number(this.addForm.dateTime),
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        action: this.addFormState
      }
      // console.log(params)
      this.submitLoading = true
      profitAndLossOperation(params)
        .then(res => {
          this.submitLoading = false
          this.isProfitAndLossShow = false
          this.$message.success(res.msg)
          this.getProfitAndLoss()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProfitAndLoss()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProfitAndLoss()
    }
  }
}
</script>

<style lang="scss" scoped>
.profit-loss-container {
  .table-list {
    .profit-loss-msg-info-item {
      display: flex;
      align-items: center;
      margin-left: -1.2%;
      .msg-item {
        flex: 0 0 13%;
        min-width: 280px;
        border: 1px solid #c7c7c7;
        padding: 15px;
        box-sizing: border-box;
        border-radius: 5px;
        margin-left: 1.2%;
        margin-bottom: 1.2%;
        display: flex;
        align-items: center;
        color: #409eff;
        .msg-icon {
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          color: #ffffff;
          background-color: #409eff;
          box-shadow: 0 0 5px #409eff;
          font-size: 22px;
          border-radius: 50%;
        }
        .msg-info-main {
          margin-left: 15px;
          div {
            line-height: 1.5;
            font-weight: bold;
          }
          .msg-name {
            font-size: 15px;
          }
          .msg-value {
            font-size: 22px;
          }
        }
      }
    }
  }
}
</style>
