<template>
    <div class="sale-detail">
      <order-detail></order-detail>
    </div>
</template>

<script>
    import OrderDetail from '@/components/order-detail'
    export default {
        name: 'detail',
      components: {OrderDetail}
    }
</script>

<style scoped lang="scss">
.sale-detail{
  position: fixed;
  top: 120px;
  z-index: 2;
  width: calc(100% - 240px);
  height: 100vh;
  background-color: #ffffff;
}
</style>
