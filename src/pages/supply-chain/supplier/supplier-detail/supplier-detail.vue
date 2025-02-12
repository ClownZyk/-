<template>
  <div class="supply-supplier-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-info></base-info>
      </el-tab-pane>
      <el-tab-pane label="产品信息" name="second" v-if="$route.query.id">
        <product></product>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="third" v-if="$route.query.id">
        <order></order>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import product from './components/product'
import order from './components/order'
export default {
  name: 'supply-supplier-detail',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    baseInfo,
    product,
    order
  }
}
</script>

<style lang="scss" scoped>

</style>
