<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"><base-info></base-info></el-tab-pane>
      <!-- <el-tab-pane v-if="loginData.attribute === 4" label="基本信息" name="first"><ly-base-info></ly-base-info></el-tab-pane> -->
      <el-tab-pane v-if="$route.query.id" label="销售批次" name="second"><sale-batch></sale-batch></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseInfo from './components/base-info.vue'
import LyBaseInfo from './components/ly-base-info.vue'
import SaleBatch from './components/sale-batch.vue'
import { mapState } from 'vuex'

export default {
  components: {
    BaseInfo,
    LyBaseInfo,
    SaleBatch
  },
  computed: {
    ...mapState(['loginData'])
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped></style>
