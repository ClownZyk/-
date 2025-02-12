<template>
  <div>
    <el-button type="primary" @click="isDailyShow = true"  v-permission="['/daily-statement:update']">{{ $route.query.action === 1 ? '新增日结单' : '修改日结单' }}</el-button>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"><daily-msg ref="dailyMsgRef" :dateTime="dateTime" :feeData="feeForm" :costsalesTotal.sync="costsalesTotal"></daily-msg></el-tab-pane>
      <!-- <el-tab-pane label="餐食饮品货损信息" name="second"><cargo-damage ref="damageRef" :dateTime="dateTime" :foodDamage.sync="feeForm.foodDamage" :drinkDamage.sync="feeForm.drinkDamage"></cargo-damage></el-tab-pane> -->
    </el-tabs>
    <!-- 日结单提交弹框 -->
    <el-dialog title="日结单信息" :visible.sync="isDailyShow" width="800px" @close="isDailyShow = false" :close-on-click-modal="false">
      <el-form ref="feeFormRef" :model="feeForm" :rules="feeFormRules" label-position="top">
        <el-row v-if="$route.query.action === 1">
          <el-col :span="12">
            <el-form-item label="日期">
              <el-date-picker type="date" v-model="dateTime" placeholder="选择日期" format="yyyy/MM/dd" value-format="yyyy/MM/dd" @change="selectTime" :clearable="false" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="电费" prop="dianfei"> <el-input-number v-model="feeForm.dianfei" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物业费" prop="wuyefei"> <el-input-number v-model="feeForm.wuyefei" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="房租" prop="fangzu"> <el-input-number v-model="feeForm.fangzu" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="水费" prop="shuifei"> <el-input-number v-model="feeForm.shuifei" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="网费" prop="wangfei"> <el-input-number v-model="feeForm.wangfei" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="零售货损" prop="cargoDamage"> <el-input-number v-model="feeForm.cargoDamage" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%" disabled></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="餐食货损" prop="foodDamage"> <el-input-number v-model="feeForm.foodDamage" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%" disabled></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="饮品货损" prop="drinkDamage"> <el-input-number v-model="feeForm.drinkDamage" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%" disabled></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="其他进货成本(快驴)" prop="otherCosts"> <el-input-number v-model="feeForm.otherCosts" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="其他支出总额" prop="othersCostTotal"> <el-input-number v-model="feeForm.othersCostTotal" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="保证金余额" prop="depositBalance"> <el-input-number v-model="feeForm.depositBalance" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%" disabled></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="当前货物总值" prop="stockValue"> <el-input-number v-model="feeForm.stockValue" :controls="false" :min="0" :step="0.01" step-strictly style="width: 100%" disabled></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="其他支出备注" prop="othersCostTotalRemark"> <el-input type="textarea" v-model="feeForm.othersCostTotalRemark" :rows="2" placeholder="请输入其他支出备注"></el-input> </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitDailyInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import dailyMsg from './component/daily-msg'
import cargoDamage from './component/cargo-damage'
import { GetDailyPayReportData, GetProductValue, GetSupplierOrderMoney, GetProductCostMoney, DailyPayReport, getLossRecord } from '@/api/system'
import { formatDate } from '@/components/js/data'

export default {
  components: {
    dailyMsg,
    cargoDamage
  },
  data() {
    return {
      dateTime: formatDate(new Date(), 'yyyy/MM/dd'),
      activeName: 'first',
      feeForm: {
        purchaseCostTotal: 0, // 采购成本
        costPriceTotal: 0, // 销售成本
        dianfei: 0,
        wuyefei: 0,
        fangzu: 0,
        shuifei: 0,
        wangfei: 0,
        otherCosts: 0,
        cargoDamage: 0,
        foodDamage: 0,
        drinkDamage: 0,
        othersCostTotal: 0,
        othersCostTotalRemark: ''
      },
      costsalesTotal: 0, // 当日销售额
      isDailyShow: false,
      submitLoading: false,
      feeFormRules: {
        dianfei: [{ required: true, message: '请输入电费', trigger: 'blur' }],
        wuyefei: [{ required: true, message: '请输入物业费', trigger: 'blur' }],
        fangzu: [{ required: true, message: '请输入房租', trigger: 'blur' }],
        shuifei: [{ required: true, message: '请输入水费', trigger: 'blur' }],
        wangfei: [{ required: true, message: '请输入网费', trigger: 'blur' }],
        cargoDamage: [{ required: true, message: '请输入零售货损', trigger: 'blur' }],
        foodDamage: [{ required: true, message: '请输入餐食货损', trigger: 'blur' }],
        drinkDamage: [{ required: true, message: '请输入饮品货损', trigger: 'blur' }],
        depositBalance: [{ required: true, message: '请输入保证金余额', trigger: 'blur' }],
        stockValue: [{ required: true, message: '请输入货物总值', trigger: 'blur' }],
        otherCosts: [{ required: true, message: '请输入其他进货成本', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (this.$route.query.action === 2) {
      // 编辑，查看
      this.getDailyDetail()
    } else {
      // 新增
     this.initAddData()
    }
  },
  methods: {
    initAddData() {
       // 获取每日货值
      this.getDailyProductVal()
      // 获取采购成本
      this.getPurchaseCost()
      // 获取销售成本
      this.getSalesCost()
      // 获取盘库亏损数据
      this.getProductLossRecord()
    },
    getDailyProductVal() {
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetProductValue(params).then(
        res => {
          this.feeForm.stockValue = res.data
          this.feeForm.depositBalance = Math.round((100000 - res.data) * 100) / 100
        }
      )
    },
    getPurchaseCost() {
      let params = {
        date: this.dateTime,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetSupplierOrderMoney(params).then(
        res => {
          this.feeForm.purchaseCostTotal = res.data
        }
      )
    },
    getSalesCost() {
      let params = {
        date: this.dateTime.replace(/\//g, ''),
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetProductCostMoney(params).then(
        res => {
          this.feeForm.costPriceTotal = res.data
        }
      )
    },
    getProductLossRecord() {
      let params = {
        cid: this.$store.state._cid,
        dt: this.dateTime
      }
      getLossRecord(params).then(res => {
        let {retailsLoss, rawFoodLoss, rawDrinkLoss} = res.data
        this.feeForm.cargoDamage = retailsLoss
        this.feeForm.foodDamage = rawFoodLoss
        this.feeForm.drinkDamage = rawDrinkLoss
      })
    },
    getDailyDetail() {
      let params = {
        id: this.$route.query.id,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
       GetDailyPayReportData(params).then(res => {
          this.feeForm = res.data
          this.dateTime = this.dateTimeFormat(res.data.date)
       })
    },
    submitDailyInfo() {
      this.$refs['feeFormRef'].validate((valid) => {
        if (valid) {
          let params = {
            type: this.$route.query.action,
            date: Number(this.dateTime.replace(/\//g, '')),
            ...this.feeForm,
            grossProfit: Math.round((this.feeForm.costPriceTotal - this.costsalesTotal) * 100) / 100,
            id: this.$route.query.action === 1 ? '' : this.feeForm._id,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          // console.log(params)
          this.submitLoading = true
          DailyPayReport(params).then(
            res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          ).catch(() => {
              this.submitLoading = false
          })
        }
      })
    },
    selectTime(val) {
      this.dateTime = val
      this.initAddData()
      this.$refs['dailyMsgRef'].initData()
      // this.$refs['damageRef'].getFoodDrinkDamage()
    },
    dateTimeFormat(time) {
      let year = time.toString().substring(0, 4)
      let month = time.toString().substring(4, 6)
      let day = time.toString().substring(6)
      return `${year}/${month}/${day}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
