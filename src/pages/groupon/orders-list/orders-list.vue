<template>
  <div class="order">
    <div class="main" v-if="containerIsShow">
      <el-form ref="form" inline :model="form">
        <el-form-item label="订单号">
          <el-input v-model="form.orderId" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="拼团商品">
          <el-input v-model="form.groupName" placeholder="请输入拼团商品"></el-input>
        </el-form-item>
        <el-form-item label="收货人姓名">
          <el-input v-model="form.name" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="收货人手机号" label-width="200">
          <el-input v-model="form.phone" placeholder="请输入收货人电话"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.payState" placeholder="请选择订单支付状态">
            <el-option v-for="item in payState" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
            <el-option v-for="item in orderStatusList" :key="item.value" :value="item.id" :label="item.value">
              {{ item.value }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-date-picker
            v-model="form.timeFrame"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="searchCondition">搜索</el-button>
        <el-button :loading="exportLoading" type="warning" :disabled="grouponOrderList.length <= 0"
                   @click="orderExport">导出订单
        </el-button>
      </el-form>
      <el-table v-loading="tableLoading" :data="grouponOrderList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column prop="orderId" label="订单编号" width="200" align="center"></el-table-column>
        <el-table-column label="收货人" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.customer ? scope.row.customer.userName : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="收货人手机号" width="130" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.customer ? scope.row.customer.phone : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="拼团商品" min-width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <div v-for="(item, index) in scope.row.product" :key="index">{{ item.productName }}({{ item.sku.name }}x{{ item.count }}){{ index + 1 === scope.row.product.length ? '' : ';' }}</div> -->
            <div>{{ scope.row.product[0].productName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="pay.buyTotal" label="订单金额" min-width="90" align="center"></el-table-column>
        <el-table-column label="拼团状态" min-width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.isSuccess === 1" style="color:#E6A23C">拼团中</div>
            <div v-else-if="scope.row.isSuccess === 2" style="color:#67C23A">拼团成功</div>
            <div v-else-if="scope.row.isSuccess === 3" style="color:#F56C6C">拼团失败</div>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="100" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.payStatus !== null">
              <div v-if="scope.row.payStatus.payState === 'ok'" style="color: #13CE66;">支付成功</div>
              <div v-else-if="scope.row.payStatus.payState === 'cancel'" style="color: #909399;">取消支付</div>
              <div v-else-if="scope.row.payStatus.payState === 'prepay'" style="color: #e6b321;">待支付</div>
              <div v-else-if="scope.row.payStatus.payState === 'fail'" style="color: #FF4949;">支付失败</div>
              <div v-else-if="scope.row.payStatus.payState === 'error'" style="color: #FF4949;">错误订单</div>
              <div v-else></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" min-width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus !== 0">{{ scope.row.orderStatus | orderTypeStateFilter }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus.time" label="订单时间" width="180" align="center"></el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleGrouponOrderCheck(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div class="total-row">
          <div>
            总销售额：<span
          ><strong>{{ salesTotal }}</strong></span
          >元
          </div>
          <div>
            总单数：<span
          ><strong>{{ total }}</strong></span
          >单
          </div>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       layout="total, prev, pager, next" :total="total" background
                       style="float:right;margin-top:10px"></el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { GroupOrderGetListByPage, GroupOrderExportByCondition } from '@/api/system'
import { getDataString } from '@/filters/filters'
import Filters from '@/components/js/Filters'
import download from '../../../utils/download'

export default {
  name: 'groupon-orders-list',
  mixins: [Filters],
  watch: {
    $route(to, from) {
      if (to.name === 'groupon-orders-list') {
        this.init()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      form: {
        orderId: '',
        customerId: '',
        name: '',
        source: '',
        phone: '',
        payState: '',
        orderStatus: 0,
        groupName: '',
        timeFrame: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')]
      },
      exportLoading: false,
      grouponOrderList: [],
      salesTotal: 0,
      tableLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      orderStatusList: [{ id: 0, value: '所有订单状态' }, { id: 11, value: '待取货' }, {
        id: 6,
        value: '已完成'
      }, { value: 4, label: '退款中' }, { id: 5, value: '已退款' }, { value: 7, label: '拒绝退款' }]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.form.timeFrame) {
        this.form.timeFrame = []
      }
      let parmas = {
        ...this.form,
        beginTime: this.form.timeFrame[0] || '',
        endTime: this.form.timeFrame[1] || '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      GroupOrderGetListByPage(parmas)
        .then(res => {
          this.tableLoading = false
          this.grouponOrderList = res.data.list
          this.salesTotal = res.data.total
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    orderExport() {
      const params = {
        ...this.form,
        beginTime: this.form.timeFrame[0] || '',
        endTime: this.form.timeFrame[1] || '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.exportLoading = true
      GroupOrderExportByCondition(params)
        .then(res => {
          this.exportLoading = false
          download(res, '拼团订单列表.xlsx')
        })
        .catch(() => {
            this.exportLoading = false
          }
        )
    },
    handleGrouponOrderCheck(row) {
      this.$router.push({
        path: '/groupon-orders-detail',
        query: { id: row._id }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.init()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
.order {
  padding: 20px;

  .total-row {
    display: flex;
    align-items: center;
    margin-top: 10px;

    > div {
      margin-right: 20px;

      > span {
        color: #409eff;
      }
    }
  }
}
</style>
