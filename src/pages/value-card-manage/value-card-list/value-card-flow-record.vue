<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="流水详情"> </el-page-header></div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="充值记录" name="first"><recharge-record></recharge-record></el-tab-pane>
      <el-tab-pane label="消费记录" name="second"><consume-record></consume-record></el-tab-pane>
      <el-tab-pane label="记账记录" name="third"><account-record></account-record></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RechargeRecord from './components/recharge-record.vue'
import ConsumeRecord from './components/consume-record.vue'
import AccountRecord from './components/account-record.vue'

export default {
  components: {
    RechargeRecord,
    ConsumeRecord,
    AccountRecord
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped></style>
