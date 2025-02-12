<template>
  <div class="order-detail">
    <div class="main">
      <!-- 基本信息 -->
      <div class="main-title">基本信息</div>
      <div style="margin-bottom: 10px;">
        订单状态： <span v-if="form.orderType === 2">{{ form.orderStatus | orderPresentStateFilter }}</span>
        <span v-else>
          <el-select v-model="form.orderStatus">
            <el-option v-for="item in stateList" :key="item.id" :label="item.value" :value="item.id">{{ item.value }}</el-option>
          </el-select>
          <el-button type="primary" @click="stateChange">保存</el-button>
        </span>
      </div>
      <div class="main-l">
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单编号：{{ form.orderId }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>积分类型：{{ form.orderType === 1 ? '实物' : '虚拟商品' }}</div>
          </div>
          <!-- <div class="main-l-l"><div class="border"></div><div>订单积分：{{form.price}}</div></div> -->
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>支付状态：{{ form.payStatus.payState | payStateFilter }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单时间：{{ form.payStatus.time }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 物流信息 -->
    <div class="logistics-box" v-if="form.orderType === 1" style="margin-top:20px;">
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
      <el-button class="logistics-btn" type="primary" @click="submitLogistics">提交物流</el-button>
    </div>
    <!-- 产品列表 -->
    <div class="main-title produce">产品列表</div>
    <el-table class="proTable" :data="this.form.product" border style="width: 100%">
      <el-table-column prop="sku.cardId" label="商品条码/卡券ID" width="280" :align="align"></el-table-column>
      <el-table-column label="商品图片" width="180" :align="align">
        <template slot-scope="scope">
          <div class="good-img" :style="{ backgroundImage: 'url(' + scope.row.sku.img.url + ')' }"></div>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" :align="align"></el-table-column>
      <el-table-column prop="sku.title" sortable label="规格" :align="align"></el-table-column>
      <!-- <el-table-column prop="sku.oriPrice" sortable label="原价" :align="align"></el-table-column> -->
      <el-table-column prop="sku.price" sortable label="价格" :align="align"></el-table-column>
      <el-table-column prop="count" sortable label="数量" :align="align"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { IntegralOrderDetail, IntegralOrderOperation, IntegralOrderUpdateKDReciver } from '@/api/system'
import Filter from '@/components/js/Filters'
export default {
  mixins: [Filter],
  name: 'scrm-order-detail',
  data() {
    return {
      align: 'center',
      form: {
        payStatus: {},
        orderStatus: null,
        receiverInfo: {},
        logisticsInfo: {}
      },
      stateList: [{ id: 1, value: '订单失败' }, { id: 2, value: '卡劵已领取' }, { id: 3, value: '待发货' }, { id: 4, value: '配送中' }, { id: 5, value: '已完成' }],
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
        'logisticsInfo.logisticsCompany': [{ required: true, message: '请选择快递公司', trigger: 'change' }],
        'logisticsInfo.logisticsNumber': [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
        'receiverInfo.name': [{ required: true, message: '请输入收件人', trigger: 'blur' }],
        'receiverInfo.phone': [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        'receiverInfo.address': [{ required: true, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init: function() {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          _id: this.$route.query.id
        }
        IntegralOrderDetail(parmas).then(
          res => {
            if (res.success) {
              this.form = res.data
              if (this.form.logisticsInfo) {
                this.otherInfo.logisticsInfo = JSON.parse(JSON.stringify(this.form.logisticsInfo))
              }
              if (this.form.receiverInfo) {
                this.otherInfo.receiverInfo = JSON.parse(JSON.stringify(this.form.receiverInfo))
              }
              // this.tableData6 = res.data.product
            } else this.$message.err(res.msg)
          },
          err => {
            this.$message.err(err.msg)
          }
        )
      }
    },
    stateChange: function() {
      this.$confirm('是否修改订单状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ...this.form
          }
          IntegralOrderOperation(params).then(
            res => {
              if (res.success) {
                this.$router.push('/intergral-order-list')
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
            IntegralOrderUpdateKDReciver(params).then(
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
  padding-top: 20px;
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
