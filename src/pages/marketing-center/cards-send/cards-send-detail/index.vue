<template>
  <div class="detail-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="内容详情" name="first"> <send-detail></send-detail> </el-tab-pane>
      <el-tab-pane label="领取记录" name="second"> <record-list></record-list> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import sendDetail from './components/send-detail'
import recordList from './components/record-list'
export default {
  name: 'cards-send-detail',
  components: {
    sendDetail,
    recordList
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped></style>
