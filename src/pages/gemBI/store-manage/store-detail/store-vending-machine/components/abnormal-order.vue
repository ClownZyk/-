<template>
  <div class="order-container">
    <el-form :model="searchForm" inline>
      <el-form-item label="开门编码"> <el-input type="text" v-model.trim="searchForm.orderCode" placeholder="请输入开门编码检索" clearable></el-input> </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="searchForm.isHandle" placeholder="请选择处理状态"> <el-option v-for="item in handleList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="abnormalOrderList" border>
        <el-table-column label="开门编码" prop="orderCode" width="160" align="center"></el-table-column>
        <el-table-column label="开关门时间" width="320" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.openDoorTime }}-{{ scope.row.closeDoorTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开门总重量" prop="openDoorWeight" width="120" align="center"> </el-table-column>
        <el-table-column label="关门总重量" prop="closeDoorWeight" width="120" align="center"> </el-table-column>
        <el-table-column label="购买动作状态" width="160" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.shopMove | shopMoveListFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="硬件异常原因" width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.hardwareEx">{{ scope.row.hardwareEx | hardwareExListFilter }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="识别处理状态" width="160" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.handleStatus | handleStatusListFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="人工处理异常原因" min-width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.abnormalReasons && scope.row.abnormalReasons.length > 0">{{ scope.row.abnormalReasons | abnormalReasonsFilters }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="订单处理状态" min-width="160" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isHandle" size="mini" type="warning" @click="handleAbnormalOrderDetail(scope.row)">处理详情</el-button>
            <div v-else style="color: #F56C6C">未处理</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
        </el-pagination>
      </div>
      <!-- 异常订单处理详情 -->
      <el-dialog title="异常订单处理详情" :visible.sync="isAbnormalOrderHandleShow" width="800px" @close="isAbnormalOrderHandleShow = false" :close-on-click-modal="false">
        <el-form :model="abnormalOrderDetail">
          <el-form-item label="订单编码：">{{ abnormalOrderDetail.orderCode }}</el-form-item>
          <el-form-item label="订单视频：">
            <div class="video-main"><video :src="abnormalOrderDetail.videoUrl" controls muted></video></div>
          </el-form-item>
          <el-form-item label="订单处理：">
            <span>{{ abnormalOrderDetail.isShop ? '有购物' : '无购物' }}</span>
            <el-table v-if="abnormalOrderDetail.isShop" size="small" :data="abnormalOrderDetail.orderGoodsList" border>
              <el-table-column type="index" width="55" align="center"></el-table-column>
              <el-table-column label="产品名称" prop="itemName" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column label="产品价格" prop="price" width="140" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ Math.round(scope.row.itemPrice) / 100 }}
                </template>
              </el-table-column>
              <el-table-column label="产品数量" min-width="160" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.count }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="处理备注：">{{ abnormalOrderDetail.remarks || '--' }}</el-form-item>
        </el-form>
        <span slot="footer"> </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getVendingMachineAbnormalOrder, getVendingMachineAbnormalOrderDetail } from '@/api/system'
import Filters from '@/components/js/Filters'
import { getDataString } from '@/filters/filters'

export default {
  mixins: [Filters],
  data() {
    return {
      searchForm: {
        orderCode: '',
        isHandle: false
      },
      abnormalOrderList: [],
      abnormalOrderDetail: {},
      tableLoading: false,
      isAbnormalOrderHandleShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      handleList: [{ value: false, label: '未处理' }, { value: true, label: '已处理' }]
    }
  },
  watch: {
    isAbnormalOrderHandleShow(val) {
      if (!val) {
        this.abnormalOrderDetail = {}
      }
    }
  },
  mounted() {
    this.getAbnormalOrderList()
  },
  methods: {
    getAbnormalOrderList() {
      let params = {
        ...this.searchForm,
        vmCode: this.$route.query.vmCode,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      this.tableLoading = true
      getVendingMachineAbnormalOrder(params)
        .then(res => {
          this.tableLoading = false
          this.abnormalOrderList = res.data.map(item => {
            return {
              ...item,
              openDoorTime: getDataString(new Date(item.openDoorTime), 'yyyy-MM-dd hh:mm:ss'),
              closeDoorTime: getDataString(new Date(item.closeDoorTime), 'yyyy-MM-dd hh:mm:ss')
            }
          })
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 获取处理详情
    handleAbnormalOrderDetail(row) {
      this.isAbnormalOrderHandleShow = true
      let params = {
        orderCode: row.orderCode
      }
      getVendingMachineAbnormalOrderDetail(params).then(res => {
        this.abnormalOrderDetail = {
          ...res.data,
          openDoorTime: getDataString(new Date(res.data.openDoorTime), 'yyyy-MM-dd hh:mm:ss'),
          closeDoorTime: getDataString(new Date(res.data.closeDoorTime), 'yyyy-MM-dd hh:mm:ss')
        }
        if (res.data.isHandle) {
          this.abnormalOrderDetail.isShop = !!(res.data.orderGoodsList && res.data.orderGoodsList.length)
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getAbnormalOrderList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAbnormalOrderList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAbnormalOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-container {
  margin-top: 20px;
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
