<template>
  <div class="vote-item-container">
    <div class="vote-item">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.name" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="operateFunc('', '添加', 0)" :disabled="disableOperate">新增</el-button>
          <el-button type="danger" @click="operateDeleteMany" :disabled="disableOperate">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serialNumber" label="编号" width="80"></el-table-column>
          <el-table-column align="center" prop="name" label="投票项名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="activityName" label="投票活动名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="voteCount" label="投票数" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="viewCount" label="浏览量" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)" :disabled="disableOperate">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)" :disabled="disableOperate">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :page-sizes="[10, 15, 20, 25]"
                        :total="total"
                        layout="total, sizes, prev, pager, next"
                        background
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {VoteObjectGetListByPage, VoteObjectOperation} from '@/api/system'
export default {
  name: 'vote-item',
  data () {
    return {
      // 查询条件
      search: {
        // 活动名称
        name: ''
      },
      // 列表
      list: [],
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
      // 是否禁用各种操作
      disableOperate: false
    }
  },
  methods: {
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push({path: '/vote-item-detail', query: {voteActivityId: this.$route.query.id, voteActivityName: this.$route.query.activityName}})
          break
        case '编辑': // 编辑
          this.$router.push({path: '/vote-item-detail', query: {voteActivityId: this.$route.query.id, voteActivityName: this.$route.query.activityName, voteItemId: row._id}})
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '查看': // 查看
          this.$router.push({path: '/vote-item-detail', query: {voteActivityId: this.$route.query.id, voteActivityName: this.$route.query.activityName, voteItemId: row._id, operate: 'view'}})
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
      VoteObjectOperation(params).then(res => {
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
      console.log('pageSize 改变')
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      console.log('currentPage 改变')
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      if (this.$route.query.operate !== undefined && (this.$route.query.operate === 'add' || this.$route.query.operate === 'view')) {
          // 说明是新增或者查看
        this.disableOperate = true
      }
      if (this.$route.query.id !== undefined) {
        let params = {
          activityId: this.$route.query.id,
          name: this.search.name,
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
        await VoteObjectGetListByPage(params).then(res => {
          this.listLoading = false
          this.list = res.data
          this.total = res.total
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
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
