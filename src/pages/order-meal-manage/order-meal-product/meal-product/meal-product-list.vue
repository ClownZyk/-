<template>
  <div v-if="containerIsShow">
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="菜品分类" prop="categoryId">
          <el-select v-model="filterParam.categoryId" placeholder="请选择菜品分类"> <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
        <el-form-item label="菜品名称" prop="productName"> <el-input type="text" v-model.trim="filterParam.productName" placeholder="请输入菜品名称搜索"></el-input> </el-form-item>
        <el-form-item><el-button type="primary" @click="getTableProductList('refresh')">搜索</el-button></el-form-item>
      </div>
      <div>
        <el-form-item> <el-button type="warning" @click="handleTableProductAdd">新增菜品</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" :data="productList" border>
      <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
      <el-table-column prop="productName" label="菜品名称" min-width="180" align="center">
        <template slot-scope="scope">
          <div><span style="color: #67C23A;" v-show="scope.row.imgs && scope.row.imgs.length > 0" class="iconfont icon-tupian"></span> {{ scope.row.productName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="菜品分类" min-width="120" align="center"> </el-table-column>
      <!--
        <el-table-column prop="zoneName" label="菜品区域" min-width="180" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.zoneId" placeholder="请选择菜品所在区域" size="small" @change="zoneChange($event, scope.row, 1)">
              <el-option v-for="item in zoneList" :key="item.zoneId" :label="item.zoneName" :value="item.zoneId"> </el-option>
            </el-select>
          </template>
        </el-table-column>
      -->
      <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="stock" label="库存" min-width="100">
        <template slot-scope="scope">
          <div>
            <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.stock + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="零售价" min-width="120">
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="vipPrice" label="会员价" min-width="120">
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.vipPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isShow" label="上下架" min-width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" @change="handleProductState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sellWell" label="热销" min-width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.sellWell" @change="handleProductState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="isNew" label="新品" min-width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isNew" @change="handleProductState(scope.row)"></el-switch>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="sales" label="销量" width="100"></el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleTableProductEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleTableProductDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </el-row>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { GetAllCategory, getTableProductList, tableProductOperation } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'meal-product-list') {
        this.getTableProductList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      filterParam: {
        categoryId: '',
        productName: ''
      },
      categoryList: [],
      productList: [],
      listLoading: false,
      operateState: 0,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getTableProductList()
  },
  methods: {
    getProductCategory() {
      let params = {
        belongMenu: '/table-product-category',
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
    getTableProductList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
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
      this.listLoading = true
      getTableProductList(params)
        .then(res => {
          this.listLoading = false
          this.productList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleTableProductAdd() {
      this.$router.push('/meal-product-detail')
    },
    handleTableProductEdit(row) {
      this.$router.push({ path: '/meal-product-detail', query: { productId: row._id } })
    },
    handleProductState(row) {
      this.operateState = 1
      this.handleTableProductOperation(row)
    },
    handleTableProductDelete(row) {
      this.operateState = 2
      this.$confirm('此操作将永久删除该菜品数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleTableProductOperation(row)
        })
        .catch(() => {})
    },
    handleTableProductOperation(row) {
      let params = {
        dto: row,
        action: this.operateState
      }
      tableProductOperation(params).then(res => {
        this.$message.success(res.msg)
        this.getTableProductList()
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableProductList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTableProductList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
