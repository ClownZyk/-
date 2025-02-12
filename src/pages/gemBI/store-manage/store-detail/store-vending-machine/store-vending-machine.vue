<template>
  <div>
    <el-table v-if="machineList.length > 0" v-loading="tableLoading" :data="machineList" border>
      <el-table-column label="售卖机名称" prop="name" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="售卖机编码" prop="code" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="门状态" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isOpen" style="color:#F56C6C">开启</span> <span v-else style="color:#67C23A">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="联网状态" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnLine" style="color:#67C23A">在线</span> <span v-else style="color:#F56C6C">离线</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数" prop="ordCnt" min-width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售额" prop="ordSales" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ parseFloat(scope.row.ordSales.toFixed(2)) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="goToVendingMachineDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="该门店暂无自助售卖机"></el-empty>
  </div>
</template>

<script>
import { getShopBindVendingMachine } from '@/api/system'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      machineList: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapState(['storeCid'])
  },
  mounted() {
    this.getShopBindVendingMachine()
  },
  methods: {
    getShopBindVendingMachine() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.storeCid
      }
      this.tableLoading = true
      getShopBindVendingMachine(params)
        .then(res => {
          this.tableLoading = false
          this.machineList = res.data.listData
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    goToVendingMachineDetail(row) {
      this.$router.push({ path: '/store-vending-machine-detail', query: { cid: this.storeCid, vmCode: row.code } })
    }
  }
}
</script>

<style lang="scss" scoped></style>
