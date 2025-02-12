<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="详情" name="first"> <detail-msg></detail-msg> </el-tab-pane>
    <el-tab-pane label="领取记录" name="second"> <orders-list></orders-list> </el-tab-pane>
    <!-- <el-tab-pane label="核销记录" name="third"> <write-off-list></write-off-list></el-tab-pane> -->
  </el-tabs>
</template>
<script>
import detailMsg from './components/detail-msg'
import ordersList from './components/orders-list'
import writeOffList from './components/write-off-list'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
  },
  components: {
    detailMsg,
    ordersList,
    writeOffList
  }
}
</script>
<style lang="scss" scoped></style>
