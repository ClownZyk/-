<template>
  <div class="">
    <el-button type="primary" @click="$router.push('/vending-purchase-orders-detail')">新增采购单</el-button>
  </div>
</template>
<script>
import { GetVmPurchaseOrderByPage } from '@/api/system.js'
export default {
  data() {
    return {
      pageParams: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getAndInitPageData()
  },
  methods: {
    getAndInitPageData() {
      this.getDataList()
    },
    getDataList() {
      const params = {
        ...this.pageParams
      }
      GetVmPurchaseOrderByPage(params).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
