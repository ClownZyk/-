<template>
  <div class="home">
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title">
          <div>当日进店人数</div>
        </div>
        <div class="count-l-total"><i class="iconfont icon-renshu"></i>
          <div class="count-value">124</div>
        </div>
        <div class="count-l-bottom">
          <span>当月进店人数</span>
          <span>439</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title">
          <div>当日会员到店人数</div>
        </div>
        <div class="count-l-total"><i class="iconfont icon-renshu"></i>
          <div class="count-value">20</div>
        </div>
        <div class="count-l-bottom">
          <span>当月会员到店人数</span>
          <span>233</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title">
          <div>当日首次到店人数</div>
        </div>
        <div class="count-l-total"><i class="iconfont icon-renshu"></i>
          <div class="count-value">12</div>
        </div>
        <div class="count-l-bottom">
          <span>当月首次到店人数</span>
          <span>21</span>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title">
          <div>当日2次及以上到店人数</div>
        </div>
        <div class="count-l-total"><i class="iconfont icon-renshu"></i>
          <div class="count-value">32</div>
        </div>
        <div class="count-l-bottom">
          <span>当月2次及以上到店人数</span>
          <span>3</span>
        </div>
      </div>
      <div class="home-count-item">
        <el-button class="btns" type="primary" size="mini" @click="_open" >{{txt}}</el-button>
        <div class="conut-l-title">
          <div>当日新增会员总人数</div>
        </div>
        <div class="count-l-total"><i class="iconfont icon-renshu"></i>
          <div class="count-value">23</div>
        </div>
        <div class="count-l-bottom">
          <span>当日付费会员总人数</span>
          <span>32</span>
        </div>
      </div>
    </div>
    <div class="home-chart">
      <div class="home-chart-title theme-color">客流量分布统计</div>
      <div class="home-chart-main">
        <div class="count-2" style="flex: 0 0 66%;" id="count-5"></div>
        <div class="count-2" style="flex: 0 0 30%;" id="count-6"></div>
      </div>
    </div>
    <!--参数配置弹框-->
    <el-dialog
      title="参数配置"
      :visible.sync="parameterSHow"
      width="600px">
      <el-form :model="dialog" label-width="100px" :rules="formRules" ref="ruleForm" class="form">
        <div class="mag-dialog-row">
          <el-form-item  prop="id" class="el-form-item el-form-row">
            <div class="form-item-title">摄像头硬件编号<span class="border"></span> <span class="EnName">Id</span></div>
            <el-input class="form-input" placeholder="请输入硬件编号" v-model="dialog.sncId"></el-input>
          </el-form-item>
          <el-form-item prop="API" class="el-form-item el-form-row">
            <div class="form-item-title">API Key<span class="border"></span> <span class="EnName">API Key</span></div>
            <el-input class="form-input" placeholder="请输入API Key" v-model="dialog.clientId"></el-input>
          </el-form-item>
          <el-form-item prop="Secret" class="el-form-item el-form-row">
            <div class="form-item-title">Secret Key<span class="border"></span> <span class="EnName">Secret Key</span></div>
            <el-input class="form-input" placeholder="请输入Secret Key" v-model="dialog.clientSecret"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="parameterSHow = false">取 消</el-button>
        <el-button type="primary" @click="_option(dialog, 'ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import {GetFacesetUp, faceOperation} from '@/api/system'
  export default {
    name: 'orders',
    components: {},
    data() {
      return {
        txt: '参数配置',
        parameterSHow: false,
        Action: null,
        Txt: '',
        count: {
          monthTotal: 0
        },
        dialog: {},
        Dto: {},
        canShu: {},
        formRules: {
          // id: [
          //       { required: true, message: '请填写摄像头硬件编号', trigger: 'blur' }
          //       ],
          // API: [
          //       { required: true, message: '请填写API Key', trigger: 'blur' }
          //       ],
          // Secret: [
          //         { required: true, message: '请填写Secret Key', trigger: 'blur' }
          //       ]
        }
      }
    },
    methods: {
      // 参数详情
      init() {
        let params = {
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        GetFacesetUp(params).then(res => {
          if (res.success) {
            this.canShu = res.data
            if (res.data._id === '000000000000000000000000') {
              this.$message.warning(res.msg)
              this.txt = '配置参数'
              this.Txt = '添加'
              this.parameterSHow = true
              this.Action = 0
              this.dialog = {
                creater: this.$store.state.UserID,
                roleId: this.$store.state.UserRole,
                cid: this.$store.state._cid
              }
            } else {
              this.txt = '修改参数'
              this.Action = 1
              this.parameterSHow = false
              this.Dto = res.data
              this.Txt = '修改'
            }
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      _open() {
        this.Dto = this.canShu
        this.parameterSHow = true
        let _this = this
        this.dialog = _this.Dto
      },
      _option(dto, formName) {
        console.log(dto)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.edit(dto, this.Action, this.Txt)
          } else {
            return false
          }
        })
      },
      edit(dto, action, txt) {
        this.$confirm('是否' + txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            dto: dto,
            action: action
          }
          faceOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.parameterSHow = false
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      }
    },
    mounted() {
      this.init()
      let myChart5 = echarts.init(document.getElementById('count-5'))
      let option5 = {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#409EFF', '#648CFF', '#646BFF', '#9B64FF', '#BE9BFF'],
        calculable: true,
        legend: {
          data: ['订单客流量', '总客流量', '客单转换率']
        },
        xAxis: [
          {
            type: 'category',
            data: ['05/01', '05/02', '05/03', '05/04', '05/05', '05/06', '05/07', '05/08', '05/09', '05/10', '05/11', '05/12']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '订单客流量',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '客单转换率',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '订单客流量',
            type: 'bar',
            data: [24290, 29246.12, 35525, 33545, 32645.24, 21812.10, 31927, 29731.21, 35282, 32827, 24743, 21245]
          },
          {
            name: '总客流量',
            type: 'bar',
            data: [21290, 23253, 22342, 15645.24, 26822.10, 30927, 18731.21, 24282, 25827, 25743, 21245]
          },
          {
            name: '客单转换率',
            type: 'line',
            yAxisIndex: 1,
            data: [5.03, 4.20, 3.35, 4.53, 6.33, 10.23, 20.34, 23.43, 23.03, 16.35, 12.30, 6.32]
          }
        ]
      }
      myChart5.setOption(option5)
      let myChart6 = echarts.init(document.getElementById('count-6'))
      myChart6.setOption({
        color: ['#3ACAFF', '#3AA0FF', '#6888FF', '#74B1FF'],
        title: {
          // text: '当日客流量性别分布'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        calculable: false,
        series: [
          {
            name: '新客',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, 70],
            x: '20%',
            width: '40%',
            funnelAlign: 'right',
            max: 1548,

            itemStyle: {
              normal: {
                label: {
                  position: 'inner'
                },
                labelLine: {
                  show: false
                }
              }
            },
            data: [
              {value: '343', name: '老客'},
              {value: '123', name: '新客', selected: true}
            ]
          },
          {
            name: '老客',
            type: 'pie',
            radius: [100, 140],

            // for funnel
            x: '60%',
            width: '35%',
            funnelAlign: 'left',
            max: 1048,

            data: [
              {value: '213', name: '男'},
              {value: '32', name: '女'}
            ]
          }
        ]
      })
    },
    watch: {
      parameterSHow: {
        handler(newName, oldName) {
          if (newName === false) {
            this.Dto = {}
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-form-item__content{
    margin-left: 0 !important;
  }
  .home {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background-color: #f2f2f2;
    padding: 10px;
    .home-count {
      width: 100%;
      padding-bottom: 10px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      .home-count-item {
        flex: 0 0 19.5%;
        background-color: #ffffff;
        box-shadow: 0 0 10px #f2f2f2;
        padding: 10px;
        max-height: 112.81px;
        position: relative;
        .btns {
          position: absolute;
          top: 10px;
          right: 10px;
        }
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
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        padding-top: 10px;
        .count-2 {
          height: 340px;
        }
      }
    }
  }
</style>
