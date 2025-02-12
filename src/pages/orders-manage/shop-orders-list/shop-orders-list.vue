<template>
  <div class="page-container">
    <div class="main" v-if="containerIsShow">
      <el-form ref="form" inline :model="form" label-width="80px">
        <el-form-item label="门店" v-if="isManage">
          <el-select v-model="form.cid" placeholder="请选择门店">
            <el-option v-for="item in storeList" :key="item.cid" :value="item.cid" :label="item.companyName">{{ item.companyName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号"> <el-input v-model="form.orderId" clearable placeholder="请输入订单编号"></el-input> </el-form-item>
        <el-form-item label="名称/条码"> <el-input v-model="form.productNameOrBarCode" clearable placeholder="请输入产品名称或者条码"></el-input> </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.status" placeholder="请选择支付状态"> <el-option v-for="item in payState" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="form.payType" placeholder="请选择支付方式"> <el-option v-for="item in payTypeState" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus" placeholder="请选择订单状态"> <el-option v-for="item in orderStatusList" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="优惠类型">
          <el-select v-model="form.discountType" placeholder="请选择优惠类型"> <el-option v-for="item in discountType" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="会员性质">
          <el-select v-model="form.isVip" placeholder="请选择会员性质"> <el-option v-for="item in VipType" :key="item.value" :value="item.value" :label="item.label"></el-option> </el-select>
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
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" :disabled="tableData3.length <= 0" @click="exportMany">导出</el-button>
      </el-form>
      <div class="table-list">
        <el-table v-loading="tableLoading" :data="tableData3" border class="order-table">
          <el-table-column label="编号" type="index" :align="align" width="80"></el-table-column>
          <el-table-column prop="orderId" label="订单编号" :align="align" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="姓名" :align="align" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.customer.userName || '--' }}</template>
          </el-table-column>
          <el-table-column label="手机号" :align="align" width="140">
            <template slot-scope="scope">{{ scope.row.customer.phone || '--' }}</template>
          </el-table-column>
          <el-table-column prop="pay.buyTotal" label="订单金额" min-width="100" :align="align"></el-table-column>
          <el-table-column prop="source" label="订单来源" min-width="120" :align="align" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pay.payType" label="订单状态" min-width="120" :align="align">
            <template slot-scope="scope">{{ scope.row.orderStatus | orderTypeStateFilter }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" :align="align" width="180"></el-table-column>
          <el-table-column label="支付状态" min-width="120" :align="align" show-overflow-tooltip>
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
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="openPrint(scope.row)">打印</el-button>
              <el-button size="mini" type="warning" @click="CMSContent(scope.row, scope.row._id, null)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-show="tableData3.length !== 0"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
          layout="total, prev, pager, next"
          :total="total"
          style="float:right;"
        ></el-pagination>
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
      </div>
      <!-- 打印机显示 -->
      <print-list ref="printRef" :printShow="printShow" @closePrint="closePrint"></print-list>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/components/js/data'
import Filters from '@/components/js/Filters'
import PrintList from '../components/print-list.vue'
import { OrderList, OrderOperation, OrderExport, getAllStore } from '@/api/system'
export default {
  name: 'orders-list',
  mixins: [Filters],
  components: {
    PrintList
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      storeList: [],
      printShow: false, // 打印显示
      printId: '',
      containerIsShow: true,
      align: 'center',
      form: {
        orderId: '',
        productNameOrBarCode: '',
        status: '',
        orderStatus: 0,
        payType: 99,
        discountType: -1,
        isVip: 0,
        source: '',
        phone: '',
        cid: ''
      },
      listLoading: false,
      lastList: [{ value: '最近一周内' }, { value: '最近一月内' }, { value: '最近三月内' }, { value: '半年前' }, { value: '一年前' }, { value: '两年前' }, { value: '超过两年' }],
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd 00:00:00'), formatDate(new Date(), 'yyyy-MM-dd 23:59:59')],
      tableData3: [],
      printList: [],
      status: '',
      selectTableList: [], // 被选择的列表
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      allTotal: 0,
      selectItem: null,
      orderStatusList: [
        { value: 0, label: '所有订单状态' },
        { value: 1, label: '待发货' },
        { value: 5, label: '已退款' },
        { value: 6, label: '已完成' },
        { value: 9, label: '取消支付' },
        { value: 10, label: '支付失败' }
      ],
      VipType: [
        { value: 0, label: '所有会员性质' },
        { value: 1, label: '超级会员' },
        { value: 2, label: '普通会员' },
        { value: 3, label: '散客' }
      ],
      tableLoading: false
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
    openPrint(row) {
      this.printShow = true
      this.$refs.printRef.getPrintList(1, row)
    },
    closePrint(val) {
      this.printShow = val
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
    // 表格选中状态
    selectTableRow(val) {
      this.selectTableList = val
    },
    search() {
      this.pageIndex = 1
      this.init()
    },
    exportMany() {
      let parmas = {
        orderId: this.form.orderId,
        customerId: '',
        phone: this.form.phone,
        payState: this.form.status,
        orderStatus: this.form.orderStatus,
        payType: this.form.payType,
        userType: this.form.isVip,
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        productNameOrBarCode: this.form.productNameOrBarCode,
        discountType: this.form.discountType,
        source: '',
        name: '',
        isPage: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      OrderExport(parmas).then(
        res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '产品信息.xls'
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
        },
        err => {
          this.$message.err(err.msg)
        }
      )
    },
    init() {
      let parmas = {
        orderId: this.form.orderId,
        phone: this.form.phone,
        payState: this.form.status,
        orderStatus: this.form.orderStatus,
        payType: this.form.payType,
        userType: this.form.isVip,
        discountType: this.form.discountType,
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        source: this.form.source,
        productNameOrBarCode: this.form.productNameOrBarCode,
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
      OrderList(parmas).then(
        res => {
          if (res.success) {
            this.tableLoading = false
            this.tableData3 = res.data
            this.total = res.total
            this.allTotal = res.allTotal
          }
        },
        err => {
          this.tableLoading = false
          console.log(err.msg)
        }
      )
    },
    CMSContent(dto, orderId, action) {
      if (action === 2) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let parmas = {
              dto: dto,
              action: action
            }
            OrderOperation(parmas).then(
              res => {
                if (res.success) {
                  this.$message.success(res.msg)
                  this.init()
                } else this.$message.err(res.msg)
              },
              err => {
                this.$message.err(err.msg)
              }
            )
          })
          .catch(() => {})
      } else {
        this.$router.push({
          path: '/shop-orders-detail',
          query: { id: orderId }
        })
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.init()
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'shop-orders-list') {
        this.init()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  .order-table {
    margin: 10px 0;
  }
}
.print-list > .el-radio + .el-radio {
  margin-right: 10px;
  margin-top: 10px;
}
.count {
  display: flex;
  align-items: center;
  margin-top: 15px;
  font-size: 16px;
  .text {
    margin-right: 30px;
    span {
      color: #f56c6c;
      font-size: 18px;
    }
  }
}
</style>
