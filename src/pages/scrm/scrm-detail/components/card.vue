<template>
  <div class="order">
    <el-tabs tab-position="left" v-model="activeName">
      <el-tab-pane label="兑换券" name="first"><card-gift></card-gift></el-tab-pane>
      <el-tab-pane label="代金券" name="second">代金券</el-tab-pane>
      <el-tab-pane label="折扣劵" name="third">折扣劵</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CardGift from './card-gift'
  export default {
    data() {
      return {
        activeName: 'first'
      }
    },
    components: {CardGift}
  }
</script>
<style lang="scss" scoped>
  .order{
  }
</style>
