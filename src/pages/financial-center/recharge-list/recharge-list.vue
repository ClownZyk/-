<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form :model="search" inline>
        <div>
          <el-form-item> <el-input v-model="search.userPhone" placeholder="请输入手机号" clearable @keyup.enter.native="_searchCondition"></el-input> </el-form-item>
          <el-form-item> <el-input v-model="search.orderid" placeholder="请输入订单编号" clearable @keyup.enter.native="_searchCondition"></el-input> </el-form-item>
          <el-date-picker
            v-model="search.sTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width:400px;"
          ></el-date-picker>
          <el-form-item>
            <el-select v-model="search.payState" placeholder="支付状态"> <el-option v-for="item in payState" :key="item.label" :label="item.label" :value="item.value"></el-option> </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.source" placeholder="充值方式"> <el-option v-for="item in rechargeTypeList" :key="item.label" :label="item.label" :value="item.value"></el-option> </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.payType" placeholder="支付方式"> <el-option v-for="item in payTypeState" :key="item.label" :label="item.label" :value="item.value"></el-option> </el-select>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="_searchCondition">查询</el-button> </el-form-item>
        </div>
      </el-form>
      <el-table v-loading="listLoading" :data="list" border>
        <el-table-column prop="orderid" align="center" label="订单编号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="姓名" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.buyUser.nickName || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.phone" width="120" align="center" label="手机号">
          <template slot-scope="scope">
            <div>{{ scope.row.buyUser.userPhone || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="setMeal.recharge" min-width="90" align="center" label="充值金额"></el-table-column>
        <el-table-column prop="setMeal.giving" min-width="90" align="center" label="赠送金额"></el-table-column>
        <el-table-column prop="orderStatus" min-width="90" align="center" label="订单状态"></el-table-column>
        <el-table-column prop="source" min-width="100" align="center" label="来源"></el-table-column>
        <el-table-column align="center" min-width="90" label="付款方式">
          <template slot-scope="scope">{{ scope.row.pays.payType | payTypeStateFilter }}</template>
        </el-table-column>
        <el-table-column min-width="90" align="center" label="退款状态">
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus" style="color:#67C23A"><span v-if="scope.row.payStatus.isRefund">已退款</span> <span v-else>--</span></div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus.remark" align="center" label="备注" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.payStatus.remark || '--' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" width="190"></el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus">
              <el-button v-if="scope.row.payStatus.payState === 'ok' && !scope.row.payStatus.isRefund" size="mini" type="warning" @click="orderRefund(scope.row)">退款</el-button>
              <!-- <el-button v-if="scope.row.payStatus.isRefund" size="mini" type="success" @click="goToRefundOrder(scope.row)">退款详情</el-button> -->
              <div v-else>--</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <div class="sales-total">
          <div>
            订单总数：<span>{{ total }}</span>
          </div>
          <div>
            消费总人数：<span>{{ payCount }}</span>
          </div>
          <div>
            消费总额：<span>{{ totalPay }}</span>
          </div>
        </div>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[10, 15, 20, 25]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          background
        ></el-pagination>
      </el-col>
      <!-- 退款弹框 -->
      <el-dialog title="充值退款" :visible.sync="isRechargeRefundShow" width="600px" @close="isRechargeRefundShow = false" :close-on-click-modal="false">
        <el-form ref="refundFormRef" :model="refundForm" :rules="refundFormRules" label-position="top">
          <el-divider content-position="left">充值信息</el-divider>
          <el-row>
            <el-form-item label="充值订单号：">{{ refundForm.orderid }}</el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="充值金额：">{{ refundForm.setMeal.recharge }} 元</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赠送金额：">{{ refundForm.setMeal.giving }} 元</el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">退款信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="退款金额：" prop="refund"> <el-input-number v-model="refundForm.refund" :min="0" :controls="false" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户余额扣减金额（充值+赠送）：" prop="accountMoney">
                <el-input-number v-model="refundForm.accountMoney" :min="0" :controls="false" :step="0.01" step-strictly style="width: 100%"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="退款备注："> <el-input type="textarea" v-model="refundForm.remark" :rows="2" placeholder="请输入退款备注信息"></el-input> </el-form-item>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer"> <el-button :loading="refundLoading" type="primary" @click="submitRechargeRefundInfo">确 定</el-button> </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { rechargeList, rechargeOrderRefundOperation
 } from '@/api/system'
import { formatDate } from '@/components/js/data'
import Filter from '@/components/js/Filters'

export default {
  name: 'vote-list',
  mixins: [Filter],
  data() {
    return {
      search: {
        userPhone: '',
        orderid: '',
        payState: '',
        payType: 99,
        source: '',
        sTime: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      },
      list: [],
      payCount: 0,
      totalPay: 0,
      refundForm: {
        setMeal: {}
      },
      refundLoading: false,
      isRechargeRefundShow: false,
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      operateAction: 0,
      checkedDatas: [],
      containerIsShow: true,
      rechargeTypeList: [
        { value: '', label: '所有来源' },
        { value: '在店充值', label: '在店充值' },
        { value: '小程序充值', label: '小程序充值' }
      ],
      refundFormRules: {
        refund: [{ required: true, message: '请输入退款金额', trigger: 'change' }],
        accountMoney: [{ required: true, message: '请输入用户余额扣减金额', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'recharge-list') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isRechargeRefundShow(val) {
      if (!val) {
        this.refundForm = {
          setMeal: {}
        }
      }
    }
  },
  methods: {
    // 加载数据
    async GetListByPage() {
      let params = {
        ...this.search,
        sTime: this.search.sTime[0] + '~' + this.search.sTime[1],
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
      await rechargeList(params).then(
        res => {
          this.listLoading = false
          this.list = res.data.list
          this.total = res.total
          this.totalPay = res.data.totalSum
          this.payCount = res.data.manCount
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    },
    // 订单退款
    orderRefund(row) {
      this.isRechargeRefundShow = true
      this.$nextTick(() => {
        let {orderid, setMeal, _id} = row
        this.refundForm = {
          _id,
          orderid,
          setMeal,
          refund: setMeal.recharge,
          accountMoney: parseFloat((setMeal.recharge + setMeal.giving).toFixed(2)),
          remark: ''
        }
      })
    },
    submitRechargeRefundInfo() {
      this.$refs['refundFormRef'].validate((valid) => {
        if (valid) {
          this.$confirm('确定进行充值订单退款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            _id: this.refundForm._id,
            refund: this.refundForm.refund,
            accountMoney: this.refundForm.accountMoney,
            remark: this.refundForm.remark
          }
          this.refundLoading = true
          rechargeOrderRefundOperation(params).then(res => {
            this.refundLoading = false
            this.isRechargeRefundShow = false
            this.$message.success('退款成功！')
            this.GetListByPage()
          }).catch(() => {
            this.refundLoading = false
          })
        }).catch(() => {})
        }
      })
    },
    goToRefundOrder(row) {
      this.$router.push({path: '/recharge-refund-order', query: {oriOrderId: row.orderid}})
    },
    _searchCondition() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.sales-total {
  display: flex;
  margin-top: 10px;
  > div {
    margin-right: 20px;
    > span {
      font-weight: 700;
      color: #409eff;
    }
  }
}
</style>
