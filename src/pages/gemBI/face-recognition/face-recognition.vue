<template>
  <div class="face">
    <el-tabs v-model="activeName">
      <el-tab-pane label="图表统计" name="first">
        <face-chart></face-chart>
      </el-tab-pane>
      <el-tab-pane label="采集库" name="second">
        <face-list></face-list>
      </el-tab-pane>
      <el-tab-pane label="记录库" name="third">
        <record-list></record-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import FaceChart from '../face-chart/face-chart'
  import faceList from '../face-recognition/components/face-list'
  import RecordList from '../face-recognition/components/record-list'
  export default {
    components: {RecordList, FaceChart, faceList},
    data() {
      return {
        activeName: 'first'
      }
    }
  }
</script>

<style scoped>
  .face{
    padding: 15px;
    padding-top: 0;
  }
</style>
