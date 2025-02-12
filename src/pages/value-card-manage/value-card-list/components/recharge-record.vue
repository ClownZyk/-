<template>
  <div>
    <el-form class="filter" ref="filterParamRef" :model="filterParam" inline>
      <div class="filter-left">
        <el-form-item label="姓名" prop="name"> <el-input type="text" v-model="filterParam.name" placeholder="请输入姓名检索" clearable></el-input> </el-form-item>
        <el-form-item label="充值方式">
          <el-select v-model="filterParam.payType" placeholder="请选择充值方式"> <el-option v-for="(item, index) in payTypeList" :key="index" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
        <!--
          <el-form-item label="卡面类型">
            <el-select v-model="filterParam.entityCardType" placeholder="请选择卡面类型"> <el-option v-for="(item, index) in cardTypeList" :key="index" :label="item.title" :value="item.cardFaceId"> </el-option> </el-select>
          </el-form-item>
        -->
        <el-form-item label="充值时间">
          <el-date-picker
            v-model="filterParam.sTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="getRechargeList('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div class="filter-right">
        <el-form-item> <el-button :loading="exportLoading" type="warning" @click="recordExport" :disabled="rechargeList.length <= 0">导出</el-button> </el-form-item>
      </div>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="rechargeList" border>
        <el-table-column label="卡编号" prop="title" width="120" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" min-width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="充值前余额(元)" prop="beforeAmount" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="充值金额(元)" prop="cardPay.recharge" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="赠送金额(元)" prop="cardPay.giving" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际余额(元)" prop="surplusAmount" min-width="140" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="充值途径" prop="source" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="充值方式" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.cardPay">
              <span v-if="scope.row.cardPay.payType !== 15">{{ scope.row.cardPay.payType | payTypeStateFilter }}</span> <span v-else>线下付款</span>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.cardPay">
              <div v-if="scope.row.cardPay.payState === 'ok'" style="color:#67C23A">支付成功</div>
              <div v-else-if="scope.row.cardPay.payState === 'cancel'" style="color:#909399">取消支付</div>
              <div v-else-if="scope.row.cardPay.payState === 'fail'" style="color:#F56C6C">支付失败</div>
              <div v-else-if="scope.row.cardPay.payState === 'prepay'" style="color:#E6A23C">待支付</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="充值时间" prop="createTime" width="180" align="center" show-overflow-tooltip> </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[15, 25, 35, 45]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
        style="text-align:right;margin-top:10px"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getValueCardRechargeOrConsumeRecord, valueCardRechargeOrConsumeRecordExport, getValueCardSetUp } from '@/api/system'
import Filter from '@/components/js/Filters'

export default {
  mixins: [Filter],
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      filterParam: {
        type: 1,
        name: '',
        entityCardType: '',
        payType: -1,
        sTime: []
      },
      cardTypeList: [],
      rechargeList: [],
      tableLoading: false,
      exportLoading: false,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      payTypeList: [{ value: -1, label: '所有充值方式' }, { value: 3, label: '现金支付' }, { value: 14, label: '通联支付' }, { value: 15, label: '线下付款' }, { value: 17, label: '宁波银行易收宝' }]
    }
  },
  mounted() {
    // this.getCardType()
    this.getRechargeList()
  },
  methods: {
    getCardType() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid || this.$store.state._cid
      }
      getValueCardSetUp(params).then(res => {
        this.cardTypeList = res.data
      })
    },
    getRechargeList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        cardNumber: this.$route.query.cardNumber || '',
        ...this.filterParam,
        beginTime: this.filterParam.sTime && this.filterParam.sTime.length > 0 ? this.filterParam.sTime[0] : null,
        endTime: this.filterParam.sTime && this.filterParam.sTime.length > 0 ? this.filterParam.sTime[1] : null,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid || this.$store.state._cid
      }
      this.tableLoading = true
      getValueCardRechargeOrConsumeRecord(params)
        .then(res => {
          this.tableLoading = false
          this.rechargeList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    recordExport() {
      let params = {
        cardNumber: this.$route.query.cardNumber || '',
        ...this.filterParam,
        beginTime: this.filterParam.sTime && this.filterParam.sTime.length > 0 ? this.filterParam.sTime[0] : null,
        endTime: this.filterParam.sTime && this.filterParam.sTime.length > 0 ? this.filterParam.sTime[1] : null,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid || this.$store.state._cid
      }
      this.exportLoading = true
      valueCardRechargeOrConsumeRecordExport(params)
        .then(res => {
          this.exportLoading = false
          const content = res
          const blob = new Blob([content])
          const fileName = '云点卡充值记录.xls'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, {
              type: 'application/vnd.ms-excel'
            })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRechargeList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getRechargeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  justify-content: space-between;
}
</style>
