<template>
  <div class="groupon-container">
    <div class="groupon-list" v-if="containShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <!--
          <div class="filters-left">
            <el-form-item>
              <el-input v-model="search.activityName" placeholder="输入名称检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            </el-form-item>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </div>
        -->
        <div class="filters-right">
          <el-form-item> <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button> </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="grouponList" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="setMealName" label="套餐名称" min-width="240" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="setMealBarCode" label="套餐条码" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="setPrice" label="套餐价" min-width="140" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column align="center" prop="totalPrice" label="产品总价" min-width="140" show-overflow-tooltip></el-table-column> -->
          <el-table-column align="center" prop="number" label="选购数量限制" width="114" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reserveName" align="center" label="开启状态" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.display" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
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
          >
          </el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {GetChooseMeal, ChooseMealOperation} from '@/api/system'
export default {
  name: 'groupon-list',
  watch: {
    '$route' (to, from) {
      if (to.name === 'choose-activity') {
        this.GetListByPage()
        this.containShow = true
      } else {
        this.containShow = false
      }
    }
  },
  data () {
    return {
      // 控制列表显示还是字内容显示
      containShow: true,
      // 查询条件
      search: {
        // 名称
      },
      // 列表
      grouponList: [],
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
  mounted() {
    this.GetListByPage()
  },
  methods: {
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push({
            path: '/choose-activity-detail',
            query: {promotionId: this.$route.query.id, action: action}
          })
          break
        case '编辑': // 编辑
          this.$router.push({
            path: '/choose-activity-detail',
            query: {id: row._id, promotionId: this.$route.query.id, action: action}
            })
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          }).catch(() => {})
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        case '查看': // 查看
          this.$router.push({
            path: '/choose-activity-detail',
            query: {id: row._id, operate: 'view', promotionId: this.$route.query.id}
          })
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      ChooseMealOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
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
      if (!this.search.activityTimeArr) {
        this.search.activityTimeArr = []
      }
      let params = {
        promotionId: this.$route.query.id,
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
      await GetChooseMeal(params).then(res => {
        this.listLoading = false
        this.grouponList = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
