<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form ref="searchForm" :model="filterParam" :inline="true">
        <el-form-item> <el-cascader v-model="filterParam.categoryId" :options="categoryList" :props="cateProps" clearable placeholder="请选择产品分类"></el-cascader> </el-form-item>
        <el-form-item> <el-input v-model="filterParam.productName" placeholder="请输入商品名检索" class="filters-filterParam" clearable @keyup.enter.native="getMaterialProduct"></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="productList" border>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="220" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #67C23A;" v-show="scope.row.mainImg !== null && scope.row.mainImg.url" class="iconfont icon-tupian"></span> {{ scope.row.productName }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="categoryName" label="产品分类" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="barCode" label="产品条码" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.barCode + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="型号" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
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
            <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleMaterialProductV8Sync(scope.row)" v-permission="['/material-product-list:update']">V8同步</el-button>
            <el-button type="primary" size="mini" @click="handleMaterialProductEdit(scope.row)" v-permission="['/material-product-list:update']">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleMaterialProductDelete(scope.row)" v-permission="['/material-product-list:delete']">删除</el-button>
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
          style="margin-top15px;text-align:right;"
        ></el-pagination>
      </el-col>

      <!-- v8同步 -->
      <el-dialog title="同步内容选择" :visible.sync="isV8SyncShow" width="600px" @close="isV8SyncShow = false" :close-on-click-modal="false">
        <el-form :model="v8SyncForm" inline>
          <el-row>
            <el-col :span="8">
              <el-form-item label="产品名称"> <el-switch v-model="v8SyncForm.productName" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品分类"> <el-switch v-model="v8SyncForm.categoryId" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最小计量单位名称"> <el-switch v-model="v8SyncForm.unitName" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="产品sku"> <el-switch v-model="v8SyncForm.sku" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="列表主图"> <el-switch v-model="v8SyncForm.mainImg" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="sureSyncV8Detail">确 定</el-button> </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getMaterialProductList, GetAllCategory, materialProductOperation, UpdateProduct } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'material-product-list') {
        this.getMaterialProduct()
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
      productList: [],
      categoryList: [],
      v8SyncForm: {
        productName: true,
        categoryId: false,
        unitName: false,
        sku: true,
        mainImg: true
      },
      isV8SyncShow: false,
      listLoading: false,
      submitLoading: false,
      containerIsShow: true,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      cateProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  mounted() {
    if (this.isManage) {
      this.getAllShop()
    } else {
      this.filterParam.cid = this.$store.state._cid
      this.getMaterialProduct()
      this.GetAllCategory()
    }
  },
  methods: {
    GetAllCategory() {
      let params = {
        belongMenu: '/material-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(
        res => {
          this.categoryList = [{
              value: '',
              label: '所有产品'
            }, ...res.data]
        }
      )
    },
    // 加载数据
    getMaterialProduct() {
      let params = {
        categoryId: this.filterParam.categoryId,
        productName: this.filterParam.productName,
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
      getMaterialProductList(params).then(
        res => {
          this.listLoading = false
          this.productList = res.data
          this.total = res.total
        }
      ).catch(() => {
        this.listLoading = false
      })
    },
    handleMaterialProductEdit(row) {
      this.$router.push({path: '/material-product-detail', query: {id: row._id}})
    },
    handleMaterialProductDelete(row) {
      this.$confirm('确定删除该耗材商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        let params = {
          dto: {...row},
          action: 2
        }
        materialProductOperation(params).then(res => {
          this.$message.success(res.msg)
          this.getMaterialProduct()
        })
      }).catch(() => {})
    },
    // v8同步
    handleMaterialProductV8Sync(row) {
      this.isV8SyncShow = true
      this.v8SyncForm.uniqueCode = row.uniqueCode
    },
    sureSyncV8Detail() {
      let params = {
        ...this.v8SyncForm,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.submitLoading = true
      UpdateProduct(params).then(
        res => {
          this.isV8SyncShow = false
          this.submitLoading = false
          this.$message.success(res.msg)
          this.getMaterialProduct()
        }
      ).catch(() => {
          this.submitLoading = false
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getMaterialProduct()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getMaterialProduct()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getMaterialProduct()
    }
  }
}
</script>

<style lang="scss" scoped></style>
