<template>
  <div class="page-container">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form :model="filterParam" inline>
      <el-form-item label="门店名称" v-if="isManage">
        <el-select v-model="filterParam.queryCid" placeholder="请选择门店" clearable @change="storeChange"> <el-option v-for="item in storeList" :key="item._id" :label="item.companyName" :value="item.cid"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="售卖机名称">
        <el-select v-model="filterParam.vmcode" placeholder="请选择售卖机" clearable> <el-option v-for="item in vendingMachineList" :key="item._id" :label="item.name" :value="item.vUnionCode"> </el-option> </el-select>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="getVendingMachineProduct('refresh')">搜索</el-button> </el-form-item>
    </el-form>
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>总销售额</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.allRetailTotal.toFixed(2) }}</div>
        </div>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="productList" border>
      <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
      <el-table-column prop="vmCode" label="售卖机编码" min-width="200"></el-table-column>
      <el-table-column label="产品分类" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.firstCategoryName }}/{{ scope.row.secCategoryName }}
        </template>
      </el-table-column>
      <el-table-column prop="prodName" label="产品名称" min-width="200"></el-table-column>
      <el-table-column prop="barCode" label="产品条码" min-width="160" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.barCode || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="销量" align="center" min-width="140"></el-table-column>
      <el-table-column prop="retailPriceTotal" label="销售总额/元" align="center" min-width="140"></el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getAllStore, getVendingMachineProductStatistics, getShopBindVendingMachine } from '@/api/system'

export default {
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      filterParam: {
        vmcode: '',
        queryCid: this.$store.state._cid
      },
      productList: [],
      storeList: [],
      vendingMachineList: [],
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      price: {
        allRetailTotal: 0,
        allCostTotal: 0,
        allProfitTotal: 0,
        grossMargin: ''
      }
    }
  },
  mounted() {
    this.getAllShop()
  },
  methods: {
    getAllShop(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getAllStore(params).then(res => {
        this.storeList = [{ cid: localStorage.getItem('cid'), companyName: '全部门店' }, ...res.data]
        if (!this.isManage) {
          this.filterParam.queryCid = res.data.find(item => item.cid === this.$store.state._cid).cid
        }
        this.getShopBindVendingMachine(this.filterParam.queryCid)
        this.getVendingMachineProduct('refresh')
      })
    },
    getShopBindVendingMachine(queryCid) {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: queryCid
      }
      getShopBindVendingMachine(params).then(res => {
        this.vendingMachineList = res.data.listData.filter(item => item.code)
      })
    },
    getVendingMachineProduct(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        stage: 1,
        sTime: '',
        vmcode: this.filterParam.vmcode,
        prodName: '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.filterParam.queryCid
      }
      this.listLoading = true
      getVendingMachineProductStatistics(params)
        .then(res => {
          this.listLoading = false
          let { allRetailTotal, allCostTotal, allProfitTotal, grossMargin } = res.data
          this.productList = res.data.list
          this.total = res.total
          this.price = {
            allRetailTotal,
            allCostTotal,
            allProfitTotal,
            grossMargin
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    storeChange(val) {
      this.filterParam.vmcode = ''
      this.getShopBindVendingMachine(val)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getVendingMachineProduct()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getVendingMachineProduct()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-count {
  width: 100%;
  padding-bottom: 10px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  .home-count-item {
    flex: 0 0 24.5%;
    background-color: #ffffff;
    box-shadow: 0 0 10px #eee;
    padding: 10px;
    max-height: 112.81px;
    .conut-l-title {
      color: #aaaaaa;
      font-size: 14px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
    }
    .count-l-total {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      display: -webkit-flex;
      align-items: baseline;
      border-bottom: 1px solid #e6e5e5;
      div.count-value {
        font-size: 26px;
        font-weight: bold;
        color: #2c2c2c;
      }
      .iconfont {
        margin-right: 10px;
      }
    }
    .count-l-bottom {
      padding: 10px 0;
      font-size: 14px;
      color: #434343;
      border-top: 1px solid #e6e5e5;
    }
    .two-total {
      position: relative;
      .total-count {
        font-weight: normal;
        font-size: 14px;
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>
