<template>
  <div>
    <el-table :data="settleList" border>
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="核销单号" prop="settle_id" min-width="180" align="center"></el-table-column>
      <el-table-column label="核销金额" prop="total_fee" min-width="160" align="center">
        <template slot-scope="scope">
          {{ Math.round(scope.row.total_fee * 0.01 * 100) / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="核销状态" prop="status" min-width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1" style="color:#E6A23C">处理中</div>
          <div v-else-if="scope.row.status === 2" style="color:#67C23A">成功</div>
          <div v-else-if="scope.row.status === 3" style="color:#F56C6C">失败</div>
          <div v-else-if="scope.row.status === 4" style="color:#909399">核销撤销</div>
        </template>
      </el-table-column>
      <el-table-column label="核销时间" prop="createTime" width="180" align="center"> </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleWriteOffQuery(scope.row)">核销查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-row>

    <!-- 核销查询弹框 -->
    <el-dialog title="核销查询" :visible.sync="isSettleShow" width="800px" :close-on-click-modal="false">
      <el-form v-loading="settleLoading" :model="settleForm" label-position="right" label-width="96px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="核销单号：">{{ settleForm.settle_id }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预付卡号：">{{ settleForm.card_id }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商户系统订单号：" label-width="130px">{{ settleForm.out_trade_no }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户号：">{{ settleForm.mch_id }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户id：">{{ settleForm.uid }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核销金额：">{{ Math.round(settleForm.settle_fee * 0.01 * 100) / 100 }} 元</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="核销状态：">
              <div v-if="settleForm.status === 1" style="color:#E6A23C">处理中</div>
              <div v-else-if="settleForm.status === 2" style="color:#67C23A">成功</div>
              <div v-else-if="settleForm.status === 3" style="color:#F56C6C">失败</div>
              <div v-else-if="settleForm.status === 4" style="color:#909399">核销撤销</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成功核销时间:" label-width="100px">{{ settleForm.succ_time || '--' }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPrepayCardSettleList, getPrepayCardSettleDetail } from '@/api/system'

export default {
  data() {
    return {
      settleList: [],
      settleForm: {},
      isSettleShow: false,
      settleLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    isSettleShow(val) {
      if (!val) {
        this.settleForm = {}
      }
    }
  },
  mounted() {
    this.getPrepayCardWriteOffList()
  },
  methods: {
    getPrepayCardWriteOffList() {
      let params = {
        card_id: this.$route.query.cardId,
        settle_id: '',
        out_trade_no: '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getPrepayCardSettleList(params).then(res => {
        this.settleList = res.data.listData
        this.total = res.total
      })
    },
    handleWriteOffQuery(row) {
      this.isSettleShow = true
      this.getSettleDetail(row)
    },
    getSettleDetail(row) {
      let params = {
        card_id: this.$route.query.cardId,
        settle_id: row.settle_id || '',
        out_trade_no: row.out_trade_no || ''
      }
      this.settleLoading = true
      getPrepayCardSettleDetail(params)
        .then(res => {
          this.settleLoading = false
          this.settleForm = res.data
        })
        .catch(err => {
          this.settleLoading = false
          this.settleForm = err.data
        })
    },
    handleSizeChange(val) {
      this.getPrepayCardWriteOffList()
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.getPrepayCardWriteOffList()
      this.pageIndex = val
    }
  }
}
</script>

<style lang="scss" scoped></style>
