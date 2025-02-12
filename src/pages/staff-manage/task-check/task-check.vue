<template>
  <div class="container">
    <div v-if="containerIsShow">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="开闭店任务" name="1"><task-check-list ref="taskRef1" taskTitle="开闭店任务"></task-check-list></el-tab-pane>
        <el-tab-pane label="日清任务" name="2"><task-check-list ref="taskRef2" taskTitle="日清任务"></task-check-list></el-tab-pane>
        <el-tab-pane label="周清任务" name="3"><task-check-list ref="taskRef3" taskTitle="周清任务"></task-check-list></el-tab-pane>
        <el-tab-pane label="月清任务" name="4"><task-check-list ref="taskRef4" taskTitle="月清任务"></task-check-list></el-tab-pane>
        <el-tab-pane label="开店协同任务" name="5"><task-check-list ref="taskRef5" taskTitle="开店协同任务"></task-check-list></el-tab-pane>
      </el-tabs>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import TaskCheckList from './components/task-check-list.vue'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'task-check') {
        this.$nextTick(() => {
          this.handleClick()
        })
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    TaskCheckList
  },
  data() {
    return {
      activeName: '1',
      containerIsShow: true
    }
  },
  mounted() {
    this.$refs['taskRef1'].initData(parseInt(this.activeName))
  },
  methods: {
    handleClick() {
      this.$refs['taskRef' + parseInt(this.activeName)].initData(parseInt(this.activeName))
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>
