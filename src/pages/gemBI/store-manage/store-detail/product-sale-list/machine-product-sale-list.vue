<template>
  <div class="product-list">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="`${$route.query.companyName}-售卖柜销售统计`"> </el-page-header></div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="产品有销售记录统计" name="first"><have-product-sale></have-product-sale></el-tab-pane>
      <el-tab-pane label="产品无销售记录统计" name="second"><not-have-product-sale></not-have-product-sale></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HaveProductSale from './components/have-product-sale.vue'
import NotHaveProductSale from './components/not-have-product-sale.vue'

export default {
  components: {
    HaveProductSale,
    NotHaveProductSale
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
.product-list {
  height: 100vh;
}
</style>
