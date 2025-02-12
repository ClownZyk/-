<template>
  <div v-if="containerIsShow">
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="套餐名称"> <el-input v-model.trim="filterParam.setMealName" placeholder="请输入套餐名称搜索" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="getTableSetMealProduct('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div><el-button type="warning" @click="handleTableSetMealAdd">新增套餐</el-button></div>
    </el-form>
    <el-table v-loading="tableLoading" :data="setMealList" border>
      <el-table-column align="center" type="index" label="编号" width="60"></el-table-column>
      <el-table-column align="center" prop="setMealName" label="套餐名称" min-width="240"></el-table-column>
      <el-table-column align="center" prop="setMealBarCode" label="套餐条码" min-width="140"></el-table-column>
      <el-table-column align="center" prop="setPrice" label="套餐价" min-width="140"></el-table-column>
      <el-table-column align="center" prop="setVipPrice" label="套餐会员价" min-width="140"></el-table-column>
      <el-table-column align="center" label="上下架" min-width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.display" @change="handelSetMealStateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sortNo" label="排序号" min-width="120"></el-table-column>
      <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleTableSetMealEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleTableSetMealDelete(scope.row)">删除</el-button>
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
import { getTableSetMealList, tableSetMealOperation } from '@/api/system'
export default {
  watch: {
    $route(to, from) {
      if (to.name === 'setMeal-product-list') {
        this.getTableSetMealProduct()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      filterParam: {
        setMealName: ''
      },
      setMealList: [],
      operateState: 0,
      tableLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getTableSetMealProduct()
  },
  methods: {
    getTableSetMealProduct(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        setMealName: '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getTableSetMealList(params)
        .then(res => {
          this.tableLoading = false
          this.setMealList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleTableSetMealAdd() {
      this.$router.push('/setMeal-product-detail')
    },
    handleTableSetMealEdit(row) {
      this.$router.push({
        path: '/setMeal-product-detail',
        query: {
          setMealId: row._id
        }
      })
    },
    handelSetMealStateChange(row) {
      this.operateState = 1
      this.handleSetMealOperation(row)
    },
    handleTableSetMealDelete(row) {
      this.operateState = 2
      this.$confirm('此操作将永久删除该套餐信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleSetMealOperation(row)
        })
        .catch(() => {})
    },
    handleSetMealOperation(row) {
      let params = {
        dto: row,
        action: this.operateState
      }
      tableSetMealOperation(params).then(res => {
        this.$message.success(res.msg)
        this.getTableSetMealProduct()
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableSetMealProduct()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTableSetMealProduct()
    }
  }
}
</script>

<style lang="scss" scoped></style>
