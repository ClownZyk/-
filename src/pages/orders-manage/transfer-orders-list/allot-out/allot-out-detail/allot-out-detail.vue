<template>
  <div class="product-container">
    <div class="product">
      <!-- 添加商品部分 -->
      <el-form class="filters" ref="addProductForm" :inline="true">
        <el-form-item>
          <el-select v-model="allotForm.companyCid" placeholder="请选择店名" clearable> <el-option v-for="(item, index) in allotShopList" :key="index" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
        <el-form-item> <el-button type="primary" :disabled="!allotForm.companyCid" @click="handleProductSelect()">添加产品</el-button> </el-form-item>
      </el-form>

      <!-- 产品列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" style="width:100%">
          <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="250" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="产品条码" min-width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="title" label="产品型号" min-width="160" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="stock" label="库存" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="datetime" label="日期" width="280" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <span> {{ scope.row.datetime || '无日期' }}</span>
                <el-button type="text" @click="handleDateShow(scope.row, scope.$index)">修改</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="调拨数量" width="200" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.count" controls-position="right" :min="1" :max="scope.row.dateIndex !== undefined ? scope.row.surplus : scope.row.stock" size="small"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="165" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="removeProduct(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 提交数据 -->
      <div class="submit-btn"><el-button type="primary" @click="allotBatchSubmit">提交</el-button></div>
    </div>
    <!-- 商品选择器弹框 -->
    <el-dialog title="商品选择器" :visible.sync="productDialogVisible" width="1000px" :close-on-click-modal="false">
      <!-- 搜索部分 -->
      <el-form class="search-filters" ref="searchForm" :model="search" :inline="true">
        <div class="search-filters-left">
          <el-form-item> <el-cascader v-model="categoryIds" :options="categoryList" change-on-select clearable expand-trigger="hover" placeholder="请选择产品分类"></el-cascader> </el-form-item>
          <el-form-item>
            <el-input v-model="search.productName" placeholder="请输入产品名检索" class="filters-item" @keyup.enter.native="ProductGetListByPage" clearable></el-input>
            <el-input v-model="search.barCode" placeholder="请输入条形码检索" class="filters-item" @keyup.enter.native="ProductGetListByPage" clearable></el-input>
            <el-button type="primary" @click="searchCondition">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item> <el-button type="primary" @click="saveSelected">保存</el-button> </el-form-item>
      </el-form>

      <!-- 列表部分 -->
      <el-table class="table-main" ref="listTable" :data="allProductList" border tooltip-effect="dark" @selection-change="selectTableRow" :row-key="getRowKeys" v-loading="listLoading">
        <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column align="center" prop="productName" label="产品名称" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="categoryName" label="分类" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="产品条码" width="160" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.sku.barCode }}</template>
        </el-table-column>
        <el-table-column align="center" prop="unitName" label="最小单位" width="120" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="当前单位" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.sku.unitName }}（{{ scope.row.sku.convertCount }}{{ scope.row.unitName }}）</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="stock" label="库存" width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="价格" width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.sku.price }}</template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[10, 15, 20, 25]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          background
          style="float:right;margin:10px 0;"
        >
        </el-pagination>
      </el-col>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>

    <!-- 日期选择弹框 -->
    <el-dialog title="日期选择" :visible.sync="isDateShow" width="800px" @close="isDateShow = false" :close-on-click-modal="false">
      <div v-loading="batchLoading">
        <el-radio-group v-model="datetime" @input="handleDateChange">
          <el-radio :label="-1" border>无日期</el-radio>
          <el-radio v-for="(item, index) in batchList" :key="index" :label="index" border :disabled="item.surplus === 0">{{ item.productionDate }}(剩余{{ item.surplus }})</el-radio>
        </el-radio-group>
        <el-pagination @current-change="handleBatchCurrentChange" :current-page="bPageIndex" :page-size="bPageSize" layout="total, prev, pager, next" :total="bTotal" background style="text-align: right"> </el-pagination>
      </div>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { AllotGetUserDropDownList, GetAllCategory, getProductListByPage, AddAllotOrder, GetBatchListByPage } from '@/api/system'
// import { getDataString } from '@/filters/filters'

export default {
  name: 'allot-out-detail',
  data() {
    return {
      datetime: '',
      batchList: [],
      batchLoading: false,
      isDateShow: false,
      allotShopList: [],
      allotForm: {
        companyCid: ''
      },
      productList: [],
      categoryList: [],
      allProductList: [],
      categoryIds: [],
      search: {
        categoryId: '',
        productName: '',
        barCode: ''
      },
      selectList: [],
      productInfo: {},
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      bPageIndex: 1,
      bPageSize: 15,
      bTotal: 0,
      listLoading: false,
      // 是否打开产品选择器
      productDialogVisible: false
    }
  },
  watch: {
    isDateShow(val) {
      if (!val) {
        this.batchList = []
        this.datetime = ''
        this.productInfo = {}
        this.bPageIndex = 1
      }
    }
  },
  created() {
    this.getShopList()
  },
  methods: {
    // 获取店名列表
    getShopList() {
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      AllotGetUserDropDownList(params).then(res => {
        if (res.success) {
          this.allotShopList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 打开或关闭产品选择器
    handleProductSelect() {
      this.productDialogVisible = true
      this.GetAllCategory()
      this.ProductGetListByPage()
    },
    // 获取产品分类
    GetAllCategory() {
      let params = {
        belongMenu: '/product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
        this.categoryList.unshift({
          value: '',
          label: '所有产品'
        })
      })
    },
    // 获取产品列表
    ProductGetListByPage() {
      if (this.categoryIds.length > 0) {
        this.search.categoryId = this.categoryIds[this.categoryIds.length - 1]
      } else {
        this.search.categoryId = ''
      }
      let params = {
        barCode: this.search.barCode,
        categoryId: this.search.categoryId,
        productName: this.search.productName,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getProductListByPage(params).then(
        res => {
          this.listLoading = false
          this.allProductList = res.data
          this.total = res.total
        },
        () => {
          this.listLoading = false
        }
      )
    },
    // 选择的商品数据
    selectTableRow(row) {
      this.selectList = JSON.parse(
        JSON.stringify(
          row.map(product => {
            return {
              uniqueCode: product.uniqueCode,
              productName: product.productName,
              barCode: product.sku.barCode,
              title: product.sku.title,
              price: product.sku.price,
              stock: product.stock,
              count: 1,
              datetime: ''
            }
          })
        )
      )
    },
    getRowKeys(row) {
      return row.sku.barCode
    },
    // 保存选中的产品数据
    saveSelected() {
      if (this.selectList.length > 0) {
        this.$confirm('确定选择该产品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let norepeatSelect = this.selectList.filter(item => {
              return this.productList.every(v => v.barCode !== item.barCode)
            })
            if (this.selectList.length !== norepeatSelect.length) {
              this.$message.warning('重复添加商品请直接修改数量')
            }
            this.productList.push(...norepeatSelect)
            this.productDialogVisible = false
          })
          .catch(() => {})
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    // 删除选中的产品
    removeProduct(row) {
      if (this.productList.some(v => v.barCode === row.barCode)) {
        // 当前数据暂未提交
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          this.productList.splice(this.productList.findIndex(v => v.barCode === row.barCode), 1)
        })
      }
    },
    // 提交调拨信息
    allotBatchSubmit() {
      if (!this.allotForm.companyCid) {
        this.$message({
          type: 'warning',
          message: '请选择店名!'
        })
        return false
      }
      // let isDatetime = this.productList.some(item => {
      //   return item.datetime === ''
      // })
      // if (isDatetime) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择生产日期!'
      //   })
      //   return false
      // }
      this.$confirm('确认调拨以上产品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          product: this.productList,
          companyName: '',
          companyCid: this.allotForm.companyCid,
          orderStatus: 1,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        AddAllotOrder(params).then(res => {
          if (res.success) {
            this.$router.back(-1)
          }
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
        })
      })
    },
    handleDateShow(row, rowIndex) {
      this.isDateShow = true
      this.productInfo = row
      this.productList['rowIndex'] = rowIndex
      this.getBatchList()
    },
    getBatchList() {
      let parmas = {
        uniqueCode: this.productInfo.uniqueCode,
        pageIndex: this.bPageIndex,
        pageSize: this.bPageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.batchLoading = true
      GetBatchListByPage(parmas)
        .then(res => {
          this.batchLoading = false
          this.batchList = res.data.map(item => {
            return {
              productionDate: item.productionDate.split(' ')[0],
              expirationTime: item.expirationTime.split(' ')[0],
              totalCount: item.totalCount,
              sold: item.sold,
              scrap: item.scrap,
              surplus: item.totalCount - item.sold - item.scrap // 剩余数量
            }
          })
          this.bTotal = res.total
        })
        .catch(() => {
          this.batchLoading = false
        })
    },
    handleDateChange(dateIndex) {
      if (dateIndex === -1) {
        this.productList[this.productList.rowIndex].datetime = ''
      } else {
        this.productList[this.productList.rowIndex].dateIndex = dateIndex
        this.productList[this.productList.rowIndex].surplus = this.batchList[dateIndex].surplus
        this.productList[this.productList.rowIndex].datetime = JSON.parse(JSON.stringify(this.batchList[dateIndex].productionDate))
        if (this.productList[this.productList.rowIndex].count > this.batchList[dateIndex].surplus) {
          this.productList[this.productList.rowIndex].count = this.batchList[dateIndex].surplus
        }
      }
      this.isDateShow = false
    },
    searchCondition() {
      this.pageIndex = 1
      this.ProductGetListByPage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.ProductGetListByPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.ProductGetListByPage()
    },
    handleBatchCurrentChange(val) {
      this.bPageIndex = val
      this.getBatchList()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .search-filters-left {
    .filters-item {
      display: inline-block;
      width: 200px;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
.submit-btn {
  margin-top: 20px;
}
.el-radio.is-bordered,
.el-radio.is-bordered + .el-radio.is-bordered {
  width: 220px;
  margin-left: unset;
  margin-bottom: 15px;
}
</style>
