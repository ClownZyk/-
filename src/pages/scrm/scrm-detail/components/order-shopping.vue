<template>
  <div class="order">
    <div class="main">
      <el-form size="small" ref="form" inline :model="form" label-width="80px">
        <el-form-item label="订单编号"> <el-input v-model="form.orderId" clearable placeholder="请输入订单编号"></el-input> </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.status" placeholder="请选择支付状态">
            <el-option v-for="item in stateList" :key="item.value" :value="item.id" :label="item.value">{{ item.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单时间"> <el-date-picker v-model="timeFrame" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker> </el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form>
      <el-table size="small" :data="tableData3" border class="order-table">
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
        <el-table-column prop="pay.payType" label="支付方式" min-width="120" :align="align">
          <template slot-scope="scope">
            {{ scope.row.pay.payType | payTypeStateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="120" :align="align" show-overflow-tooltip>
          <!-- ok：支付成功，cancel：取消支付，prepay：待支付（下单时状态）,fail:支付失败,error:错误订单 -->
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus">
              <div v-if="scope.row.payStatus.payState === 'ok'" style="color: #13CE66;">支付成功</div>
              <div v-else-if="scope.row.payStatus.payState === 'cancel'" style="color: #909399;">取消支付</div>
              <div v-else-if="scope.row.payStatus.payState === 'prepay'" style="color: #e6b321;">待支付</div>
              <div v-else-if="scope.row.payStatus.payState === 'fail'" style="color: #FF4949;">支付失败</div>
              <div v-else-if="scope.row.payStatus.payState === 'error'" style="color: #FF4949;">错误订单</div>
              <div v-else></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :align="align" width="180"></el-table-column>
        <el-table-column label="操作" min-width="170" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="CMSContent(scope.row, scope.row._id, null)">查看</el-button>
            <el-button size="mini" type="danger" @click="CMSContent(scope.row, scope.row._id, 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-show="tableData3.length !== 0" background @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" layout="total, prev, pager, next" :total="total" style="float:right;margin-top: 15px"></el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { OrderList, OrderOperation, OrderExport } from '@/api/system'
import {formatDate} from '@/components/js/data'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      timeFrame: ['', ''],
      align: 'center',
      form: {
        payType: 99,
        payState: '',
        status: '',
        orderStatus: 0
      },
      lastList: [
        {value: '最近一周内'},
        {value: '最近一月内'},
        {value: '最近三月内'},
        {value: '半年前'},
        {value: '一年前'},
        {value: '两年前'},
        {value: '超过两年'}
      ],
      tableData3: [],
      status: '',
      pageIndex: 1,
      pageSize: 8,
      total: 0,
      stateList: [
        {id: '', value: '所有'},
        {id: 'ok', value: '支付成功'},
        {id: 'cancel', value: '取消支付'},
        {id: 'prepay', value: '待支付'},
        {id: 'fail', value: '支付失败'},
        {id: 'error', value: '错误订单'}
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    search() {
      this.pageIndex = 1
      this.init()
    },
    exportMany() {
        let parmas = {
        orderId: this.form.orderId,
        customerId: this.$route.query.id || '',
        phone: this.form.phone,
        payState: this.form.status,
        orderStatus: this.form.orderStatus,
        payType: this.form.payType,
        sTime: (!this.timeFrame[0] && !this.timeFrame[1]) ? '' : `${formatDate(this.timeFrame[0], 'yyyy-MM-dd')}~${formatDate(this.timeFrame[1], 'yyyy-MM-dd')}`,
        source: '',
        name: '',
        isPage: false,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      OrderExport(parmas).then(res => {
        const content = res
        const blob = new Blob([content])
        const fileName = '产品信息.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob, {type: 'application/vnd.ms-excel'})
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }, err => { this.$message.err(err.msg) })
    },
    init() {
      let parmas = {
        orderId: this.form.orderId,
        customerId: this.$route.query.id || '',
        phone: this.form.phone,
        payState: this.form.status,
        orderStatus: this.form.orderStatus,
        payType: this.form.payType,
        sTime: (!this.timeFrame[0] && !this.timeFrame[1]) ? '' : `${formatDate(this.timeFrame[0], 'yyyy-MM-dd')}~${formatDate(this.timeFrame[1], 'yyyy-MM-dd')}`,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      OrderList(parmas).then(res => {
        if (res.success) {
          this.tableData3 = res.data
          this.total = res.total
        } else this.$message.err(res.msg)
      }, err => { this.$message.err(err.msg) })
    },
    CMSContent(dto, orderId, action) {
      if (action === 2) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let parmas = {
            dto: dto,
            action: action
          }
          OrderOperation(parmas).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.init()
            } else this.$message.err(res.msg)
          }, err => { this.$message.err(err.msg) })
        }).catch(() => {})
      } else {
        this.$router.push({
          path: '/shop-orders-detail',
          query: {id: orderId}
        })
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.init()
    }
  }
}
</script>

<style scoped lang="scss"></style>
