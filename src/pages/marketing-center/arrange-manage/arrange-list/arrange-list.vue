<template>
<el-tabs v-model="activeName">
    <el-tab-pane label="排单信息" name="first">
      <time-arrange></time-arrange>
    </el-tab-pane>
    <el-tab-pane label="商品列表" name="second">
      <product-list></product-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script type="text/ecmascript-6">
import timeArrange from './components/time-arrange'
import productList from './components/product-list'
export default {
  name: 'arrange-list',
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {
    timeArrange,
    productList
  }
}
</script>

<style lang="scss" scoped>
</style>
