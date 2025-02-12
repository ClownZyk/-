<template>
  <div class="activity-enroll-container">
    <div class="activity-enroll" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-cascader v-model="search.categoryIds" :options="categoryList" change-on-select clearable expand-trigger="hover"></el-cascader>
            <el-button type="primary" @click="addCategory">新增分类</el-button>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.activityName" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
          <el-button type="danger" @click="operateDeleteMany">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="activityName" label="活动名称" width="280"></el-table-column>
          <el-table-column align="center" prop="beginTime" label="开始时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="endTime" label="结束时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="stopApply" label="截止报名时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="personLimit" label="限制报名人数" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="hotLine" label="咨询热线" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button>
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
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
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {ActivityEnrollGetListByPage, ActivityEnrollOperation, GetAllCategory} from '@/api/system'
export default {
  name: 'activity-enroll',
  watch: {
    '$route' (to, from) {
      if (to.name === 'activity-enroll') {
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
        // 分类
        categoryId: '',
        categoryIds: [],
        // 活动名称
        activityName: ''
      },
      // 分类列表
      categoryList: [],
      // 活动报名列表
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
      checkedDatas: []
    }
  },
  methods: {
    // 新增分类
    addCategory () {
      this.$router.push('/activity-enroll-category')
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push('/activity-enroll-detail')
          break
        case '编辑': // 编辑
          this.$router.push({path: '/activity-enroll-detail', query: {id: row._id}})
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '查看': // 查看
          this.$router.push({path: '/activity-enroll-detail', query: {id: row._id, operate: 'view'}})
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
      ActivityEnrollOperation(params).then(res => {
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
    // 加载商品分类
    async GetAllCategory () {
      let params = {
        belongMenu: '/activity-enroll-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetAllCategory(params).then(res => {
        if (res.success) {
          this.categoryList = res.data
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 加载数据
    async GetListByPage () {
      if (this.search.categoryIds.length > 0) {
        this.search.categoryId = this.search.categoryIds[this.search.categoryIds.length - 1]
      } else {
        this.search.categoryId = ''
      }
      let params = {
        categoryId: this.search.categoryId,
        activityName: this.search.activityName,
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
      await ActivityEnrollGetListByPage(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
    this.GetAllCategory()
  }
}
</script>

<style lang="scss" scoped>
  .activity-enroll-container {
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
