<template>
  <div class="allot-in-container">
    <div class="allot-in">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item label="订单时间">
            <el-date-picker v-model="timeFrame" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="_search">搜索</el-button>
          <el-button type="primary" @click="exportExcel" :disabled="list.length === 0">导出</el-button>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column type="expand" prop="product">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.product" :key="index" class="procuct-item">
                <div class="product-title">{{ `入库产品 ${index + 1}` }}</div>
                <div class="product-info">
                  <span>{{ item.productName + '（' + item.title + '）' }} x {{ item.count + '，' }}</span> <span>{{ item.barCode + '，' }}</span> <span>{{ item.datetime ? item.datetime.split(' ')[0] + '，' : ' ' }}</span>
                  <span v-if="item.onlyStatus === 1" style="color:#e6b321;">未完成</span> <span v-if="item.onlyStatus === 2" style="color: #13CE66;">已完成</span> <span v-if="item.onlyStatus === 3" style="color: #FF4949;">已作废</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="orderId" label="入库编号" width="220"></el-table-column>
          <el-table-column align="center" prop="orderStatus" label="调配状态" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus === 1" style="color: #e6b321;">未完成</div>
              <div v-else-if="scope.row.orderStatus === 2" style="color: #13CE66;">已完成</div>
              <div v-else-if="scope.row.orderStatus === 3" style="color: #FF4949;">已作废</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="companyName" label="调出门店" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="openAllot(scope.row, 'confirm')" :disabled="scope.row.orderStatus !== 1">确认收货</el-button>
              <el-button type="primary" size="mini" @click="openAllot(scope.row, 'cancel')" :disabled="scope.row.orderStatus !== 1">取消收货</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 15, 20, 25]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          ></el-pagination>
        </el-col>
      </div>
    </div>

    <!-- 入库产品详情弹框 -->
    <el-dialog :visible.sync="isDetailShow" title="调拨详情" width="1000px" @closed="isDetailShow = false">
      <el-table ref="productListTable" :data="listData" tooltip-effect="dark" style="width: 100%" border @selection-change="selectTableProductRow" :row-key="getRowKey">
        <el-table-column align="center" type="selection" :reserve-selection="true" width="55" :selectable="handleSelectData"></el-table-column>
        <el-table-column align="center" type="index" label="编号" width="54"></el-table-column>
        <el-table-column align="center" label="产品名称" prop="productName" width="200"></el-table-column>
        <el-table-column align="center" label="产品条码" prop="barCode" width="180"></el-table-column>
        <el-table-column align="center" label="产品型号" prop="title" width="90"></el-table-column>
        <el-table-column align="center" label="价格" prop="price" width="80"></el-table-column>
        <el-table-column align="center" label="调拨数量" prop="count" width="90"></el-table-column>
        <el-table-column align="center" label="生产日期" prop="datetime" width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.datetime ? scope.row.datetime.split(' ')[0] : '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="调拨状态" prop="onlyStatus" width="90">
          <template slot-scope="scope">
            <div>
              <div v-if="scope.row.onlyStatus === 1" style="color: #e6b321;">未完成</div>
              <div v-if="scope.row.onlyStatus === 2" style="color: #13CE66;">已完成</div>
              <div v-if="scope.row.onlyStatus === 3" style="color: #FF4949;">已作废</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleListSizeChange"
          @current-change="handleListCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          :current-page="listPageIndex"
          :page-size="listPageSize"
          :total="listTotal"
          layout="total, sizes,prev, pager, next"
          background
          style="float:right;padding:10px 0;"
        >
        </el-pagination>
      </el-col>

      <div slot="footer" style="text-align:center;"><el-button type="primary" @click="AllotOperation">确 定</el-button></div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/components/js/data'
import { AlllotOrderList, CancelAllotOrder, ConfirmAllotOrder, allocationExport } from '@/api/system'
import Filters from '@/components/js/Filters.js'
export default {
  name: 'allot-in',
  mixins: [Filters],
  data() {
    return {
      // 查询条件
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
      list: [],
      productData: {},
      listData: [], // 需要调拨的产品列表
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 本地分页数据
      listTotal: 0,
      listPageIndex: 1,
      listPageSize: 10,
      isDetailShow: false
    }
  },
  watch: {
    isDetailShow(val) {
      if (!val) {
        this.listPageIndex = 1
        this.$refs.productListTable.clearSelection()
      }
    }
  },
  methods: {
    openAllot(row, type) {
      this.isDetailShow = true
      this.operateType = type
      this.productData = row
      this.getProductListByPage()
    },
    selectTableProductRow(row) {
      this.barCodeList = row.map(item => {
        return item.barCode
      })
    },
    handleSelectData(row) {
      if (row.onlyStatus === 1) {
        // 未完成 可选
        return true
      } else {
        return false
      }
    },
    getProductListByPage() {
      this.listData = JSON.parse(JSON.stringify(this.productData.product)).splice((this.listPageIndex - 1) * this.listPageSize, this.listPageSize)
      this.listTotal = this.productData.product.length
    },
    // 确认收货
    AllotOperation() {
      if (this.barCodeList.length <= 0) {
         this.$message.warning('请至少选择一条数据！')
      } else {
          this.$confirm('确认提交数据吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              id: this.productData._id,
              barCodes: this.barCodeList,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
            let allotOrderOperation = null
            if (this.operateType === 'confirm') {
              allotOrderOperation = ConfirmAllotOrder
            } else if (this.operateType === 'cancel') {
              allotOrderOperation = CancelAllotOrder
            }
            allotOrderOperation(params).then(res => {
              this.isDetailShow = false
              this.$message.success(res.msg)
              this.GetListByPage()
            }).catch(err => {
              this.isDetailShow = false
              this.GetListByPage()
              console.log(err.msg)
            })
          })
      }
    },
    _search() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    // 选中行
    selectTableRow(row) {
      this.checkedDatas = row
    },
    getRowKey(row) {
      return row.barCode
    },
    // pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // pageSize 改变
    handleListSizeChange(val) {
      this.listPageSize = val
      this.getProductListByPage()
    },
    // currentPage 改变
    handleListCurrentChange(val) {
      this.listPageIndex = val
      this.getProductListByPage()
    },
    // 加载数据
    async GetListByPage() {
      let params = {
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        companyCid: this.$store.state._cid,
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
      await AlllotOrderList(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.list = res.data
            this.total = res.total
          } else {
            this.$message.warning(res.msg)
          }
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    },
    exportExcel() {
      let parmas = {
        sTime: !this.timeFrame[0] ? '' : `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        companyCid: this.$store.state._cid,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      allocationExport(parmas).then(
        res => {
          const content = res
          const blob = new Blob([content])
          const fileName = `${parmas.sTime}的入库表.xls`
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, { type: 'application/vnd.ms-excel' })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        },
        err => {
          this.$message.err(err.msg)
        }
      )
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.allot-in-container {
  padding: 20px;
}
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
.list-table {
  color: #666666;
  padding: 20px 0;
  .table-main {
    text-align: center;
    margin-bottom: 15px;
  }
}
.form {
  .item-long {
    width: 492px;
  }
}
.procuct-item {
  display: flex;
  margin-bottom: 10px;
  .product-title {
    margin-right: 20px;
  }
}
</style>
