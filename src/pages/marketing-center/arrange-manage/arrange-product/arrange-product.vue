<template>
  <div class="product-container">
    <div class="product-list" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <!-- <el-form-item>
            <el-cascader
              v-model="search.categoryIds"
              :options="categoryList"
              change-on-select
              clearable
              expand-trigger="hover"
              placeholder="请选择产品分类"
            ></el-cascader>
          </el-form-item> -->
          <el-form-item>
            <el-input
              v-model="search.productName"
              placeholder="请输入商品名检索"
              class="filters-search"
              @keyup.enter.native="ShopGetListByPage"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="_search">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
                  <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table
          class="table-main"
          ref="listTable"
          :data="productList"
          border
          :default-sort="{prop: 'sales', order: 'descending'}"
          tooltip-effect="dark"
          @selection-change="selectTableRow"
          v-loading="listLoading || uploadLoading"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column
            align="center"
            prop="prodName"
            label="产品名称"
            min-width="280"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            prop="categoryId"
            label="分类"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="price" label="价格" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column
            align="center"
            prop="vipPrice"
            label="会员价"
            width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            prop="isShow"
            label="上下架"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShow" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" width="220" show-overflow-tooltip></el-table-column>
          <el-table-column
            align="center"
            label="操作"
            min-width="250"
            show-overflow-tooltip
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button> -->
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
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
            style="float:right;"
          ></el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  GetReserveProduct,
  reserveMProdOperation,
  GetAllCategory,
  AllotGetUserDropDownList,
  UpdateUpDown
} from '@/api/system'
import {formatDate} from '@/components/js/data'
export default {
  name: 'product-list',
  watch: {
    $route(to, from) {
      console.log(to.name)
      if (to.name === 'arrange-product') {
        this.ShopGetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      stockOrShowList: [
        { value: 0, label: '全部' },
        { value: 1, label: '有库存' },
        { value: 2, label: '无库存' },
        { value: 3, label: '已上架' },
        { value: 4, label: '未上架' }
      ],
      uploadLoading: false,
      skuModal: false, // 库存修改弹框显示状态
      // 控制列表显示还是字内容显示
      containerIsShow: true,
      // 查询条件
      search: {
        category: '',
        categoryId: '',
        categoryIds: [],
        productName: '',
      },
      dialog: {},
      // 分类列表
      categoryList: [],
      // 产品列表
      productList: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      // 多选删除的数据列表
      checkedDatas: [],
      outputs: []
    }
  },
  methods: {
    _search() {
      this.pageIndex = 1
      this.ShopGetListByPage()
    },
    // 新增分类
    addCategory() {
      this.$router.push('/product-category')
    },
    // 增删改查
    operateFunc(row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push('/arrange-product-detail')
          break
        case '编辑': // 编辑
          this.$router.push({ path: '/arrange-product-detail', query: { id: row._id } })
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        case '查看': // 查看
          this.$router.push({
            path: '/arrange-product-detail',
            query: { id: row._id, operate: 'view' }
          })
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios(item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      reserveMProdOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.ShopGetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany() {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 选中行
    selectTableRow(row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.ShopGetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.ShopGetListByPage()
    },
    // 加载商品分类
    async GetAllCategory() {
      let params = {
        belongMenu: '/product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
            this.categoryList.unshift({
              value: '',
              label: '所有产品'
            })
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 加载数据
    async ShopGetListByPage() {
      if (this.search.categoryIds.length > 0) {
        let _index = this.search.categoryIds.length - 1
        this.search.categoryId = this.search.categoryIds[_index]
      } else {
        this.search.categoryId = ''
      }
      let params = {
        name: this.search.productName,
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
      await GetReserveProduct(params).then(
        res => {
          this.listLoading = false
          this.productList = res.data
          this.total = res.total
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    }
  },
  mounted() {
    this.ShopGetListByPage()
    // this.GetAllCategory()
  }
}
</script>

<style lang="scss" scoped>
.product-container {
  position: relative;
  padding: 20px;
}
// .product-list {
//   position: fixed;
//   width: calc(100% - 240px);
//   height: calc(100vh - 90px);
//   overflow: scroll;
// }
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
      margin-bottom: 10px;
    }
  }
  .el-form-item {
    margin-bottom: 0;
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
.sku-list {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  .sku-item {
    flex: 0 0 50%;
    .mag-dialog-row {
      .el-form-item {
        .form-item-input {
          width: 200px;
        }
      }
    }
  }
}
</style>
