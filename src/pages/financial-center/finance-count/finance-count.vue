<template>
  <div class="contains">
    <el-tabs v-model="activeName">
      <el-tab-pane label="零售产品" name="first"><retail-count></retail-count></el-tab-pane>
      <el-tab-pane label="餐食产品" name="second"><meals-count></meals-count></el-tab-pane>
      <el-tab-pane label="饮品产品" name="third"><drink-count></drink-count></el-tab-pane>
      <el-tab-pane label="售卖机产品" name="fourth"><vending-count></vending-count></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RetailCount from './components/retail-count.vue'
import MealsCount from './components/meals-count.vue'
import DrinkCount from './components/drink-count.vue'
import VendingCount from './components/vending-count.vue'

export default {
  components: {
    RetailCount,
    MealsCount,
    DrinkCount,
    VendingCount
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
.contains {
  padding: 15px;
}
</style>
