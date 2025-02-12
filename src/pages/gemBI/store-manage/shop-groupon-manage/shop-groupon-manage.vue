<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="`${$route.query.shopName}--${$route.meta.name}`"> </el-page-header></div>
    <gem-groupon-manage :queryCid="$route.query.shopCid"></gem-groupon-manage>
  </div>
</template>

<script>
import GemGrouponManage from '@/components/gem-groupon-manage'

export default {
  components: {
    GemGrouponManage
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
