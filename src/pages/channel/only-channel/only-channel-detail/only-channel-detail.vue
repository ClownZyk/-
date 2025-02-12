<template>
  <div class="only-channel-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-info></base-info>
      </el-tab-pane>
      <el-tab-pane label="分润记录" name="second">
        <benefit></benefit>
      </el-tab-pane>
      <el-tab-pane label="提现记录" name="third">
        <withdraw></withdraw>
      </el-tab-pane>
      <el-tab-pane label="用户列表" name="four">
        <users></users>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import benefit from './components/benefit'
import withdraw from './components/withdraw'
import users from './components/users'
export default {
  name: 'only-channel-detail',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    baseInfo,
    benefit,
    withdraw,
    users
  }
}
</script>

<style lang="scss" scoped>

</style>
