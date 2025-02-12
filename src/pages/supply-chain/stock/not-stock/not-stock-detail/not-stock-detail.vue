<template>
  <div class="supply-not-stock-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="采购单信息" name="first">
        <base-info></base-info>
      </el-tab-pane>
      <el-tab-pane label="产品信息" name="second" v-if="this.$route.query.id">
        <product></product>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import product from './components/product'
export default {
  name: 'supply-not-stock-detail',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    baseInfo,
    product
  }
}
</script>

<style lang="scss" scoped>

</style>
