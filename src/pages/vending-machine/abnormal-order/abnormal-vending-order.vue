<template>
  <div v-if="containerIsShow">
    <el-form :model="searchForm" inline>
      <el-form-item label="开门编码"> <el-input type="text" v-model.trim="searchForm.orderCode" placeholder="请输入开门编码检索" clearable></el-input> </el-form-item>
      <el-form-item label="售卖机名称">
        <el-select v-model="searchForm.vmCode" placeholder="请选择售卖机" clearable @change="machinceChange"> <el-option v-for="item in vendingMachineList" :key="item._id" :label="item.name" :value="item.code"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="searchForm.isHandle" placeholder="请选择处理状态"> <el-option v-for="item in handleList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="orderList" border>
        <!-- <el-table-column type="index" width="60" align="center"></el-table-column> -->
        <el-table-column label="门店名称" prop="shopName" min-width="220" align="center"></el-table-column>
        <el-table-column label="开门编码" prop="orderCode" width="160" align="center"></el-table-column>
        <el-table-column label="售卖机编码" prop="vmCode" width="160" align="center"></el-table-column>
        <el-table-column label="开关门时间" width="310" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.openDoorTime }}-{{ scope.row.closeDoorTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="购买动作状态" width="160" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.shopMove | shopMoveListFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="硬件异常原因" width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.hardwareEx">{{ scope.row.hardwareEx | hardwareExListFilter }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="识别处理状态" width="160" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.handleStatus | handleStatusListFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="人工处理异常原因" min-width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.abnormalReasons && scope.row.abnormalReasons.length > 0">{{ scope.row.abnormalReasons | abnormalReasonsFilters }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="订单处理状态" min-width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.isHandle" style="color: #67C23A">已处理</div>
            <div v-else style="color: #F56C6C">未处理</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" :type="scope.row.isHandle ? 'primary' : 'warning'" @click="handleAbnormalOrder(scope.row)">{{ scope.row.isHandle ? '处理详情' : '异常处理' }}</el-button>
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
        style="margin-top: 10px;text-align:right"
      >
      </el-pagination>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getVendingMachineAbnormalOrder, getShopBindVendingMachine } from '@/api/system'
import Filters from '@/components/js/Filters'
import { getDataString } from '@/filters/filters'

export default {
  mixins: [Filters],
  watch: {
    $route(to, from) {
      if (to.name === 'abnormal-vending-order') {
        this.getOrderList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      searchForm: {
        orderId: '',
        orderCode: this.$route.query.orderCode || '',
        vmCode: this.$route.query.vmCode || '',
        phone: '',
        orderStatus: 0,
        isHandle: false,
        cid: this.$route.query.cid || this.$store.state._cid
      },
      vendingMachineList: [],
      orderList: [],
      tableLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      handleList: [{ value: false, label: '未处理' }, { value: true, label: '已处理' }]
    }
  },
  mounted() {
    this.getShopBindVendingMachine()
    this.getOrderList()
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
    getOrderList() {
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
      getVendingMachineAbnormalOrder(params)
        .then(res => {
          this.tableLoading = false
          this.orderList = res.data.map(item => {
            return {
              ...item,
              openDoorTime: getDataString(new Date(item.openDoorTime), 'yyyy-MM-dd hh:mm:ss'),
              closeDoorTime: getDataString(new Date(item.closeDoorTime), 'yyyy-MM-dd hh:mm:ss')
            }
          })
          this.total = res.total
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
    handleAbnormalOrder(row) {
      if (this.$route.query.orderId) {
        this.$router.push({ path: '/pay-score-abnormal-order-detail', query: { orderCode: row.orderCode, vmCode: row.vmCode } })
      } else {
        this.$router.push({ path: '/abnormal-order-detail', query: { queryCid: row.cid, orderCode: row.orderCode, vmCode: row.vmCode } })
      }
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
