<template>
  <div class="enterprise-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="企业信息" name="1"> <enterprise-info></enterprise-info> </el-tab-pane>
      <el-tab-pane label="企业订单" name="2"> <enterprise-order></enterprise-order> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EnterpriseInfo from '@/pages/enterprise-manage/enterprise-detail/components/enterprise-info'
import EnterpriseOrder from '@/pages/enterprise-manage/enterprise-detail/components/enterprise-order'
export default {
  components: {
    EnterpriseInfo,
    EnterpriseOrder
  },
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
