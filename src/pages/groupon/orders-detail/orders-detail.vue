<template>
  <div class="orders-detail">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <div class="order-detail">
      <div class="main">
        <div class="main-title">基本信息</div>
        <div class="main-l">
          <div class="main-l-row">
            <div class="main-l-l">
              <div class="border"></div>
              <div>订单编号：{{ form.orderId }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>收货人：{{ form.customer.userName }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>收货人手机号：{{ form.customer.phone }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>订单时间：{{ form.payStatus.time }}</div>
            </div>
          </div>
          <div class="main-l-row">
            <div class="main-l-l">
              <div class="border"></div>
              <div>支付方式：{{ form.pay.payType | payTypeStateFilter }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>
                支付状态：{{
                  form.payStatus === null
                    ? ''
                    : form.payStatus.payState === 'ok'
                    ? '支付成功'
                    : form.payStatus.payState === 'cancel'
                    ? '取消支付'
                    : form.payStatus.payState === 'prepay'
                    ? '待支付'
                    : form.payStatus.payState === 'fail'
                    ? '支付失败'
                    : '错误订单'
                }}
              </div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>订单状态：{{ form.orderStatus | orderTypeStateFilter }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>订单原价：{{ form.pay.oriTotal }}</div>
            </div>
          </div>
          <div class="main-l-row">
            <div class="main-l-l">
              <div class="border"></div>
              <div>实付金额：{{ form.pay.buyTotal }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>订单优惠：{{ parseFloat((form.pay.memberDiscount + form.pay.discountAmount).toFixed(2)) }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>拼团身份：{{ form.type === 0 ? '团长' : form.type === 1 ? '团员' : '--' }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>拼团状态：{{ form.isSuccess === 1 ? '拼团中' : form.isSuccess === 2 ? '拼团成功' : form.isSuccess === 3 ? '拼团失败' : '' }}</div>
            </div>
          </div>
          <div class="main-l-row">
            <div class="main-l-l">
              <div class="border"></div>
              <div>{{ form.needNum }}人团，已有{{ form.successNum }}人参团</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>拼团备注：{{ form.canTuanMsg || '--' }}</div>
            </div>
            <div class="main-l-l">
              <div class="border"></div>
              <div>用户备注：{{ form.remark || '--' }}</div>
            </div>
          </div>
        </div>
        <!--
          <div class="logistics-box" v-if="form.payStatus.payState === 'ok'">
            <div class="main-title">物流信息</div>
            <el-form :model="otherInfo" label-width="80px" :rules="formRules" ref="form" class="logistics-form" :inline="true">
              <div>
                <el-form-item label="快递公司" prop="logisticsInfo.logisticsCompany">
                  <el-select v-model="otherInfo.logisticsInfo.logisticsCompany" clearable>
                    <el-option v-for="(item, index) in logisticsList" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="快递单号" prop="logisticsInfo.logisticsNumber">
                  <el-input v-model="otherInfo.logisticsInfo.logisticsNumber" style="width:350px;"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="收件人" prop="receiverInfo.name">
                  <el-input v-model="otherInfo.receiverInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="receiverInfo.phone">
                  <el-input v-model="otherInfo.receiverInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="receiverInfo.address">
                  <el-input v-model="otherInfo.receiverInfo.address" style="width:350px;"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <el-button class="logistics-btn" type="primary" @click="submitLogistics" :disabled="form.isSuccess!==2 || (form.orderStatus!==1 && form.orderStatus!==2)">
              {{form.isSuccess===1?'暂未成团，不能发货':form.isSuccess===2?'提交物流':form.isSuccess===3?'拼团失败，不能发货':''}}
            </el-button>
          </div>
        -->
      </div>
      <div class="main-title group-product">产品信息</div>
      <el-table :data="groupOrderProductList" border style="width: 100%">
        <!-- <el-table-column prop="sku.barCode" label="商品条码" width="180" :align="align"></el-table-column> -->
        <el-table-column label="商品图片" width="180" :align="align">
          <template slot-scope="scope">
            <div v-if="scope.row.sku.img" class="good-img" :style="{ backgroundImage: 'url(' + scope.row.sku.img.url + ')' }"></div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" :align="align" min-width="100"></el-table-column>
        <el-table-column prop="sku.name" label="商品规格" :align="align" min-width="100"></el-table-column>
        <el-table-column prop="sku.originalPrice" label="原价" :align="align"></el-table-column>
        <el-table-column prop="sku.spellPrice" label="拼团价" :align="align"></el-table-column>
        <el-table-column prop="count" label="数量" :align="align"></el-table-column>
        <el-table-column label="总价" :align="align">
          <template slot-scope="scope">
            {{ parseFloat((scope.row.sku.spellPrice * scope.row.count).toFixed(2)) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { GroupOrderGetOrderDetail, GroupOrderUpdateKDReciver } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  name: 'groupon-order-detail',
  mixins: [Filters],
  data() {
    return {
      align: 'center',
      form: {
        customer: {},
        payStatus: {},
        pay: {},
        sendInfo: {
          receiverInfo: {}
        }
      },
      groupOrderProductList: [],
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
        'logisticsInfo.logisticsCompany': [{ required: true, message: '请选择快递公司', trigger: 'change' }],
        'logisticsInfo.logisticsNumber': [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
        'receiverInfo.name': [{ required: true, message: '请输入收件人', trigger: 'blur' }],
        'receiverInfo.phone': [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        'receiverInfo.address': [{ required: true, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function() {
      if (this.$route.query.id) {
        let parmas = {
          _id: this.$route.query.id
        }
        GroupOrderGetOrderDetail(parmas).then(res => {
          this.form = res.data
          if (this.form.logisticsInfo) {
            this.otherInfo.logisticsInfo = JSON.parse(JSON.stringify(this.form.logisticsInfo))
          }
          if (this.form.sendInfo.receiverInfo) {
            this.otherInfo.receiverInfo = JSON.parse(JSON.stringify(this.form.sendInfo.receiverInfo))
          }
          this.groupOrderProductList = res.data.product
        })
      }
    },
    // 提交物流信息
    submitLogistics() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确认提交物流信息吗？', '提示', {}).then(() => {
            let params = {
              receiverInfo: this.otherInfo.receiverInfo,
              logisticsInfo: this.otherInfo.logisticsInfo,
              _id: this.$route.query.id,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
            GroupOrderUpdateKDReciver(params).then(res => {
              if (res.success) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.$router.go(-1)
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  .main {
    .main-l {
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
          .border {
            width: 3px;
            height: 20px;
            background-color: #409eff;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
.main-title {
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 10px;
}
.group-product {
  margin-top: 30px;
}
.good-img {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #f2f6fc;
}
.logistics-box {
  margin: 20px 0;
}
</style>
