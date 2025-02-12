<template>
  <div v-loading="detailLoading">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form label-position="top">
      <el-row>
        <el-col :span="14">
          <el-form-item label="设备关联信息">
            <div><el-button size="small" type="warning" @click="handleMachineAdd">设备添加</el-button></div>
            <el-table size="small" :data="vmList" border style="margin-top:10px">
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column label="设备名称" prop="name" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
              <el-table-column label="设备编码" prop="code" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
              <el-table-column label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                  <!-- <el-button size="mini" type="warning" @click="pushMachineAdvert(scope.row)">投放</el-button> -->
                  <el-button size="mini" type="danger" @click="clearMachineAdvert(scope.row)">清除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 设备选择弹框 -->
    <el-dialog title="设备信息" :visible.sync="isMachineShow" width="1000px" @close="isMachineShow = false" :close-on-click-modal="false">
      <el-table size="small" v-loading="tableLoading" ref="listTableRef" :data="machineList" row-key="vUnionCode" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" reserve-selection :selectable="handleSelected" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="自编码" prop="vUnionCode" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="绑定店铺" prop="companyName" min-width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.companyName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="售卖机名称" prop="name" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="售卖机编码" prop="code" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.code || '--' }}
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
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitAdvertBindMachineInfo">设备关联</el-button> </span> <span slot="footer"></span>
    </el-dialog>
  </div>
</template>

<script>
import { getVendingMachineAdvertDetail, getShopBindVendingMachine, bindVendingMachineAdvertDev, pushVendingMachineAdvertDev } from '@/api/system'

export default {
  data() {
    return {
      vmList: [],
      machineList: [],
      selectedMachine: [],
      submitLoading: false,
      tableLoading: false,
      detailLoading: false,
      isMachineShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    isMachineShow(val) {
      if (!val) {
        this.$refs['listTableRef'].clearSelection()
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getAdvertDetail()
    }
  },
  methods: {
    getAdvertDetail() {
      let params = {
        id: this.$route.query.id,
        vmcode: ''
      }
      this.detailLoading = true
      getVendingMachineAdvertDetail(params)
        .then(res => {
          this.detailLoading = false
          this.vmList = res.data.vmList || []
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    handleMachineAdd() {
      this.isMachineShow = true
      this.getShopBindVendingMachine()
    },
    getShopBindVendingMachine() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getShopBindVendingMachine(params)
        .then(res => {
          this.tableLoading = false
          this.machineList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleSelectionChange(val) {
      this.selectedMachine = JSON.parse(JSON.stringify(val))
    },
    submitAdvertBindMachineInfo() {
      if (this.selectedMachine.length <= 0) {
        return this.$message.warning('请至少选择一个需要关联的设备！')
      }
      let noRepeatList = this.selectedMachine.filter(item => {
        return this.vmList.every(val => item !== val)
      })
      this.vmList.push(...noRepeatList)
      let params = {
        id: this.$route.query.id,
        vmcode: this.vmList.map(item => item.code)
      }
      this.submitLoading = true
      bindVendingMachineAdvertDev(params)
        .then(res => {
          this.submitLoading = false
          this.isMachineShow = false
          this.$message.success(res.msg)
          this.getAdvertDetail()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    pushMachineAdvert(row) {
      this.$confirm('确定给该设备投放此广告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: this.$route.query.id,
            vmcode: row.code
          }
          pushVendingMachineAdvertDev(params).then(res => {
            this.$message.success(res.msg)
          })
        })
        .catch(() => {})
    },
    clearMachineAdvert(row) {
      this.$confirm('确定清除该广告下该设备信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: 0,
            vmcode: row.code
          }
          pushVendingMachineAdvertDev(params).then(res => {
            this.$message.success(res.msg)
            this.getAdvertDetail()
          })
        })
        .catch(() => {})
    },
    handleSelected(row) {
      if (!row.code) {
        return false
      } else {
        return true
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getShopBindVendingMachine()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getShopBindVendingMachine()
    }
  }
}
</script>

<style lang="scss" scoped></style>
