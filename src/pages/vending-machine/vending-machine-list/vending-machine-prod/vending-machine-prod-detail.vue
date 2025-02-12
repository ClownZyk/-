<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="goBack()" :content="$route.meta.name"> </el-page-header></div>
    <el-row :gutter="10">
      <el-divider content-position="left">产品基本信息</el-divider>
      <el-col :span="2"> <el-image style="width: 100px; height: 100px" :src="productDetail.imageUrl" :preview-src-list="[productDetail.imageUrl]" fit="fill"></el-image> </el-col>
      <el-col :span="22">
        <div><strong>产品名称：</strong>{{ productDetail.name }}</div>
        <el-row class="prod-info" :gutter="20">
          <el-col :span="8">
            <span><strong>产品条码：</strong>{{ productDetail.barCode }}</span>
          </el-col>
          <el-col :span="8">
            <span><strong>产品价格：</strong>{{ parseFloat((productDetail.price / 100).toFixed(2)) }} 元</span>
          </el-col>
          <el-col :span="8">
            <span><strong>产品库存：</strong>{{ productDetail.stock }}</span>
          </el-col>
        </el-row>
        <el-row class="prod-info">
          <el-col>
            <span><strong>库存修改：</strong></span>
            <el-table size="small" :data="productDetail.productlist" border style="margin-top:10px">
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column label="产品条码" prop="barCode" min-width="180" align="center"> </el-table-column>
              <el-table-column label="仓库存" prop="stock" min-width="160" align="center"> </el-table-column>
              <el-table-column label="补货数量" prop="editStock" min-width="160" align="center">
                <template slot-scope="scope">
                  <el-input-number size="small" v-model="scope.row.editStock" :min="productDetail.stock < 0 ? productDetail.stock : -productDetail.stock" :max="scope.row.stock" :step="1" step-strictly style="width:100%"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px"><el-button size="small" :loading="submitLoading" type="primary" @click="submitProdStockInfo">确定并提交</el-button></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-divider content-position="left">产品销售和补货记录</el-divider>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="产品销售记录" name="first"><sales-record ref="salesRecordRef"></sales-record></el-tab-pane>
        <el-tab-pane label="产品补货记录" name="second"><inventory-record ref="inventoryRecordRef"></inventory-record></el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import { getVendingMachineBindProdDetail, bindProdStockUpdate } from '@/api/system'
import SalesRecord from '../../components/sales-record.vue'
import InventoryRecord from '../../components/inventory-record.vue'

export default {
  components: {
    SalesRecord,
    InventoryRecord
  },
  data() {
    return {
      productDetail: {},
      activeName: 'first',
      detailLoading: false,
      submitLoading: false
    }
  },
  mounted() {
    this.getProductDetail()
  },
  methods: {
    getProductDetail() {
      this.detailLoading = true
      getVendingMachineBindProdDetail({ _id: this.$route.query.id })
        .then(res => {
          this.detailLoading = false
          this.productDetail = {
            ...res.data,
            productlist: res.data.productlist.map(item => {
              return {
                ...item,
                editStock: 0
              }
            })
          }
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    submitProdStockInfo() {
      let addStockProduct = this.productDetail.productlist
        .filter(item => item.editStock)
        .map(item => {
          return {
            barCode: item.barCode,
            stock: item.editStock
          }
        })
      let params = {
        _Id: this.productDetail._id,
        productBarCode: addStockProduct
      }
      this.submitLoading = true
      bindProdStockUpdate(params)
        .then(res => {
          this.submitLoading = false
          this.$router.push({ path: '/vending-machine-prod', query: { vmcode: this.$route.query.vmcode } })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleClick() {
      if (this.activeName === 'first') {
        this.$refs['salesRecordRef'].getProductSalesRecordList()
      } else if (this.activeName === 'second') {
        this.$refs['inventoryRecordRef'].getProdRecordList()
      }
    },
    goBack() {
      this.$router.push({ path: '/vending-machine-prod', query: { vmcode: this.$route.query.vmcode } })
    }
  }
}
</script>

<style lang="scss" scoped>
.prod-info {
  margin-top: 30px;
}
</style>
