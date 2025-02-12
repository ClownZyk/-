<template>
  <div>
    <el-form class="filter" ref="filterParamRef" :model="filterParam" inline>
      <div class="filter-left">
        <!--
          <el-form-item label="卡面类型">
            <el-select v-model="filterParam.entityCardType" placeholder="请选择卡面类型"> <el-option v-for="(item, index) in cardTypeList" :key="index" :label="item.title" :value="item.cardFaceId"> </el-option> </el-select>
          </el-form-item>
        -->
        <el-form-item label="姓名" prop="name"> <el-input type="text" v-model="filterParam.name" placeholder="请输入姓名检索" clearable></el-input> </el-form-item>
        <el-form-item label="记账时间">
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
        <el-form-item> <el-button type="primary" @click="getAccountList('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div class="filter-right">
        <el-form-item> <el-button :loading="exportLoading" type="warning" @click="recordExport" :disabled="accountList.length <= 0">导出</el-button> </el-form-item>
      </div>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="accountList" border>
        <el-table-column label="记账卡编号" prop="title" width="160" align="center"> </el-table-column>
        <el-table-column label="姓名" prop="name" min-width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderId" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单金额" prop="amount" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="记账途径" prop="source" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" show-overflow-tooltip> </el-table-column>
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

export default {
  data() {
    return {
      filterParam: {
        type: 5,
        entityCardType: '',
        name: '',
        payType: -1,
        sTime: []
      },
      cardTypeList: [],
      accountList: [],
      tableLoading: false,
      exportLoading: false,
      pageIndex: 1,
      pageSize: 15,
      total: 0
    }
  },
  mounted() {
    // this.getCardType()
    this.getAccountList()
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
    getAccountList(refresh) {
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
          this.accountList = res.data
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
          const fileName = '云点卡记账记录.xls'
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
      this.getAccountList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAccountList()
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
