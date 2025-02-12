<template>
  <div class="vote-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-info></base-info>
      </el-tab-pane>
      <el-tab-pane label="投票项" name="second">
        <vote-item></vote-item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import voteItem from './components/vote-item'
export default {
  name: 'vote-detail',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    baseInfo,
    voteItem
  }
}
</script>

<style lang="scss" scoped>

</style>
