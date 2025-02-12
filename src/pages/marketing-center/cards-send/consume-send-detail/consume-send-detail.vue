<template>
<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="详情" name="first">
      <detail-msg></detail-msg>
    </el-tab-pane>
    <el-tab-pane label="订单列表" name="second">
      <orders-list></orders-list>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import detailMsg from './components/detail-msg'
import ordersList from './components/orders-list'
  export default {
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      }
    },
    components: {
      detailMsg, ordersList
    }
  }
</script>
<style lang="scss" scoped>

</style>
