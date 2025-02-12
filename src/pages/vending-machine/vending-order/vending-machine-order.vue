<template>
  <div v-if="containerIsShow">
    <el-form :model="searchForm" inline>
      <el-form-item label="门店名称" v-if="isManage">
        <el-select v-model="searchForm.cid" placeholder="请选择门店" @change="storeChange">
          <el-option v-for="item in storeList" :key="item.cid" :value="item.cid" :label="item.companyName">{{ item.companyName }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售卖机名称">
        <el-select v-model="searchForm.vmCode" placeholder="请选择售卖机" clearable> <el-option v-for="item in vendingMachineList" :key="item._id" :label="item.name" :value="item.code"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="订单编码"> <el-input type="text" v-model.trim="searchForm.orderId" placeholder="请输入订单编码检索" clearable></el-input> </el-form-item>
      <el-form-item label="开门编码"> <el-input type="text" v-model.trim="searchForm.orderCode" placeholder="请输入开门编码检索" clearable></el-input> </el-form-item>
      <el-form-item label="手机号"> <el-input type="text" v-model.trim="searchForm.phone" placeholder="请输入手机号检索" clearable></el-input> </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态"> <el-option v-for="item in vendingOrderState" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="订单时间">
        <el-date-picker
          v-model="timeFrame"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      <el-form-item> <el-button :loading="exportLoading" type="warning" :disabled="orderList.length <= 0" @click="orderExport">订单导出</el-button> </el-form-item>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="orderList" border>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column prop="orderId" label="订单编号" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderCode" label="开门编码" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="vmName" label="售卖机名称" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.customer.userName || '--' }}</template>
        </el-table-column>
        <el-table-column label="手机号" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.customer.phone || '--' }}</template>
        </el-table-column>
        <el-table-column label="订单金额" min-width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.pay">{{ scope.row.pay.buyTotal ? (scope.row.pay.buyTotal / 100).toFixed(2) : scope.row.pay.buyTotal }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="pay.payType" label="订单状态" min-width="100" align="center">
          <template slot-scope="scope">{{ scope.row.orderStatus | vendingOrderStateFilter }}</template>
        </el-table-column>
        <el-table-column prop="pay.payType" label="退款状态" min-width="100" align="center">
          <template slot-scope="scope">{{ scope.row.orderRefundStatus | vendingOrderRefundStateFilter }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleOrderDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handlePayScoreOrder(scope.row)">支付信息</el-button>
            <el-button v-if="scope.row.orderId.startsWith('ZFB') && scope.row.pay && scope.row.pay.buyTotal !== 0 && scope.row.orderStatus === 4" size="mini" type="danger" @click="handlePayScoreOrderDeduction(scope.row)">扣款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span style="margin-right:10px">
            总单数：<span style="color: #F56C6C">{{ total }}</span
            >单
          </span>
          <span>
            总金额：<span style="color: #F56C6C">{{ salesTotal || 0 }}</span> 元
          </span>
        </el-col>

        <el-col>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
            background
            style="text-align: right"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <!-- 支付宝二次扣款弹框 -->
    <el-dialog title="支付宝扣款" :visible.sync="isDeductionDialogShow" width="800px" :close-on-click-modal="false">
      <el-form ref="deductionFormRef" :model="deductionForm" :rules="deductionFormRules" label-position="right" label-width="86px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单编号：">{{ deductionForm.orderId }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="扣款金额：">¥ {{ parseFloat((deductionForm.totalAmount / 100).toFixed(2)) }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="购买商品：">
          <el-table size="mini" :data="deductionForm.prod" border>
            <el-table-column type="index" width="60" align="center"></el-table-column>
            <el-table-column label="商品名称" prop="name" min-width="180"></el-table-column>
            <el-table-column label="商品价格(元)" prop="amount" min-width="160" align="center">
              <template slot-scope="scope">
                {{ parseFloat((scope.row.amount / 100).toFixed(2)) }}
              </template>
            </el-table-column>
            <el-table-column label="购买数量" prop="count" min-width="160" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="扣款原因" prop="reason"> <el-input type="textarea" v-model="deductionForm.reason" :rows="2" placeholder="请输入扣款原因"></el-input> </el-form-item>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitDeductionInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getVendingMachineAllOrder, getShopBindVendingMachine, vendingMachineOrderExport, getAllStore, completeAlipayScoreOrder } from '@/api/system'
import Filters from '@/components/js/Filters'
import { formatDate } from '@/components/js/data'

export default {
  mixins: [Filters],
  watch: {
    $route(to, from) {
      if (to.name === 'vending-machine-order') {
        this.getOrderList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isDeductionDialogShow(val) {
      if (!val) {
        this.deductionForm = {}
        this.$refs['deductionFormRef'].resetFields()
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      storeList: [],
      searchForm: {
        orderId: '',
        orderCode: '',
        vmCode: this.$route.query.vmcode || '',
        phone: '',
        orderStatus: 0,
        start: '',
        end: '',
        cid: this.$route.query.cid || this.$store.state._cid
      },
      vendingMachineList: [],
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd 00:00:00'), formatDate(new Date(), 'yyyy-MM-dd 23:59:59')],
      orderList: [],
      salesTotal: 0,
      tableLoading: false,
      containerIsShow: true,
      exportLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      // 扣款信息
      deductionForm: {},
      isDeductionDialogShow: false,
      submitLoading: false,
      deductionFormRules: {
        reason: [{ required: true, message: '扣款原因不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (this.isManage) {
      this.getAllShop()
    }
    this.getShopBindVendingMachine()
    this.getOrderList()
  },
  methods: {
    // 获取所有门店信息
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getAllStore(params).then(res => {
        this.storeList = res.data.map(item => {
          return {
            cid: item.cid,
            companyName: item.companyName
          }
        })
        this.storeList.unshift({
          cid: localStorage.getItem('cid'),
          companyName: '所有门店'
        })
      })
    },
    getShopBindVendingMachine() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.searchForm.cid
      }
      getShopBindVendingMachine(params).then(res => {
        this.vendingMachineList = res.data.listData.filter(item => item.code)
      })
    },
    getOrderList() {
      let params = {
        ...this.searchForm,
        start: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[0] : '',
        end: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[1] : '',
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
      getVendingMachineAllOrder(params)
        .then(res => {
          this.tableLoading = false
          this.orderList = res.data.list
          this.salesTotal = parseFloat((res.data.total / 100).toFixed(2))
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 订单导出
    orderExport() {
      let params = {
        ...this.searchForm,
        start: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[0] : '',
        end: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[1] : '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
        // cid: this.$store.state._cid
      }
      this.exportLoading = true
      vendingMachineOrderExport(params).then(
        res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '售卖机订单信息.xls'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, { type: 'application/vnd.ms-excel' })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
          this.exportLoading = false
        },
        () => {
          this.exportLoading = false
        }
      )
    },
    storeChange(val) {
      let storeInfo = this.storeList.find(item => item.cid === val)
      if (storeInfo) {
        this.searchForm.cid = storeInfo.cid
        this.getShopBindVendingMachine()
      }
    },
    // 扣款操作
    handlePayScoreOrderDeduction(row) {
      this.isDeductionDialogShow = true
      this.$nextTick(() => {
        let { orderId, pay, orderGoodsList } = row
        this.deductionForm = {
          orderId,
          appId: '',
          totalAmount: pay.buyTotal,
          reason: '',
          endTime: formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss'),
          prod: orderGoodsList.map(item => {
            return {
              name: item.itemName,
              amount: item.itemPrice,
              count: item.count
            }
          })
        }
      })
    },
    submitDeductionInfo() {
      this.$refs['deductionFormRef'].validate(valid => {
        if (valid) {
          this.$confirm('确认再次发起该支付宝订单的扣款?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let params = {
                ...this.deductionForm
              }
              // console.log(params)
              this.submitLoading = true
              completeAlipayScoreOrder(params).then(res => {
                this.submitLoading = false
                this.isDeductionDialogShow = false
                if (res.data.code === '10000') {
                  this.$message.success('扣款操作成功！')
                } else if (res.data.code === '40004') {
                  this.$message({
                    type: 'warning',
                    message: '买家余额不足！',
                    duration: 0,
                    showClose: true
                  })
                }
                this.getOrderList()
              })
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    handleOrderDetail(row) {
      this.$router.push({ path: '/vending-order-detail', query: { orderCode: row.orderCode } })
    },
    handlePayScoreOrder(row) {
      this.$router.push({ path: '/pay-score-order', query: { cid: this.$route.query.cid || this.searchForm.cid, vmCode: row.vmCode, orderId: row.orderId, orderCode: row.orderCode } })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getOrderList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
