<template>
  <div>
    <el-form size="small" :model="compareForm" inline>
      <el-form-item label="门店" prop="queryCid">
        <el-select v-model="compareForm.queryCid" placeholder="请选择门店" clearable @clear="handleQueryCidClear"> <el-option v-for="(item, index) in shopList" :key="index" :label="item.label" :value="item.value"> </el-option> </el-select
      ></el-form-item>
      <el-form-item> <el-button type="primary" :disabled="!compareForm.queryCid" @click="handleProfitLossSearch(null)">搜索</el-button> </el-form-item>
      <el-form-item v-if="isShopDataAddShow"> <el-button type="warning" @click="handleProfitLossAdd()">添加门店基础数据</el-button> </el-form-item>
    </el-form>
    <div v-loading="listLoading" class="profit-loss-msg-info">
      <div v-if="compareData" class="profit-loss-msg-info-item">
        <div class="msg-item">
          <div class="msg-icon">F</div>
          <div class="msg-info-main">
            <div class="msg-name">浮动盈亏值</div>
            <div class="msg-value"><span>￥</span>{{ parseFloat(compareData.profitAndLoss.toFixed(2)) }}</div>
          </div>
        </div>
        <div class="msg-item">
          <div class="msg-icon">P</div>
          <div class="msg-info-main">
            <div class="msg-name">盈值</div>
            <div class="msg-value"><span>￥</span>{{ parseFloat(compareData.profitValue.toFixed(2)) }}</div>
          </div>
        </div>
        <div class="msg-item">
          <div class="msg-icon">N</div>
          <div class="msg-info-main">
            <div class="msg-name">净毛利额</div>
            <div class="msg-value"><span>￥</span>{{ parseFloat(compareData.netProfit.toFixed(2)) }}</div>
          </div>
        </div>
        <div class="msg-item">
          <div class="msg-icon">P</div>
          <div class="msg-info-main">
            <div class="msg-name">实毛利率</div>
            <div class="msg-value">{{ parseFloat((compareData.profitRate * 100).toFixed(2)) }}%</div>
          </div>
        </div>
        <div class="msg-item">
          <div class="msg-icon">A</div>
          <div class="msg-info-main">
            <div class="msg-name">净销售额</div>
            <div class="msg-value"><span>￥</span>{{ parseFloat(compareData.accountTotal.toFixed(2)) }}</div>
          </div>
        </div>
        <div class="msg-item">
          <div class="msg-icon">R</div>
          <div class="msg-info-main">
            <div class="msg-name">零售差额</div>
            <div class="msg-value"><span>￥</span>{{ parseFloat(compareData.retailDiff.toFixed(2)) }}</div>
          </div>
        </div>
      </div>
      <el-empty v-if="compareForm.queryCid && !compareData" description="该门店暂未提交该月门店基础数据"></el-empty>
      <el-empty v-if="!compareForm.queryCid" description="暂无数据，请选择门店进行数据获取"></el-empty>
    </div>
  </div>
</template>

<script>
import { AllotGetUserDropDownList, queryProfitAndLoss } from '@/api/system'
export default {
  props: {
    toRef: {
      type: String,
      default: 'compareLeftInfoRef'
    },
    compareMonth: {
      type: String,
      default: ''
    },
    isProfitAndLossShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shopList: [],
      compareForm: {
        queryCid: ''
      },
      compareData: null,
      listLoading: false,
      isShopDataAddShow: false
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
        }
      })
    },
    handleProfitLossSearch(queryCid) {
      this.compareData = null
      let params = {
        month: Number(this.compareMonth),
        queryCid: queryCid || this.compareForm.queryCid,
        pageIndex: 1,
        pageSize: 10,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      queryProfitAndLoss(params)
        .then(res => {
          if (res.data.listData && res.data.listData.length > 0) {
            this.compareData = res.data.listData[0]
            this.isShopDataAddShow = false
          } else {
            this.isShopDataAddShow = true
          }
          this.listLoading = false
        })
        .catch(() => {
          this.isShopDataAddShow = true
          this.listLoading = false
        })
    },
    handleQueryCidClear() {
      this.compareData = null
      this.isShopDataAddShow = false
    },
    handleProfitLossAdd() {
      this.$emit('update:isProfitAndLossShow', true)
      this.$emit('getBaseData', { type: this.toRef, queryCid: this.compareForm.queryCid, action: 0 })
    }
  }
}
</script>

<style lang="scss" scoped>
.profit-loss-msg-info {
  .profit-loss-msg-info-item {
    .msg-item {
      width: 50%;
      border: 1px solid #c7c7c7;
      padding: 15px;
      box-sizing: border-box;
      border-radius: 5px;
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
</style>
