<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div>
          <el-form-item> <el-input v-model="search.orderNum" placeholder="请输入单号检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="GetListByPage">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item>
            <!-- @click="operateFunc('', '添加', 0)" -->
            <el-button type="primary" @click="handleWarehouseShow">新增</el-button>
            <!-- <el-button type="danger" @click="operateDeleteMany">批量删除</el-button> -->
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <el-table ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
        <el-table-column align="center" prop="oddNumbers" label="采购单号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="ordermony" label="订单总金额" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="procureType" label="入库类别" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.procureType | procureTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="purchaseWay" label="采购方式" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.purchaseWay === 1 ? '订货' : '到货' }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="采购单状态" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="!scope.row.supplierId" style="color: #909399;">{{ scope.row.status | supplyOrderStateToString }}</div>
            <div v-else style="color: #909399;">
              <span v-if="scope.row.status === 3">待入库</span> <span v-else>{{ scope.row.status | supplyOrderStateToString }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderName" label="下单人" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="orderTime" label="下单时间" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="330" show-overflow-tooltip fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">订单详情</el-button>
            <el-button type="primary" size="mini" @click="handlePushOrderToV8(scope.row)" :disabled="scope.row.status !== 1 && scope.row.status !== 4">推送</el-button>
            <el-button type="primary" size="mini" @click="handlewithdrawOrderToV8(scope.row)" :disabled="scope.row.status !== 3 || (scope.row.status === 3 && scope.row.supplierId !== null)">撤回</el-button>
            <!-- <el-button type="danger" size="mini" @click="handleDeleteOrderV6V8(scope.row)" :disabled="scope.row.status === 2">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 15, 20, 25]" :total="total" layout="total, sizes, prev, pager, next" background>
        </el-pagination>
      </el-col>

      <!-- 仓库选择弹框 -->
      <el-dialog title="采购仓库-入库类别选择" :visible.sync="isWarehouseShow" width="650px" @close="isWarehouseShow = false" :close-on-click-modal="false">
        <el-form v-loading="whLoading" label-position="top">
          <el-form-item label="采购仓库">
            <el-radio-group v-model="whCid" size="small" style="width:100%">
              <el-radio class="radio-item" v-for="item in warehouseList" :key="item.whCid" :label="item.whCid" border>{{ item.whName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" @click="isWarehouseShow = false">取 消</el-button>
          <el-button size="small" type="primary" :disabled="!whCid" @click="operateFunc('', '添加', 0)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { SupplierOrderOperation, PullOrderFromV8, DeleteOrderV6V8 } from '@/api/system'
import {getGoodsWarehouse, getPhurchaseOrderList, updatePurchaseOrder} from '@/api/systemForV8'
import Filters from '@/components/js/Filters.js'
export default {
  name: 'supply-purchase',
  mixins: [Filters],
  watch: {
    '$route' (to, from) {
      if (to.name === 'supply-purchase') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isWarehouseShow(val) {
      if (!val) {
        this.whCid = ''
      }
    }
  },
  data () {
    return {
      search: {
        orderNum: ''
      },
      whCid: '',
      list: [],
      warehouseList: [],
      operateAction: 0,
      checkedDatas: [],
      isWarehouseShow: false,
      listLoading: false,
      whLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    handleWarehouseShow() {
      this.isWarehouseShow = true
      this.getWarhouseList()
    },
    // 获取仓库信息列表
    getWarhouseList() {
      this.whLoading = true
      getGoodsWarehouse().then(res => {
        if (res.success) {
          this.whLoading = false
          this.warehouseList = res.data
        }
      }).catch(() => {
        this.whLoading = false
      })
    },
    // 删除v6 v8的订单
    handleDeleteOrderV6V8 (row) {
      this.$confirm(`确认删除${row.oddNumbers}采购单吗？（该操作会撤回v8里对应的采购单）`, '提示', {}).then(() => {
        let params = {
          oddNumbers: row.oddNumbers,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        DeleteOrderV6V8(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.GetListByPage()
        }, err => {
          console.log(err)
        })
      })
    },
    // 从v8获取最新订单信息
    handlePullOrderFromV8 (row) {
      this.$confirm(`确认更新${row.oddNumbers}订单吗？`, '提示', {}).then(() => {
        let params = {
          oddNumbers: row.oddNumbers,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        PullOrderFromV8(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.GetListByPage()
        }, err => {
          console.log(err)
        })
      })
    },
    // 向v8推送订单
    handlePushOrderToV8 (row) {
      this.$confirm(`确认推送${row.oddNumbers}订单吗？（订单只能推送一次）`, '提示', {}).then(() => {
        this.upDateSupplyOrderState(row.oddNumbers, 3)
      })
    },
    handlewithdrawOrderToV8(row) {
      this.$confirm(`确认撤回${row.oddNumbers}订单吗？（撤回后可修改订单再次提交）`, '提示', {}).then(() => {
        this.upDateSupplyOrderState(row.oddNumbers, 4)
      })
    },
    upDateSupplyOrderState(oddNumbers, state) {
      let params = {
          oddNumbers: oddNumbers,
          status: state,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
      updatePurchaseOrder(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.GetListByPage()
        }, err => {
          console.log(err)
        })
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.isWarehouseShow = false
          this.$router.push({path: '/supply-purchase-detail', query: {whCid: this.whCid, operate: 'add'}})
          break
        case '编辑': // 编辑
          this.$router.push({path: '/supply-purchase-detail', query: {id: row._id, whCid: row.whCid, oddNumbers: row.oddNumbers}})
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '查看': // 查看
          this.$router.push({path: '/supply-purchase-detail', query: {id: row._id, oddNumbers: row.oddNumbers, operate: 'view'}})
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      SupplierOrderOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        type: 0, // 0全部，1待入库
        orderType: 0,
        status: 99,
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
      await getPhurchaseOrderList(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.el-radio {
  width: 30%;
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0;
  margin-bottom: 15px;
}
</style>
