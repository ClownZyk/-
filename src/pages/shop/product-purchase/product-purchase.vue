<template>
  <div class="product-container">
    <div class="product-list">
      <!--搜索部分-->
      <!-- <el-form class="filters" ref="searchForm" :model="search" :inline="true"> -->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <!-- <el-form-item>
            <el-cascader
              v-model="search.categoryIds"
              :options="categoryList"
              change-on-select
              clearable
              expand-trigger="hover"
              placeholder="请选择产品分类"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="search.productName"
              placeholder="请输入检索内容"
              class="filters-search"
              @keyup.enter.native="ShopGetListByPage"
            ></el-input>
            <el-input
              v-model="search.code"
              placeholder="请输入商品条码"
              class="filters-search"
              @keyup.enter.native="ShopGetListByPage"
            ></el-input>
            <el-button type="primary" @click="ShopGetListByPage">搜索</el-button>
          </el-form-item> -->
        </div>
        <el-form-item>
          <el-button type="primary" @click="_handlePurchaseOrder">生成采购单</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table
          class="table-main"
          ref="listTable"
          :data="productList"
          border
          tooltip-effect="dark"
          @selection-change="selectTableRow"
          v-loading="listLoading"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column type="expand" prop="sku" label="SKU" width="80">
            <template slot-scope="scope">
              <el-table :data="scope.row.sku" border tooltip-effect="dark" style="width: 55%;">
                <el-table-column prop="title" label="型号" min-width="150"></el-table-column>
                <el-table-column prop="barCode" label="产品条码" min-width="150"></el-table-column>
                <el-table-column prop="stock" label="库存" width="80">
                  <template slot-scope="scope">
                    <span v-if="scope.row.stock <= 5" style="color: red;">{{scope.row.stock}}</span>
                    <span v-else>{{scope.row.stock}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="80"></el-table-column>
                <el-table-column prop="vipPrice" label="会员价" width="80"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column align="center"  prop="productName" label="产品名称" min-width="280" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #67C23A;" v-show="scope.row.mainImg !== null && scope.row.mainImg.url !== null" class="iconfont icon-tupian"></span>
              {{scope.row.productName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="categoryName"
            label="分类"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            prop="isShow"
            label="上下架"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShow" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="sellWell"
            label="热销"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sellWell" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="isTop"
            label="店长推荐"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isTop" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sales" label="销量" width="100" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { StocksForewarnList, CreatePurchaseOrder } from '@/api/system'
export default {
  name: 'product-purchase',
  data() {
    return {
      // 产品列表
      productList: [],
      // 控制loading是否显示
      listLoading: false,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 选中行
    selectTableRow(row) {
      this.checkedDatas = row
    },
    // 生成采购单
    _handlePurchaseOrder () {
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认对已选中的数据生成采购单吗？', '提示', {}).then(() => {
          let ids = []
          that.checkedDatas.forEach(item => ids.push(item._id))
          let params = {
            idList: ids,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          CreatePurchaseOrder(params).then(res => {
            if (res.success) {
              this.$router.push('/supply-purchase')
            }
          }, err => {
            this.listLoading = false
            console.log(err)
          })
        })
      } else {
        that.$message({
          message: '请选中要生成的数据',
          type: 'warning'
        })
      }
    },
    // 获取库存不足的产品
    init () {
      let params = {
        count: 5,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      StocksForewarnList(params).then(res => {
        this.listLoading = false
        this.productList = res.data
      }, err => {
        this.listLoading = false
        console.log(err)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
