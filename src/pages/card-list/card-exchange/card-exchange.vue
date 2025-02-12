<template>
  <div class="list-container">
    <!-- 搜索 -->
    <div v-if="containerIsShow">
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item> <el-input v-model="search.name" placeholder="输入卡券标题检索"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="_initData">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button> </el-form-item>
        </div>
      </el-form>
      <!-- 表格 -->
      <div class="list-table">
        <el-table class="table-main" :data="contentList" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
          <el-table-column prop="title" label="标题" align="center" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="子标题" align="center" min-width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.subTitle || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="库存" align="center" min-width="100"></el-table-column>
          <el-table-column prop="useLimit" label="使用上限" align="center" min-width="100"></el-table-column>
          <el-table-column prop="getLimit" label="领取上限" align="center" min-width="100"></el-table-column>
          <el-table-column label="领取时间" align="center" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope"
              >{{ scope.row.startTime.split(' ')[0] }} - {{ scope.row.endTime.split(' ')[0] }}</template
            >
          </el-table-column>
          <el-table-column label="创建时间" align="center" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" fixed="right" v-if="isManage">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button size="mini" type="danger" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
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
import { GiftCardList, GiftCardOperation } from '@/api/system'
export default {
  watch: {
    $route(to, from) {
      if (to.name === 'card-exchange') {
        this._initData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      containerIsShow: true,
      search: {
        name: ''
      },
      contentList: [], // 表格列表
      total: 0, // 分页总数
      pageIndex: 1, // 当前页码
      pageSize: 10, // 每页条数
      listLoading: false // 控制loading是否显示
    }
  },
  methods: {
    // 增删改查
    operateFunc(row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push('/card-exchange-detail')
          break
        case '编辑': // 编辑
          this.$router.push({ path: '/card-exchange-detail', query: { id: row._id } })
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
            path: '/card-exchange-detail',
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
      GiftCardOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this._initData()
      })
    },

    _initData() {
      let params = {
        title: this.search.name,
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
      GiftCardList(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
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
