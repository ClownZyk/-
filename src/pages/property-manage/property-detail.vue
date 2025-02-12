<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="`${$route.query.id ? $route.query.propertyName + '--' : ''}${$route.meta.name}`"> </el-page-header></div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="资产信息" name="first"><property-info></property-info></el-tab-pane>
      <el-tab-pane label="转移记录" name="second" v-if="$route.query.id"><transfer-record></transfer-record></el-tab-pane>
      <el-tab-pane label="维修记录" name="third" v-if="$route.query.id"><repair-record></repair-record></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PropertyInfo from './components/property-info.vue'
import TransferRecord from './components/transfer-record.vue'
import RepairRecord from './components/repair-record.vue'

export default {
  components: {
    PropertyInfo,
    TransferRecord,
    RepairRecord
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped></style>
