<template>
  <div>
    <div v-if="containerIsShow">
      <el-form class="filters" :model="filterParam" inline>
        <div>
          <el-form-item label="方案名称"> <el-input v-model.trim="filterParam.title" placeholder="请输入方案名称搜索" clearable></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="getDefaultDishesPlanList('refresh')">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="warning" @click="handleDefaultDishesAdd">新增必点菜方案</el-button> </el-form-item>
        </div>
      </el-form>
      <el-table v-loading="listLoading" :data="dishesPlanList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="方案名称" prop="title" min-width="180"></el-table-column>
        <el-table-column label="必点类型" prop="type" min-width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? '每人必点一份' : '每笔订单必点1份' }}
          </template>
        </el-table-column>
        <el-table-column label="必点规则" prop="rule" min-width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.rule === 1 ? '固定菜品' : '可选菜品' }}
          </template>
        </el-table-column>
        <el-table-column label="桌台区域" min-width="240" align="center">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.includeArea" :key="index">{{ item.areaName + (index + 1 === scope.row.includeArea.length ? '' : '、') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" prop="isOpen" min-width="140" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isOpen" @change="openStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleDefaultDishesEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDefaultDishesDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
        </el-pagination>
      </el-row>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getDefaultDishesList, defaultDishesOperation } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'default-dishes') {
        this.getDefaultDishesPlanList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      filterParam: {
        title: ''
      },
      dishesPlanList: [],
      actionState: 0,
      listLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getDefaultDishesPlanList()
  },
  methods: {
    getDefaultDishesPlanList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getDefaultDishesList(params)
        .then(res => {
          this.listLoading = false
          this.dishesPlanList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleDefaultDishesAdd() {
      this.$router.push({ path: '/default-dishes-detail' })
    },
    handleDefaultDishesEdit(row) {
      this.$router.push({ path: '/default-dishes-detail', query: { id: row._id } })
    },
    openStateChange(row) {
      this.actionState = 1
      this.handleDefaultDishesOperation(row)
    },
    handleDefaultDishesDelete(row) {
      this.actionState = 2
      this.$confirm('此操作将永久删除该必点菜方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDefaultDishesOperation(row)
        })
        .catch(() => {})
    },
    handleDefaultDishesOperation(row) {
      let params = {
        dto: row,
        action: this.state
      }
      defaultDishesOperation(params).then(res => {
        this.$message.success(res.msg)
        this.getDefaultDishesPlanList()
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getDefaultDishesPlanList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getDefaultDishesPlanList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
