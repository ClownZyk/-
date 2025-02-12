<template>
  <div class="vote-list-container">
    <div class="vote-list" >
      <!--搜索部分-->
      <!-- <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item  label="手机号">
            <el-input v-model="search.tel" placeholder="请输入购买人手机号" clearable class="filters-search" @keyup.enter.native="_search"></el-input>
          </el-form-item>
          <el-form-item  label="姓名">
            <el-input v-model="search.name" placeholder="请输入购买人姓名" clearable class="filters-search" @keyup.enter.native="_search"></el-input>
          </el-form-item>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
        </div>
      </el-form> -->
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="userName" label="购买人姓名" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.userName || '--'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="userphone" label="购买人手机号" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="title" label="卡劵名称" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="订单时间" min-width="180" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column align="center" label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pageIndex"
                         :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 25]"
                         :total="total"
                         v-show="list.length !== 0"
                         layout="total, sizes, prev, pager, next"
                         background
                         style="float:right;">
          </el-pagination>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {userCardsList} from '@/api/system'
  export default {
    name: 'vote-list',
    data () {
      return {
        cardId: this.$route.query.id || '',
        search: { // 查询条件
          tel: '',
          name: ''
        },
        list: [], // 列表
        // 控制loading是否显示
        listLoading: false,
        // 分页相关
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    },
    methods: {
      _search() {
        this.pageIndex = 1
        this.GetListByPage()
      },
      operateFunc(detail) {
        this.isFormShow = true
        this.dialog = detail
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
      // 套餐列表
      async GetListByPage () {
        let params = {
          platformId: this.cardId,
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
        await userCardsList(params).then(res => {
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
