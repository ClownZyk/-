<template>
  <div class="page-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="易联云打印配置" name="first"><yilianyun-print></yilianyun-print></el-tab-pane>
      <el-tab-pane label="芯烨云标签打印配置" name="second"><xinyeyun-print></xinyeyun-print></el-tab-pane>
      <el-tab-pane label="飞鹅标签打印配置" name="third"><feie-print></feie-print></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import YilianyunPrint from './components/yilianyun-print.vue'
import XinyeyunPrint from './components/xinyeyun-print.vue'
import FeiePrint from './components/feie-print.vue'

export default {
  components: {
    YilianyunPrint,
    XinyeyunPrint,
    FeiePrint
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped></style>
