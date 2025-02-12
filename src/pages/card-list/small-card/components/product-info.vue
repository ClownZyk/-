<template>
  <div class="product-container">
    <div class="product">
      <!-- 分类添加部分 -->
      <el-form class="filters" :inline="true" style="margin-bottom:20px;">
        <el-form-item label="饮品商品分类：">
          <el-select multiple v-model="selectedCategory" placeholder="请选择分类" @change="handleCategoryChange" style="width: 400px">
            <el-option v-for="item in categoryList" :key="item.unionCode" :label="item.name" :value="item.unionCode"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 产品添加部分 -->
      <el-form ref="searchForm" :inline="true">
        <el-form-item> <el-button type="success" @click="addDrinkProduct">添加饮品产品</el-button> </el-form-item>
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
    <!-- 饮品商品选择器 -->
    <drink-product-select ref="drinkRef" :isDrinkProductShow="isDrinkProductShow" @savedDrinkData="saveData" @closedDrinkDialog="closedDrinkDialog"></drink-product-select>
  </div>
</template>

<script type="text/ecmascript-6">
import DrinkProductSelect from '@/components/drink-product-select.vue'
import { GetListByPage } from '@/api/system'
export default {
  name: 'card-exchange-product',
  components: {
    DrinkProductSelect
  },
  props: {
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
  data () {
    return {
      categoryList: [],
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
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  watch: {
    // 数据回显
    includeCategory(val) {
      this.selectedCategory = val.map(item => {
        return item.unionCode
      })
    },
    includeProd(val) {
      this.selectedProducts = val
    }
  },
  created() {
    this.GetAllDrinkCategory()
  },
  methods: {
    // 商品分类
    GetAllDrinkCategory () {
      let params = {
        belongMenu: '/drink-product-category',
        categoryName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetListByPage(params).then(res => {
        if (res.success) {
          this.categoryList = res.data.map(item => {
            return {
              name: item.categoryName,
              unionCode: item.unionCode
            }
          })
        }
      })
    },

    handleCategoryChange(val) {
      this.selectedCategory = this.categoryList.filter(item => {
        return val.some(cate => cate === item.unionCode)
      })
      this.$emit('update:includeCategory', this.selectedCategory)
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
    saveData(newSelectedList) {
      let norepeatSelect = newSelectedList.filter(item => {
          return this.selectedProducts.every(v => v.uniqueCode !== item.uniqueCode)
        }).map(item => {
        return {
            uniqueCode: item.uniqueCode,
            name: item.productName,
            skuName: item.title,
            barCode: item.barCode
          }
      })
      this.selectedProducts.push(...norepeatSelect)
      this.$emit('update:includeProd', this.selectedProducts)
    },
    // 删除
    delFunc (row) {
      let currIndex = this.selectedProducts.findIndex(item => item.uniqueCode === row.uniqueCode)
      // 当前数据暂未提交
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.selectedProducts.splice(currIndex, 1)
      })
    }
  }
}

// let treeForeach = function (categoryList) {
//   let result = []
//   let node = [...categoryList]
//   let list = [...categoryList]
//   while ((node = list.shift())) {
//     result.push({
//       ...node
//     })
//     node.children &&
//       list.push(
//         ...node.children)
//   }
//   return result
// }
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
