<template>
  <div class="store-detail">
    <div v-if="containerIsShow">
      <div class="gem-back-header"><el-page-header @back="goBack" :content="`${storeInfo.companyName}-门店信息`"> </el-page-header></div>
      <div class="store-info-top">
        <!-- 门店基本信息 -->
        <div class="base-info">
          <div class="info">
            <div class="picture"><img src="../../../../assets/store/bg2.png" /></div>
            <div class="info-detail">
              <div class="info-item row-line">
                <el-tooltip class="item" effect="dark" :content="storeInfo.companyName" placement="top">
                  <div>
                    门店： <span>{{ storeInfo.companyName }}</span>
                  </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="storeInfo.shopType | shopTypeFilter" placement="top">
                  <div>
                    门店类型： <span>{{ storeInfo.shopType | shopTypeFilter }}</span>
                  </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="storeInfo.manager" placement="top">
                  <div>
                    店长： <span>{{ storeInfo.manager }}</span>
                  </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="storeInfo.time" placement="top">
                  <div>
                    营业时间： <span>{{ storeInfo.time }}</span>
                  </div>
                </el-tooltip>
              </div>
              <div class="info-item row-flex">
                <el-tooltip class="item" effect="dark" content="店铺当前状态" placement="top"> <div class="shop-state">店铺当前状态：</div> </el-tooltip>
                <div class="shop-state-detail">
                  <span class="state" v-for="item in shopState" :key="item.value" :class="{ current: storeInfo.shopState === item.value }">{{ item.label }}</span>
                </div>
              </div>
              <div class="info-item">
                地址：<span>{{ storeInfo.companyAddress }}</span>
              </div>
              <div class="info-item">
                联系方式：<span>{{ storeInfo.servicePhone }}</span>
              </div>
            </div>
          </div>
          <div class="device-manage">
            <div class="manage-title">设备管理</div>
            <div class="device">
              <div class="device-item">
                <div class="left">
                  <div class="device-pic"><img src="../../../../assets/store/icon-device1.png" /></div>
                  <div class="device-detail">
                    <div class="title">监控</div>
                    <div class="state open" v-if="manageForm.isMonitor">正常</div>
                    <div class="state close" v-else>已关闭</div>
                  </div>
                </div>
                <div class="right"><el-switch v-model="manageForm.isMonitor" active-color="#3FBC4B" inactive-color="#D6D6D6"> </el-switch></div>
              </div>
              <div class="device-item">
                <div class="left">
                  <div class="device-pic"><img src="../../../../assets/store/icon-device2.png" /></div>
                  <div class="device-detail">
                    <div class="title">收银台</div>
                    <div class="state open" v-if="manageForm.isCashier">正常</div>
                    <div class="state close" v-else>已关闭</div>
                  </div>
                </div>
                <div class="right"><el-switch v-model="manageForm.isCashier" active-color="#3FBC4B" inactive-color="#D6D6D6"> </el-switch></div>
              </div>
              <div class="device-item">
                <div class="left">
                  <div class="device-pic"><img src="../../../../assets/store/icon-device3.png" /></div>
                  <div class="device-detail">
                    <div class="title">小票打印机</div>
                    <div class="state open" v-if="manageForm.isTicketPrint">正常</div>
                    <div class="state close" v-else>已关闭</div>
                  </div>
                </div>
                <div class="right"><el-switch v-model="manageForm.isTicketPrint" active-color="#3FBC4B" inactive-color="#D6D6D6"> </el-switch></div>
              </div>
              <div class="device-item">
                <div class="left">
                  <div class="device-pic"><img src="../../../../assets/store/icon-device4.png" /></div>
                  <div class="device-detail">
                    <div class="title">不干胶打印机</div>
                    <div class="state open" v-if="manageForm.isAdhesivePrint">正常</div>
                    <div class="state close" v-else>已关闭</div>
                  </div>
                </div>
                <div class="right"><el-switch v-model="manageForm.isAdhesivePrint" active-color="#3FBC4B" inactive-color="#D6D6D6"> </el-switch></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 店铺数据和会员状况 -->
        <div class="store-data">
          <el-tabs v-model="activeName">
            <el-tab-pane label="店铺数据" name="1"> <data-state :listData="storeStateData"></data-state> </el-tab-pane>
            <el-tab-pane label="会员状况" name="2"><data-state :listData="memberStateData"></data-state></el-tab-pane>
            <el-tab-pane label="自助售卖机" name="3"><store-vending-machine></store-vending-machine></el-tab-pane>
          </el-tabs>
          <div class="data-filter" v-if="activeName !== '3'">
            <el-radio-group v-model="selectRadio" @change="getStoreOrUserStatistics">
              <el-radio-button :label="1">今日</el-radio-button>
              <el-radio-button :label="2">本周</el-radio-button>
              <el-radio-button :label="3">本月</el-radio-button>
            </el-radio-group>
            <span class="detail" v-if="activeName === '1'" @click="gotoStoreAndMember">详情</span>
          </div>
        </div>
      </div>
      <div class="store-info-bottom">
        <!-- 商品top10 -->
        <div class="store-info-item vipCost-list">
          <div>
            <div class="title">
              <h2>商品TOP10</h2>
              <div>
                <el-radio-group v-model="productSelectRadio" size="mini" @change="getProductList">
                  <el-radio-button :label="1">今日</el-radio-button>
                  <el-radio-button :label="2">本周</el-radio-button>
                  <el-radio-button :label="3">本月</el-radio-button>
                </el-radio-group>
                <span class="more" @click="gotoProduct(1)">更多</span>
              </div>
            </div>
            <el-table :data="productData" style="width: 100%">
              <el-table-column type="index" width="40" align="center"> </el-table-column>
              <el-table-column label="商品名称" prop="productName" width="190" show-overflow-tooltip> </el-table-column>
              <!-- <el-table-column label="产品条码" prop="barCode" width="100" show-overflow-tooltip> </el-table-column> -->
              <el-table-column label="销量(件)" prop="count" width="110" show-overflow-tooltip> </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 餐食top10 -->
        <div class="store-info-item vipCost-list">
          <div>
            <div class="title">
              <h2>餐食TOP10</h2>
              <div>
                <el-radio-group v-model="mealsSelectRadio" size="mini" @change="getMealsProductList">
                  <el-radio-button :label="1">今日</el-radio-button>
                  <el-radio-button :label="2">本周</el-radio-button>
                  <el-radio-button :label="3">本月</el-radio-button>
                </el-radio-group>
                <span class="more" @click="gotoProduct(2)">更多</span>
              </div>
            </div>
            <el-table :data="mealsProductData" style="width: 100%">
              <el-table-column type="index" width="40" align="center"> </el-table-column>
              <el-table-column label="商品名称" prop="productName" width="190" show-overflow-tooltip> </el-table-column>
              <!-- <el-table-column label="产品条码" prop="barCode" width="100" show-overflow-tooltip> </el-table-column> -->
              <el-table-column label="销量(份)" prop="count" width="110" align="center" show-overflow-tooltip> </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 饮品top10 -->
        <!--
          <div class="store-info-item vipCost-list">
            <div>
              <div class="title">
                <h2>饮品TOP10</h2>
                <div>
                  <el-radio-group v-model="drinkSelectRadio" size="mini" @change="getDrinkProductList">
                    <el-radio-button :label="1">今日</el-radio-button>
                    <el-radio-button :label="2">本周</el-radio-button>
                    <el-radio-button :label="3">本月</el-radio-button>
                  </el-radio-group>
                  <span class="more" @click="gotoProduct(3)">更多</span>
                </div>
              </div>
              <el-table :data="drinkProductData" style="width: 100%">
                <el-table-column type="index" width="40" align="center"> </el-table-column>
                <el-table-column label="商品名称" prop="productName" width="190" show-overflow-tooltip> </el-table-column>
                <el-table-column label="销量(份)" prop="count" width="110" align="center" show-overflow-tooltip> </el-table-column>
              </el-table>
            </div>
          </div>
        -->
        <!-- 售卖柜top10 -->
        <div class="store-info-item vipCost-list">
          <div>
            <div class="title">
              <h2>售卖柜TOP10</h2>
              <div>
                <el-radio-group v-model="machineSelectRadio" size="mini" @change="getMachineProductList">
                  <el-radio-button :label="1">今日</el-radio-button>
                  <el-radio-button :label="2">本周</el-radio-button>
                  <el-radio-button :label="3">本月</el-radio-button>
                </el-radio-group>
                <span class="more" @click="gotoMachineProduct">更多</span>
              </div>
            </div>
            <el-table :data="machineProductData" style="width: 100%">
              <el-table-column type="index" width="40" align="center"> </el-table-column>
              <el-table-column label="商品名称" prop="prodName" width="190" show-overflow-tooltip> </el-table-column>
              <!-- <el-table-column label="产品条码" prop="barCode" width="100" show-overflow-tooltip> </el-table-column> -->
              <el-table-column label="销量(份)" prop="count" width="110" align="center" show-overflow-tooltip> </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 会员消费top10 -->
        <div class="store-info-item vipCost-list">
          <div>
            <div class="title">
              <h2>会员消费TOP10</h2>
              <div>
                <el-radio-group v-model="memberSelectRadio" size="mini" @change="getMemberList">
                  <el-radio-button :label="1">今日</el-radio-button>
                  <el-radio-button :label="2">本周</el-radio-button>
                  <el-radio-button :label="3">本月</el-radio-button>
                </el-radio-group>
                <span class="more" @click="gotoMemberList">更多</span>
              </div>
            </div>
            <el-table :data="vipCostData" style="width: 100%">
              <el-table-column type="index" width="38" align="center"> </el-table-column>
              <el-table-column label="会员姓名" prop="realName" width="95" show-overflow-tooltip> </el-table-column>
              <el-table-column label="手机号" prop="phone" width="115" show-overflow-tooltip> </el-table-column>
              <el-table-column label="消费额(元)" prop="payTotal" width="95" align="center" show-overflow-tooltip> </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 分类占比 -->
        <div class="store-info-item cate-Proportion">
          <div>
            <div class="title"><h2>日分类销售占比</h2></div>
            <div ref="cateProportion" id="cateProportion"></div>
          </div>
        </div>
        <div class="store-info-item cate-Proportion">
          <div>
            <div class="title"><h2>日销售额</h2></div>
            <div ref="salesProportion" id="cateProportion"></div>
          </div>
        </div>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import echarts from 'echarts'
import Filters from '@/components/js/Filters'
import {
  GetSetUpObj,
  getNewOrderStatistics,
  getUserConsumeStatistics,
  getCategoryStatistics,
  getStoreStatistics,
  getUserStatistics,
  getMealsProductStatistics,
  getDrinkProductStatistics,
  StatisticsData,
  getVendingMachineProductStatistics
} from '@/api/system'
import DataState from './data-state/data-state'
import StoreVendingMachine from './store-vending-machine/store-vending-machine.vue'
import { mapState } from 'vuex'
export default {
  mixins: [Filters],
  components: {
    DataState,
    StoreVendingMachine
  },
  watch: {
    $route(to, from) {
      if (to.name === 'store-detail') {
        this.$nextTick(() => {
          this.initData()
        })
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  computed: {
    ...mapState(['storeCid'])
  },
  data() {
    return {
      manageForm: {
        isMonitor: true,
        isCashier: true,
        isTicketPrint: true,
        isAdhesivePrint: true
      },
      storeInfo: {},
      activeName: '1',
      selectRadio: 1,
      productSelectRadio: 1,
      mealsSelectRadio: 1,
      drinkSelectRadio: 1,
      machineSelectRadio: 1,
      memberSelectRadio: 1,
      productData: [], // 商品数据
      mealsProductData: [], // 餐食产品数据
      drinkProductData: [], // 饮品产品数据
      machineProductData: [], // 售卖柜产品数据
      vipCostData: [], // 会员消费数据
      storeStateData: [], // 店铺状态数据
      memberStateData: [], // 会员状态数据
      containerIsShow: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    getStoreDetail() {
      let params = {
        isPage: false,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: this.storeCid
      }
      GetSetUpObj(params).then(res => {
        this.storeInfo = res.data
        // this.$store.commit('setStoreCid', res.data.cid)
      })
    },
    initData() {
      this.getStoreDetail()
      this.getStoreOrUserStatistics()
      this.getProductList()
      this.getMealsProductList()
      // this.getDrinkProductList()
      this.getMachineProductList()
      this.getMemberList()
      this.getCategoryList()
      this.getSaleMoneyList()
    },
    getStoreOrUserStatistics() {
      this.getStoreData()
      this.getUserStatistics()
    },
    // 获取店铺数据
    getStoreData() {
      let params = {
        stage: this.selectRadio,
        queryCid: this.storeCid,
        pageSize: 10,
        pageIndex: 1,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getStoreStatistics(params).then(res => {
        if (res.success) {
          let saleCount = res.data.length
            ? {
                ...res.data[0],
                marketingTotal: (parseFloat(res.data[0].payTotal) + parseFloat(res.data[0].promotionTotal)).toFixed(2),
                retailGrossProfit: (parseFloat(res.data[0].payTotal) + parseFloat(res.data[0].promotionTotal) - parseFloat(res.data[0].costTotal)).toFixed(2),
                virtualGrossProfit: (parseFloat(res.data[0].retailTotal) - parseFloat(res.data[0].costTotal)).toFixed(2),
                customerUnitPrice: (parseFloat(res.data[0].retailTotal) / parseFloat(res.data[0].count)).toFixed(2)
              }
            : {}
          this.storeStateData = [
            { img: require('@/assets/store/icon-storedata1.png'), title: '零售总额', price: saleCount.retailTotal },
            { img: require('@/assets/store/icon-storedata2.png'), title: '订单数', price: saleCount.count },
            { img: require('@/assets/store/icon-storedata8.png'), title: '客单价', price: saleCount.customerUnitPrice },
            { img: require('@/assets/store/icon-storedata3.png'), title: '实付金额', price: saleCount.payTotal },
            { img: require('@/assets/store/icon-storedata11.png'), title: '营收总额', price: saleCount.marketingTotal },
            { img: require('@/assets/store/icon-storedata4.png'), title: '手续费', price: saleCount.feeTotal },
            { img: require('@/assets/store/icon-storedata5.png'), title: '实收金额', price: saleCount.accountTotal },
            { img: require('@/assets/store/icon-storedata6.png'), title: '销售成本', price: saleCount.costTotal },
            { img: require('@/assets/store/icon-storedata7.png'), title: '实毛利额', price: saleCount.retailGrossProfit },
            { img: require('@/assets/store/icon-storedata10.png'), title: '实毛利率', price: res.data.length ? `${((saleCount.retailGrossProfit / saleCount.marketingTotal) * 100).toFixed(2)}%` : 0 },
            { img: require('@/assets/store/icon-storedata9.png'), title: '零售毛利额', price: saleCount.virtualGrossProfit },
            { img: require('@/assets/store/icon-storedata10.png'), title: '零售毛利率', price: res.data.length ? `${((saleCount.virtualGrossProfit / saleCount.retailTotal) * 100).toFixed(2)}%` : 0 }
            // { img: require('@/assets/store/icon-storedata11.png'), title: '会员折扣总额', price: saleCount.memberDiscountTotal }
          ]
        }
      })
    },
    // 获取会员状况数据
    getUserStatistics() {
      let params = {
        stage: this.selectRadio,
        queryCid: this.storeCid,
        pageSize: 10,
        pageIndex: 1,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getUserStatistics(params).then(res => {
        if (res.success) {
          let memberCount = res.data[0] || {}
          this.memberStateData = [
            { img: require('@/assets/store/icon-vipdata1.png'), title: '会员消费额', price: memberCount.payTotal },
            { img: require('@/assets/store/icon-vipdata2.png'), title: 'VIP会员购买数', price: memberCount.count },
            { img: require('@/assets/store/icon-vipdata3.png'), title: '组合营销优惠额', price: memberCount.promotionTotal },
            { img: require('@/assets/store/icon-vipdata4.png'), title: '单品折扣优惠额', price: memberCount.onePromotionTotal },
            { img: require('@/assets/store/icon-vipdata5.png'), title: '会员价优惠额', price: memberCount.memberDiscountTotal },
            { img: require('@/assets/store/icon-vipdata6.png'), title: '卡券优惠总额', price: memberCount.cardTotal }
          ]
        }
      })
    },
    // 获取产品列表数据
    getProductList() {
      let params = {
        stage: this.productSelectRadio,
        category: '',
        nameOrBarCode: '',
        queryCid: this.storeCid,
        pageSize: 10,
        pageIndex: 1,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getNewOrderStatistics(params)
        .then(res => {
          if (res.success) {
            this.productData = res.data
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 获取餐食产品数据
    getMealsProductList() {
      let params = {
        stage: this.mealsSelectRadio,
        category: '',
        nameOrBarCode: '',
        queryCid: this.storeCid,
        pageSize: 10,
        pageIndex: 1,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getMealsProductStatistics(params)
        .then(res => {
          if (res.success) {
            this.mealsProductData = res.data
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 获取饮品产品数据
    getDrinkProductList() {
      let params = {
        stage: this.drinkSelectRadio,
        category: '',
        nameOrBarCode: '',
        queryCid: this.storeCid,
        pageSize: 10,
        pageIndex: 1,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getDrinkProductStatistics(params).then(res => {
        if (res.success) {
          this.drinkProductData = res.data
        }
      })
    },
    // 获取售卖柜产品数据
    getMachineProductList() {
      let params = {
        stage: this.machineSelectRadio,
        vmcode: '',
        prodName: '',
        pageSize: 10,
        pageIndex: 1,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: this.storeCid
      }
      getVendingMachineProductStatistics(params).then(res => {
        this.machineProductData = res.data.list
      })
    },
    // 获取用户消费列表
    getMemberList() {
      let params = {
        stage: this.memberSelectRadio,
        queryCid: this.storeCid,
        pageSize: 10,
        pageIndex: 1,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getUserConsumeStatistics(params)
        .then(res => {
          if (res.success) {
            this.vipCostData = res.data
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 获取分类占比
    getCategoryList() {
      let params = {
        queryCid: this.storeCid,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getCategoryStatistics(params)
        .then(res => {
          if (res.success) {
            let categoryData = res.data.map(item => {
              return {
                name: item.oneCategoryName,
                icon: 'rect',
                value: item.count
              }
            })
            this.getProportionPie(categoryData)
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    getProportionPie(categoryData) {
      let myPieChart = echarts.init(this.$refs.cateProportion)
      let option = {
        color: ['#E99745', '#6F5ED9', '#39C7D7', '#67B5E3', '#D95858', '#3F7FD4', '#85D356', '#FFDD00', '#CA55A4', '#48C69B'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          width: '30%',
          left: 'left',
          top: 'middle',
          itemGap: 10,
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
            padding: [4, 0, 0, 2]
          },
          data: categoryData
        },
        series: [
          {
            type: 'pie',
            radius: ['25%', '60%'],
            center: ['65%', '60%'],
            avoidLabelOverlap: true, // 防止标签重叠
            label: {
              formatter: '{d}%',
              fontSize: 14,
              fontWeight: 'bold',
              fontStyle: 'italic'
            },
            labelLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            labelLayout: {
              hideOverlap: false // 是否隐藏重叠标签
            },
            data: categoryData
          }
        ]
      }
      myPieChart.setOption(option)
      this.chartResize(myPieChart)
    },
    // 获取日销售额
    getSaleMoneyList() {
      let param = {
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: this.storeCid
      }
      StatisticsData(param).then(res => {
        if (res.success) {
          let salesData = res.data.fifData
          // 画图
          this.getSalesLine(salesData)
        }
      })
    },
    getSalesLine(salesData) {
      let myLineChart = echarts.init(this.$refs.salesProportion)
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#409EFF', '#648CFF', '#646BFF', '#9B64FF', '#BE9BFF'],
        calculable: true,
        legend: {
          data: ['线下', '线上', '订单笔数']
        },
        xAxis: [
          {
            type: 'category',
            data: salesData.timeList
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销售额',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '订单笔数',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '线下',
            type: 'bar',
            data: salesData.offLineList
          },
          {
            name: '线上',
            type: 'bar',
            data: salesData.onLineList
          },
          {
            name: '订单笔数',
            type: 'line',
            yAxisIndex: 1,
            data: salesData.allLineList
          }
        ]
      }
      myLineChart.setOption(option)
      this.chartResize(myLineChart)
    },
    chartResize(echart) {
      window.onresize = function() {
        echart.resize()
      }
    },
    gotoStoreAndMember() {
      this.$router.push({
        path: '/store-data-detail',
        query: { companyName: this.storeInfo.companyName, cid: this.storeCid }
      })
    },
    gotoProduct(type) {
      this.$router.push({
        path: '/product-sale-list',
        query: { type, companyName: this.storeInfo.companyName, cid: this.storeCid }
      })
    },
    gotoMachineProduct() {
      this.$router.push({
        path: '/machine-product-sale-list',
        query: { companyName: this.storeInfo.companyName, cid: this.storeCid }
      })
    },
    gotoMemberList() {
      this.$router.push({
        path: '/member-list',
        query: { companyName: this.storeInfo.companyName, cid: this.storeCid }
      })
    },
    goBack() {
      this.$router.push('/store-manage')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_element-reset.scss';
@import '@/styles/_mixin.scss';
.store-detail {
  font-family: 'MicrosoftYaHei';
  .store-info-top {
    display: flex;
    justify-content: space-between;
    height: 474px;
    .base-info {
      flex: 0 0 38.9%;
      // width: 650px;
      border-radius: 10px;
      display: flex;
      overflow: hidden;
      .info {
        flex: 0 0 65%;
        padding: 33px 43px 0;
        background: url('../../../../assets/store/bg1.png') no-repeat top center;
        background-size: cover;
        .picture {
          // width: 305px;
          height: 208px;
          padding: 0 20px 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .info-detail {
          .info-item {
            display: flex;
            font-size: 14px;
            color: #000;
            font-family: 'MicrosoftYaHei';
            padding-bottom: 20px;
            span {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.65);
              cursor: default;
            }
            span.state {
              display: inline-block;
              width: 52px;
              height: 19px;
              line-height: 19px;
              // margin: 0 10%;
              font-size: 12px;
              text-align: center;
            }
            span.current {
              background: #3664b7;
              color: #ffffff;
              border-radius: 10px;
            }
          }
          .row-line {
            flex-wrap: wrap;
            > div {
              flex: 50%;
              margin-top: 20px;
              @include no-wrap();
            }
          }
          .row-flex {
            .shop-state {
              flex: 30%;
              @include no-wrap();
            }
            .shop-state-detail {
              flex: 70%;
              display: flex;
              justify-content: space-around;
            }
          }
        }
      }
      .device-manage {
        flex: 0 0 35%;
        padding: 10px 20px 0;
        background: #3664b7;
        color: #ffffff;
        font-family: 'MicrosoftYaHei-Bold, MicrosoftYaHei';
        font-weight: bold;
        .manage-title {
          font-size: 18px;
          padding: 10px 0;
        }
        .device {
          margin-top: 16px;
          .device-item {
            padding: 16px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              display: flex;
              .device-pic {
                width: 30px;
                height: 38px;
                margin-right: 10px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .device-detail {
                font-family: 'MicrosoftYaHei';
                .title {
                  font-size: 14px;
                  font-weight: 700;
                  color: #fff;
                }
                .state {
                  width: 48px;
                  height: 18px;
                  font-size: 12px;
                  text-align: center;
                  line-height: 18px;
                  border-radius: 10px;
                  &.open {
                    background: #fff;
                    color: #3664b7;
                  }
                  &.close {
                    background: #b73636;
                    color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
    .store-data {
      position: relative;
      flex: 0 0 60%;
      // width: 1003px;
      padding: 40px 25px 0;
      background: #ffffff;
      border-radius: 10px;
      .data-filter {
        position: absolute;
        top: 40px;
        right: 25px;
        display: flex;
        align-items: center;
        line-height: 24px;
        font-size: 16px;
        .detail {
          color: #3664b7;
          margin-left: 35px;
          cursor: pointer;
        }
      }
    }
  }
  .store-info-bottom {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // height: 457px;
    .store-info-item {
      padding: 20px 35px 25px;
      background: #ffffff;
      border-radius: 10px;
      margin-top: 20px;
      > div {
        width: 100%;
        .title {
          display: flex;
          justify-content: space-between;
          line-height: 28px;
          h2 {
            font-size: 18px;
            font-weight: 700 !important;
          }
          .more {
            font-size: 14px;
            color: #3664b7;
            cursor: pointer;
            margin-left: 10px;
          }
        }
      }
      &.vipCost-list {
        width: 24.8%;
      }
      &.cate-Proportion {
        width: 49.5%;
        #cateProportion,
        #salesProportion {
          width: 100% !important;
          height: 400px;
          margin-top: 10px;
          div {
            width: 100% !important;
            height: 100% !important;
            canvas {
              width: 100% !important;
              height: 100% !important;
            }
          }
        }
      }
    }
  }
  /deep/ .el-table__body-wrapper {
    td {
      // border-bottom: unset;
      padding: 5px 0;
    }
    th.is-leaf {
      border-bottom: unset;
    }
  }
}
</style>
