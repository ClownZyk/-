<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-tabs v-loading="detailLoading" v-model="activeName">
      <el-tab-pane label="基本信息" name="first"><base-info></base-info></el-tab-pane>
      <el-tab-pane label="核销信息" name="second"><write-off-info></write-off-info></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseInfo from './components/base-info.vue'
import WriteOffInfo from './components/write-off-info.vue'

export default {
  components: {
    BaseInfo,
    WriteOffInfo
  },
  data() {
    return {
      activeName: 'first',
      detailLoading: false
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
