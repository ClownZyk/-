<template>
  <div class="only-channel-list-container">
    <div class="only-channel-list" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-select v-model="search.type" placeholder="选择合作状态检索">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="search.userName" placeholder="请输入用户名检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <!-- <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column> -->
          <el-table-column align="center" prop="shopNo" label="门店编号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userName" label="用户名" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizationName" label="店名" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryName" label="门店分类" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="isExamine" label="合作状态" width="130">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isExamine" @change="handleCheck(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.province + scope.row.city + scope.row.area + scope.row.adress}}
            </template>
          </el-table-column>
          <el-table-column prop="yuAmount" label="账户余额" min-width="150"></el-table-column>
          <el-table-column prop="withdrawAmount" label="已提现金额" min-width="150"></el-table-column>
          <el-table-column align="center" label="操作" width="150" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row)">详情</el-button>
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
import {GetExamineUserByPage, ToExamineUser} from '@/api/system'
export default {
  name: 'only-channel-list',
  watch: {
    '$route' (to, from) {
      if (to.name === 'only-channel-list') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      typeList: [
        { label: '全部', value: 0 },
        { label: '已审核', value: 1 },
        { label: '待审核', value: 2 }
      ],
      // 控制列表显示还是子内容显示
      containerIsShow: true,
      // 查询条件
      search: {
        userName: '',
        type: 0
      },
      // 列表
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 15
    }
  },
  methods: {
    // 审核
    handleCheck (row) {
      this.$confirm('确认更改审核状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = Object.assign({}, row)
        ToExamineUser(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.GetListByPage()
        })
      })
    },
    operateFunc (row) {
      this.$router.push({path: '/only-channel-detail', query: {id: row._id, cid: row.cid}})
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
        userName: this.search.userName,
        type: this.search.type,
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
      await GetExamineUserByPage(params).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
  .only-channel-list-container {
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
