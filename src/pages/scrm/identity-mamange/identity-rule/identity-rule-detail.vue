<template>
  <div>
    <!-- 产品列表 -->
    <el-form class="filter" :model="filterParams" :inline="true">
      <div class="filter-left">
        <el-form-item> <el-input v-model="filterParams.productName" placeholder="请输入产品名称或条形码" clearable style="width: 300px"></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="_getProduct">搜索</el-button> </el-form-item>
      </div>
      <div class="filter-right">
        <el-form-item>
          <el-button type="primary" @click="handleProductSelect(true)">添加零售商品</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="isMealDialogVisible = true">添加餐食商品</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="isDrinkDialogVisible = true">添加饮品商品</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="isWeightDialogVisible = true">添加散称商品</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" v-loading="listLoading">
      <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="title" label="规格" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="barCode" label="条码" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="price" label="原价" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="modifyPrice" label="特殊价" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input-number controls-position="right" size="mini" v-model="scope.row.modifyPrice" :precision="2"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isPrice" label="是否开启特殊价格" width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isPrice" @change="operateRow(scope.row, 1, '')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isShow" label="是否展示特殊商品" width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" @change="operateRow(scope.row, 1, '')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="234" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="operateRow(scope.row, 1, '编辑')">保存</el-button>
          <el-button type="danger" size="mini" @click="operateRow(scope.row, 2, '删除')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-pagination
        v-show="total !== 0"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
        layout="total, prev, pager, next"
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="total"
      ></el-pagination>
    </el-row>
    <!-- 零售商品选择器 -->
    <product-sku-select :isShowProductSelect="isShowProductSelect" :selectedList="productList" :ruleId="ruleId" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></product-sku-select>
    <!-- 餐食商品选择器 -->
    <el-dialog title="餐食商品选择" :visible.sync="isMealDialogVisible" width="50%" :close-on-click-modal="false" @close="isMealDialogVisible = false">
      <meal-product-select ref="mealRef" @closeDialog="closeDialog"></meal-product-select>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
    <!-- 饮品商品选择器 -->
    <el-dialog title="饮品商品选择" :visible.sync="isDrinkDialogVisible" width="50%" :close-on-click-modal="false" @close="isDrinkDialogVisible = false">
      <drink-product-select ref="drinkRef" @closeDialog="closeDialog"></drink-product-select>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
    <!-- 散称商品选择器 -->
    <el-dialog title="散称商品选择" :visible.sync="isWeightDialogVisible" width="50%" :close-on-click-modal="false" @close="isWeightDialogVisible = false">
      <weight-product-select ref="weightRef" @closeDialog="closeDialog"></weight-product-select>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { GetSpecialProduct, ManyAddRule, SprodOperation } from '@/api/system'
import productSkuSelect from '@/components/product-sku-select.vue'
import MealProductSelect from './componenets/meal-product-select.vue'
import DrinkProductSelect from './componenets/drink-product-select.vue'
import WeightProductSelect from './componenets/weight-product-select.vue'

export default {
  components: {
    productSkuSelect,
    MealProductSelect,
    DrinkProductSelect,
    WeightProductSelect
  },
  watch: {
    isMealDialogVisible(val) {
      if (!val) {
        this.$refs.mealRef.clear()
      }
    },
    isDrinkDialogVisible(val) {
      if (!val) {
        this.$refs.drinkRef.clear()
      }
    },
    isWeightDialogVisible(val) {
      if (!val) {
        this.$refs.weightRef.clear()
      }
    }
  },
  data() {
    return {
      ruleId: this.$route.query.ruleId,
      ruleDetail: {
        ratioName: '',
        getPointsTimes: null,
        discountRatio: null,
        remark: '',
        creater: localStorage.getItem('createrVip'),
        roleId: localStorage.getItem('createrVip'),
        cid: localStorage.getItem('createrVip')
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      identFormRules: {
        ratioName: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        discountRatio: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        getPointsTimes: [{ required: true, message: '该值不能为空', trigger: 'blur' }]
      },
      filterParams: {
        productName: ''
      },
      listLoading: false,
      productList: [],
      isShowProductSelect: false, // 是否打开产品选择器
      isMealDialogVisible: false, // 餐食选择
      isDrinkDialogVisible: false, // 饮品选择
      isWeightDialogVisible: false // 散称选择
    }
  },
  mounted() {
    if (this.ruleId) {
      this._getProduct()
    }
  },
  methods: {
    // 保存选中数据
    saveSelected(newSelectedList) {
      let newList = JSON.parse(JSON.stringify(newSelectedList)).map(item => {
        return {
          categoryid: item.categoryId,
          categoryName: item.categoryName,
          uniqueCode: item.uniqueCode,
          productName: item.productName,
          title: item.title,
          barCode: item.barCode,
          price: item.price,
          Productid: item._id,
          modifyPrice: item.price
        }
      })
      // this.productList = this.productList.concat(newList)
      this.handleProductSelect(false)
      this.editRule(newList)
    },
    // 打开或关闭产品选择器
    handleProductSelect(flag) {
      this.isShowProductSelect = flag
    },
    _getProduct(categoryId) {
      let params = {
        IdentityRoleid: this.ruleId,
        categoryid: '',
        productName: this.filterParams.productName.trim(),
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      GetSpecialProduct(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.productList = res.data
            this.total = res.total
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },
    editRule(newList) {
      if (newList.length === 0) {
        this.$message.error('请选择商品')
        return false
      }
      this.$confirm('是否添加商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            identityRoleid: this.ruleId,
            SpecialProduct: newList,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          ManyAddRule(params).then(
            res => {
              if (res.success) {
                this.$message.success(res.msg)
                this._getProduct()
              } else this.$message.error(res.msg)
            },
            err => {
              console.log(err)
            }
          )
        })
        .catch(() => {})
    },
    operateRow(row, action, txt) {
      if (txt) {
        this.$confirm(`是否${txt}商品?, 提示`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this._option(row, action)
          })
          .catch(() => {})
      } else this._option(row, action)
    },
    _option(row, action) {
      let params = {
        dto: {
          ...row,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        action: action
      }
      SprodOperation(params).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this._getProduct()
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },
    // 关闭弹框
    closeDialog(type) {
      if (type === 'meal') {
        this.isMealDialogVisible = !this.isMealDialogVisible
      } else if (type === 'drink') {
        this.isDrinkDialogVisible = !this.isDrinkDialogVisible
      } else if (type === 'weight') {
        this.isWeightDialogVisible = !this.isWeightDialogVisible
      }
      this._getProduct()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this._getProduct()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this._getProduct()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  justify-content: space-between;
}
.conform-btn,
.table-main {
  margin-top: 20px;
}
.pagination {
  margin-top: 10px;
  float: right;
}
</style>
