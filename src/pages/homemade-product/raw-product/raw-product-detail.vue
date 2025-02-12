<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"><base-info></base-info></el-tab-pane>
      <el-tab-pane label="销售批次" name="second"><sale-batch></sale-batch></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseInfo from './components/base-info.vue'
import SaleBatch from './components/sale-batch.vue'

export default {
  components: {
    BaseInfo,
    SaleBatch
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped></style>
