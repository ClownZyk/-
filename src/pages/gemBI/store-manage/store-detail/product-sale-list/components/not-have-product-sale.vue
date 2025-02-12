<template>
  <div>
    <el-form class="filters" ref="form" :model="searchForm" label-width="80px" :inline="true">
      <div>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.time"
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
        <el-form-item>
          <el-select v-model="searchForm.vmcode" placeholder="请选择售卖机" clearable style="width: 260px"> <el-option v-for="item in vendingMachineList" :key="item._id" :label="item.name" :value="item.vUnionCode"> </el-option> </el-select>
        </el-form-item>
        <el-form-item> <el-input placeholder="请输入商品名称" v-model="searchForm.prodName" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition()">搜索</el-button> </el-form-item>
      </div>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="listData" border>
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column prop="prodName" label="产品名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="barCode" label="产品条码" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.barCode || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品分类" min-width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.firstCategoryName || '--' }}/{{ scope.row.secCategoryName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="销售数量" align="center" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="valueList" label="设备/价格/库存" min-width="220">
          <template slot-scope="scope">
            <div v-if="scope.row.valueList && scope.row.valueList.length > 0">
              <div v-for="(item, index) in scope.row.valueList" :key="index">设备：{{ item.vmcode }}，价格：¥{{ item.price }}，剩余库存：{{ item.stock }}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[15, 25, 35, 45]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin-top: 10px;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getDataString } from '@/filters/filters'
import { getShopBindVendingMachine, getVendingMachineNotHaveProductStatistics } from '@/api/system'

export default {
  data() {
    return {
      searchForm: {
        time: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')],
        stage: 4, // 1 当日 2 当周 3 当月 4 自定义时间
        vmcode: '',
        prodName: '',
        isAsc: true
      },
      vendingMachineList: [],
      listData: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 15,
      total: 0
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.getShopBindVendingMachine()
      this.getProductList()
    },
    getShopBindVendingMachine() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      getShopBindVendingMachine(params).then(res => {
        this.vendingMachineList = res.data.listData.filter(item => item.code)
      })
    },
    // 获取产品信息
    getProductList() {
      let params = {
        sTime: this.searchForm.time && this.searchForm.time.length > 0 ? this.searchForm.time[0] + '~' + this.searchForm.time[1] : '',
        stage: this.searchForm.stage,
        vmcode: this.searchForm.vmcode,
        prodName: this.searchForm.prodName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: this.searchForm.isAsc,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      this.tableLoading = true
      getVendingMachineNotHaveProductStatistics(params)
        .then(res => {
          this.tableLoading = false
          this.listData = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 搜索
    handleFixedSearchCondition(stage) {
      this.pageIndex = 1
      this.searchForm.stage = stage
      this.searchForm.time = []
      this.getProductList()
    },
    searchCondition() {
      this.pageIndex = 1
      if (!this.searchForm.isFixedSearch) {
        this.searchForm.stage = 4
      }
      this.getProductList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProductList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_element-reset.scss';
.filters {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
/deep/ .el-table__body-wrapper {
  td {
    border-bottom: 1px solid #ebeef5;
    padding: 12px 0;
  }

  th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
