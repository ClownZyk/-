<template>
  <div class="product-container">
    <div class="product">
      <!-- 分类添加部分 -->
      <el-form inline style="margin-bottom:20px;">
        <el-form-item v-if="useRange.includes(1)" label="零售商品分类：">
          <el-cascader
            v-model="selectedRetailCategory"
            :options="retailCategoryList"
            :props="categoryProps"
            placeholder="请选择零售产品分类"
            clearable
            @change="handleCategoryChange"
            @remove-tag="handleCategoryRemove"
            style="width: 300px"
          ></el-cascader>
        </el-form-item>
        <el-form-item v-if="useRange.includes(2)" label="餐食商品分类：">
          <el-select multiple v-model="selectedMealCategory" placeholder="请选择餐食产品分类"
                     @change="handleMealCategoryChange" @remove-tag="handleCategoryRemove" style="width: 300px">
            <el-option v-for="item in mealCategoryList" :key="item.unionCode" :label="item.name"
                       :value="item.unionCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="useRange.includes(3)" label="饮品商品分类：">
          <el-select multiple v-model="selectedDrinkCategory" placeholder="请选择饮品产品分类"
                     @change="handleDrinkCategoryChange" @remove-tag="handleCategoryRemove" style="width: 300px">
            <el-option v-for="item in drinkCategoryList" :key="item.unionCode" :label="item.name"
                       :value="item.unionCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 产品添加部分 -->
      <el-form ref="searchForm" :inline="true">
        <el-form-item v-if="useRange.includes(1)">
          <el-button type="primary" @click="handleProductSelect(true)">添加零售产品</el-button>
        </el-form-item>
        <el-form-item v-if="useRange.includes(2)">
          <el-button type="warning" @click="addMealProduct">添加餐食产品</el-button>
        </el-form-item>
        <el-form-item v-if="useRange.includes(3)">
          <el-button type="success" @click="addDrinkProduct">添加饮品产品</el-button>
        </el-form-item>
        <el-form-item v-if="useRange.includes(4)">
          <el-button type="success" @click="addVendingProduct">添加自助零售柜产品</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="includeProd" border tooltip-effect="dark" style="width:60%">
          <el-table-column prop="name" label="产品名称" align="center" min-width="250"></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" min-width="180"></el-table-column>
          <el-table-column prop="skuName" label="规格名称" align="center" min-width="150"></el-table-column>
          <el-table-column label="操作" align="center" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delFunc(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 商品选择器 -->
    <v8-product-select :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect"
                       @saveSelected="saveSelected"></v8-product-select>
    <!-- 餐食商品选择器 -->
    <meal-product-select ref="mealRef" :isMealProductShow="isMealProductShow" @savedMealData="saveData"
                         @closedMealDialog="closedMealDialog"></meal-product-select>
    <!-- 饮品商品选择器 -->
    <drink-product-select ref="drinkRef" :isDrinkProductShow="isDrinkProductShow" @savedDrinkData="saveData"
                          @closedDrinkDialog="closedDrinkDialog"></drink-product-select>
    <vending-product-select ref="vendingRef" :isVendingProductShow="isVendingProductShow" @savedVendingData="saveData"
                            @closedVendingDialog="closedVendingDialog"></vending-product-select>
  </div>
</template>

<script type="text/ecmascript-6">
import v8ProductSelect from '@/components/v8-product-select.vue'
import MealProductSelect from '@/components/meal-product-select.vue'
import DrinkProductSelect from '@/components/drink-product-select.vue'
import VendingProductSelect from '@/components/vending-base-product-select.vue'

export default {
  name: 'card-exchange-product',
  components: {
    v8ProductSelect,
    MealProductSelect,
    DrinkProductSelect,
    VendingProductSelect
  },
  props: {
    useRange: {
      type: Array,
      default: () => {
        return []
      }
    },
    retailCategoryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    mealCategoryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    drinkCategoryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    includeProd: {
      type: Array,
      default: () => {
        return []
      }
    },
    includeCategory: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      selectedRetailCategory: [],
      selectedMealCategory: [],
      selectedDrinkCategory: [],
      selectedCategory: [],
      categoryProps: {
        value: 'unionCode',
        label: 'name',
        multiple: true,
        checkStrictly: false,
        emitPath: false
      },
      // 是否打开产品选择器
      isShowProductSelect: false,
      selectedProducts: [],
      isMealProductShow: false,
      isDrinkProductShow: false,
      isVendingProductShow: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  watch: {
    // 数据回显
    includeCategory(val) {
      this.selectedCategory = val
    },
    retailCategoryList(val) {
      this.selectedRetailCategory = this.selectedCategory.filter(item => {
        return treeForeach(val).some(v => v.unionCode === item.unionCode)
      }).map(item => {
        return item.unionCode
      })
    },
    mealCategoryList(val) {
      this.selectedMealCategory = this.selectedCategory.filter(item => {
        return val.some(v => v.unionCode === item.unionCode)
      }).map(item => {
        return item.unionCode
      })
    },
    drinkCategoryList(val) {
      this.selectedDrinkCategory = this.selectedCategory.filter(item => {
        return val.some(v => v.unionCode === item.unionCode)
      }).map(item => {
        return item.unionCode
      })
    },
    includeProd(val) {
      this.selectedProducts = val
    }
  },
  methods: {
    // 分类选择操作
    handleCategoryChange(val) {
      let selectedCategory = treeForeach(this.retailCategoryList).filter(item => {
        return val.some(cate => cate === item.unionCode)
      })
      this.handleEmitChange(selectedCategory)
    },

    handleMealCategoryChange(val) {
      let selectedCategory = this.mealCategoryList.filter(item => {
        return val.some(cate => cate === item.unionCode)
      })
      this.handleEmitChange(selectedCategory)
    },

    handleDrinkCategoryChange(val) {
      let selectedCategory = this.drinkCategoryList.filter(item => {
        return val.some(cate => cate === item.unionCode)
      })
      this.handleEmitChange(selectedCategory)
    },
    handleEmitChange(list) {
      let npRepeatList = list.filter(item => {
        return this.selectedCategory.every(val => val.unionCode !== item.unionCode)
      })
      this.selectedCategory.push(...npRepeatList)
      this.$emit('update:includeCategory', this.selectedCategory)
    },

    handleCategoryRemove(val) {
      let index = this.selectedCategory.findIndex(item => item.unionCode === val)
      this.selectedCategory.splice(index, 1)
    },

    // 打开或关闭产品选择器
    handleProductSelect(flag) {
      this.isShowProductSelect = flag
    },
    // 保存选中数据
    saveSelected(newSelectedList) {
      this.saveData(newSelectedList)
      this.handleProductSelect(false)
    },
    // 餐食商品操作
    addMealProduct() {
      this.isMealProductShow = true
      this.$nextTick(() => {
        this.$refs['mealRef'].initData()
      })
    },
    closedMealDialog(val) {
      this.isMealProductShow = val
    },
    // 饮品商品操作
    addDrinkProduct() {
      this.isDrinkProductShow = true
      this.$nextTick(() => {
        this.$refs['drinkRef'].initData()
      })
    },
    closedDrinkDialog(val) {
      this.isDrinkProductShow = val
    },
    addVendingProduct() {
      this.isVendingProductShow = true
      this.$nextTick(() => {
        this.$refs['vendingRef'].initData()
      })
    },
    closedVendingDialog(val) {
      this.isVendingProductShow = val
    },
    saveData(newSelectedList) {
      let noRepeatSelect = newSelectedList.filter(item => {
        if (item.uniqueCode) {
          return this.selectedProducts.every(v => {
            return v.uniqueCode !== item.uniqueCode
          })
        }
        if (item.itemCode) {
          return this.selectedProducts.every(v => {
            return v.itemCode !== item.itemCode
          })
        }
      }).map(item => {
        return {
          uniqueCode: item.uniqueCode || '',
          name: item.productName || item.name,
          skuName: item.title || '',
          barCode: item.barCode || item.qrCodes,
          itemCode: item.itemCode || ''
        }
      })
      this.selectedProducts.push(...noRepeatSelect)
      this.$emit('update:includeProd', this.selectedProducts)
    },
    // 删除
    delFunc(row) {
      let currIndex = this.selectedProducts.findIndex(item => item.uniqueCode === row.uniqueCode)
      // 当前数据暂未提交
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.selectedProducts.splice(currIndex, 1)
      })
    }
  }
}

let treeForeach = function(categoryList) {
  let result = []
  let node = [...categoryList]
  let list = [...categoryList]
  while ((node = list.shift())) {
    result.push({
      ...node
    })
    node.children &&
    list.push(
      ...node.children)
  }
  return result
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;

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

.form-contain {
  margin-top: 20px;

  .form-contain-item {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;

    .el-form-item {
      margin-right: 20px;

      .el-form-item__content {
        .form-item-title {
          font-weight: bolder;
          font-size: 16px;
          position: relative;

          .border {
            width: 1px;
            height: 16px;
            position: absolute;
            background-color: #000000;
            display: inline-block;
            top: 10px;
            margin-left: 8px;
          }

          .EnName {
            font-weight: normal;
            font-size: 14px;
            position: absolute;
            bottom: 0;
            margin-left: 17px;
          }
        }
      }
    }

    .item-long {
      width: 440px;
    }

    .item-middle {
      width: 210px;
    }
  }
}

.list-table {
  color: #666666;
  padding: 20px 0;

  .table-main {
    text-align: center;
    margin-bottom: 15px;
  }
}

.form {
  .item-long {
    width: 492px;
  }

  .el-input-number {
    width: 202px;
  }
}

.order-info {
  .order-info-item {
    margin-right: 25px;
  }

  .money {
    color: #f56c6c;
  }
}
</style>
