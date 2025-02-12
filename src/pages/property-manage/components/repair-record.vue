<template>
  <div>
    <el-table v-loading="listLoading" :data="repairRecordList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="维修状态" width="140" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.repairState === 1" style="color:#E6A23C">维修中</div>
          <div v-else-if="scope.row.repairState === 2" style="color:#67C23A">已维修</div>
          <div v-else-if="scope.row.repairState === 3" style="color:#F56C6C">已损坏</div>
        </template>
      </el-table-column>
      <el-table-column label="维修原因" prop="reason" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="维修备注" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remarks || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleRepairEdit(scope.row)">修改</el-button>
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
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </el-col>
    <!-- 维修状态修改弹框 -->
    <el-dialog title="资产维修" :visible.sync="isPropertyRepairShow" width="500px" @close="isPropertyRepairShow = false" :close-on-click-modal="false">
      <el-form ref="repairFormRef" :model="repairForm" :rules="repairFormRules" label-width="95px" label-position="right">
        <el-form-item label="创建时间：">{{ repairForm.createTime }}</el-form-item>
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
</template>

<script>
import { getPropertyRepairRecordList, propertyRepairRecordOperation } from '@/api/system'

export default {
  data() {
    return {
      repairRecordList: [],
      repairForm: {},
      repairFormState: 1,
      listLoading: false,
      submitRepairLoading: false,
      isPropertyRepairShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      repairFormRules: {
        reason: [{ required: true, message: '请输入资产维修原因', trigger: 'blur' }],
        repairState: [{ required: true, message: '请选择资产维修状态', trigger: 'change' }]
      }
    }
  },
  watch: {
    isPropertyRepairShow(val) {
      if (!val) {
        this.repairForm = {}
      }
    }
  },
  mounted() {
    this.getRepairRecordList()
  },
  methods: {
    getRepairRecordList() {
      let params = {
        propertyId: this.$route.query.id,
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
      getPropertyRepairRecordList(params)
        .then(res => {
          this.listLoading = false
          this.repairRecordList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleRepairEdit(row) {
      this.repairFormState = 1
      this.isPropertyRepairShow = true
      this.$nextTick(() => {
        let { propertyId, reason, remarks, repairState, createTime, _id } = row
        this.repairForm = {
          propertyId,
          reason,
          remarks,
          repairState,
          createTime,
          _id
        }
      })
    },
    submitRepairInfo() {
      this.$refs['repairFormRef'].validate(valid => {
        if (valid) {
          let params = {
            dto: {
              ...this.repairForm,
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
              this.getRepairRecordList()
            })
            .catch(() => {
              this.submitRepairLoading = false
            })
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRepairRecordList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getRepairRecordList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
