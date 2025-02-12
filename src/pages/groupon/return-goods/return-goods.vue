<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" inline>
        <div>
          <el-form-item>
            <el-select v-model="search.state" placeholder="请选择退款单状态">
              <el-option v-for="(item, index) in stateList" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-input v-model="search.oriOrderid" placeholder="请输入订单编号" @keyup.enter.native="GetListByPage('refresh')"></el-input> </el-form-item>
          <el-form-item> <el-input v-model.trim="search.mobile" placeholder="请输入收货人手机号" @keyup.enter.native="GetListByPage('refresh')"></el-input> </el-form-item>
          <el-form-item> <el-input v-model.trim="search.name" placeholder="请输入收货人姓名" @keyup.enter.native="GetListByPage('refresh')"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="GetListByPage('refresh')">搜索</el-button> </el-form-item>
          <el-form-item> <el-button type="warning" @click="isRefundApplyShow = true">退款申请</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="danger" @click="operateDeleteMany">批量删除</el-button> </el-form-item>
        </div>
      </el-form>
      <el-table v-loading="listLoading" :data="list" border @selection-change="selectTableRow">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="编号" type="index" width="60"></el-table-column>
        <el-table-column align="center" prop="orderId" label="订单号" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="收货人姓名" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.receiverInfo.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收货人电话" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.receiverInfo.phone || '--' }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="refund_fee" label="退款金额" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="refund_desc" label="退款说明" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.refund_desc || '--' }}</template>
        </el-table-column>
        <el-table-column align="center" prop="state" label="退款状态" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.state === 1" style="color: #e6b321;">待审核</div>
            <div v-else-if="scope.row.state === 2" style="color: #13CE66;">已退款</div>
            <div v-else-if="scope.row.state === 3" style="color: #FF4949;">拒绝退款</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleGrouponRefundCheck(scope.row)" :disabled="scope.row.state !== 1">审核</el-button>
            <el-button type="danger" size="mini" @click="handleGrouponRefundDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 15, 20, 25]" :total="total" layout="total, sizes, prev, pager, next" background>
        </el-pagination>
      </el-col>

      <!-- 退款申请弹框 -->
      <el-dialog title="团购退款申请" :visible.sync="isRefundApplyShow" width="500px" @close="isRefundApplyShow = false" :close-on-click-modal="false">
        <el-form ref="refundApplyFormRef" :model="refundApplyForm" :rules="refundApplyFormRules" label-width="96px" label-position="right">
          <el-form-item label="订单编号：" prop="orderId"> <el-input type="text" v-model.trim="refundApplyForm.orderId" placeholder="请输入订单编号"></el-input> </el-form-item>
          <el-form-item label="退款金额：" prop="total"> <el-input-number v-model="refundApplyForm.total" :controls="false" :min="0" :step="0.01" step-strictly label="退款金额"></el-input-number> </el-form-item>
          <el-form-item label="退款原因：" prop="reason"> <el-input type="textarea" v-model="refundApplyForm.reason" :rows="2" placeholder="请输入退款原因"></el-input> </el-form-item>
        </el-form>
        <span slot="footer"> <el-button :loading="submitRefundApplyLoading" type="primary" @click="submitRefundApplyInfo">确 定</el-button> </span>
      </el-dialog>
      <!-- 退款审核弹框 -->
      <el-dialog title="团购退款审核" :visible.sync="isRefundShow" width="500px" @close="isRefundShow = false" :close-on-click-modal="false">
        <el-form ref="refundFormRef" :model="refundForm" :rules="refundFormRules" label-width="96px" label-position="right">
          <el-row>
            <el-divider content-position="left">退款申请信息</el-divider>
            <el-form-item label="订单编号：">{{ refundForm.orderId }}</el-form-item>
            <el-form-item label="退款金额：">{{ refundForm.refund_fee }}</el-form-item>
            <el-form-item label="退款说明：">{{ refundForm.refund_desc || '--' }}</el-form-item>
          </el-row>
          <el-row>
            <el-divider content-position="left">退款审核信息</el-divider>
            <el-form-item label="审核状态：" prop="state">
              <el-radio-group v-model="refundForm.state">
                <el-radio-button :label="2">同意退款</el-radio-button>
                <el-radio-button :label="3">拒绝退款</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核说明：" prop="replyContent"> <el-input type="textarea" v-model="refundForm.replyContent"></el-input> </el-form-item>
          </el-row>
        </el-form>
        <span slot="footer"> <el-button :loading="submitRefundLoading" type="primary" @click="submitRefundInfo">确 定</el-button> </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { GroupOrderRefundGetListByPage, GroupOrderRefundOperation, postSpellGroupOrderRefund, GroupOrderRefundUpdateReply } from '@/api/system'
export default {
  watch: {
    '$route' (to, from) {
      if (to.name === 'groupon-return-goods') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isRefundApplyShow(val) {
      if (!val) {
        this.$refs['refundApplyFormRef'].resetFields()
      }
    },
    isRefundShow(val) {
      if (!val) {
        this.refundForm = {}
      }
    }
  },
  data () {
    return {
      search: {
        name: '',
        mobile: '',
        oriOrderid: '',
        state: 0
      },
      list: [],
      refundApplyForm: {
        orderId: '',
        reason: '',
        total: 0
      },
      refundForm: {},
      operateAction: 0,
      listLoading: false,
      isRefundShow: false,
      isRefundApplyShow: false,
      submitRefundLoading: false,
      submitRefundApplyLoading: false,
      containerIsShow: true,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      checkedDatas: [],
      stateList: [
        { value: 0, label: '全部审核状态' },
        { value: 1, label: '待审核' },
        { value: 2, label: '同意退款' },
        { value: 3, label: '拒绝退款' }
      ],
      refundApplyFormRules: {
        orderId: [{ required: true, message: '订单编号不能为空', trigger: 'blur' }],
        total: [{ required: true, message: '退款金额不能为空', trigger: 'change' }]
      },
      refundFormRules: {
        state: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    GetListByPage (refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        name: this.search.name,
        mobile: this.search.mobile,
        state: this.search.state,
        oriOrderid: this.search.oriOrderid,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      GroupOrderRefundGetListByPage(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleGrouponRefundDelete(row) {
      this.operateAction = 2
      this.$confirm('确认删除该条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.grouponRefundOperation(row)
      }).catch(() => {})
    },
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.checkedDatas.forEach(v => {
            that.grouponRefundOperation(v)
          })
        }).catch(() => {})
      } else {
        that.$message.warning('请选中要删除的数据！')
      }
    },
    grouponRefundOperation(row) {
      let params = {
        Dto: {
          _id: row._id
        },
        Action: this.operateAction
      }
      GroupOrderRefundOperation(params).then(res => {
        this.$message.success(res.msg)
        this.GetListByPage()
      })
    },
    // 退款申请
    submitRefundApplyInfo() {
      this.$refs['refundApplyFormRef'].validate((valid) => {
        if (valid) {
          let params = {
            ...this.refundApplyForm,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          this.submitRefundApplyLoading = true
          // console.log(params)
          postSpellGroupOrderRefund(params).then(res => {
            this.isRefundApplyShow = false
            this.submitRefundApplyLoading = false
            this.$message.success(res.msg)
            this.GetListByPage()
          }).catch(() => {
            this.submitRefundApplyLoading = false
          })
        }
      })
    },
    // 退款审核
    handleGrouponRefundCheck(row) {
      this.isRefundShow = true
      this.$nextTick(() => {
        // eslint-disable-next-line camelcase
        let { orderId, refund_fee, refund_desc, _id } = row
        this.refundForm = {
          orderId,
          refund_fee,
          refund_desc,
          _id,
          remark: '',
          replyContent: '',
          state: 2
        }
      })
    },
    submitRefundInfo() {
       this.$refs['refundFormRef'].validate((valid) => {
         if (valid) {
           if (this.refundForm.state === 3 && !this.refundForm.replyContent) {
             return this.$message.warning('请填写拒绝退款的说明！')
           }
           let params = {
             remark: this.refundForm.remark,
             replyContent: this.refundForm.replyContent,
             state: this.refundForm.state,
             _id: this.refundForm._id
           }
           this.submitRefundLoading = true
           GroupOrderRefundUpdateReply(params).then(res => {
             this.submitRefundLoading = false
             this.isRefundShow = false
             this.$message.success(res.msg)
             this.GetListByPage()
           }).catch(() => {
             this.submitRefundLoading = false
           })
         }
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
