<template>
  <div class="order-detail">
    <order-detail></order-detail>
  </div>
</template>

<script>
  import OrderDetail from '@/components/order-detail'
  export default {
    name: 'scrm-order-detail',
    components: {
      OrderDetail
    }
  }
</script>

<style lang="scss" scoped>
  .order-detail{
    width: calc(100% - 40px);
    height: 100vh;
    position: absolute;
    z-index: 4;
    background-color: #ffffff;
    .main{
      .main-l{
        background-color: #f2f6fc;
        padding: 0 10px 10px 10px;
        .main-l-row {
          display: flex;
          display: -webkit-flex;
          flex-wrap: wrap;
          .main-l-l {
            flex: 0 0 25%;
            display: flex;
            display: -webkit-flex;
            margin-top: 10px;
            .border{
              width: 3px;
              height: 20px;
              background-color: #409EFF;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
</style>
