<template>
  <div>
    <div class="product-list" v-if="containerIsShow">
      <!-- 搜索区域 -->
      <el-form class="filter" :model="filterParam" ref="filterParamRef" :inline="true">
        <div class="filter-left">
          <el-form-item><el-input v-model.trim="filterParam.productName" placeholder="请输入产品名称检索" clearable></el-input></el-form-item>
          <el-form-item> <el-cascader v-model="filterParam.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
          <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
        </div>
        <div class="filter-right"><el-button type="primary" @click="weighProductAsync">同步散称产品</el-button></div>
      </el-form>

      <!-- 列表区域 -->
      <div class="table-list">
        <el-table v-loading="tableLoading" :data="productList" border style="width: 100%">
          <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="200" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="categoryName" label="产品分类" min-width="140" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" prop="title" label="型号" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ' ;' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="stock" label="库存" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.stock <= 5" style="color: red;">{{ scope.row.stock }}</span> <span v-else>{{ scope.row.stock }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="价格" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ' ;' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="vipPrice" label="会员价" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.vipPrice + '元' + (index + 1 !== scope.row.sku.length ? ' ;' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isShow" label="上下架" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShow" @change="weighProductOperation(scope.row, 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sellWell" label="热销" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sellWell" @change="weighProductOperation(scope.row, 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isTop" label="店长推荐" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isTop" @change="weighProductOperation(scope.row, 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sales" label="销量" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="checkWeighProduct(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="removeWeighProduct(scope.row, 2)">删除</el-button>
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
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { GetAllCategory, getWeighProduct, weighProductOperation } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'weigh-product-list') {
        this.getWeighProductList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      filterParam: {
        productName: '',
        categoryId: ''
      },
      productList: [],
      categoryList: [],
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      containerIsShow: true,
      tableLoading: false
    }
  },
  created() {
    this.getProductCategory()
    this.getWeighProductList()
  },
  methods: {
    // 获取自制产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/weigh-product-category',
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
    // 获取散称产品列表
    getWeighProductList() {
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
      getWeighProduct(params)
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
    // 散称产品同步
    weighProductAsync() {
      this.$router.push('/v8-category-list')
    },
    // 编辑散称产品
    weighProductOperation(row, action) {
      let params = {
        dto: {
          ...row
        },
        action
      }
      weighProductOperation(params).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.getWeighProductList()
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 删除散称产品
    removeWeighProduct(row, action) {
      this.action = action
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
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
          weighProductOperation(params).then(
            res => {
              this.$message.success(res.msg)
              this.getWeighProductList()
            },
            err => {
              console.log(err.msg)
            }
          )
        })
        .catch(() => {})
    },
    // 查看散称产品数据
    checkWeighProduct(row) {
      this.$router.push({
        path: '/weigh-product-detail',
        query: {
          id: row._id,
          uniqueCode: row.uniqueCode
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getWeighProductList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getWeighProductList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getWeighProductList()
    }
  }
}
</script>

<style lang="scss" scoped>
.product-list {
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
