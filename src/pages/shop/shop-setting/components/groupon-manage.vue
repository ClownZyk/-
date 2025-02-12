<template>
  <div><gem-groupon-manage :queryCid="$store.state._cid"></gem-groupon-manage></div>
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
