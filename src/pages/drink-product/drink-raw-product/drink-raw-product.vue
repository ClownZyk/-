<template>
  <div class="product-container">
    <div class="product-list" v-if="containerIsShow">
      <!-- 搜索区域 -->
      <el-form class="filter" :model="filterParam" ref="filterParamRef" :inline="true">
        <div class="filter-left">
          <el-form-item><el-input v-model.trim="filterParam.productName" placeholder="请输入原料名称检索" clearable></el-input></el-form-item>
          <el-form-item> <el-cascader v-model="filterParam.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
          <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
        </div>
        <div class="filter-right"><el-button v-if="isManage" type="primary" @click="handleWarehouseShow">添加原料产品</el-button></div>
      </el-form>
      <!-- 列表区域 -->
      <div class="table-list">
        <el-table v-loading="tableLoading" :data="productList" border style="width: 100%">
          <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
          <el-table-column prop="productName" label="原料名称" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="categoryName" label="原料分类" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column label="产品条码" min-width="120" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.barCode + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column label="主单位" prop="unitName" min-width="150" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="stock" label="库存" min-width="120" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.stock }}({{ scope.row.unitName }})</div>
            </template>
          </el-table-column>
          <el-table-column label="供货价" min-width="120" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.costPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="rawV8Sync(scope.row)">v8同步</el-button>
              <el-button type="warning" size="mini" @click="checkRawProduct(scope.row)">查看</el-button>
              <!-- <el-button v-if="!isManage && loginData.attribute === 4" type="warning" size="mini" @click="checkRawProduct(scope.row)">修改</el-button> -->
              <el-button type="danger" size="mini" @click="removeRawProduct(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[15, 25, 35, 45]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </div>

      <!-- 仓库选择弹框 -->
      <el-dialog title="仓库选择" :visible.sync="isWarehouseShow" width="650px" @close="isWarehouseShow = false" :close-on-click-modal="false">
        <div v-loading="whLoading" class="radio">
          <el-radio-group v-model="whCid" size="small" style="width:100%">
            <el-radio class="radio-item" v-for="item in warehouseList" :key="item.whCid" :label="item.whCid" border>{{ item.whName }}</el-radio>
          </el-radio-group>
        </div>
        <span slot="footer">
          <el-button size="small" @click="isWarehouseShow = false">取 消</el-button>
          <el-button size="small" type="primary" :disabled="!whCid" @click="handleProductShow">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 总库选择器 -->
      <v8-all-product-select ref="productRef" :whCid="whCid" :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></v8-all-product-select>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getDrinkRawProduct, drinkRawProductOperation, drinkRawProductBatchAdd, GetAllCategory, SynchronismCategory, rawProductV8Sync } from '@/api/system'
import { getGoodsWarehouse } from '@/api/systemForV8'
import v8AllProductSelect from '@/components/v8-all-product-select.vue'
import { mapState } from 'vuex'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'drink-raw-product') {
        this.getRawProduct()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    v8AllProductSelect
  },
  computed: {
    ...mapState(['loginData'])
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      filterParam: {
        productName: '',
        categoryId: ''
      },
      categoryList: [],
      productList: [],
      whCid: '',
      warehouseList: [],
      action: 0,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      isShowProductSelect: false,
      tableLoading: false,
      containerIsShow: true,
      isWarehouseShow: false,
      whLoading: false,
      rules: {
        recipeUnitName: [{ required: true, message: '请输入计量单位名称', trigger: 'blur' }],
        recipeUnit: [{ required: true, message: '请输入计量单位量', trigger: 'blur' }]
      },
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getProductCategory()
      this.getRawProduct()
    },
    // 原料产品v8同步
    rawV8Sync(row) {
      let params = {
        uniqueCode: row.uniqueCode,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      rawProductV8Sync(params).then(res => {
        this.$message.success(res.msg)
        this.getRawProduct()
      })
    },
    handleWarehouseShow() {
      if (this.isManage) {
        this.isWarehouseShow = true
        this.getWarhouseList()
      } else if (!this.isManage && this.loginData.attribute === 4) {
        this.$router.push({
          path: '/drink-raw-product-detail'
        })
      }
    },
    // 获取仓库信息列表
    getWarhouseList() {
      this.whLoading = true
      getGoodsWarehouse()
        .then(res => {
          if (res.success) {
            this.whLoading = false
            this.warehouseList = res.data
          }
        })
        .catch(() => {
          this.whLoading = false
        })
    },
    handleProductShow() {
      this.isWarehouseShow = false
      this.isShowProductSelect = true
      this.$nextTick(() => {
        this.$refs.productRef.initData()
      })
    },
    // 获取原料产品分类
    getProductCategory() {
      let commonParam =
        this.loginData.attribute === 4
          ? { creater: this.$store.state.UserID, roleId: this.$store.state.UserRole, cid: this.$store.state._cid }
          : { creater: localStorage.getItem('creater'), roleId: localStorage.getItem('roleId'), cid: localStorage.getItem('cid') }
      let params = {
        belongMenu: '/raw-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        ...commonParam
      }
      GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 获取原料库列表数据
    getRawProduct() {
      let params = {
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getDrinkRawProduct(params)
        .then(res => {
          if (res.success) {
            this.tableLoading = false
            this.productList = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 保存选中的商品数据
    saveSelected(row) {
      let selectedRawProductList = row.map(v => {
        return {
          uniqueCode: v.uniqueCode,
          categoryId: v.categorys,
          productName: v.productName,
          sortNo: v.sortNo,
          mainImg: v.mainImg,
          imgs: v.imgs,
          sku: v.sku,
          unitName: v.unitName,
          stock: v.stock
        }
      })
      this.sumbitRawProduct(selectedRawProductList)
    },
    // 提交原料产品
    sumbitRawProduct(rawProduct) {
      let params = {
        rawProduct: rawProduct,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      let ids = rawProduct.map(item => {
        return item.categoryId
      })
      // console.log(params)
      drinkRawProductBatchAdd(params).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.getRawProduct()
            this.SynchronismCategory(ids)
            this.isShowProductSelect = false
          }
        },
        () => {
          this.isShowProductSelect = false
        }
      )
    },
    SynchronismCategory(ids) {
      let params = {
        categories: [],
        ids,
        belongMenu: '/raw-product-category',
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      SynchronismCategory(params).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.getProductCategory()
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 删除原料产品
    removeRawProduct(row) {
      this.action = 2
      this.$confirm('确认删除此原料商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: {
              ...row
            },
            action: this.action
          }
          // console.log(params)
          drinkRawProductOperation(params)
            .then(res => {
              this.$message.success(res.msg)
              this.getRawProduct()
            })
            .catch(err => {
              console.log(err.msg)
            })
        })
        .catch(() => {})
    },
    // 查看原料产品
    checkRawProduct(row) {
      this.$router.push({
        path: '/drink-raw-product-detail',
        query: {
          id: row._id,
          uniqueCode: row.uniqueCode
        }
      })
    },
    // 改变商品弹框状态
    handleProductSelect(val) {
      this.isShowProductSelect = val
    },
    // 条件搜索
    searchCondition() {
      this.pageIndex = 1
      this.getRawProduct()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getRawProduct()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRawProduct()
    }
  }
}
</script>

<style lang="scss" scoped>
.product-container {
  .filter {
    display: flex;
    justify-content: space-between;
  }
  .pagination {
    margin-top: 15px;
    text-align: right;
  }
  .product-info {
    .title {
      font-size: 16px;
      font-weight: 700;
      .info {
        margin-left: 15px;
        font-weight: 400;
      }
    }
  }
}
.el-radio {
  width: 30%;
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0;
  margin-bottom: 15px;
}
</style>
