<template>
  <div class="product-container">
    <div class="product-list" v-if="containerIsShow">
      <!-- 搜索区域 -->
      <el-form class="filter" :model="filterParam" ref="filterParamRef" :inline="true">
        <div class="filter-left">
          <el-form-item><el-input v-model.trim="filterParam.productName" placeholder="请输入产品名称检索" clearable></el-input></el-form-item>
          <el-form-item> <el-cascader v-model="filterParam.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
          <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item> <el-button v-if="isManage" type="primary" @click="gotoFormulaDetail">添加自制餐食</el-button> </el-form-item>
          <el-form-item> <el-button v-if="!isManage" :loading="asyncLoading" type="warning" @click="handleHomemadeProductAsync">同步自制餐食</el-button> </el-form-item>
        </div>
      </el-form>

      <!-- 列表区域 -->
      <div class="table-list">
        <el-table v-loading="tableLoading" :data="productList" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.sku" border style="width: 50%" size="small">
                <el-table-column prop="title" label="型号" min-width="150" align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column label="配料名称(配方量)" min-width="180" align="center" show-overflow-tooltip>
                  <template slot-scope="props">
                    <div>
                      <div v-for="(item, index) of props.row.recipe" :key="index">{{ item.recipeName + '( ' + item.dose + item.recipeUnitName + ' )' }}<span style="color:#F56C6C" v-if="item.totalStock <= 5">(缺少)</span></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="可做数量" min-width="150" align="center" show-overflow-tooltip>
                  <template slot-scope="props">
                    <div>
                      <div v-for="(item, index) of props.row.recipe" :key="index">{{ item.totalStock }}</div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="180" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div><span style="color: #67C23A;" v-show="scope.row.imgs && scope.row.imgs.length > 0" class="iconfont icon-tupian"></span> {{ scope.row.productName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="产品分类" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column v-if="!isManage" prop="zoneName" label="产品区域" min-width="180" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select v-model="scope.row.zoneId" placeholder="请选择产品所在区域" size="small" @change="zoneChange($event, scope.row, 1)">
                <el-option v-for="item in zoneList" :key="item.zoneId" :label="item.zoneName" :value="item.zoneId"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="stock" label="库存" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.stock + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="价格" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="vipPrice" label="会员价" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.vipPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isShow" label="上下架" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShow" @change="homemadeProductOperation(scope.row, 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sellWell" label="热销" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sellWell" @change="homemadeProductOperation(scope.row, 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isNew" label="新品" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isNew" @change="homemadeProductOperation(scope.row, 1)"></el-switch>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="sales" label="销量" width="100" show-overflow-tooltip></el-table-column> -->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="editHomemadeProduct(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="removeHomemadeProduct(scope.row, 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </div>

      <!-- 餐食商品选择器 -->
      <meal-product-select ref="mealRef" :isSync="true" :isMealProductShow="isMealProductShow" @savedMealData="saveData" @closedMealDialog="closedMealDialog"></meal-product-select>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { GetAllCategory, getMakeZoneList, getVShopMakeProduct, vShopMakeProductOperation, HomemadeProductAsync } from '@/api/system'
import MealProductSelect from '@/components/meal-product-select.vue'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'homemade-product-list') {
        this.getProductFormulaList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    MealProductSelect
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      filterParam: {
        productName: '',
        categoryId: ''
      },
      categoryList: [],
      zoneList: [],
      productList: [],
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      asyncLoading: false,
      tableLoading: false,
      isMealProductShow: false,
      containerIsShow: true
    }
  },
  created() {
    this.getProductCategory()
    this.getZoneList()
    this.getProductFormulaList()
  },
  methods: {
    // 获取自制产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/homemade-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
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
    // 获取产品区域
    getZoneList() {
      let params = {
        zoneName: '',
        isPage: false,
        isOrder: true,
        isAsc: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getMakeZoneList(params).then(res => {
        if (res.success) {
          this.zoneList = res.data.map(item => {
            return {
              zoneId: item._id,
              zoneName: item.zoneName
            }
          })
        }
      })
    },
    // 获取自制产品列表
    getProductFormulaList() {
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
      getVShopMakeProduct(params)
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
    // 产品区域改变
    zoneChange(val, row, action) {
      row.zoneName = this.zoneList.find(item => item.zoneId === val).zoneName
      this.homemadeProductOperation(row, action)
    },
    // 删除自制产品
    removeHomemadeProduct(row, action) {
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.homemadeProductOperation(row, action)
        })
        .catch(() => {})
    },
    homemadeProductOperation(row, action) {
      let params = {
        dto: {
          ...row
        },
        action
      }
      vShopMakeProductOperation(params)
        .then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.getProductFormulaList()
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 跳转配方详情页
    gotoFormulaDetail() {
      this.$router.push({
        path: '/homemade-product-detail',
        query: {
          action: 0
        }
      })
    },
    handleHomemadeProductAsync() {
      this.isMealProductShow = true
      this.$nextTick(() => {
        this.$refs['mealRef'].initData()
      })
    },
    closedMealDialog(val) {
      this.isMealProductShow = val
    },
    saveData(newSelectedList) {
      let uniqueCodeIds = newSelectedList.map(item => item.uniqueCode)
      this.homemadeProductAsync(uniqueCodeIds)
    },
    // 自制产品同步
    homemadeProductAsync(uniqueCodeIds) {
      let params = {
        uniqueCode: uniqueCodeIds,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.asyncLoading = true
      HomemadeProductAsync(params).then(
        res => {
          this.asyncLoading = false
          this.getProductFormulaList()
        },
        () => {
          this.asyncLoading = false
        }
      )
    },
    // 自制产品编辑修改
    editHomemadeProduct(row) {
      this.$router.push({
        path: '/homemade-product-detail',
        query: {
          action: 1,
          id: row._id,
          uniqueCode: row.uniqueCode
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getProductFormulaList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProductFormulaList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductFormulaList()
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
}
</style>
