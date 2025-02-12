<template>
  <div>
    <el-form :model="searchForm" inline>
      <el-form-item label="售卖机名称">
        <el-select v-model="searchForm.vmCode" placeholder="请选择售卖机" clearable @change="machinceChange"> <el-option v-for="item in vendingMachineList" :key="item._id" :label="item.name" :value="item.code"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="订单号"> <el-input type="text" v-model.trim="searchForm.orderId" placeholder="请输入订单号检索" clearable></el-input> </el-form-item>
      <el-form-item label="订单交易状态">
        <el-select v-model="searchForm.trade_status" placeholder="请选择订单状态" @change="statusChange"> <el-option v-for="item in orderStateList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>

      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      <!-- <el-form-item> <el-button type="warning" @click="handleRefundOrder">退款订单</el-button> </el-form-item> -->
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="orderList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="订单号" prop="orderId" min-width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="签约号" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.agreement_no || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="支付宝账号" prop="phone" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单总金额" prop="total" width="120" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="协议状态" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.status === 'NORMAL'" style="color:#67C23A">已签约</div>
            <div v-else-if="scope.row.status === 'TEMP'" style="color:#E6A23C">暂存，协议未生效过</div>
            <div v-else-if="scope.row.status === 'STOP'" style="color:#909399">暂停</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.agreement_no">
              <div v-if="scope.row.trade_status === 'TRADE_SUCCESS'" style="color:#67C23A">已支付</div>
              <div v-else-if="scope.row.total === 0 && scope.row.trade_status === 'TRADE_UNSIGN'" style="color: #E6A23C">协议取消</div>
              <div v-else-if="scope.row.total !== 0 && scope.row.trade_status === ''" style="color: #F56C6C">未支付</div>
              <div v-else>--</div>
            </div>
            <div v-else><div style="color:#909399">未授权</div></div>
          </template>
        </el-table-column>
        <el-table-column prop="pay.payType" label="订单状态" min-width="140" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus === 0">--</div>
            <div v-else>{{ scope.row.orderStatus | vendingOrderStateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.refundState" type="text" @click="refundPayScoreOrderDeatil(scope.row)">已退款</el-button>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handlePayScoreDetail(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status === 'NORMAL' && scope.row.agreement_no && scope.row.trade_status === '' && scope.row.delayCancelState === ''" size="mini" type="primary" @click="handleUnsignPayScore(scope.row)"
              >协议解约</el-button
            >
            <el-button size="mini" type="danger" v-if="scope.row.delayCancelState === 'DOING'" disabled>延时取消中</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAlipayScoreOrderList, unsignAlipayScoreOrder, getShopBindVendingMachine } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      searchForm: {
        vmCode: this.$route.query.vmCode || '',
        orderId: this.$route.query.orderId || '',
        trade_status: 'all',
        cid: this.$route.query.cid || this.$store.state._cid
      },
      orderList: [],
      vendingMachineList: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      orderStateList: [{ value: 'all', label: '所有订单状态' }, { value: 'TRADE_SUCCESS', label: '已支付' }, { value: 'TRADE_UNSIGN', label: '协议取消' }, { value: '', label: '已签约未支付' }]
    }
  },
  mounted() {
    this.getShopBindVendingMachine()
    this.getAliPayScoreOrderList()
  },
  methods: {
    getShopBindVendingMachine() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getShopBindVendingMachine(params).then(res => {
        this.vendingMachineList = res.data.listData.filter(item => item.code)
      })
    },
    getAliPayScoreOrderList() {
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
        // cid: this.$store.state._cid
      }
      this.tableLoading = true
      getAlipayScoreOrderList(params)
        .then(res => {
          this.tableLoading = false
          this.orderList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleUnsignPayScore(row) {
      this.$confirm('确定进行支付分协议解约操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            agreementNo: row.agreement_no,
            orderId: row.orderId
          }
          unsignAlipayScoreOrder(params).then(res => {
            this.$message.success(res.msg)
            this.getAliPayScoreOrderList()
          })
        })
        .catch(() => {})
    },
    // 售卖机编码改变操作
    machinceChange(val) {
      if (this.vendingMachineList.length > 0) {
        let machineInfo = this.vendingMachineList.find(item => item.code === val)
        this.searchForm.cid = machineInfo ? machineInfo.cid : this.$store.state._cid
      }
    },
    statusChange(val) {
      if (val === '') {
        this.searchForm.status = 'NORMAL'
      }
    },
    handlePayScoreDetail(row) {
      this.$router.push({ path: '/ali-order-detail', query: { _id: row._id } })
    },
    // 查看退款订单
    handleRefundOrder() {
      this.$router.push({ path: '/pay-score-refund-order' })
    },
    refundPayScoreOrderDeatil(row) {
      this.$router.push({ path: '/pay-score-refund-order', query: { oriOrderId: row.orderId, refundType: 2 } })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getAliPayScoreOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAliPayScoreOrderList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAliPayScoreOrderList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
