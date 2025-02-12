<template>
  <div class="benefit">
    <el-form ref="form" inline label-width="80px">
      <el-form-item label="订单时间">
        <el-date-picker
          v-model="timeFrame"
          :clearable="false"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="GetListByPage">搜索</el-button>
      <!--<el-button type="primary" :disabled = "this.selectTableList.length === 0" @click="exportMany">批量导出</el-button>-->
    </el-form>
    <el-table class="main-table" ref="mainTable" :data="mainList" border tooltip-effect="dark" v-loading="listLoading">
      <el-table-column align="center" prop="orderId" label="订单号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="orderMoney" label="订单支付金额" width="250" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="benefitMoney" label="分润的金额" width="250" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="benefitIntegral" label="分润的积分数量" width="250" show-overflow-tooltip></el-table-column>
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
import {GetWriteDownListByPage} from '@/api/system'
import { formatTime2 } from '@/filters/filters'
export default {
  name: 'only-channel-benefit',
  data () {
    return {
      timeFrame: [formatTime2(new Date()), formatTime2(new Date())],
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      // 控制表格是否显示加载中
      listLoading: false,
      // 内容列表
      mainList: []
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
    // 获取分润记录
    async GetListByPage () {
      if (this.$route.query.id !== undefined && this.$route.query.cid !== undefined) {
        if (!this.timeFrame) {
          this.timeFrame = []
        }
        let parmas = {
          _id: this.$route.query.id,
          beginTime: this.timeFrame[0],
          endTime: this.timeFrame[1],
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$route.query.cid
        }
        this.listLoading = true
        await GetWriteDownListByPage(parmas).then(res => {
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