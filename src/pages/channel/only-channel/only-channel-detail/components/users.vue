<template>
  <div class="users-container">
    <div class="users">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.nickName" placeholder="输入昵称检索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="nickName" label="昵称" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="payTotal" label="消费金额" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="payCount" label="消费单数" min-width="200" show-overflow-tooltip></el-table-column>
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
  </div>
</template>

<script type="text/ecmascript-6">
import {ChannelUserList} from '@/api/system'
export default {
  name: 'users',
  data () {
    return {
      // 查询条件
      search: {
        nickName: ''
      },
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
      if (this.$route.query.cid) {
        let params = {
          parentOpenid: this.$route.query.cid,
          nickName: this.search.nickName,
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
        await ChannelUserList(params).then(res => {
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
</style>
