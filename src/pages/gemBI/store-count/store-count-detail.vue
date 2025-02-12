<template>
  <div class="store-count-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="商品订单" name="first"><shop-orders></shop-orders></el-tab-pane>
      <el-tab-pane label="餐食订单" name="second"><meal-orders></meal-orders></el-tab-pane>
      <el-tab-pane label="VIP购买订单" name="third"><vip-orders></vip-orders></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ShopOrders from './components/shop-orders.vue'
import MealOrders from './components/meal-orders.vue'
import VipOrders from './components/vip-orders.vue'

export default {
  components: {
    ShopOrders,
    MealOrders,
    VipOrders
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped></style>
