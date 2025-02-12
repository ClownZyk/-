<template>
  <div class="详情">
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动详情" name="first">
        <activity-detail></activity-detail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import activityDetail from './components/activity-detail'
export default {
  name: 'groupon-list',
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {activityDetail}
}
</script>

<style lang="scss" scoped>
</style>
