<template>
  <div v-loading="listLoading">
    <!-- 每日原始数据信息 -->
    <div class="daily-msg-top dispaly-di">
      <div class="top-item" v-for="(item, index) in saleslist" :key="index">
        <div class="icon">{{ item.en }}</div>
        <div class="top-txt theme-color">
          <div class="top-txt-title">{{ item.title }}</div>
          <div class="top-txt-data"><span v-if="index !== 0">￥</span> {{ item.price }}</div>
        </div>
      </div>
    </div>
    <!-- 当日支付方式统计 -->
    <div>
      <div class="daily-title">
        <div class="title-left">
          <div class="title-left-c">当日支付方式统计</div>
          <div class="title-left-e">Sales volume</div>
        </div>
        <div class="title-right">
          <div class="title-right-item">日期：{{ dateTime }}</div>
        </div>
      </div>
      <el-table class="tables" :data="payStateList" border show-summary>
        <el-table-column align="center" prop="payType" label="支付方式" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="count" label="交易笔数" sortable min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="retailTotal" label="零售额" sortable min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="memberDiscountTotal" label="会员优惠" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="moling" label="抹零优惠额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="zhengdandazhe" label="整单折扣额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="zhengdanyouhui" label="整单优惠额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="promotionTotal" label="其他营销活动优惠" min-width="170" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="onePromotionTotal" label="单品折扣优惠" min-width="160" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payTotal" label="实付金额" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="feeTotal" label="手续费" min-width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="accountTotal" label="实际到账" min-width="110" sortable show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 当日收入来源统计 -->
    <div>
      <div class="daily-title">
        <div class="title-left">
          <div class="title-left-c">当日收入来源统计</div>
          <div class="title-left-e">Pay Sales</div>
        </div>
        <div class="title-right">
          <div class="title-right-item">日期：{{ dateTime }}</div>
        </div>
      </div>
      <el-table class="tables" :data="paySourceList" border show-summary>
        <el-table-column align="center" prop="source" label="收入来源" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payType" label="支付方式" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="count" label="交易笔数" sortable min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="retailTotal" label="零售额" sortable min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payTotal" label="实付金额" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="accountTotal" label="实际到账" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="feeTotal" label="手续费" min-width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="memberDiscountTotal" label="会员优惠" min-width="110" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="moling" label="抹零优惠额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="zhengdandazhe" label="整单折扣额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="zhengdanyouhui" label="整单优惠额" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="promotionTotal" label="其他营销活动优惠" min-width="170" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="onePromotionTotal" label="单品折扣优惠" min-width="160" sortable show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 其他支出 -->
    <div v-if="$route.query.action === 2">
      <div class="daily-title">
        <div class="title-left">
          <div class="title-left-c">其他支出</div>
          <div class="title-left-e">expenditure</div>
        </div>
        <div class="title-right">
          <div class="title-right-item">当日总支出：{{ allOtherTotal }}</div>
        </div>
      </div>
      <div class="pay-list">
        <div class="pay-item">
          <i class="iconfont icon-tupian"></i>
          <div class="pay-item-txt">
            <div class="pay-item-tilte">电费</div>
            <div class="pay-item-total">{{ feeData.dianfei }}元</div>
          </div>
        </div>
        <div class="pay-item">
          <i class="iconfont icon-tupian"></i>
          <div class="pay-item-txt">
            <div class="pay-item-tilte">物业</div>
            <div class="pay-item-total">{{ feeData.wuyefei }}元</div>
          </div>
        </div>
        <div class="pay-item">
          <i class="iconfont icon-tupian"></i>
          <div class="pay-item-txt">
            <div class="pay-item-tilte">房租</div>
            <div class="pay-item-total">{{ feeData.fangzu }}元</div>
          </div>
        </div>
        <div class="pay-item">
          <i class="iconfont icon-tupian"></i>
          <div class="pay-item-txt">
            <div class="pay-item-tilte">水费</div>
            <div class="pay-item-total">{{ feeData.shuifei }}元</div>
          </div>
        </div>
        <div class="pay-item">
          <i class="iconfont icon-tupian"></i>
          <div class="pay-item-txt">
            <div class="pay-item-tilte">网费</div>
            <div class="pay-item-total">{{ feeData.wangfei }}元</div>
          </div>
        </div>
        <div class="pay-item">
          <i class="iconfont icon-tupian"></i>
          <div class="pay-item-txt">
            <div class="pay-item-tilte">其他</div>
            <div class="pay-item-total">{{ feeData.othersCostTotal }}元</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetDailyPayReportOriginData, GetVIPFoodChargeMoney, GetDailyPayReportOriginDataNoSum, GetDailyPaySummaryBySourceDataNoSum } from '@/api/system'

export default {
  props: {
    dateTime: {
      type: String,
      default: ''
    },
    feeData: {
      type: Object,
      default() {
        return {}
      }
    },
    costsalesTotal: {
      type: Number,
      default: 0
    }
  },
  computed: {
    allOtherTotal() {
      if (this.feeData && JSON.stringify(this.feeData) !== '{}') {
        return parseFloat((this.feeData.othersCostTotal + this.feeData.dianfei + this.feeData.wuyefei + this.feeData.fangzu + this.feeData.shuifei + this.feeData.wangfei).toFixed(2))
      } else {
        return 0
      }
    }
  },
  data() {
    return {
      date: '',
      saleslist: [],
      payStateList: [],
      paySourceList: [],
      listLoading: false
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      // 根据日期查询每日结算原始数据
      this.getDailyOriData()
      // 获取每日支付方式统计
      this.getDailyPayStateData()
      // 获取每日各种支付来源金额
      this.getDailyPaySourceData()
    },
    getDailyOriData() {
      let params = {
        date: this.$route.query.action === 1 ? this.dateFormatToNone(this.dateTime) : this.$route.query.time,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid || this.$store.state._cid
      }
      this.listLoading = true
      GetDailyPayReportOriginData(params).then(res => {
        this.$emit('update:costsalesTotal', res.data.payTotal)
        this.retailTotal = res.data.retailTotal
        this.saleslist = [
          { en: 'C', title: '订单数', price: res.data.count },
          { en: 'R', title: '零售总额', price: res.data.retailTotal },
          { en: 'M', title: '抹零优惠额', price: res.data.moling },
          { en: 'D', title: '整单折扣额', price: res.data.zhengdandazhe },
          { en: 'Y', title: '整单优惠额', price: res.data.zhengdanyouhui },
          { en: 'M', title: '会员折扣总额', price: res.data.memberDiscountTotal },
          { en: 'C', title: '卡劵折扣额', price: res.data.cardTotal },
          { en: 'P', title: '其他营销优惠', price: parseFloat((res.data.promotionTotal + res.data.onePromotionTotal).toFixed(2)) },
          { en: 'V', title: '实付金额', price: res.data.payTotal },
          { en: 'F', title: '手续费', price: res.data.feeTotal },
          { en: 'A', title: '实际到账', price: res.data.accountTotal }
        ]
        // 根据日期查询餐食和VIP购买和充值余额金额
        this.getDailyVIPFoodChargeData()
      })
    },
    getDailyVIPFoodChargeData() {
      let params = {
        date: this.$route.query.action === 1 ? this.dateTime : this.dateFormatToLine(this.$route.query.time),
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid || this.$store.state._cid
      }
      GetVIPFoodChargeMoney(params)
        .then(res => {
          this.listLoading = false
          this.saleslist = [
            ...this.saleslist,
            // { en: 'F', title: '餐食总额', price: res.data.foodmoney },
            // { en: 'F', title: '餐食手续费', price: res.data.foodFee },
            { en: 'V', title: 'Vip购买总额', price: res.data.vipmoney },
            { en: 'V', title: 'Vip购买手续费', price: res.data.vipFee },
            { en: 'C', title: '充值总额', price: res.data.chargeMoney },
            { en: 'C', title: '充值手续费', price: res.data.chargeFee },
            { en: 'G', title: '当日进货成本', price: this.feeData.purchaseCostTotal },
            { en: 'S', title: '当日销售成本', price: this.feeData.costPriceTotal },
            { en: 'S', title: '其他进货成本(快驴)', price: this.feeData.otherCosts },
            { en: 'G', title: '当日毛利', price: Math.round((this.retailTotal - this.feeData.costPriceTotal) * 100) / 100 }
          ]
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    getDailyPayStateData() {
      let params = {
        date: this.$route.query.action === 1 ? this.dateFormatToNone(this.dateTime) : this.$route.query.time,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid || this.$store.state._cid
      }
      GetDailyPayReportOriginDataNoSum(params).then(res => {
        this.payStateList = res.data
      })
    },
    getDailyPaySourceData() {
      let params = {
        date: this.$route.query.action === 1 ? this.dateFormatToNone(this.dateTime) : this.$route.query.time,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid || this.$store.state._cid
      }
      GetDailyPaySummaryBySourceDataNoSum(params).then(res => {
        this.paySourceList = res.data
      })
    },
    dateFormatToLine(time) {
      let year = time.toString().substring(0, 4)
      let month = time.toString().substring(4, 6)
      let day = time.toString().substring(6)
      return `${year}/${month}/${day}`
    },
    dateFormatToNone(time) {
      return time.replace(/\//g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.daily-msg-top {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  margin-top: 10px;
  .top-item {
    flex: 0 0 13%;
    min-width: 218px;
    border: 1px solid #c7c7c7;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 5px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    .icon {
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      background-color: #409eff;
      box-shadow: 0 0 5px #409eff;
      font-size: 22px;
      /*font-weight: bold;*/
      border-radius: 50%;
    }
    .top-txt {
      margin-left: 15px;
      div {
        line-height: 1.5;
        font-weight: bold;
      }
      .top-txt-title {
        font-size: 15px;
      }
      .top-txt-data {
        font-size: 22px;
      }
    }
  }
}

.dispaly-di {
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-left: -1.2%;
  .top-item {
    margin-bottom: 10px;
    margin-left: 1.2%;
  }
}
.daily-title {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  margin-top: 30px;
  .title-left {
    display: flex;
    display: -webkit-flex;
    align-items: flex-end;
    color: #409eff;
    .title-left-c {
      padding-right: 10px;
      font-size: 18px;
      font-weight: bold;
      border-right: 1px solid #409eff;
    }
    .title-left-e {
      margin-left: 10px;
      text-transform: uppercase;
      font-size: 14px;
    }
  }
  .title-right {
    display: flex;
    display: -webkit-flex;
    .title-right-item {
      margin-left: 15px;
      color: #409eff;
      font-weight: bold;
    }
  }
}
.tables {
  margin-top: 10px;
}
.pay-list {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  margin-left: -15px;
  .pay-item {
    flex: 0 0 200px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    display: -webkit-flex;
    align-items: center;
    color: #ffffff;
    height: 84px;
    background-color: #bebebe;
    /*padding: 15px 0;*/
    justify-content: space-around;
    margin-left: 15px;
    margin-top: 10px;
    border-radius: 5px;
    .iconfont {
      font-size: 40px;
    }
    .pay-item-txt {
      font-size: 18px;
      div {
        line-height: 1.5;
      }
    }
  }
  .add-pay {
    flex: 0 0 200px;
    color: #409eff;
    text-align: center;
    height: 84px;
    line-height: 84px;
    border: 2px dashed rgba(64, 158, 255, 0.4);
    justify-content: space-around;
    margin-left: 15px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    &:hover {
      background-color: rgba(64, 158, 255, 0.4);
      color: #ffffff;
      cursor: pointer;
      border: transparent;
    }
  }
}

.msg-dialog-row {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  .el-form-item {
    .form-item-input {
      width: 160px;
    }
    &:not(:first-child) {
      margin-left: 10px;
    }
    .form-item-textarea {
      width: 200px;
    }
  }
}
</style>
