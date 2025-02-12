<template>
  <el-tabs v-model="tabIndex" class="tabs">
    <el-tab-pane label="基本信息" name="first"><shop-setting></shop-setting></el-tab-pane>
    <el-tab-pane label="拼团管理人员设置" name="second" v-if="AppConfig.DOMAINNAME !== 'yunjixiaochao.cn'"><groupon-manage></groupon-manage></el-tab-pane>
    <el-tab-pane label="快递配送管理" name="third" v-if="!isManage"><deliver></deliver></el-tab-pane>
    <el-tab-pane label="同城配送管理" name="fourth" v-if="!isManage"><intra-city-service></intra-city-service></el-tab-pane>
  </el-tabs>
</template>
<script>
import ShopSetting from './components/shop-setting'
import GrouponManage from './components/groupon-manage'
import Deliver from './components/deliver'
import IntraCityService from './components/intraCity-service'
import AppConfig from '@/components/js/gem'

export default {
  data() {
    return {
      tabIndex: 'first',
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      AppConfig: AppConfig
    }
  },
  methods: {},
  components: {
    IntraCityService,
    Deliver,
    GrouponManage,
    ShopSetting
  }
}
</script>
<style lang="scss" scoped>
.tabs {
  padding: 20px;
}
</style>
