<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <div v-loading="detailLoading">
      <div class="main-l">
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单编号：{{ orderDetail.orderId }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>购买人：{{ orderDetail.customer.userName }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>购买人电话：{{ orderDetail.customer.phone }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>支付方式：{{ orderDetail.pay.payType | payTypeStateFilter }}</div>
          </div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>订单原价：{{ orderDetail.pay.oriTotal }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>实付金额：{{ orderDetail.pay.buyTotal }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>
              支付状态：{{
                orderDetail.payStatus === null
                  ? ''
                  : orderDetail.payStatus.payState === 'ok'
                  ? '支付成功'
                  : orderDetail.payStatus.payState === 'cancel'
                  ? '取消支付'
                  : orderDetail.payStatus.payState === 'prepay'
                  ? '待支付'
                  : orderDetail.payStatus.payState === 'fail'
                  ? '支付失败'
                  : '错误订单'
              }}
            </div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>创建时间：{{ orderDetail.payStatus.time }}</div>
          </div>
        </div>
        <div class="main-l-row">
          <div class="main-l-l">
            <div class="border"></div>
            <div>优惠方式：{{ orderDetail.pay.discountType | formatDisCountFilter }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>优惠价：{{ orderDetail.pay.discountAmount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>会员优惠金额：{{ orderDetail.pay.memberDiscount }}</div>
          </div>
          <div class="main-l-l">
            <div class="border"></div>
            <div>卡券优惠金额：{{ orderDetail.pay.cardDiscountAmount }}</div>
          </div>
        </div>
        <div class="main-l-row">
          <!--
            <div class="main-l-l">
              <div class="border"></div>
              <div>运费：{{ orderDetail.pay.fee }}</div>
            </div>
          -->
          <div class="main-l-l">
            <div class="border"></div>
            <div>用户备注：{{ orderDetail.customerRemark || '--' }}</div>
          </div>
        </div>
      </div>

      <div class="main-title" v-show="productList.length !== 0">普通产品</div>
      <el-table class="proTable" :data="productList" border v-show="productList.length !== 0" :summary-method="getCommonSummaries" show-summary>
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
      <div class="main-title" v-show="this.promotionList.length !== 0">促销产品</div>
      <el-table class="proTable" :data="promotionList" border v-show="this.promotionList.length !== 0" :summary-method="getPromotionSummaries" show-summary>
        <el-table-column type="expand" width="60">
          <template slot-scope="props">
            <el-table :data="props.row.aProduct" style="width: 770px;">
              <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
              <el-table-column prop="barCode" label="商品条码" width="220" align="center"></el-table-column>
              <el-table-column prop="price" label="商品原价" width="150" align="center"></el-table-column>
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
      <div class="main-title" v-show="batchProductList.length !== 0">临期产品</div>
      <el-table :data="batchProductList" border v-show="this.batchProductList.length !== 0">
        <el-table-column prop="batchBarCode" label="临期码" width="180" :align="align"></el-table-column>
        <el-table-column label="商品图片" width="180" :align="align">
          <template slot-scope="scope">
            <div class="good-img" :style="{ backgroundImage: 'url(' + scope.row.skuImg + ')' }"></div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" :align="align" min-width="100"></el-table-column>
        <el-table-column prop="price" sortable label="原价" :align="align"></el-table-column>
        <el-table-column prop="batchPrice" sortable label="临期价" :align="align"></el-table-column>
        <el-table-column prop="count" sortable label="数量" :align="align"></el-table-column>
        <el-table-column sortable label="总价" :align="align">
          <template slot-scope="scope">{{ Math.round(scope.row.batchPrice * scope.row.count * 100) / 100 }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getAllOrderDetail } from '@/api/system'
import Filters from '@/components/js/Filters'
import { toDecimal } from '@/filters/filters'

export default {
  mixins: [Filters],
  data() {
    return {
      orderDetail: {
        customer: {},
        payStatus: {},
        pay: {},
        sendInfo: {}
      },
      productList: [],
      promotionList: [],
      batchProductList: [],
      detailLoading: false,
      align: 'center'
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getAllOrderDetail()
    }
  },
  methods: {
    getAllOrderDetail() {
      let params = {
        _id: this.$route.query.id
      }
      this.detailLoading = true
      getAllOrderDetail(params)
        .then(res => {
          this.detailLoading = false
          this.orderDetail = res.data
          this.productList = res.data.product
          this.promotionList = res.data.promotion
          this.batchProductList = res.data.batchProduct
            ? res.data.batchProduct.map(item => {
                return {
                  ...item,
                  skuImg: item.skuImg ? item.skuImg.url : ''
                }
              })
            : []
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
.main-title {
  font-weight: bolder;
  font-size: 18px;
  margin: 15px 0 10px 0;
}
</style>
