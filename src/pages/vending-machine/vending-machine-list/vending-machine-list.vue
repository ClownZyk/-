<template>
  <div v-if="containerIsShow">
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>当月总销售额(元)</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ saleData.monthPayTotal }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>当日总销售额(元)</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ saleData.dayPayTotal }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>当日客单价(元)</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-renshu"></i>
          <div class="count-value">{{ saleData.dayPerCus }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>当月利润(元)</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ saleData.monthProfit }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>机器总台数</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-dingdan"></i>
          <div class="count-value">{{ saleData.vendCount }}</div>
        </div>
      </div>
    </div>
    <el-form :model="searchForm" inline v-if="isManage">
      <el-form-item label="门店">
        <el-select v-model="searchForm.queryCid" placeholder="请选择门店" style="width: 320px">
          <el-option v-for="item in storeList" :key="item.cid" :value="item.cid" :label="item.companyName"> {{ item.companyName }} </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期"> <el-date-picker v-model="searchForm.queryTime" value-format="yyyy/MM/dd" type="date" placeholder="选择日期"> </el-date-picker> </el-form-item>
      <el-form-item> <el-button type="primary" @click="initData">搜索</el-button> </el-form-item>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="machineList" border>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column label="自编码" prop="vUnionCode" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="绑定店铺" prop="companyName" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="售卖机名称" prop="name" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="售卖机编码" prop="code" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.code || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="售卖机位置" prop="location" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.location || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="门状态" width="90" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isOpen" style="color:#F56C6C">开启</span> <span v-else style="color:#67C23A">关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="联网状态" width="90" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isOnLine" style="color:#67C23A">在线</span> <span v-else style="color:#F56C6C">离线</span>
          </template>
        </el-table-column>
        <el-table-column label="营业状态" width="90" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isTrade" @change="openStateChange(scope.row)" :disabled="!scope.row.code"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="当日订单数" prop="ordCnt" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="当日购买人数" prop="dayOrderManCount" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="当日销售额" prop="ordSales" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ parseFloat(scope.row.ordSales.toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="昨日订单数" prop="upperOrdCnt" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="昨日购买人数" prop="upperOrderManCount" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="昨日销售额" prop="upperOrdSales" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ parseFloat(scope.row.upperOrdSales.toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="480" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleVendingMachineDetail(scope.row)" v-permission="['/vending-machine-list:update']">编辑 </el-button>
            <el-button v-if="scope.row.code" size="mini" type="success" @click="handleVendingMachineBindProd(scope.row)">产品绑定 </el-button>
            <el-button v-if="!isManage && scope.row.code" size="mini" type="warning" @click="handleVendingMachineProdRecord(scope.row)">补货记录 </el-button>
            <el-button size="mini" type="success" @click="handleVendingMachineProdOrder(scope.row)" :disabled="!scope.row.code">订单查看 </el-button>
            <el-button size="mini" type="primary" @click="handleQrCode(scope.row)">二维码生成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </div>
    <!-- 二合一二维码弹框 -->
    <el-dialog title="售卖机二维码（微信、支付宝）" :visible.sync="isQrCodeShow" width="550px" @close="isQrCodeShow = false" :close-on-click-modal="false">
      <el-form ref="qrCodeFormRef" :model="qrCodeForm" label-position="left">
        <el-row>
          <el-col>
            <el-form-item label="售卖机名称：" prop="name">{{ qrCodeForm.name }}</el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="售卖机编码：" prop="code">{{ qrCodeForm.code }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="二维码生成：" prop="qrCodeImg">
          <div class="qrCode-main"><div class="qrCode" ref="qrCodeRef" v-show="qrCodeForm.qrCodeImg"></div></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getShopBindVendingMachine, shopBindVendingMachineOperation, queryVendingSalesData, getAllStore } from '@/api/system'
import AppConfig from '@/components/js/gem'
import QRcode from 'qrcodejs2'
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      saleData: {
        monthPayTotal: 0,
        dayPayTotal: 0,
        dayPerCus: 0,
        monthProfit: 0,
        vendCount: 0
      },
      machineList: [],
      qrCodeForm: {
        name: '',
        code: '',
        qrCodeImg: ''
      },
      searchForm: {
        queryCid: this.$store.state._cid,
        queryTime: ''
      },
      storeList: [],
      tableLoading: false,
      qrLoading: false,
      containerIsShow: true,
      isQrCodeShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        count: [{ required: true, message: '生成售卖机自编码个数不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'vending-machine-list') {
        this.initData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isQrCodeShow(val) {
      if (!val) {
        this.qrCodeForm = {
          name: '',
          code: '',
          qrCodeImg: ''
        }
        this.$refs['qrCodeRef'].innerHTML = ''
      }
    }
  },
  mounted() {
    if (this.isManage) {
      this.getAllShop()
    } else {
      this.initData()
    }
  },
  methods: {
    initData() {
      this.getSalesData()
      this.getShopBindVendingMachine('refresh')
    },
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.storeList = res.data.map(item => {
            return {
              cid: item.cid,
              companyName: item.companyName
            }
          })
          this.storeList.unshift({
            cid: this.$store.state._cid,
            companyName: '所有门店'
          })
          this.initData()
        }
      })
    },
    getSalesData() {
      let params = {
        queryTime: this.searchForm.queryTime,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.searchForm.queryCid
      }
      queryVendingSalesData(params).then(res => {
        this.saleData = res.data
      })
    },
    getShopBindVendingMachine(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.searchForm.queryCid
      }
      this.tableLoading = true
      getShopBindVendingMachine(params)
        .then(res => {
          this.tableLoading = false
          this.machineList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleQrCode(row) {
      this.isQrCodeShow = true
      this.$nextTick(() => {
        this.qrCodeForm.name = row.name
        this.qrCodeForm.code = row.code
        // eslint-disable-next-line no-new
        new QRcode(this.$refs['qrCodeRef'], {
          text: `https://${AppConfig.FULLDOMAINNAME}?code=${row.vUnionCode}`,
          width: 250,
          height: 250,
          colorDark: '#000000',
          colorLight: '#ffffff'
        })
        // 生成图片
        this.createQRcodePicture()
      })
    },
    createQRcodePicture() {
      html2canvas(this.$refs['qrCodeRef'], {
        backgroundColor: null,
        width: 250,
        height: 250
      }).then(canvas => {
        this.qrCodeForm.qrCodeImg = canvas.toDataURL('image/jpeg')
      })
    },
    handleVendingMachineDetail(row) {
      this.$router.push({
        path: '/vending-machine-detail',
        query: { cid: row.cid, vUnionCode: row.vUnionCode, vmcode: row.code }
      })
    },
    handleVendingMachineBindProd(row) {
      this.$router.push({
        path: '/vending-machine-prod',
        query: { vUnionCode: row.vUnionCode, vmcode: row.code, queryCid: row.cid }
      })
    },
    handleVendingMachineProdRecord(row) {
      this.$router.push({ path: '/vending-prod-record', query: { vUnionCode: row.vUnionCode, vmcode: row.code } })
    },
    handleVendingMachineProdOrder(row) {
      this.$router.push({ path: '/vending-machine-order', query: { cid: row.cid, vmcode: row.code } })
    },
    // 售卖机营业状态修改
    openStateChange(row) {
      let params = {
        cid: row.cid,
        vmCode: row.code,
        vUnionCode: row.vUnionCode,
        name: row.name,
        location: row.location,
        temp: row.temp,
        engineOn: row.engineOn,
        coordinate: row.coordinate,
        facadeImg: row.facadeImg,
        isTrade: row.isTrade
      }
      shopBindVendingMachineOperation(params).then(res => {
        this.$message.success(res.msg)
        this.getShopBindVendingMachine()
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getShopBindVendingMachine()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getShopBindVendingMachine()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-count {
  width: 100%;
  padding-bottom: 15px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;

  .home-count-item {
    flex: 0 0 19%;
    background-color: #ffffff;
    box-shadow: 0 0 10px #dddddd;
    padding: 10px 15px;
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

      div.count-value {
        font-size: 26px;
        font-weight: bold;
        color: #2c2c2c;
      }

      .iconfont {
        margin-right: 10px;
      }
    }
  }
}

.qrCode-main {
  margin-top: 40px;
  padding: 0 114px;

  .qrCode {
    border: 1px solid #eeeff0;
    padding: 15px;
  }
}

.filters {
  display: flex;
  justify-content: space-between;
}
</style>
