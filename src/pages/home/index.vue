<template>
  <div class="page-container home" v-loading="loading2" v-if="containerIsShow">
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>当月总销售额</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ Entity.monthSalesVolume }}</div>
        </div>
        <div class="count-l-bottom">
          <span>当月日均销售额</span> <span>￥{{ Entity.monthAverage || 0 }}</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>当日总额</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ Entity.daySalesVolume }}</div>
        </div>
        <div class="count-l-bottom">
          <span>当日总订单数</span> <span>{{ Entity.dayManCount }}</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>前日总额</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ Entity.yesterDaySalesVolume }}</div>
        </div>
        <div class="count-l-bottom">
          <span>前日总订单数</span> <span>{{ Entity.yesterDayManCount }}</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>当日客单价</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-renshu"></i>
          <div class="count-value">{{ Entity.averagePrice || 0 }}</div>
        </div>
        <div class="count-l-bottom">
          <span>前日客单价</span> <span>￥{{ Entity.yesterDayManCount ? (Entity.yesterDaySalesVolume / Entity.yesterDayManCount).toFixed(2) : 0 }}</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>当日会员消费占比</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-gaikuangtongji"></i>
          <div class="count-value">{{ Entity.userAverage || 0 }}</div>
        </div>
        <div class="count-l-bottom">
          <span>当日付费会员总人数</span> <span>{{ Entity.userCount }}</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>当月利润</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ Entity.monthProfit }}</div>
        </div>
        <div class="count-l-bottom">
          <span>当月日均利润</span> <span>￥{{ Entity.monthAverageProfit.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <div class="home-chart">
      <div class="home-chart-title theme-color">后台系统统计图表</div>
      <div class="home-chart-main">
        <div class="home-chart-main-item">
          <div class="count-2" id="count-2"></div>
          <div class="count-2" id="count-3"></div>
          <div class="count-2" id="count-4"></div>
        </div>
        <div class="home-chart-main-item">
          <div class="count-2" style="flex: 0 0 50%;" id="count-5"></div>
          <el-tabs type="card" v-model="activeName" style="flex: 0 0 50%;">
            <el-tab-pane label="零售产品（含散称）" name="first"><retail-product></retail-product></el-tab-pane>
            <el-tab-pane label="餐食产品" name="second"><meals-product></meals-product></el-tab-pane>
            <el-tab-pane label="饮品产品" name="third"><drinks-product></drinks-product></el-tab-pane>
            <el-tab-pane label="售卖机产品" name="fourth"><vending-machine-product></vending-machine-product></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import echarts from 'echarts'
import { NewOrderStateStatistics, StatisticsData } from '@/api/system'
import RetailProduct from './components/retail-product.vue'
import MealsProduct from './components/meals-product.vue'
import DrinksProduct from './components/drinks-product.vue'
import VendingMachineProduct from './components/vending-machine-product.vue'

export default {
  name: 'orders',
  components: {
    RetailProduct,
    MealsProduct,
    DrinksProduct,
    VendingMachineProduct
  },
  watch: {
    $route(to, from) {
      if (to.name === 'home') {
        this.init()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      loading2: false,
      Entity: {
        daySalesVolume: 0, // 当日总销售额
        yesterDaySalesVolume: 0, // 昨日总销售额
        dayManCount: 0, // 当日订单数
        averagePrice: 0, // 当日客单价
        yesterUserCount: 0, // 前日客单价
        yesterDayManCount: 0, // 昨日订单数
        monthSalesVolume: 0, // 当月总销售额
        monthAverage: 0, // 当月日均销售额
        userCount: 0, // 当日会员消费数
        userAverage: 0, // 当日会员消费占比
        monthProfit: 0, // 当月利润
        monthAverageProfit: 0 // 当月日均利润
      },
      fd: {}, // 近15天的订单
      sd: {},
      productList: [],
      count: {
        monthTotal: 1243
      },
      containerIsShow: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this._salsesStatic()
      this._typeProportion()
    },
    // 顶部销售数据统计
    _salsesStatic() {
      this.loading2 = true
      let param = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      StatisticsData(param).then(res => {
        this.loading2 = false
        if (res.success) {
          this.Entity = res.data
          this.fd = res.data.fifData
          this.sd = res.data.sevenData
          // 画图
          this._counts()
        }
      })
    },
    _counts() {
      this._radarEchart()
      this._userAvange()
      this._monthCount()
    },
    // 用户消费饼状图
    _typeProportion() {
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.loading2 = true
      NewOrderStateStatistics(params).then(res => {
        if (res.success) {
          this.loading2 = false
          res.data = res.data.map(item => {
            return {
              name: item.firstCategoryName,
              value: item.totel
            }
          })
          this._userSalesType(res.data)
        }
      })
    },
    // 用户消费类型
    _userSalesType(res) {
      let myChart3 = echarts.init(document.getElementById('count-3'))
      let option3 = {
        title: {
          text: '用户消费类型',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left'
        },
        color: ['#409EFF', '#648CFF', '#646BFF', '#9B64FF', '#BE9BFF'],
        calculable: true,
        series: [
          {
            name: '用户消费类型',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: res.data
          }
        ]
      }
      myChart3.setOption(option3)
    },
    // 雷达图统计
    _radarEchart() {
      let myChart2 = echarts.init(document.getElementById('count-2'))
      let option2 = {
        title: {
          text: '系统分析雷达图',
          x: 'right'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'left',
          orient: 'vertical',
          data: ['新用户', '老用户']
        },
        color: ['#409EFF', '#648CFF'],
        calculable: true,
        polar: [
          {
            indicator: [{ text: '线下消费', max: 100 }, { text: '访问量', max: 100 }, { text: '文章浏览量', max: 100 }, { text: '线上消费', max: 100 }, { text: '总人数', max: 100 }],
            radius: 130
          }
        ],
        series: [
          {
            name: '完全实况球员数据',
            type: 'radar',
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default'
                }
              }
            },
            data: [
              {
                value: [67, 42, 88, 54, 90, 86],
                name: '新用户'
              },
              {
                value: [86, 32, 74, 43, 88, 92],
                name: '老用户'
              }
            ]
          }
        ]
      }
      myChart2.setOption(option2)
    },
    // 用户客单价
    _userAvange() {
      let myChart4 = echarts.init(document.getElementById('count-4'))
      let option4 = {
        title: {
          text: '用户客单价(线上/线下)'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'right',
          y: 'top',
          data: ['线上量', '线下量']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.sd.weekList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '线上量',
            type: 'line',
            smooth: true,
            markPoint: {
              itemStyle: {
                normal: {
                  borderColor: '#3ACAFF'
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#3ACAFF',
                lineStyle: { color: '#3ACAFF' },
                areaStyle: { color: '#7CEEFF' }
              }
            },
            data: this.sd.onLineList
          },
          {
            name: '线下量',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#3AA0FF',
                lineStyle: { color: '#3AA0FF' },
                areaStyle: { color: '#98ddff' }
              }
            },
            data: this.sd.offLineList
          }
        ]
      }
      myChart4.setOption(option4)
    },
    // 线上，线下，订单笔数折线图
    _monthCount() {
      let myChart5 = echarts.init(document.getElementById('count-5'))
      let option5 = {
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
            data: this.fd.timeList
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
            data: this.fd.offLineList
          },
          {
            name: '线上',
            type: 'bar',
            data: this.fd.onLineList
          },
          {
            name: '订单笔数',
            type: 'line',
            yAxisIndex: 1,
            data: this.fd.allLineList
          }
        ]
      }
      myChart5.setOption(option5)
    }
  }
}
</script>
<style scoped lang="scss">
.home {
  padding: 10px;
  background-color: #f2f2f2;
  .home-count {
    width: 100%;
    padding-bottom: 10px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    .home-count-item {
      flex: 0 0 16%;
      background-color: #ffffff;
      box-shadow: 0 0 10px #f2f2f2;
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
  /*图表*/
  .home-chart {
    margin-bottom: 10px;
    width: 100%;
    /*height: 100%;*/
    background-color: #ffffff;
    .home-chart-title {
      padding: 10px;
      font-weight: bolder;
      border-bottom: 1px solid #e6e5e5;
      font-size: 18px;
    }
    .home-chart-main {
      width: 100%;
      height: 100%;
      padding: 10px;
      .home-chart-main-item {
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .count-2 {
          flex: 0 0 33%;
          height: 340px;
        }
      }
    }
  }
}
</style>
