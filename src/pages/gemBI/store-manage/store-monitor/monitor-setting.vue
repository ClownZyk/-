<template>
  <div class="device-list">
    <div class="filter"><el-button type="primary" @click="handleMonitorAdd()">新增门店监控</el-button></div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="monitorList" border>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="shopName" label="门店名称" min-width="250" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备名称" min-width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.deviceSerial" :key="index">{{ item.channelName + (index + 1 !== scope.row.deviceSerial.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设备序列号" min-width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.deviceSerial" :key="index">{{ item.deviceSerial + (index + 1 !== scope.row.deviceSerial.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设备通道" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.deviceSerial" :key="index">{{ item.channelNo + (index + 1 !== scope.row.deviceSerial.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="加密状态" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.deviceSerial" :key="index">{{ item.isEncrypt ? '加密' : '未加密' + (index + 1 !== scope.row.deviceSerial.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleMonitorUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleMonitorRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 监控配置弹框 -->
    <el-dialog title="监控配置" :visible.sync="isMonitordialogVisible" width="50%">
      <el-form ref="addFormRef" :model="addForm">
        <el-form-item label="门店：">
          <el-select v-model="addForm.shopName" placeholder="请选择门店" :disabled="operationAction === 1"> <el-option v-for="item in shopList" :key="item.shopCid" :label="item.shopName" :value="item.shopName"> </el-option> </el-select>
        </el-form-item>
        <el-form-item label="设备：">
          <el-button size="mini" type="primary" @click="openAllDeviceList()">设备选择</el-button>
          <el-table :data="addForm.deviceSerial" border style="margin-top:10px">
            <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
            <el-table-column prop="channelName" label="设备名称" min-width="180" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceSerial" label="设备序列号" min-width="180" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="channelNo" label="设备通道" min-width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="加密状态" min-width="120" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.isEncrypt ? '加密' : '未加密' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeDevice(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"> <el-button type="primary" @click="submitDeviceStore()">确 定</el-button> </span>
    </el-dialog>

    <!-- 所有设备列表弹框 -->
    <el-dialog title="设备列表" :visible.sync="isDevicedialogVisible" width="50%">
      <el-table v-loading="deviceLoading" ref="multipleTable" :data="deviceList" border style="width: 100%" @selection-change="handleSelectionChange" :row-key="getRowKey">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="channelName" label="设备名称" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="deviceSerial" label="设备序列号" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="channelNo" label="设备通道号" min-width="100" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="status" label="在线状态" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.status" style="color:#67C23A">在线</div>
            <div v-else>离线</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="加密状态" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.isEncrypt === 0">未加密</div>
            <div v-else-if="scope.row.isEncrypt === 1" style="color:#E6A23C">加密</div>
          </template>
        </el-table-column>
        <el-table-column label="门店分配" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.shopName || '未分配' }}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @size-change="handleDeviceSizeChange"
        @current-change="handleDeviceCurrentChange"
        :current-page="devicePageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="devicePageSize"
        layout="total, sizes, prev, pager, next"
        :total="deviceTotal"
        background
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer"> <el-button type="primary" @click="saveSelectedDevice()">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getShopCameraList, GetAllShop, getCameraList, shopCameraOperation } from '@/api/system'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      monitorList: [],
      shopList: [],
      addForm: {
        shopName: '',
        deviceSerial: []
      },
      deviceList: [],
      selectedDevice: [],
      operationAction: 0,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      devicePageIndex: 1,
      devicePageSize: 10,
      deviceTotal: 0,
      tableLoading: false,
      deviceLoading: false,
      isMonitordialogVisible: false,
      isDevicedialogVisible: false
    }
  },
  computed: {
    ...mapState(['monitorToken'])
  },
  watch: {
    isMonitordialogVisible(val) {
      if (!val) {
        this.addForm = {
          shopName: '',
          deviceSerial: []
        }
      }
    },
    isDevicedialogVisible(val) {
      if (!val) {
        this.selectedDevice = []
        this.$refs.multipleTable.clearSelection()
      }
    }
  },
  mounted() {
    this.getShopMonitorList()
  },
  methods: {
    // 获取已经配置好的门店监控列表
    getShopMonitorList() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.tableLoading = true
      getShopCameraList(params).then(
        res => {
          this.tableLoading = false
          if (res.data && res.data.length > 0) {
            this.monitorList = res.data
            this.total = res.total
          }
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    // 获取所有门店信息
    getAllStore() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      GetAllShop(params).then(res => {
        if (res.success) {
          this.shopList = res.data
        }
      })
    },
    // 添加门店监控配置
    handleMonitorAdd() {
      this.operationAction = 0
      this.isMonitordialogVisible = true
      this.getAllStore()
    },
    // 更新门店监控配置
    handleMonitorUpdate(row) {
      this.operationAction = 1
      this.isMonitordialogVisible = true
      this.$nextTick(() => {
        let { shopName, deviceSerial, _id } = row
        this.addForm = {
          shopName,
          deviceSerial,
          _id
        }
      })
    },
    // 删除门店监控配置
    handleMonitorRemove(row) {
      this.operationAction = 2
      this.$confirm('确定删除此数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleCameraOperation(row)
        })
        .catch(() => {})
    },

    // 提交分配信息
    submitDeviceStore() {
      if (!this.addForm.shopName) {
        this.$message.warning('请选择门店！')
        return false
      }
      if (this.addForm.deviceSerial.length <= 0) {
        this.$message.warning('请选择门店设备！')
        return false
      }
      this.$confirm('确定提交此数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleCameraOperation(this.addForm)
        })
        .catch(() => {})
    },
    handleCameraOperation(row) {
      let params = {
        dto: {
          ...row,
          creater: localStorage.getItem('creater'),
          roleId: localStorage.getItem('roleId'),
          cid: localStorage.getItem('cid')
        },
        action: this.operationAction
      }
      // console.log(params)
      shopCameraOperation(params).then(
        res => {
          this.$message.success(res.msg)
          this.isMonitordialogVisible = false
          this.getShopMonitorList()
        },
        err => {
          console.log(err.msg)
        }
      )
    },

    // 所有设备列表
    openAllDeviceList() {
      this.isDevicedialogVisible = true
      this.getDeviceList()
    },
    // 获取设备列表
    getDeviceList() {
      let params = {
        accessToken: this.monitorToken,
        pageIndex: this.devicePageIndex - 1,
        pageSize: this.devicePageSize
      }
      this.deviceLoading = true
      getCameraList(params).then(
        res => {
          this.deviceLoading = false
          this.deviceList = res.data
          this.deviceTotal = res.total
        },
        () => {
          this.deviceLoading = false
        }
      )
    },
    // 选择的设备数据处理
    handleSelectionChange(val) {
      // let isDistribution = val.some(v => v.shopName)
      // if (isDistribution) {
      //   this.$message.warning('请选择未分配的设备进行门店绑定！')
      //   return false
      // }
      this.selectedDevice = val.map(item => {
        return {
          deviceSerial: item.deviceSerial,
          channelNo: item.channelNo,
          channelName: item.channelName,
          isEncrypt: item.isEncrypt !== 0
        }
      })
    },
    // 保存选中的数据
    saveSelectedDevice() {
      if (this.selectedDevice.length <= 0) {
        this.$message.warning('至少选中1条数据！')
        return false
      }
      let norepeat = this.selectedDevice.filter(item => {
        return this.addForm.deviceSerial.every(v => v.deviceSerial !== item.deviceSerial)
      })
      this.addForm.deviceSerial.push(...norepeat)
      this.isDevicedialogVisible = false
    },

    // 删除已选择的设备
    removeDevice(row) {
      this.$confirm('确定删除此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let index = this.addForm.deviceSerial.findIndex(v => v.deviceSerial === row.deviceSerial)
          this.addForm.deviceSerial.splice(index, 1)
          // 改变选中状态
          let removeRow = this.deviceList.find(v => v.deviceSerial === row.deviceSerial)
          this.$refs.multipleTable.toggleRowSelection(removeRow)
        })
        .catch(() => {})
    },
    getRowKey(row) {
      return row.channelName
    },
    // 多选框是否可选
    // handleIsSelected(row, index) {
    //   if (row.shopName) {
    //     return false
    //   } else {
    //     return true
    //   }
    // },
    handleSizeChange(val) {
      this.pageSize = val
      this.getShopMonitorList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getShopMonitorList()
    },
    handleDeviceSizeChange(val) {
      this.devicePageSize = val
      this.getDeviceList()
    },
    handleDeviceCurrentChange(val) {
      this.devicePageIndex = val
      this.getDeviceList()
    }
  }
}
</script>

<style lang="scss" scoped>
.device-list {
  padding: 20px;
  .table-list {
    margin: 15px 0;
  }
  .pagination {
    text-align: right;
    margin-top: 15px;
  }
}
</style>
