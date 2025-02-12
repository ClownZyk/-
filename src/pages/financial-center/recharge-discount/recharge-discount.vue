<template>
  <div class="page-container">
    <el-form class="filters" inline>
      <el-form-item> <el-button type="primary" @click="handleRechargeDiscountAdd">新增充值优惠</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="rechargeDicountList" border>
      <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="recharge" label="充值金额" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="giving" label="赠送金额" min-width="180" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="cards" label="赠送卡劵" min-width="350" show-overflow-tooltip></el-table-column> -->
      <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="handleRechargeDiscountEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleRechargeDiscountDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 15, 20, 25]" :total="total" layout="total, sizes, prev, pager, next" background>
      </el-pagination>
    </el-col>
    <el-dialog title="充值优惠" :visible.sync="isFormShow" width="600px" :close-on-click-modal="false">
      <el-form ref="dialogRef" :model="dialog" :rules="formRules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="充值金额" prop="recharge"> <el-input-number v-model="dialog.recharge" :min="0" :step="0.01" step-strictly :controls="false" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠送金额" prop="giving"> <el-input-number v-model="dialog.giving" :min="0" :max="dialog.recharge" :step="0.01" step-strictly :controls="false" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="isFormShow = false">返回</el-button>
        <el-button type="primary" @click="submitRechargeDiscountInfo">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {RechargeDiscountList, RechargeDiscountOperation} from '@/api/system'
export default {
  data () {
    return {
      rechargeDicountList: [],
      dialog: {
        recharge: 0,
        giving: 0,
        cards: []
      },
      operationAction: 0,
      listLoading: false,
      isFormShow: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      formRules: {
        recharge: [{ required: true, message: '请填写充值金额', trigger: 'change' }],
        giving: [{ required: true, message: '请填写赠送金额', trigger: 'change' }]
      }
    }
  },
  watch: {
    isFormShow(val) {
      if (!val) {
        this.dialog = {
          recharge: 0,
          giving: 0,
          cards: []
        }
      }
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    GetListByPage () {
      let params = {
        activityName: '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
     RechargeDiscountList(params).then(res => {
        this.listLoading = false
        this.rechargeDicountList = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleRechargeDiscountAdd() {
      this.operationAction = 0
      this.isFormShow = true
    },
    handleRechargeDiscountEdit(row) {
      this.operationAction = 1
      this.isFormShow = true
      this.$nextTick(() => {
        let {recharge, giving, cards, _id} = row
        this.dialog = {
          recharge,
          giving,
          cards,
          _id
        }
      })
    },
    submitRechargeDiscountInfo() {
      this.$refs['dialogRef'].validate((valid) => {
        if (valid) {
          this.rechargeDiscountOperation()
        }
      })
    },
    handleRechargeDiscountDelete(row) {
      this.operationAction = 2
      this.$confirm('是否删除该充值优惠信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rechargeDiscountOperation(row)
      }).catch(() => {})
    },
    rechargeDiscountOperation(row) {
      const publicParam = row ? {...row} : {...this.dialog}
       let params = {
          dto: {
            ...publicParam,
            creater: localStorage.getItem('creater'),
            roleId: localStorage.getItem('roleId'),
            cid: localStorage.getItem('cid')
          },
          action: this.operationAction
        }
        RechargeDiscountOperation(params).then(res => {
          this.$message.success(res.msg)
          this.isFormShow = false
          this.GetListByPage()
        })
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
