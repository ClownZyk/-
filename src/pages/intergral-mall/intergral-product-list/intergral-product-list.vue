<template>
  <div class="intergral-container">
    <div class="intergral-product-list" v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item> <el-input v-model="search.productName" placeholder="输入名称检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input> </el-form-item>
          <el-button type="primary" @click="GetListByPage">搜索</el-button>
        </div>
        <div class="filters-right">
          <el-form-item>
            <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
            <el-button type="danger" @click="operateDeleteMany">批量删除</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="intergralList" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading" style="width:100%;">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="productName" label="名称" width="280" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="兑换所需积分" width="180">
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.integral + '积分' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="兑换所需金额" width="180">
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isShow" label="上下架" width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShow" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sales" label="销量" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="productType" label="积分类型" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.productType === 1" style="color: #13CE66;">实物</div>
              <div v-else-if="scope.row.productType === 2" style="color: #e6b321;">虚拟商品</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sortNo" label="排序号" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button>
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
          >
          </el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {IntegralProductList, IntegralProductOperation} from '@/api/system'
export default {
  name: 'intergral-product-list',
  watch: {
    '$route' (to, from) {
      if (to.name === 'intergral-product-list') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      // 控制列表显示还是字内容显示
      containerIsShow: true,
      // 查询条件
      search: {
        // 名称
        productName: ''
      },
      // 列表
      intergralList: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push('/intergral-product-detail')
          break
        case '编辑': // 编辑
          this.$router.push({path: '/intergral-product-detail', query: {id: row._id}})
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
          this.$router.push({path: '/intergral-product-detail', query: {id: row._id, operate: 'view'}})
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      IntegralProductOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany () {
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
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        productName: this.search.productName,
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
      await IntegralProductList(params).then(res => {
        this.listLoading = false
        this.intergralList = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.intergral-container {
  position: relative;
  padding: 20px;
}
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
  .filters-right {
    flex: 0 0 200px;
  }
}
.list-table {
  color: #666666;
  .table-main {
    text-align: center;
    margin-bottom: 15px;
  }
}
</style>
