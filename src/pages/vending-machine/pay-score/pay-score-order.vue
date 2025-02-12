<template>
  <div v-if="containerIsShow">
    <div v-if="$route.query.orderId" class="gem-back-header"><el-page-header @back="$router.back()" content="支付信息"> </el-page-header></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="微信支付分订单" name="first"><wx-pay-order ref="wxPayScoreRef"></wx-pay-order></el-tab-pane>
      <el-tab-pane label="支付宝支付分订单" name="second"><ali-pay-order ref="aliPayScoreRef"></ali-pay-order></el-tab-pane>
      <el-tab-pane v-if="$route.query.orderId" label="异常订单" name="third"><abnormal-order ref="abnormalOrderRef"></abnormal-order></el-tab-pane>
    </el-tabs>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import WxPayOrder from './wx-pay-score/wx-pay-order.vue'
import AliPayOrder from './ali-pay-score/ali-pay-order.vue'
import AbnormalOrder from '../abnormal-order/abnormal-vending-order.vue'
export default {
  components: {
    WxPayOrder,
    AliPayOrder,
    AbnormalOrder
  },
  watch: {
    $route(to, from) {
      if (to.name === 'pay-score-order') {
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      containerIsShow: true
    }
  },
  mounted() {
    if (this.$route.query.orderId) {
      if (this.$route.query.orderId.startsWith('ZJ')) {
        this.activeName = 'first'
      } else if (this.$route.query.orderId.startsWith('ZFB')) {
        this.activeName = 'second'
      }
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'first') {
        this.$refs['wxPayScoreRef'].getWxPayScoreOrderList()
      } else if (this.activeName === 'second') {
        this.$refs['aliPayScoreRef'].getAliPayScoreOrderList()
      } else if (this.activeName === 'third') {
        this.$refs['abnormalOrderRef'].getOrderList()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
