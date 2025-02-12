<template>
  <div v-if="containerIsShow">
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="分账接收方名称" prop="receiverName"
          ><el-input type="text" v-model.trim="filterParam.receiverName" placeholder="请输入分账接收方名称搜索" clearable @keyup.enter.native="getLedgerReceiveList('refresh')"></el-input
        ></el-form-item>
        <el-form-item label="联系手机号" prop="contactMobile"
          ><el-input type="text" v-model.trim="filterParam.contactMobile" placeholder="请输入联系手机号搜索" clearable @keyup.enter.native="getLedgerReceiveList('refresh')"></el-input
        ></el-form-item>
        <el-form-item><el-button type="primary" @click="getLedgerReceiveList('refresh')">搜索</el-button></el-form-item>
      </div>
      <div>
        <el-form-item><el-button type="primary" @click="handleLedgerReceiverApplyAdd">新增分账接收方申请</el-button></el-form-item>
      </div>
    </el-form>

    <el-table v-loading="listLoading" :data="ledgerReceiverList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="分账接收方名称" prop="receiverName" min-width="180" align="center"> </el-table-column>
      <el-table-column label="联系手机号" prop="contactMobile" min-width="120" align="center"></el-table-column>
      <el-table-column label="收款账户类型" min-width="120" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.acctTypeCode === '57'">对公</div>
          <div v-else-if="scope.row.acctTypeCode === '58'">对私</div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="收款账户名称" prop="acctName" min-width="120" align="center"></el-table-column>
      <el-table-column label="收款账户卡号" prop="acctNo" min-width="180" align="center"></el-table-column>
      <el-table-column label="收款账户信息" min-width="240">
        <template slot-scope="scope">
          <div>
            证件类型：<span v-if="scope.row.acctCertificateType === '17'">身份证</span><span v-else-if="scope.row.acctCertificateType === '18'">护照</span><span v-else-if="scope.row.acctCertificateType === '19'">港澳居民来往内地通行证</span
            ><span v-else-if="scope.row.acctCertificateType === '20'">台湾居民来往内地通行证</span> <span v-else>--</span>
          </div>
          <div>证件号：{{ scope.row.acctCertificateNo || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="收款账户开户信息" min-width="240">
        <template slot-scope="scope">
          <div>开户名称：{{ scope.row.acctOpenBankName || '--' }}</div>
          <div>开户行号：{{ scope.row.acctOpenBankCode || '--' }}</div>
          <div>清算行行号：{{ scope.row.acctClearBankCode || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="营业执照" min-width="240">
        <template slot-scope="scope">
          <div>营业执照名称：{{ scope.row.licenseName || '--' }}</div>
          <div>营业执照号码：{{ scope.row.licenseNo || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="法人信息" min-width="240">
        <template slot-scope="scope">
          <div>法人姓名：{{ scope.row.legalPersonName || '--' }}</div>
          <div>
            证件类型：<span v-if="scope.row.legalPersonCertificateType === '17'">身份证</span><span v-else-if="scope.row.legalPersonCertificateType === '18'">护照</span
            ><span v-else-if="scope.row.legalPersonCertificateType === '19'">港澳居民来往内地通行证</span><span v-else-if="scope.row.legalPersonCertificateType === '20'">台湾居民来往内地通行证</span> <span v-else>--</span>
          </div>
          <div>证件号：{{ scope.row.legalPersonCertificateNo || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleLedgerReceiverApplyEdit(scope.row)">修改</el-button>
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
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getApplyLedgerReceiverList } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'ledger-receiver-list') {
        this.getLedgerReceiveList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      filterParam: {
        receiverName: '',
        contactMobile: ''
      },
      ledgerReceiverList: [],
      listLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getLedgerReceiveList()
  },
  methods: {
    getLedgerReceiveList(refresh) {
      if (refresh === 'refresh') {
        this.pegIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true
      }
      this.listLoading = true
      getApplyLedgerReceiverList(params)
        .then(res => {
          this.listLoading = false
          this.ledgerReceiverList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleLedgerReceiverApplyAdd() {
      this.$router.push({ path: '/ledger-receiver-detail' })
    },
    handleLedgerReceiverApplyEdit(row) {
      this.$router.push({ path: '/ledger-receiver-detail', query: { id: row._id } })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getLedgerReceiveList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getLedgerReceiveList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
