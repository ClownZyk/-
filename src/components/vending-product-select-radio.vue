<template>
  <!-- 商品选择器（单选版本） -->
  <el-dialog :visible.sync="isShow" :title="isNjV6 === 1 ? '南京V6商品选择器' : '西安V8商品选择器'" width="1100px" @closed="closed">
    <!-- 搜索部分 -->
    <el-form class="filters" ref="searchFormRef" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item prop="categoryId"> <el-cascader v-model="search.categoryId" :options="categoryList" :props="cateProps" clearable placeholder="请选择产品分类"></el-cascader> </el-form-item>
        <el-form-item prop="productName"> <el-input v-model="search.productName" placeholder="请输入产品名称检索" class="filters-search" @keyup.enter.native="_valSearch"></el-input> </el-form-item>
        <el-form-item prop="barCode"> <el-input v-model="search.barCode" placeholder="请输入产品条码检索" class="filters-search" @keyup.enter.native="_valSearch" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="_valSearch">搜索</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table size="small" v-loading="listLoading" class="table-main" ref="listTable" :data="productList" border :max-height="600">
      <el-table-column prop="productName" label="产品名称" min-width="260" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="categorysName" label="产品分类" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ isNjV6 === 1 ? scope.row.categoryName : scope.row.categorysName }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="barCode" label="产品条码" width="150" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="unitName" label="单位" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.unitName }}（{{ scope.row.convertCount }}{{ scope.row.baseUnitName }}）
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="零售价" width="100" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column align="center" prop="proStock" label="库存" width="100" show-overflow-tooltip></el-table-column> -->
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="selectTableRow(scope.row)">选择此产品</el-button>
        </template>
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
    <el-dialog width="1000px" title="基础产品库" :visible.sync="isJTBaseProdShow" append-to-body @close="isJTBaseProdShow = false" :close-on-click-modal="false">
      <el-row style="font-size:14px;color:#F56C6C">
        <div>
          注：
          <div>合集产品是指该系列不同口味的产品，若存在合集产品，优先选择合集产品上架</div>
          <div>如基础产品库中不存在v6产品库中的产品，请将该产品作为 ‘新品’ 进行申请，第三方审核通过后再进行产品绑定</div>
        </div>
      </el-row>
      <el-table v-loading="tableLoading" ref="listBaseTable" :data="baseProductList" border>
        <el-table-column align="center" label="产品图片" width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-image v-if="scope.row.imgUrl" style="width: 35px; height: 35px" :src="scope.row.imgUrl" fit="fill"></el-image>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="产品名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="产品类型" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.collType === 1" style="color:#909399">单品</div>
            <div v-else-if="scope.row.collType === 2" style="color:#E6A23C">合集</div>
            <div></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="itemCode" label="产品编码" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="qrCodes" label="产品条码" min-width="160" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="selectBaseTableRow(scope.row)">选择此产品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleBaseSizeChange"
          @current-change="handleBaseCurrentChange"
          :current-page="bPageIndex"
          :page-size="bPageSize"
          :page-sizes="[10, 15, 20, 25]"
          :total="bTotal"
          layout="total, sizes, prev, pager, next"
          background
          style="float:right;margin:10px 0;"
        >
        </el-pagination>
      </el-col>
      <div slot="footer"></div>
    </el-dialog>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {ShopGetListByPage, GetAllCategory, getJTBaseProduct} from '@/api/system'
import {getXaProductInfoListByPage, getXaCategoryForV6} from '@/api/systemForXaV8'

export default {
  name: 'product-select-radio',
  props: {
    isShowProductSelect: {
      type: Boolean,
      default: false
    },
    isNjV6: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isShowProductSelect(newValue, oldValue) {
      this.isShow = newValue
      if (!newValue) {
        this.pageIndex = 1
        this.$refs['searchFormRef'].resetFields()
      }
    },
    isJTBaseProdShow(val) {
      if (!val) {
        this.baseProductList = []
      }
    }
  },
  data () {
    return {
      isShow: false,
      productList: [],
      listLoading: false,
      categoryList: [],
      search: {
        categoryId: '',
        productName: '',
        barCode: ''
      },
      filterParam: {
        name: '',
        barcode: ''
      },
      baseProductList: [],
      prodData: {},
      tableLoading: false,
      submitLoading: false,
      isJTBaseProdShow: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      bTotal: 0,
      bPageIndex: 1,
      bPageSize: 10,
      cateProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  methods: {
    initV6Data() {
      this.GetAllCategory()
      this.ShopGetListByPage()
    },
    initXaV8Data() {
      this.getXaAllCategory()
      this.getXaShopListByPage()
    },
    GetAllCategory () {
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
      })
    },
    ShopGetListByPage (refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.search,
        isStock: 0,
        isShow: 0,
        queryStock: '',
        sellWell: false,
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
      ShopGetListByPage(params).then(res => {
        this.listLoading = false
        this.productList = this.handleData(res.data)
        this.total = res.total
      }, () => {
        this.listLoading = false
      })
    },
    getXaAllCategory() {
      let params = {
        belongMenu: '',
        categoryName: '',
        belong: '',
        cid: this.$store.state.retailWarehouseId,
        whCid: this.$store.state.retailWarehouseId
      }
      getXaCategoryForV6(params).then(res => {
        this.categoryList = res.data.map(item => {
            return {
              label: item.categoryName,
              value: item._id,
              children: item.children.map(child => {
                return {
                  label: child.categoryName,
                  value: child._id
                }
            })
            }
        })
      })
    },
    getXaShopListByPage(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        productName: this.search.productName,
        categorys: this.search.categoryId,
        barCode: this.search.barCode,
        isStock: null,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        whCid: this.$store.state.retailWarehouseId,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getXaProductInfoListByPage(params).then(res => {
        this.listLoading = false
        this.productList = this.handleData(res.data)
        this.total = res.total
      }, () => {
        this.listLoading = false
      })
    },
     // 处理列表数据，拆分sku
    handleData (data) {
      let newList = []
      data.forEach(e => {
        if (e.sku && e.sku.length > 0) {
          e.sku.forEach(sku => {
            let obj = { ...e, ...sku, proStock: e.stock, baseUnitName: e.unitName }
            newList.push(obj)
          })
        }
      })
      return newList
    },
    selectTableRow (row) {
      this.isJTBaseProdShow = true
      this.$nextTick(() => {
        this.filterParam.barcode = row.barCode
        // this.filterParam.name = row.productName
        this.prodData.price = row.price
        this.prodData.barCode = row.barCode
        this.getBaseProduct()
      })
    },
    getBaseProduct() {
      let params = {
        ...this.filterParam,
        pageSize: this.bPageSize,
        pageIndex: this.bPageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getJTBaseProduct(params).then(res => {
        this.tableLoading = false
        this.baseProductList = res.data.listData
        this.bTotal = res.data.total
      }).catch(() => {
        this.tableLoading = false
      })
    },
    selectBaseTableRow(row) {
      this.$confirm('确认选择' + row.name + '吗？?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.prodData = {...this.prodData, ...row}
          this.$emit('saveSelected', this.prodData)
          this.closed()
        }).catch(() => {})
    },
    closed () {
      this.isJTBaseProdShow = false
      this.$emit('handleProductSelect', false, 0)
    },
    handleSizeChange (val) {
      this.pageSize = val
      if (this.isNjV6 === 1) {
        this.ShopGetListByPage()
      } else {
        this.getXaShopListByPage()
      }
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      if (this.isNjV6 === 1) {
        this.ShopGetListByPage()
      } else {
        this.getXaShopListByPage()
      }
    },
    _valSearch() {
      this.pageIndex = 1
      if (this.isNjV6 === 1) {
        this.ShopGetListByPage()
      } else {
        this.getXaShopListByPage()
      }
    },
    searchCondition() {
      this.bPageIndex = 1
      this.getBaseProduct()
    },
    handleBaseSizeChange(val) {
      this.bPageSize = val
      this.getBaseProduct()
    },
    handleBaseCurrentChange(val) {
      this.bPageIndex = val
      this.getBaseProduct()
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
