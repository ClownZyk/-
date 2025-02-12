<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动详情" name="first"><activity-info></activity-info></el-tab-pane>
      <el-tab-pane label="领取详情" name="second" v-if="this.$route.query.id"><card-receive></card-receive></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ActivityInfo from './components/activity-info.vue'
import CardReceive from './components/card-receive.vue'

export default {
  components: {
    ActivityInfo,
    CardReceive
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped></style>
