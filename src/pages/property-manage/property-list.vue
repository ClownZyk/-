<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form class="filters" :model="filterParam" inline>
        <div>
          <el-form-item label="资产名称"> <el-input type="text" v-model.trim="filterParam.propertyName" placeholder="请输入资产名称" @keyup.enter.native="getPropertyList('refresh')"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="getPropertyList('refresh')">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="warning" @click="handlePropertyAdd()">资产新增</el-button> </el-form-item>
        </div>
      </el-form>
      <div style="margin-bottom:10px"><el-alert title="列表的资产转移和资产维修只用于记录的添加，转移和维修记录列表可点击‘详情’进行查看" type="warning" show-icon :closable="false"> </el-alert></div>
      <el-table v-loading="listLoading" :data="propertyList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="资产名称" prop="propertyName" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="资产类别" prop="categoryName" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="资产价格（元）" prop="price" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="负责人" prop="headUp.headUpName" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="负责人电话" prop="headUp.headUpPhone" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center"></el-table-column>
        <el-table-column label="操作" width="360" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handlePropertyTransfer(scope.row)">资产转移</el-button>
            <el-button size="mini" type="primary" @click="handlePropertyRepair(scope.row)">资产维修</el-button>
            <el-button size="mini" type="warning" @click="handlePropertyEdit(scope.row)">详情</el-button>
            <el-button size="mini" type="danger" @click="handlePropertyDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
          style="text-align:right;margin-top:15px"
        >
        </el-pagination>
      </el-col>
      <!-- 资产转移弹框 -->
      <el-dialog title="资产转移" :visible.sync="isPropertyTransferShow" width="500px" @close="isPropertyTransferShow = false" :close-on-click-modal="false">
        <el-form ref="transferFormRef" :model="transferForm" :rules="transferFormRules" label-width="95px" label-position="right">
          <el-form-item label="资产名称：">{{ transferForm.propertyName }}</el-form-item>
          <el-form-item label="资产状态：" prop="propertyState">
            <el-radio-group v-model="transferForm.propertyState">
              <el-radio-button :label="1">使用中</el-radio-button>
              <el-radio-button :label="2">转移中</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="转移门店：" prop="storeInfo.storeCid">
            <el-select v-model="transferForm.storeInfo.storeCid" placeholder="请选择要转移的门店" @change="storeChange" style="width:100%">
              <el-option v-for="item in storeList" :key="item.storeCid" :label="item.storeName" :value="item.storeCid"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转移备注：" prop="remarks"> <el-input type="textarea" v-model="transferForm.remarks" :rows="2" placeholder="请输入资产转移备注"></el-input> </el-form-item>
        </el-form>
        <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitTransferInfo">确 定</el-button> </span>
      </el-dialog>
      <!-- 资产维修弹框 -->
      <el-dialog title="资产维修" :visible.sync="isPropertyRepairShow" width="500px" @close="isPropertyRepairShow = false" :close-on-click-modal="false">
        <el-form ref="repairFormRef" :model="repairForm" :rules="repairFormRules" label-width="95px" label-position="right">
          <el-form-item label="资产名称：">{{ repairForm.propertyName }}</el-form-item>
          <el-form-item label="维修状态：" prop="repairState">
            <el-radio-group v-model="repairForm.repairState">
              <el-radio-button :label="1">维修中</el-radio-button>
              <el-radio-button :label="2">已维修</el-radio-button>
              <el-radio-button :label="3">已损坏</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="维修原因：" prop="reason"> <el-input type="textarea" v-model="repairForm.reason" :rows="2" placeholder="请输入资产维修原因"></el-input> </el-form-item>
          <el-form-item label="维修备注：" prop="remarks"> <el-input type="textarea" v-model="repairForm.remarks" :rows="2" placeholder="请输入资产维修备注"></el-input> </el-form-item>
        </el-form>
        <span slot="footer"> <el-button :loading="submitRepairLoading" type="primary" @click="submitRepairInfo">确 定</el-button> </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getPropertyInfoList, propertyInfoOperation, getAllStore, propertyTransferRecordOperation, propertyRepairRecordOperation } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'property-list') {
        this.getPropertyList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isPropertyTransferShow(val) {
      if (!val) {
        this.transferForm = {
          sourceInfo: {},
          storeInfo: {},
          propertyState: 2,
          remarks: ''
        }
      }
    },
    isPropertyRepairShow(val) {
      if (!val) {
        this.repairForm = {
          repairState: 1,
          remarks: ''
        }
      }
    }
  },
  data() {
    return {
      filterParam: {
        propertyName: ''
      },
      propertyList: [],
      transferForm: {
        sourceInfo: {},
        storeInfo: {},
        propertyState: 2,
        remarks: ''
      },
      repairForm: {
        repairState: 1,
        remarks: ''
      },
      transferFormState: 0,
      repairFormState: 0,
      storeList: [],
      listLoading: false,
      submitLoading: false,
      containerIsShow: true,
      submitRepairLoading: false,
      isPropertyRepairShow: false,
      isPropertyTransferShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      transferFormRules: {
        'storeInfo.storeCid': [{ required: true, message: '请选择资产转移门店', trigger: 'change' }],
        propertyState: [{ required: true, message: '请选择资产状态', trigger: 'change' }]
      },
      repairFormRules: {
        reason: [{ required: true, message: '请输入资产维修原因', trigger: 'blur' }],
        repairState: [{ required: true, message: '请选择资产维修状态', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getPropertyList()
  },
  methods: {
    getPropertyList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getPropertyInfoList(params)
        .then(res => {
          this.listLoading = false
          this.propertyList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handlePropertyAdd() {
      this.$router.push('/property-detail')
    },
    handlePropertyEdit(row) {
      this.$router.push({ path: '/property-detail', query: { propertyName: row.propertyName, id: row._id } })
    },
    handlePropertyDelete(row) {
      this.$confirm('此操作将永久删除该资产信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: row,
            action: 2
          }
          propertyInfoOperation(params).then(res => {
            this.$message.success(res.msg)
            this.getPropertyList()
          })
        })
        .catch(() => {})
    },
    // 资产转移
    handlePropertyTransfer(row) {
      this.transferFormState = 0
      this.isPropertyTransferShow = true
      this.getStoreList()
      this.$nextTick(() => {
        this.transferForm.propertyName = row.propertyName
        this.transferForm.propertyId = row._id
      })
    },
    getStoreList() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        pageIndex: 1,
        pageSize: 10,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getAllStore(params).then(res => {
        let allStore = res.data.map(item => {
          return {
            storeCid: item.cid,
            storeName: item.companyName
          }
        })
        this.storeList = allStore.filter(item => item.storeCid !== this.$store.state._cid)
        this.transferForm.sourceInfo = allStore.find(item => item.storeCid === this.$store.state._cid)
      })
    },
    storeChange(val) {
      let storeInfo = this.storeList.find(item => item.storeCid === val)
      if (storeInfo) {
        this.transferForm.storeInfo = storeInfo
      }
    },
    submitTransferInfo() {
      this.$refs['transferFormRef'].validate(valid => {
        if (valid) {
          if (!this.transferForm.propertyId) {
            return this.$message.warning('资产id不能为空！')
          }
          if (!this.transferForm.sourceInfo.storeCid) {
            return this.$message.warning('资产来源信息不能为空！')
          }
          let params = {
            dto: {
              propertyId: this.transferForm.propertyId,
              sourceInfo: this.transferForm.sourceInfo,
              storeInfo: this.transferForm.storeInfo,
              remarks: this.transferForm.remarks,
              propertyState: this.transferForm.propertyState,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.transferFormState
          }
          // console.log(params)
          this.submitLoading = true
          propertyTransferRecordOperation(params)
            .then(res => {
              this.submitLoading = false
              this.isPropertyTransferShow = false
              this.$message.success(res.msg)
              this.getPropertyList()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 资产维修
    handlePropertyRepair(row) {
      this.repairFormState = 0
      this.isPropertyRepairShow = true
      this.$nextTick(() => {
        this.repairForm.propertyName = row.propertyName
        this.repairForm.propertyId = row._id
      })
    },
    submitRepairInfo() {
      this.$refs['repairFormRef'].validate(valid => {
        if (valid) {
          if (!this.repairForm.propertyId) {
            return this.$message.warning('资产id不能为空！')
          }
          let params = {
            dto: {
              propertyId: this.repairForm.propertyId,
              reason: this.repairForm.reason,
              remarks: this.repairForm.remarks,
              repairState: this.repairForm.repairState,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.repairFormState
          }
          // console.log(params)
          this.submitRepairLoading = true
          propertyRepairRecordOperation(params)
            .then(res => {
              this.submitRepairLoading = false
              this.isPropertyRepairShow = false
              this.$message.success(res.msg)
              this.getPropertyList()
            })
            .catch(() => {
              this.submitRepairLoading = false
            })
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getPropertyList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getPropertyList()
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
}
</style>
