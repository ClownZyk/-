<template>
  <div class="list-container">
    <!-- 搜索 -->
    <div v-if="containerIsShow1">
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item label="卡劵有效期">
            <el-date-picker v-model="timeFrame" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="_initData">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button> </el-form-item>
        </div>
      </el-form>
      <!-- 表格 -->
      <div class="list-table">
        <el-table class="table-main" :data="contentList" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
          <el-table-column prop="title" label="卡劵名称" align="center" width="160"></el-table-column>
          <el-table-column prop="getLimit" label="使用上限" align="center" width="160"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" align="center" min-width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endTime" label="结束时间" align="center" min-width="240"></el-table-column>
          <el-table-column align="center" prop="isOpen" label="启用状态" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isOpen" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <!--
            <el-table-column label="创建时间" align="center" min-width="150">
              <template slot-scope="scope">{{scope.row.createTime.split(' ')[0]}}</template>
            </el-table-column>
          -->
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="operateFunc(scope.row, '编辑', 1)" v-if="isManage">编辑</el-button>
              <el-button size="mini" type="warning" @click="operateFunc(scope.row, '查看', null)" v-else>查看</el-button>
              <el-button size="mini" type="danger" @click="operateFunc(scope.row, '删除', 2)" v-if="isManage">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :total="total" layout="total, prev, pager, next" background style="float:right;"></el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { CardPlatformList, CardPlatformOperation } from '@/api/system'
export default {
  watch: {
    $route(to, from) {
      if (to.name === 'card-activity') {
        this._initData()
        this.containerIsShow1 = true
      } else {
        this.containerIsShow1 = false
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      containerIsShow1: true,
      timeFrame: [],
      contentList: [], // 表格列表
      total: 0, // 分页总数
      pageIndex: 1, // 当前页码
      pageSize: 20, // 每页条数
      listLoading: false // 控制loading是否显示
    }
  },
  methods: {
    // 增删改查
    operateFunc(row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push({ path: '/card-activity-detail', query: { action: 0, type: 0 } })
          break
        case '编辑': // 编辑
          this.$router.push({
            path: '/card-activity-detail',
            query: { id: row._id, action: 1, type: row.cardType, cardId: row.cardId }
          })
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
            path: '/card-activity-detail',
            query: { id: row._id, operate: 'view', action: null, type: row.cardType }
          })
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios(item) {
      let params = {
        Dto: {
          ...item,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        Action: this.operateAction
      }
      CardPlatformOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this._initData()
      })
    },
    _initData() {
      let params = {
        sTime: this.timeFrame.length > 0 ? `${this.timeFrame[0]}~${this.timeFrame[1]}` : '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      CardPlatformList(params).then(
        res => {
          if (res.success) {
            this.listLoading = false
            this.contentList = res.data
            this.total = res.total
          } else this.$message.error(res.msg)
        },
        err => {
          this.listLoading = false
          this.$message.error(err.msg)
        }
      )
    },
    handleSizeChange(val) {
      this.pageSize = val
      this._initData()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this._initData()
    }
  },
  mounted() {
    this._initData()
  }
}
</script>

<style scoped lang="scss">
.list-container {
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
</style>
