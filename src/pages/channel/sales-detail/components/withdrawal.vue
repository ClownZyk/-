<template>
  <div class="withdrawal">
    <el-table class="main-table" ref="mainTable" :data="mainList" border tooltip-effect="dark" v-loading="listLoading">
      <el-table-column align="center" prop="serialNumber" label="提现序列号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="money" label="提现金额" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="applyState" label="申请状态" width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.applyState === 0 ? '待审核' : scope.row.applyState === 1 ? '审核通过' : scope.row.applyState === 2 ? '审核驳回' : ''}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="workDay" label="预计多少工作日到账" width="250" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="issue" label="是否发放" width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.applyState === true ? '是' : '否'}}
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
import {WithDrawalsGetListByPage} from '@/api/system'
export default {
  name: 'sales-withdrawal',
  data () {
    return {
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 控制表格是否显示加载中
      listLoading: false,
      // 内容列表
      mainList: []
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
    // 获取提现数据
    async GetListByPage () {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          personId: this.$route.query.id,
          serialNumber: '',
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
        await WithDrawalsGetListByPage(parmas).then(res => {
          if (res.success) {
            this.listLoading = false
            this.mainList = res.data
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