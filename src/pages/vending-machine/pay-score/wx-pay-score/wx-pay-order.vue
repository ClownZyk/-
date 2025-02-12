<template>
  <div>
    <el-form :model="searchForm" inline>
      <el-form-item label="售卖机名称">
        <el-select v-model="searchForm.vmCode" placeholder="请选择售卖机" clearable @change="machinceChange"> <el-option v-for="item in vendingMachineList" :key="item._id" :label="item.name" :value="item.code"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="订单号"> <el-input type="text" v-model.trim="searchForm.orderId" placeholder="请输入订单号检索" clearable></el-input> </el-form-item>
      <el-form-item label="服务订单状态">
        <el-select v-model="searchForm.trade_status" placeholder="请选择订单状态"> <el-option v-for="item in orderStateList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      <!-- <el-form-item> <el-button type="warning" @click="handleRefundOrder">退款订单</el-button> </el-form-item> -->
    </el-form>
    <div class="alert"><el-alert title="'取消订单' 操作的前提是没有创建售卖机订单" type="warning" show-icon :closable="false"> </el-alert></div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="orderList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="商户服务订单号" prop="out_order_no" min-width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单总金额" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ Math.round(scope.row.total_amount) / 100 }}
          </template>
        </el-table-column>
        <el-table-column label="服务时间段" min-width="320" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.time_range.start_time">{{ scope.row.time_range.start_time.split('+')[0] }}- {{ scope.row.time_range.end_time.split('+')[0] }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="服务订单状态" min-width="220" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state === 'CREATED'">商户已创建服务订单</div>
            <div v-else-if="scope.row.state === 'DOING'">服务订单进行中</div>
            <div v-else-if="scope.row.state === 'DONE'">服务订单完成</div>
            <div v-else-if="scope.row.state === 'REVOKED'">商户取消服务订单</div>
            <div v-else-if="scope.row.state === 'EXPIRED'">服务订单已失效</div>
          </template>
        </el-table-column>
        <el-table-column prop="pay.payType" label="订单状态" min-width="140" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus === 0">--</div>
            <div v-else>{{ scope.row.orderStatus | vendingOrderStateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handlePayScoreDetail(scope.row)">详情</el-button>
            <!-- <el-button size="mini" type="success" @click="syncPayScoreOrder(scope.row)">同步订单</el-button> -->
            <el-button v-if="(scope.row.state === 'CREATED' || scope.row.state === 'DOING') && scope.row.delayCancelState === ''" size="mini" type="danger" @click="cancelPayScoreOrder(scope.row)">取消订单</el-button>
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
import { getPayScoreOrder, cancelPayScoreOrder, syncPayScoreOrder, getShopBindVendingMachine } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      searchForm: {
        vmCode: this.$route.query.vmCode || '',
        orderId: this.$route.query.orderId || '',
        trade_status: '',
        cid: this.$route.query.cid || this.$store.state._cid
      },
      orderList: [],
      vendingMachineList: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      orderStateList: [
        { value: '', label: '所有订单状态' },
        { value: 'CREATED', label: '商户已创建服务订单' },
        { value: 'DOING', label: '服务订单进行中' },
        { value: 'DONE', label: '服务订单完成' },
        { value: 'REVOKED', label: '商户取消服务订单' },
        { value: 'EXPIRED', label: '服务订单已失效' }
      ]
    }
  },
  mounted() {
    this.getShopBindVendingMachine()
    this.getWxPayScoreOrderList()
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
    getWxPayScoreOrderList() {
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
      getPayScoreOrder(params)
        .then(res => {
          this.tableLoading = false
          this.orderList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 售卖机编码改变操作
    machinceChange(val) {
      if (this.vendingMachineList.length > 0) {
        let machineInfo = this.vendingMachineList.find(item => item.code === val)
        this.searchForm.cid = machineInfo ? machineInfo.cid : this.$store.state._cid
      }
    },
    handlePayScoreDetail(row) {
      this.$router.push({ path: '/wx-order-detail', query: { _id: row._id } })
    },
    // 同步支付分订单
    syncPayScoreOrder(row) {
      this.$confirm('确定同步此支付分订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          let params = {
            orderId: row.out_order_no
          }
          syncPayScoreOrder(params).then(res => {
            this.$message.success('支付分订单同步成功！')
            this.getWxPayScoreOrderList()
          })
        })
        .catch(() => {})
    },
    // 取消支付分订单
    cancelPayScoreOrder(row) {
      this.$prompt('请输入取消原因(30字以内)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '30字以内'
      })
        .then(({ value }) => {
          if (!value) {
            return this.$message.warning('请填写取消原因！')
          }
          let params = {
            orderId: row.out_order_no,
            reason: value
          }
          cancelPayScoreOrder(params).then(res => {
            this.$message.success('支付分订单取消成功！')
            this.getWxPayScoreOrderList()
          })
        })
        .catch(() => {})
    },
    // 查看退款订单
    handleRefundOrder() {
      this.$router.push({ path: '/pay-score-refund-order' })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getWxPayScoreOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getWxPayScoreOrderList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getWxPayScoreOrderList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
