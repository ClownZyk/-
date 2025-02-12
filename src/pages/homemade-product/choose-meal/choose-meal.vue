<template>
  <div class="meal-container">
    <div class="meal-list" v-if="containerIsShow">
      <!-- 添加 -->
      <div class="filter">
        <el-button type="primary" @click="addSetMeal">新增套餐</el-button>
      </div>
      <!-- 列表区 -->
      <div class="table-list">
        <el-table v-loading="tableLoading" ref="listTable" :data="makeSetMealList" border>
          <el-table-column align="center" type="index" label="编号" width="60"></el-table-column>
          <el-table-column align="center" prop="setMealName" label="套餐名称" min-width="240" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="zoneName" label="套餐区域" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="setMealBarCode" label="套餐条码" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="setPrice" label="套餐价" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="开启状态" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.display" @change="setMealOperation(scope.row, 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editSetMeal(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="removeSetMeal(scope.row, 2)">删除</el-button>
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
import { getMakeSetMealList, makeSetMealOperation } from '@/api/system'
export default {
  watch: {
    $route(to, from) {
      if (to.name === 'choose-meal') {
        this.getChooseMealActivity()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      makeSetMealList: [],
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      tableLoading: false,
      containerIsShow: true
    }
  },
  mounted() {
    this.getChooseMealActivity()
  },
  methods: {
    // 获取选购套餐
    getChooseMealActivity() {
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
      getMakeSetMealList(params).then(
        res => {
          this.makeSetMealList = res.data
          this.total = res.total
          this.tableLoading = false
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    addSetMeal() {
      this.$router.push({
        path: '/choose-meal-detail'
      })
    },
    // 编辑套餐
    editSetMeal(row) {
      this.$router.push({
        path: '/choose-meal-detail',
        query: {
          id: row._id
        }
      })
    },
    // 删除套餐
    removeSetMeal(row, action) {
      this.$confirm('此操作将永久删除该套餐, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setMealOperation(row, action)
        })
        .catch(() => {})
    },
    // 套餐处理
    setMealOperation(row, action) {
      let params = {
        dto: row,
        action
      }
      makeSetMealOperation(params).then(
        res => {
          this.$message.success(res.msg)
          this.getChooseMealActivity()
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getChooseMealActivity()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getChooseMealActivity()
    }
  }
}
</script>

<style lang="scss" scoped>
.meal-container {
  .table-list {
    margin-top: 15px;
    .pagination {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
