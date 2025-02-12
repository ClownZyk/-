<template>
  <div class="enterprise-order">
    <div v-if="containerIsShow">
      <div class="table-list">
        <el-table :data="enterpriseOrderList" border style="width: 100%">
          <el-table-column label="编号" type="index" align="center" width="80"></el-table-column>
          <el-table-column prop="orderId" label="订单编号" align="center" width="220"> </el-table-column>
          <el-table-column label="姓名" align="center" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.customer.userName || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.customer.phone || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="pay.buyTotal" label="订单金额" align="center" width="150"> </el-table-column>
          <el-table-column prop="source" label="订单来源" align="center" width="150"> </el-table-column>
          <el-table-column prop="pay.payType" label="订单状态" align="center" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.orderStatus | orderTypeStateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column label="支付状态" align="center" width="150">
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
          <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
          <el-table-column label="操作" align="center" min-width="120" fixed="right">
            <template slot-scope="scope">
              <div><el-button size="mini" type="warning" @click="_goToOrderDetail(scope.row)">详情</el-button></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[15, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
        </el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getEnterpriseOrderById } from '@/api/system'
import { mapState, mapMutations } from 'vuex'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  watch: {
    $route(to, from) {
      if (to.name === 'enterprise-detail') {
        this._getEnterpriseOrderList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  computed: {
    ...mapState(['enterpriseInfo'])
  },
  data() {
    return {
      enterpriseOrderList: [],
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      containerIsShow: true
    }
  },
  created() {
    this._getEnterpriseOrderList()
  },
  methods: {
    _getEnterpriseOrderList() {
      let params = {
        _id: this.enterpriseInfo._id,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true
      }
      getEnterpriseOrderById(params)
        .then(res => {
          if (res.success) {
            this.enterpriseOrderList = res.data
            this.total = res.total
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    _goToOrderDetail(row) {
      this.setEnterpriseOrderDetail(row)
      this.$router.push({
        path: '/order-detail'
      })
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this._getEnterpriseOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this._getEnterpriseOrderList()
    },
    ...mapMutations(['setEnterpriseOrderDetail'])
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
