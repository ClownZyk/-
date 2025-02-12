<template>
  <div class="container">
    <el-form>
      <el-form-item> <el-button type="primary" @click="handleDefineIntegralAdd()">积分累计活动添加</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="tableLoading" :data="activityList" border>
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="积分累计名称" prop="title" min-width="200" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="积分累计活动时间" min-width="200" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.activeStartTime.split(' ')[0] }} - {{ scope.row.activeEndTime.split(' ')[0] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="零售兑换积分倍数" prop="retailMultiple" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="餐食兑换积分倍数" prop="makeMultiple" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="饮品兑换积分倍数" prop="drinkMultiple" min-width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleDefineIntegralUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDefineIntegralDetele(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total" background style="margin-top:15px;text-align:right">
    </el-pagination>
    <!-- 积分积累活动信息弹框 -->
    <el-dialog title="积分积累" :visible.sync="isDefineIntegralShow" width="550px" @close="isDefineIntegralShow = false">
      <el-form ref="activityConfigRef" :model="activityConfig" :rules="activityConfigRules" label-position="top">
        <el-form-item label="积分累计名称" prop="title"> <el-input type="text" v-model.trim="activityConfig.title" placeholder="请输入积分累计名称"></el-input> </el-form-item>
        <el-form-item label="积分累计活动时间" prop="timeSlot">
          <el-date-picker v-model="activityConfig.timeSlot" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy/MM/dd" value-format="yyyy/MM/dd" style="width:100%"> </el-date-picker>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="零售兑换积分倍数" prop="retailMultiple">
              <el-input-number v-model="activityConfig.retailMultiple" :controls="false" :min="0" :step="0.1" step-strictly label="零售兑换积分倍数" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="餐食兑换积分倍数" prop="makeMultiple">
              <el-input-number v-model="activityConfig.makeMultiple" :controls="false" :min="0" :step="0.1" step-strictly label="餐食兑换积分倍数" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="饮品兑换积分倍数" prop="drinkMultiple">
              <el-input-number v-model="activityConfig.drinkMultiple" :controls="false" :min="0" :step="0.1" step-strictly label="饮品兑换积分倍数" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer"> <el-button :loading="submitLoading" type="primary" @click="submitActivityInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/components/js/data'
import { getDefineIntegralLevel, defineIntegralLevelOperation } from '@/api/system'

export default {
  data() {
    return {
      activityList: [],
      activityConfig: {
        title: '',
        activeStartTime: '',
        activeEndTime: '',
        timeSlot: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')],
        retailMultiple: 1,
        makeMultiple: 1,
        drinkMultiple: 1
      },
      addFormState: 0,
      submitLoading: false,
      tableLoading: false,
      isDefineIntegralShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      activityConfigRules: {
        title: [{ required: true, message: '请输入积分累计活动名称', trigger: 'blur' }],
        timeSlot: [{ required: true, message: '请选择积分累计活动时间', trigger: 'change' }],
        retailMultiple: [{ required: true, message: '零售兑换积分倍数不能为空', trigger: 'change' }],
        makeMultiple: [{ required: true, message: '餐食兑换积分倍数不能为空', trigger: 'change' }],
        drinkMultiple: [{ required: true, message: '饮品兑换积分倍数不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    isDefineIntegralShow(val) {
      if (!val) {
        delete this.activityConfig._id
        this.$refs['activityConfigRef'].resetFields()
      }
    }
  },
  mounted() {
    this.getIntegralAddConfig()
  },
  methods: {
    getIntegralAddConfig() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.tableLoading = true
      getDefineIntegralLevel(params)
        .then(res => {
          this.tableLoading = false
          this.activityList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleDefineIntegralAdd() {
      this.addFormState = 0
      this.isDefineIntegralShow = true
    },
    handleDefineIntegralUpdate(row) {
      this.addFormState = 1
      this.isDefineIntegralShow = true
      this.$nextTick(() => {
        let { title, activeStartTime, activeEndTime, retailMultiple, makeMultiple, drinkMultiple, _id } = row
        this.activityConfig = { title, activeStartTime, activeEndTime, retailMultiple, makeMultiple, drinkMultiple, _id }
        this.$set(this.activityConfig, 'timeSlot', [this.activityConfig.activeStartTime, this.activityConfig.activeEndTime])
      })
    },
    handleDefineIntegralDetele(row) {
      this.addFormState = 2
      this.$confirm('此操作将永久删除该积分积累活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.defineIntegralOperation(row)
        })
        .catch(() => {})
    },
    submitActivityInfo() {
      this.$refs['activityConfigRef'].validate(valid => {
        if (valid) {
          this.defineIntegralOperation()
        }
      })
    },
    defineIntegralOperation(row) {
      const publicParam = row
        ? { ...row }
        : {
            ...this.activityConfig,
            activeStartTime: this.activityConfig.timeSlot && this.activityConfig.timeSlot.length > 0 ? this.activityConfig.timeSlot[0] : '',
            activeEndTime: this.activityConfig.timeSlot && this.activityConfig.timeSlot.length > 0 ? this.activityConfig.timeSlot[1] : ''
          }
      let params = {
        dto: {
          ...publicParam,
          creater: localStorage.getItem('creater'),
          roleId: localStorage.getItem('roleId'),
          cid: localStorage.getItem('cid')
        },
        action: this.addFormState
      }
      this.submitLoading = true
      defineIntegralLevelOperation(params)
        .then(res => {
          this.submitLoading = false
          this.isDefineIntegralShow = false
          this.$message.success(res.msg)
          this.getIntegralAddConfig()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getIntegralAddConfig()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getIntegralAddConfig()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>
