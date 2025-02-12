<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="门店" v-if="isManage">
          <el-select v-model="searchForm.cid" placeholder="请选择门店">
            <el-option v-for="item in storeList" :key="item.cid" :value="item.cid" :label="item.companyName">{{ item.companyName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号"> <el-input v-model="searchForm.orderId" placeholder="请输入订单号" clearable></el-input> </el-form-item>
        <el-form-item label="产品名称/条码"> <el-input v-model="searchForm.productNameOrBarCode" placeholder="请输入产品名称或条码" clearable></el-input> </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="searchForm.payState" placeholder="请选择支付状态"> <el-option v-for="item in payState" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="searchForm.payType" placeholder="请选择支付方式"> <el-option v-for="item in payTypeState" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态"> <el-option v-for="item in orderStatusList" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="优惠类型">
          <el-select v-model="searchForm.discountType" placeholder="请选择优惠类型"> <el-option v-for="item in discountType" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="searchForm.userType" placeholder="请选择用户类型"> <el-option v-for="item in userTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
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
          ></el-date-picker>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
        <el-form-item> <el-button :loading="exportLoading" type="primary" :disabled="orderList.length <= 0" @click="orderExport">订单导出</el-button> </el-form-item>
      </el-form>
      <div class="table-list">
        <!-- 订单列表 -->
        <el-table v-loading="tableLoading" :data="orderList" border>
          <el-table-column label="编号" type="index" align="center" width="55"></el-table-column>
          <el-table-column prop="orderId" label="订单编号" align="center" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="姓名" align="center" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.customer.userName || '--' }}</template>
          </el-table-column>
          <el-table-column label="手机号" align="center" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.customer.phone || '--' }}</template>
          </el-table-column>
          <el-table-column prop="pay.buyTotal" label="订单金额" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="source" label="订单来源" min-width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pay.payType" label="订单状态" min-width="120" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.orderStatus | orderTypeStateFilter }}</template>
          </el-table-column>
          <el-table-column label="支付状态" min-width="120" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-show="scope.row.payStatus !== null">
                <div v-if="scope.row.payStatus.payState === 'ok'" style="color: #13CE66;">支付成功</div>
                <div v-else-if="scope.row.payStatus.payState === 'cancel'" style="color: #909399;">取消支付</div>
                <div v-else-if="scope.row.payStatus.payState === 'prepay'" style="color: #e6b321;">待支付</div>
                <div v-else-if="scope.row.payStatus.payState === 'fail'" style="color: #FF4949;">支付失败</div>
                <div v-else-if="scope.row.payStatus.payState === 'error'" style="color: #FF4949;">错误订单</div>
                <div v-else></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="openPrint(scope.row)">打印</el-button>
              <el-button size="mini" type="warning" @click="gotoOrderDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="bottom">
          <div class="count">
            <div class="text">
              总单数：<span>{{ total }}</span
              >单
            </div>
            <div class="text">
              总金额：<span>{{ allTotal }}</span
              >元
            </div>
          </div>
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
            background
          >
          </el-pagination>
        </div>
      </div>
      <!-- 打印机显示 -->
      <print-list ref="printRef" :printShow="printShow" @closePrint="closePrint"></print-list>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { formatDate } from '@/components/js/data'
import Filters from '@/components/js/Filters'
import PrintList from '../components/print-list.vue'
import { getMakeOrderList, makeOrderExport, getAllStore } from '@/api/system'

export default {
  mixins: [Filters],
  watch: {
    $route(to, from) {
      if (to.name === 'meals-order-list') {
        this.initData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    PrintList
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      searchForm: {
        orderId: '',
        customerId: '',
        userType: 0,
        phone: '',
        payState: '',
        orderStatus: 0,
        payType: 99,
        source: '',
        name: '',
        productNameOrBarCode: '',
        discountType: -1,
        cid: this.$store.state._cid
      },
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd 00:00:00'), formatDate(new Date(), 'yyyy-MM-dd 23:59:59')],
      orderList: [],
      storeList: [],
      printId: '',
      selectItem: null,
      allTotal: 0,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      printShow: false,
      tableLoading: false,
      exportLoading: false,
      containerIsShow: true,
      orderStatusList: [
        { value: 0, label: '所有订单状态' },
        // { value: 1, label: '待发货' },
        { value: 5, label: '已退款' },
        { value: 6, label: '已完成' },
        { value: 8, label: '待接单' },
        { value: 11, label: '待取货' },
        { value: 13, label: '制作中' },
        { value: 9, label: '取消支付' },
        { value: 10, label: '支付失败' }
      ],
      userTypeList: [{ value: 0, label: '所有用户' }, { value: 1, label: '超级会员' }, { value: 2, label: '普通会员' }, { value: 3, label: '散客' }]
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData() {
      if (this.isManage) {
        this.getAllShop()
      }
      this.getOrderList()
    },
    // 获取自制餐食订单列表
    getOrderList() {
      let params = {
        ...this.searchForm,
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
        // cid: this.searchForm.cid
      }
      this.tableLoading = true
      getMakeOrderList(params).then(
        res => {
          if (res.success) {
            this.tableLoading = false
            this.orderList = res.data
            this.total = res.total
            this.allTotal = res.allTotal // 总金额
          }
        },
        () => {
          this.tableLoading = false
        }
      )
    },
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
    openPrint(row) {
      this.printShow = true
      this.$refs.printRef.getPrintList(2, row)
    },
    closePrint(val) {
      this.printShow = val
    },
    // 订单导出
    orderExport() {
      let params = {
        ...this.searchForm,
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.exportLoading = true
      makeOrderExport(params).then(
        res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '订单信息.xls'
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
        err => {
          this.exportLoading = false
          console.log(err.msg)
        }
      )
    },
    // 查看订单详情
    gotoOrderDetail(row) {
      this.$router.push({
        path: '/meals-order-detail',
        query: { id: row._id }
      })
    },
    // 搜索
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

<style lang="scss" scoped>
.table-list {
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    .count {
      display: flex;
      align-items: center;
      font-size: 16px;
      .text {
        margin-right: 30px;
        span {
          color: #f56c6c;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
