<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form ref="form" inline :model="form" label-width="80px">
        <el-form-item label="门店" v-if="isManage">
          <el-select v-model="form.cid" placeholder="请选择门店">
            <el-option v-for="item in storeList" :key="item.cid" :value="item.cid" :label="item.companyName">{{ item.companyName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号"> <el-input v-model="form.orderId" clearable placeholder="请输入订单编号"></el-input> </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.payState" placeholder="请选择支付状态"> <el-option v-for="item in payState" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="form.payType" placeholder="请选择支付方式"> <el-option v-for="item in payTypeState" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus" placeholder="请选择订单状态"> <el-option v-for="item in orderStatusList" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-date-picker v-model="timeFrame" type="daterange" format="yyyy/MM/dd" value-format="yyyy/MM/dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      </el-form>
      <div class="table-list">
        <el-table v-loading="tableLoading" :data="orderList" border>
          <el-table-column label="编号" type="index" :align="align" width="80"></el-table-column>
          <el-table-column prop="orderId" label="订单编号" :align="align" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="姓名" :align="align" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.customer.userName || '--' }}</template>
          </el-table-column>
          <el-table-column label="手机号" :align="align" width="140">
            <template slot-scope="scope">{{ scope.row.customer.phone || '--' }}</template>
          </el-table-column>
          <el-table-column prop="pay.buyTotal" label="订单金额" min-width="100" :align="align"></el-table-column>
          <el-table-column prop="pay.payType" label="支付方式" min-width="120" :align="align">
            <template slot-scope="scope">
              <div v-if="scope.row.pay && scope.row.pay.payType">{{ scope.row.pay.payType | payTypeStateFilter }}</div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="支付状态" min-width="120" :align="align" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.payStatus && scope.row.payStatus.payState">
                <div v-if="scope.row.payStatus.payState === 'ok'" style="color: #13CE66;">支付成功</div>
                <div v-else-if="scope.row.payStatus.payState === 'cancel'" style="color: #909399;">取消支付</div>
                <div v-else-if="scope.row.payStatus.payState === 'prepay'" style="color: #e6b321;">待支付</div>
                <div v-else-if="scope.row.payStatus.payState === 'fail'" style="color: #FF4949;">支付失败</div>
                <div v-else-if="scope.row.payStatus.payState === 'error'" style="color: #FF4949;">错误订单</div>
                <div v-else>--</div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" :align="align" width="180"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="handleOrderCheck(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" layout="total, prev, pager, next" :total="total" style="text-align:right;margin-top:15px"></el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/components/js/data'
import Filters from '@/components/js/Filters'
import { getAllOrderList, getAllStore } from '@/api/system'
export default {
  mixins: [Filters],
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      form: {
        orderId: '',
        customerId: '',
        phone: '',
        payState: '',
        orderStatus: 0,
        payType: 99,
        source: '',
        name: '',
        cid: ''
      },
      storeList: [],
      orderList: [],
      tableLoading: false,
      timeFrame: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')],
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      align: 'center',
      orderStatusList: [
        { value: 0, label: '所有订单状态' },
        { value: 1, label: '待发货' },
        { value: 5, label: '已退款' },
        { value: 6, label: '已完成' },
        { value: 9, label: '取消支付' },
        { value: 10, label: '支付失败' }
      ]
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'all-order-list') {
        this.init()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  mounted() {
    if (!this.$route.query.cid) {
      this.form.cid = this.$store.state._cid
    } else {
      this.form.cid = this.$route.query.cid
    }
    this.getAllShop()
    this.init()
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
        if (res.success) {
          this.storeList = res.data.map(item => {
            return {
              cid: item.cid,
              companyName: item.companyName
            }
          })
          this.storeList.unshift({
            cid: this.$store.state._cid,
            companyName: '全部门店'
          })
        }
      })
    },
        init() {
      let parmas = {
        orderId: this.form.orderId,
        customerId: this.form.customerId,
        phone: this.form.phone,
        payState: this.form.payState,
        orderStatus: this.form.orderStatus,
        payType: this.form.payType,
        beginTime: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[0] : '',
        endTime: this.timeFrame && this.timeFrame.length > 0 ? this.timeFrame[1] : '',
        source: this.form.source,
        name: this.form.name,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.form.cid
      }
      this.tableLoading = true
      getAllOrderList(parmas).then(
        res => {
          this.tableLoading = false
          this.orderList = res.data
          this.total = res.total
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    handleOrderCheck(row) {
      this.$router.push({
          path: '/all-order-detail',
          query: { id: row._id }
        })
    },
    searchCondition() {
      this.pageIndex = 1
      this.init()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.init()
    }
  }
}
</script>

<style scoped lang="scss"></style>
