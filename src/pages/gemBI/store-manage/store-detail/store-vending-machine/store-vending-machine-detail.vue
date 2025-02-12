<template>
  <div class="data-container">
    <div class="go-back"><el-page-header @back="$router.back()" content="售卖机详情"> </el-page-header></div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="绑定产品" name="first"><bind-prod></bind-prod></el-tab-pane>
      <el-tab-pane label="补货记录" name="second"><stock-record></stock-record></el-tab-pane>
      <el-tab-pane label="订单列表" name="third"><prod-order></prod-order></el-tab-pane>
      <el-tab-pane label="异常订单" name="fourth"><abnormal-order></abnormal-order></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BindProd from './components/bind-prod.vue'
import StockRecord from './components/stock-record.vue'
import ProdOrder from './components/prod-order.vue'
import AbnormalOrder from './components/abnormal-order.vue'

export default {
  components: {
    BindProd,
    StockRecord,
    ProdOrder,
    AbnormalOrder
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.data-container {
  height: 100vh;
  .go-back {
    margin-bottom: 15px;
  }
}
/deep/ .el-tabs {
  .el-tabs__content {
    .el-tab-pane {
      height: 100% !important;
    }
  }
}
</style>
