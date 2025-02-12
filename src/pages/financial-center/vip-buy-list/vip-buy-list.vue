<template>
  <div class="page-container">
    <el-form class="filters" :model="search" inline>
      <div>
        <el-form-item label="门店" v-if="isManage">
          <el-select v-model="search.cid" placeholder="请选择门店">
            <el-option v-for="item in storeList" :key="item.cid" :value="item.cid" :label="item.companyName">{{ item.companyName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买人手机号"> <el-input v-model.trim="search.tel" placeholder="请输入购买人手机号" class="filters-search" @keyup.enter.native="GetListByPage('refresh')"></el-input> </el-form-item>
        <el-form-item label="订单编号"> <el-input v-model.trim="search.orderid" placeholder="请输入订单编号" class="filters-search" @keyup.enter.native="GetListByPage('refresh')"></el-input> </el-form-item>
        <el-form-item label="购买时间">
          <el-date-picker v-model="timeFrame" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="GetListByPage('refresh')">搜索</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border>
      <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="orderid" label="订单编号" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="userPhone" label="购买人手机号" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="vipTypeName" label="套餐名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="payableMoney" label="套餐原价" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="actualMoney" label="套餐现价" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="role" label="支付方式" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="支付状态" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.orderStatus }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="订单时间" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="handleVipBuyRecordView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 15, 20, 25]" :total="total" layout="total, sizes, prev, pager, next" background>
      </el-pagination>
    </el-col>
    <!-- 弹框 -->
    <el-dialog title="vip购买详情" :visible.sync="isFormShow" width="600px" :close-on-click-modal="false">
      <el-form :model="dialog" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单编号"> <el-input v-model="dialog.orderid" disabled></el-input> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购买人姓名"> <el-input v-model="dialog.buyDays" disabled></el-input> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购买人手机号"> <el-input v-model="dialog.userPhone" disabled></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="套餐名称"> <el-input v-model="dialog.vipTypeName" disabled></el-input> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="套餐原价"> <el-input v-model="dialog.payableMoney" disabled></el-input> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="套餐现价"> <el-input v-model="dialog.actualMoney" disabled></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="支付方式"> <el-input v-model="dialog.role" disabled></el-input> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付状态"> <el-input v-model="dialog.payStatus.remark" disabled></el-input> </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {vipOrderList, getAllStore} from '@/api/system'
 import {formatDate} from '@/components/js/data'
export default {
  data () {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      search: { // 查询条件
        tel: '',
        orderid: '',
        cid: this.$store.state._cid
      },
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
      storeList: [],
      list: [],
      dialog: { // 弹框数据
        buyDays: 0,
        giveDays: 0,
        payStatus: {}
      },
      listLoading: false,
      isFormShow: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    if (this.isManage) {
      this.getAllShop()
    }
    this.GetListByPage()
  },
  methods: {
    GetListByPage (refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        userid: '',
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        source: '',
        userphone: this.search.tel,
        orderid: this.search.orderid,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.search.cid
      }
      this.listLoading = true
      vipOrderList(params).then(res => {
        this.listLoading = false
        this.list = res.data.list
        this.total = res.total
      }).catch(() => {
        this.listLoading = false
      })
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
    handleVipBuyRecordView(row) {
      this.isFormShow = true
      this.dialog = row
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    }
  }
}
</script>

<style lang="scss" scoped></style>
