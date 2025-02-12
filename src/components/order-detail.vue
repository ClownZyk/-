<template>
  <div class="order-detail">
    <div class="main">
      <div class="main-title">基本信息</div>

      <div style="margin-bottom: 10px;">
        订单状态：
        <span v-if="form.orderStatus === 8 && form.sendInfo.sendTyppe === 3">
          <el-select v-model="form.orderStatus" style="margin-left: 10px;">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">{{ item.label }}</el-option>
          </el-select>
          <el-button type="primary" @click="stateChange" :disabled="form.orderStatus !== 8">保存</el-button>
        </span>
        <span v-else>{{ form.orderStatus | orderTypeStateFilter }}</span>
      </div>

      <div class="main-l">
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单编号：{{ form.orderId }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>预订人：{{ form.customer.userName }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>预订人电话：{{ form.customer.phone }}</div>
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
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单来源：{{ form.source }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>支付方式：{{ form.pay.payType | payTypeStateFilter }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>打包完成时间：{{ form.payStatus.time }}</div>
          </div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单原价：{{ form.pay.oriTotal }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>优惠方式：{{ form.pay.discountType | formatDisCountFilter }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>优惠价：{{ form.pay.discountAmount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>会员优惠金额：{{ form.pay.memberDiscount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>卡券优惠金额：{{ form.pay.cardDiscountAmount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单实付金额：{{ form.pay.buyTotal }}</div>
          </div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>运费：{{ form.pay.fee }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>用户备注：{{ form.customerRemark }}</div>
          </div>
        </div>
      </div>

      <div class="logistics-box" v-show="form.sendInfo && form.source !== '在店购买'" style="margin-top:20px;">
        <div class="main-title">物流信息</div>
        <el-form :model="otherInfo" label-width="80px" :rules="formRules" ref="form" class="logistics-form" :inline="true">
          <div>
            <el-form-item label="快递公司" prop="logisticsInfo.logisticsCompany">
              <el-select v-model="otherInfo.logisticsInfo.logisticsCompany" clearable> <el-option v-for="(item, index) in logisticsList" :key="index" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="快递单号" prop="logisticsInfo.logisticsNumber"> <el-input v-model="otherInfo.logisticsInfo.logisticsNumber" style="width:350px;"></el-input> </el-form-item>
          </div>
          <div>
            <el-form-item label="收件人" prop="receiverInfo.name"> <el-input v-model="otherInfo.receiverInfo.name"></el-input> </el-form-item>
            <el-form-item label="手机号" prop="receiverInfo.phone"> <el-input v-model="otherInfo.receiverInfo.phone"></el-input> </el-form-item>
            <el-form-item label="收件地址" prop="receiverInfo.address"> <el-input v-model="otherInfo.receiverInfo.address" style="width:350px;"></el-input> </el-form-item>
          </div>
        </el-form>
        <el-button class="logistics-btn" type="primary" @click="submitLogistics" :disabled="form.orderStatus !== 8">提交物流</el-button>
      </div>
    </div>
    <div class="main-title produce" v-show="tableData6.length !== 0">普通产品</div>
    <el-table class="proTable" :data="tableData6" border style="width: 100%" v-show="tableData6.length !== 0" :summary-method="getCommonSummaries" show-summary>
      <el-table-column prop="sku.barCode" label="商品条码" width="180" :align="align"></el-table-column>
      <el-table-column label="商品图片" width="180" :align="align">
        <template slot-scope="scope">
          <div class="good-img" v-if="scope.row.sku.skuImg" :style="{ backgroundImage: 'url(' + scope.row.sku.skuImg.url + ')' }"></div>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" :align="align" min-width="100"></el-table-column>
      <el-table-column prop="sku.name" label="商品规格" :align="align" min-width="100"></el-table-column>
      <el-table-column prop="sku.nowPrice" sortable label="商品价格" :align="align"></el-table-column>
      <el-table-column prop="price" sortable label="商品实付价格" :align="align"></el-table-column>
      <el-table-column prop="sku.count" sortable label="数量" :align="align"></el-table-column>
      <el-table-column sortable label="实付总价" :align="align">
        <template slot-scope="scope">{{ Math.round(scope.row.price * scope.row.sku.count * 100) / 100 }}</template>
      </el-table-column>
    </el-table>
    <div class="main-title produce" v-show="this.promotion && this.promotion.length !== 0">促销产品</div>
    <el-table class="proTable" :data="promotion" border style="width: 100%" v-show="this.promotion && this.promotion.length !== 0" :summary-method="getPromotionSummaries" show-summary>
      <el-table-column type="expand" width="60">
        <template slot-scope="props">
          <el-table :data="props.row.aProduct" style="width: 770px;">
            <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
            <el-table-column prop="barCode" label="商品条码" width="220" align="center"></el-table-column>
            <el-table-column prop="price" label="商品原价" width="150" align="center"></el-table-column>
            <!-- <el-table-column prop="memberPrice" label="商品会员价" width="150" align="center"> </el-table-column> -->
            <el-table-column prop="count" label="商品数量" width="100" align="center"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="sku.barCode" label="促销类型" width="180" :align="align">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 1">单品</div>
          <div v-if="scope.row.type === 2">组合</div>
          <div v-if="scope.row.type === 3">选购组合</div>
        </template>
      </el-table-column>
      <el-table-column prop="pName" label="商品名称" :align="align" min-width="150"></el-table-column>
      <el-table-column prop="retailPrice" label="应付总价" :align="align" min-width="100"></el-table-column>
      <el-table-column prop="actualPrice" sortable label="实付总价" :align="align" min-width="100"></el-table-column>
      <el-table-column prop="discountPrice" sortable label="优惠总价" :align="align"></el-table-column>
      <el-table-column prop="buyCount" sortable label="数量" :align="align"></el-table-column>
    </el-table>
    <!-- 临期产品 -->
    <div class="main-title produce" v-show="batchList.length !== 0">临期产品</div>
    <el-table class="proTable" :data="batchList" border style="width: 100%" v-show="batchList.length !== 0">
      <el-table-column prop="batchBarCode" label="临期码" width="180" :align="align"></el-table-column>
      <el-table-column label="商品图片" width="180" :align="align">
        <template slot-scope="scope">
          <div class="good-img" :style="{ backgroundImage: 'url(' + scope.row.skuImg + ')' }"></div>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" :align="align" min-width="100"></el-table-column>
      <!-- <el-table-column prop="sku.name" label="商品规格" :align="align" min-width="100"></el-table-column> -->
      <el-table-column prop="price" sortable label="原价" :align="align"></el-table-column>
      <el-table-column prop="batchPrice" sortable label="临期价" :align="align"></el-table-column>
      <el-table-column prop="count" sortable label="数量" :align="align"></el-table-column>
      <el-table-column sortable label="总价" :align="align">
        <template slot-scope="scope">{{ Math.round(scope.row.batchPrice * scope.row.count * 100) / 100 }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetOrderDetail, VShopOrderUpdateKDReciver, VShopUpdateOrderStatus } from '@/api/system'
import Filters from '@/components/js/Filters'
import { toDecimal } from '@/filters/filters'

export default {
  mixins: [Filters],
  name: 'scrm-order-detail',
  data() {
    return {
      align: 'center',
      form: {
        customer: {},
        payStatus: {},
        pay: {},
        sendInfo: {}
      },
      stateList: [{ value: 8, label: '待接单' }, { value: 11, label: '待取货' }],
      tableData6: [],
      promotion: [],
      batchList: [],
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
  methods: {
    getCommonSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 6) {
          let count = 0
          data.forEach(item => {
            count += item.sku.count
          })
          sums[index] = count
        } else if (index === 7) {
          let total = 0
          data.forEach(item => {
            total += item.sku.count * item.price
          })
          sums[index] = toDecimal(total)
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },

    getPromotionSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 6) {
          let count = 0
          data.forEach(item => {
            item.aProduct.forEach(v => {
              count += item.type === 1 ? v.count * item.buyCount : v.count
            })
          })
          sums[index] = count
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },
    init() {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          _id: this.$route.query.id
        }
        GetOrderDetail(parmas).then(
          res => {
            if (res.success) {
              this.form = res.data
              if (this.form.logisticsInfo) {
                this.otherInfo.logisticsInfo = JSON.parse(JSON.stringify(this.form.logisticsInfo))
              }
              if (this.form.sendInfo && this.form.sendInfo.receiverInfo) {
                this.otherInfo.receiverInfo = JSON.parse(JSON.stringify(this.form.sendInfo.receiverInfo))
              }
              this.tableData6 = res.data.product
              this.promotion = res.data.promotion
              this.batchList = res.data.batchProduct
                ? res.data.batchProduct.map(item => {
                    return {
                      ...item,
                      skuImg: item.skuImg ? item.skuImg.url : ''
                    }
                  })
                : []
            } else this.$message.err(res.msg)
          },
          err => {
            this.$message.err(err.msg)
          }
        )
      }
    },
    stateChange() {
      this.$confirm('是否修改订单状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            _id: this.form._id,
            orderStatus: this.form.orderStatus
          }
          VShopUpdateOrderStatus(params).then(
            res => {
              if (res.success) {
                this.$router.go(-1)
              } else this.$message.error(res.msg)
            },
            err => {
              this.$message.error(err.msg)
            }
          )
        })
        .catch(() => {})
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
              roleid: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
            VShopOrderUpdateKDReciver(params).then(
              res => {
                if (res.success) {
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  })
                  this.$router.go(-1)
                } else this.$message.error(res.msg)
              },
              err => {
                this.$message.error(err.msg)
              }
            )
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
.order-detail {
  width: 100%;
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
.produce {
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
</style>
