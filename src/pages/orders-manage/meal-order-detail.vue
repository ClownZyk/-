<template>
  <div class="order-detail">
    <div class="main">
      <div class="main-title">基本信息</div>
      <div class="main-l">
        <div class="main-l-row">
          <div class="main-l-l"><div class="border"></div><div>订单编号：{{form.orderId}}</div></div>
          <div class="main-l-l"><div class="border"></div><div>买家姓名：{{form.customer.userName}}</div></div>
          <div class="main-l-l"><div class="border"></div><div>买家电话：{{form.customer.phone}}</div></div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l"><div class="border"></div><div>订单金额：{{form.pay.buyTotal}}</div></div>
          <div class="main-l-l"><div class="border"></div><div>订单状态：{{form.orderStatus}}</div></div>
          <div class="main-l-l"><div class="border"></div><div>订单创建时间：{{form.createTime}}</div></div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l"><div class="border"></div><div>订单备注：{{form.createTime}}</div></div>
        </div>
      </div>
    </div>
    <div class="main-title produce">产品列表</div>
    <el-table class="proTable" :data="tableData6" border style="width: 100%" v-show="tableData6.length !== 0">
      <el-table-column prop="d_sku.barcode" label="商品条码" width="180" :align="align" show-overflow-tooltip></el-table-column>
      <!--<el-table-column label="商品图片" width="180" :align="align">-->
        <!--<template  slot-scope="scope">-->
          <!--<div class="good-img" v-if="scope.row.sku.skuImg" :style="{'backgroundImage': 'url('+scope.row.sku.skuImg.url+')'}"></div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="name" label="商品名称" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="d_sku.title" label="商品规格" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="现价" :align="align" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="d_sku.price" sortable label="原价" :align="align" show-overflow-tooltip></el-table-column>
      <el-table-column  prop="d_sku.vipPrice" sortable label="会员价" :align="align" show-overflow-tooltip></el-table-column>
      <el-table-column prop="d_sku.dayCount" sortable label="数量" :align="align" show-overflow-tooltip></el-table-column>
      <el-table-column sortable label="总价" :align="align">
        <template  slot-scope="scope">
          {{scope.row.price * scope.row.d_sku.dayCount}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {DailyVShopFoodOrderId, OrderOperation, VShopOrderUpdateKDReciver} from '@/api/system'
  export default {
    name: 'scrm-order-detail',
    filters: {
      formatDisCount(val) {
        switch (val) {
          case 0:
            return '抹零'
          case 1:
            return '折扣'
          case 2:
            return '优惠金额'
          case 3:
            return '微信卡劵'
          default:
            return '其它优惠'
        }
      },
      formatType (val) {
        switch (val) {
          case 0:
            return '微信支付'
          case 1:
            return '支付宝支付'
          case 2:
            return '余额支付'
          case 3:
            return '现金支付'
          case 4:
            return '银行卡支付'
          case 5:
            return '充值卡支付'
          case 6:
            return '收钱吧'
          case 7:
            return '富有支付'
          case 8:
            return '裕福支付'
          default:
            return '其它支付'
        }
      }
    },
    data() {
      return {
        align: 'center',
        form: {
          customer: {},
          payStatus: {},
          pay: {}
        },
        stateList: [{value: '待接单'}, {value: '已接单'}, {value: '配送中'}, {value: '已送达'}],
        tableData6: [],
        pageSize: 10,
        pageIndex: 1,
        logisticsList: [
          { label: '顺丰速运', value: 'SF' },
          { label: '百世快递', value: 'HTKY' },
          { label: '中通快递', value: 'ZTO' },
          { label: '申通快递', value: 'STO' },
          { label: '圆通速递', value: 'YTO' },
          { label: '韵达速递', value: 'YD' },
          { label: '邮政快递包裹', value: 'YZPY' },
          { label: 'EMS', value: 'EMS' },
          { label: '天天快递', value: 'HHTT' },
          { label: '京东快递', value: 'JD' },
          { label: '德邦快递', value: 'DBL' }
        ],
        // 物流和收件人信息
        otherInfo: {
          logisticsInfo: {
            logisticsCompany: '',
            logisticsNumber: ''
          },
          receiverInfo: {
            name: '',
            phone: '',
            address: ''
          }
        },
        formRules: {
          'logisticsInfo.logisticsCompany': [
            { required: true, message: '请选择快递公司', trigger: 'change' }
          ],
          'logisticsInfo.logisticsNumber': [
            { required: true, message: '请输入快递单号', trigger: 'blur' }
          ],
          'receiverInfo.name': [
            { required: true, message: '请输入收件人', trigger: 'blur' }
          ],
          'receiverInfo.phone': [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          'receiverInfo.address': [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init: function() {
        if (this.$route.query.id !== undefined) {
          let parmas = {
            _id: this.$route.query.id
          }
          DailyVShopFoodOrderId(parmas).then(res => {
            if (res.success) {
              this.form = res.data
              if (this.form.logisticsInfo) {
                this.otherInfo.logisticsInfo = JSON.parse(JSON.stringify(this.form.logisticsInfo))
              }
              if (this.form.sendInfo && this.form.sendInfo.receiverInfo) {
                this.otherInfo.receiverInfo = JSON.parse(JSON.stringify(this.form.sendInfo.receiverInfo))
              }
              this.tableData6 = res.data.product
            } else this.$message.err(res.msg)
          }, err => { this.$message.err(err.msg) })
        }
      },
      stateChange: function () {
        this.$confirm('是否修改订单状态', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.Pay.Discount = this.form.pay.discount
          this.form.Pay = this.form.pay
          let params = {
            dto: this.form,
            action: 1
          }
          OrderOperation(params).then(res => {
            if (res.success) {
              // this.form = res.data
              this.$router.go(-1)
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      },
      // 提交物流信息
      submitLogistics () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交物流信息吗？', '提示', {}).then(() => {
              let params = {
                receiverInfo: this.otherInfo.receiverInfo,
                logisticsInfo: this.otherInfo.logisticsInfo,
                _id: this.$route.query.id,
                creater: this.$store.state.UserID,
                roleid: this.$store.state.UserRole,
                cid: this.$store.state._cid
              }
              VShopOrderUpdateKDReciver(params).then(res => {
                if (res.success) {
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  })
                  this.$router.go(-1)
                } else this.$message.error(res.msg)
              }, err => {
                this.$message.error(err.msg)
              })
            })
          }
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .order-detail{
    .main{
      top: 0;
      .main-l{
        background-color: #f2f6fc;
        padding: 0 10px 10px 10px;
        .main-l-row {
          display: flex;
          display: -webkit-flex;
          flex-wrap: wrap;
          .main-l-l {
            flex: 0 0 25%;
            display: flex;
            display: -webkit-flex;
            margin-top: 10px;
            .border{
              width: 3px;
              height: 20px;
              background-color: #409EFF;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .main-title{
    font-weight: bolder;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .produce{
    margin-top: 30px;
  }
  .good-img{
    width: 60px;
    height: 60px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #f2f6fc;
  }
</style>
