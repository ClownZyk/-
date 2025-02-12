<template>
  <div class="orders-detail">
    <scrm-order-detail></scrm-order-detail>
  </div>
</template>

<script type="text/ecmascript-6">
  import ScrmOrderDetail from '@/pages/scrm/scrm-order-detail/scrm-order-detail'
  export default {
    components: {ScrmOrderDetail}
  }
</script>

<style scoped lang="scss">
.orders-detail{
  position: fixed;
  z-index: 2;
  width: calc(100% - 200px);
  height:90vh;
  overflow-y: scroll;
  background-color: #ffffff;
}
</style>
