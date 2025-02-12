<template>
  <div class="partner">
    <el-table class="main-table" ref="mainTable" :data="personList" border tooltip-effect="dark" v-loading="listLoading">
      <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="realName" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="userName" label="用户名" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="phone" label="手机" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="jobNumber" label="工号" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="jobState" label="在职状态" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime.substring(0, 10)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 'Update')">查看</el-button> -->
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
                  layout="total, sizes, prev, pager, next, jumper"
                  background
                  style="float:right; margin-top: 10px;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import {SalesManGetListByPage, SalesManOperation} from '@/api/system'
export default {
  name: 'channel-partner',
  data () {
    return {
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 控制表格是否显示加载中
      listLoading: false,
      // 内容列表
      personList: []
    }
  },
  methods: {
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
    // 增删改查
    operateFunc (row, title, action) {
      if (action === 1) {
        this.$router.push({path: '/sales-detail', query: {id: row._id, openid: row.openid}})
      } else if (action === 2) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let parmas = {
            dto: row,
            action: action
          }
          SalesManOperation(parmas).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this.GetListByPage()
          })
        })
      }
    },
    // 获取合伙人（业务员）数据
    async GetListByPage () {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          channelId: this.$route.query.id,
          realName: '',
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
        await SalesManGetListByPage(parmas).then(res => {
          if (res.success) {
            this.listLoading = false
            this.personList = res.data
            this.total = res.total
          } else {
            this.$message.error(res.msg)
          }
        }, err => {
          this.$message.error(err.msg)
        })
      }
    }
  },
  mounted () {
    this.GetListByPage()
  }
}
</script>

<style>

</style>