<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item class="item-long">
            <div class="form-item-title">秒杀商品<span class="border"></span><span class="EnName">GOODSNAME</span></div>
            <el-button type="primary" plain @click="handleProductSelect(true)">{{this.form.selectedGoodsName ? this.form.selectedGoodsName : '点击选择秒杀商品'}}</el-button>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="seckillName" class="item-long">
            <div class="form-item-title">名称<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input placeholder="请输入名称" v-model="form.seckillName"></el-input>
          </el-form-item>
          <el-form-item prop="isLimit" class="item-short">
            <div class="form-item-title">限购<span class="border"></span><span class="EnName">ISLIMIT</span></div>
            <el-switch v-model="form.isLimit" @change="handleIsLimit"></el-switch>
          </el-form-item>
          <el-form-item prop="limitNum" v-show="form.isLimit">
            <div class="form-item-title">限购数量<span class="border"></span><span class="EnName">LIMITNUM</span></div>
            <el-input-number placeholder="限购数量" controls-position="right" v-model="form.limitNum"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="seckillTimeArr" class="item-long">
            <div class="form-item-title">秒杀活动时间<span class="border"></span><span class="EnName">ACTIVITYTIME</span></div>
            <el-date-picker
              v-model="form.seckillTimeArr"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item prop="orderCancel" class="item-long">
            <div class="form-item-title">订单取消（未支付订单，规定时间内自动取消/分钟）<span class="border"></span><span class="EnName">ORDERCANCEL</span></div>
            <el-input-number placeholder="分钟" controls-position="right" v-model="form.orderCancel"></el-input-number>
          </el-form-item> -->
        </div>
        <div class="form-contain-item">
          <el-form-item prop="sumPrice" class="item-middle">
            <div class="form-item-title">总付款金额<span class="border"></span><span class="EnName">SUMPRICE</span></div>
            <el-input-number placeholder="总付款金额" controls-position="right" v-model="form.sumPrice"></el-input-number>
          </el-form-item>
          <el-form-item prop="orderNum" class="item-middle">
            <div class="form-item-title">成功付款的数量<span class="border"></span><span class="EnName">ORDERNUM</span></div>
            <el-input-number placeholder="付款数量" controls-position="right" v-model="form.orderNum"></el-input-number>
          </el-form-item>
          <el-form-item prop="payNum" class="item-middle">
            <div class="form-item-title">成功付款的客户数<span class="border"></span><span class="EnName">PAYNUM</span></div>
            <el-input-number placeholder="付款客户数" controls-position="right" v-model="form.payNum"></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <el-table class="table" ref="tablePrice" :data="form.sku" border>
        <el-table-column align="center" prop="name" label="商品型号" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="originalPrice" label="原价" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="seckillPrice" label="秒杀价" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input-number placeholder="秒杀价" size="mini" controls-position="right" @change="inputChange($event, scope.row, 'seckillPrice')" :min="0" v-model="scope.row.seckillPrice"></el-input-number>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="inventoryNum" label="库存" width="180" show-overflow-tooltip></el-table-column> -->
        <el-table-column align="center" prop="inventoryNum" label="库存" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input-number placeholder="库存" size="mini" controls-position="right" @change="inputChange($event, scope.row, 'inventoryNum')" :min="0" v-model="scope.row.inventoryNum"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="operateDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="formSubmit" :loading="submitLoading" :disabled="disabledSubmit" class="submit-btn">提交</el-button>
    </div>
    <!-- 商品选择器 -->
    <product-select-radio :isShowProductSelect="isShowProductSelect"
                    @handleProductSelect="handleProductSelect"
                    @saveSelected="saveSelected"></product-select-radio>
  </div>
</template>
<script>
import productSelectRadio from '@/components/product-select-radio.vue'
export default {
  components: {
    productSelectRadio
  },
  props: {
    form: Object,
    formDisabled: {
      type: Boolean,
      default: false
    },
    submitLoading: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabledSubmit: {
      type: Boolean,
      default: false
    },
    operateTitle: {
      type: String,
      default: ''
    },
    operateAction: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 是否打开产品选择器
      isShowProductSelect: false,
      isShowProductSelectView: false,
      selectedList: [],
      rules: {
        seckillName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        seckillTimeArr: [
          {type: 'array', required: true, message: '请选择活动时间', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    // 删除sku里面的值
    operateDelete (index) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.sku.splice(index, 1)
      })
    },
    // 开关是否限购
    handleIsLimit(val) {
      if (val) {
        // 限购，清空限购数量
        this.form.limitNum = 0
      }
    },
    // 打开或关闭产品选择器
    handleProductSelect (flag) {
      this.isShowProductSelect = flag
    },
    // 保存选中的商品
    saveSelected(selectRow) {
      this.form.sku = []
      this.form.productId = selectRow._id
      let list = selectRow.sku.map(v => {
        v.seckillPrice = 0
        v.inventoryNum = v.stock
        v.originalPrice = v.price
        v.name = v.title
        return v
      })
      this.form.sku = JSON.parse(JSON.stringify(list))
      this.form.selectedGoodsName = selectRow.productName
    },
    // 秒杀输入框值改变时，限定值不能为空
    inputChange(e, row, txt) {
      this.$nextTick(() => {
        if (e === undefined) {
          row[txt] = 0
        }
      })
    },
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.productId) {
            this.$message({
              message: '请选择秒杀商品',
              type: 'warn'
            })
            return false
          }
          this.$confirm('确认' + this.operateTitle + '吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.form.seckillTimeArr.length > 0) {
              this.form.seckillStartTime = this.form.seckillTimeArr[0]
              this.form.seckillEndTime = this.form.seckillTimeArr[1]
            }
            // this.form.prod = {}
            this.$emit('formSubmit')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .base-info {
    width: 100%;
    .page-contain {
      width: 100%;
      background-color: #ffffff;
      .form-contain {
        .form-contain-item {
          display: flex;
          display: -webkit-flex;
          flex-wrap: wrap;
          .el-form-item {
            margin-left: 20px;
            .el-form-item__content {
              .form-item-title {
                font-weight: bolder;
                font-size: 16px;
                position: relative;
                .border {
                  width: 1px;
                  height: 16px;
                  position: absolute;
                  background-color: #000000;
                  display: inline-block;
                  top: 10px;
                  margin-left: 8px;
                }
                .EnName {
                  font-weight: normal;
                  font-size: 14px;
                  position: absolute;
                  bottom: 0;
                  margin-left: 17px;
                }
              }
            }
          }
          .item-long {
            width: 440px;
          }
          .item-middle {
            width: 210px;
          }
          .item-short {
            width: 100px;
          }
        }
      }
    }
  }
  .submit-btn{
    margin-left: 20px;
  }
  .table {
    width: 800px;
    margin-bottom: 20px;
    margin-left: 20px;
  }
</style>
