<template>
  <div>
    <el-form :model="allotForm" :rules="allotRules">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item prop="companyCid">
            <div class="form-item-title">店名 <span class="border"></span> <span class="EnName">SHOP</span></div>
            <el-select v-model="allotForm.companyCid" placeholder="选择店名">
              <el-option v-for="(item, index) in allotShopList" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="product.barCode">
            <div class="form-item-title">产品型号 <span class="border"></span> <span class="EnName">SKU</span></div>
            <el-select v-model="allotForm.product.barCode" placeholder="选择产品型号" @change="allotSkuChange">
              <el-option v-for="(item, index) in allotSku" :key="index" :value="item.value" :label="item.label" :disabled="item.disabled">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item prop="datetime">
            <div class="form-item-title">生产日期 <span class="border"></span> <span class="EnName">DATE</span></div>
            <!--
              <el-button size="mini" type="warning" @click="handleDateShow(allotForm.product)">日期选择</el-button>
              <span v-if="allotForm.product.datetime" style="margin-left: 5px">{{ allotForm.product.datetime }}</span>
            -->
            <div>
              <span>{{ allotForm.product.datetime || '无日期' }}</span>
              <el-button type="text" @click="handleDateShow(allotForm.product)">修改</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="product.count">
            <div class="form-item-title">数量 <span class="border"></span> <span class="EnName">COUNT</span></div>
            <el-input-number
              controls-position="right"
              class="form-item-input"
              v-model="allotForm.product.count"
              :min="1"
              :max="allotForm.product.dateIndex !== undefined ? batchList[allotForm.product.dateIndex].surplus : allotForm.product.stock"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item> <el-button type="primary" @click="submitAllot">确 定</el-button> </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 日期选择弹框 -->
    <el-dialog title="日期选择" :visible.sync="isDateShow" width="800px" @close="isDateShow = false" :close-on-click-modal="false" append-to-body>
      <div v-loading="batchLoading">
        <el-radio-group v-model="datetime" @input="handleDateChange">
          <el-radio :label="-1" border>无日期</el-radio>
          <el-radio v-for="(item, index) in batchList" :key="index" :label="index" border :disabled="item.surplus === 0">{{ item.productionDate }}(剩余{{ item.surplus }})</el-radio>
        </el-radio-group>
        <el-pagination @current-change="handleBatchCurrentChange" :current-page="bPageIndex" :page-size="bPageSize" layout="total, prev, pager, next" :total="bTotal" background style="text-align: right"> </el-pagination>
      </div>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { AddAllotOrder, AllotGetUserDropDownList, GetBatchListByPage } from '@/api/system'

export default {
  props: {
    allotInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    searchCid: {
      type: String,
      default: ''
    }
  },
  watch: {
    allotInfo(val) {
      if (val) {
        this.getAllotFormData()
      }
    },
    isDateShow(val) {
      if (!val) {
        // this.batchList = []
        this.datetime = ''
        this.bPageIndex = 1
      }
    }
  },
  data() {
    return {
      allotForm: {
        product: {
          uniqueCode: '',
          barCode: '',
          price: 0,
          count: 1,
          stock: 0,
          datetime: '',
          productName: '',
          title: ''
        },
        companyName: '',
        companyCid: '',
        orderStatus: 1
      },
      datetime: '',
      batchList: [],
      batchLoading: false,
      isDateShow: false,
      allotSku: [],
      allotCurrSku: {},
      allotShopList: [],
      allotRules: {
        'product.barCode': [{ required: true, message: '请选择产品型号', trigger: 'change' }],
        // companyCid: [{ required: true, message: '请选择店名', trigger: 'change' }],
        'product.count': [{ required: true, message: '请输入数量', trigger: 'blur' }]
      },
      uniqueCode: '',
      bPageIndex: 1,
      bPageSize: 15,
      bTotal: 0
    }
  },
  mounted() {
    this.getShopList()
    this.getAllotFormData()
  },
  methods: {
    // 处理数据
    getAllotFormData() {
      this.allotSku = this.allotInfo.sku.map(v => {
        return {
          value: v.barCode,
          label: v.title + ' / ' + v.barCode,
          disabled: v.convertCount <= 0 || !v.unitName,
          stock: this.allotInfo.stock,
          price: v.price,
          title: v.title,
          convertCount: v.convertCount
        }
      })
      this.allotForm.product.barCode = this.allotSku.filter(v => v.convertCount <= 0 || !v.unitName)[0].value
      this.allotCurrSku = this.allotSku.filter(v => v.convertCount <= 0 || !v.unitName)[0]
      this.allotForm.product.price = this.allotCurrSku.price
      this.allotForm.product.title = this.allotCurrSku.title
      this.allotForm.product.stock = this.allotInfo.stock
      this.allotForm.product.productName = this.allotInfo.productName
      this.allotForm.product.uniqueCode = this.allotInfo.uniqueCode
    },
    // 调拨型号改变
    allotSkuChange(barCode) {
      let obj = this.allotSku.find(v => {
        return v.value === barCode
      })
      this.allotCurrSku = JSON.parse(JSON.stringify(obj))
      this.allotForm.product.price = this.allotCurrSku.price
      this.allotForm.product.title = this.allotCurrSku.title
    },
    // 提交调拨
    submitAllot() {
      if (!this.allotForm.product.barCode) {
        this.$message({
          type: 'warning',
          message: '请选择产品型号!'
        })
        return false
      }
      if (!this.allotForm.companyCid) {
        this.$message({
          type: 'warning',
          message: '请选择店名!'
        })
        return false
      }
      // if (!this.allotForm.product.datetime) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择生产日期!'
      //   })
      //   return false
      // }
      if (this.allotCurrSku.stock - this.allotForm.product.count * this.allotCurrSku.convertCount < 0) {
        this.$message({
          type: 'warning',
          message: '库存不足!'
        })
        return false
      }
      this.$confirm('确认调拨该产品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ...JSON.parse(JSON.stringify(this.allotForm)),
          product: [this.allotForm.product],
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.searchCid
        }
        AddAllotOrder(params).then(res => {
          if (res.success) {
            this.$emit('closeAllot', false)
            this.$emit('init')
          }
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
        })
      })
    },
    // 获取店名列表
    getShopList() {
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      AllotGetUserDropDownList(params).then(
        res => {
          if (res.success) {
            this.allotShopList = res.data
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    handleDateShow(row) {
      this.isDateShow = true
      this.uniqueCode = row.uniqueCode
      this.getBatchList(row.uniqueCode)
    },
    getBatchList(uniqueCode) {
      let parmas = {
        uniqueCode: uniqueCode,
        pageIndex: this.bPageIndex,
        pageSize: this.bPageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.batchLoading = true
      GetBatchListByPage(parmas)
        .then(res => {
          this.batchLoading = false
          this.batchList = res.data.map(item => {
            return {
              productionDate: item.productionDate.split(' ')[0],
              expirationTime: item.expirationTime.split(' ')[0],
              totalCount: item.totalCount,
              sold: item.sold,
              scrap: item.scrap,
              surplus: item.totalCount - item.sold - item.scrap // 剩余数量
            }
          })
          this.bTotal = res.total
        })
        .catch(() => {
          this.batchLoading = false
        })
    },
    handleDateChange(dateIndex) {
      if (dateIndex === -1) {
        this.allotForm.product.datetime = ''
      } else {
        this.allotForm.product.dateIndex = dateIndex
        this.allotForm.product.datetime = this.batchList[dateIndex].productionDate
        if (this.allotForm.product.count > this.batchList[dateIndex].surplus) {
          this.allotForm.product.count = this.batchList[dateIndex].surplus
        }
      }
      this.isDateShow = false
    },
    // 弹框关闭
    closed() {
      this.allotForm.companyCid = ''
      this.allotForm.product.dateIndex = undefined
      this.allotForm.product.count = 1
      this.allotForm.product.datetime = ''
      // this.allotSku = []
      // this.allotForm = {
      //   product: {
      //     barCode: '',
      //     price: 0,
      //     count: 0,
      //     productName: '',
      //     title: ''
      //   },
      //   companyName: '',
      //   companyCid: '',
      //   orderStatus: 1
      // }
      // this.allotCurrSku = {}
    },
    handleBatchCurrentChange(val) {
      this.bPageIndex = val
      this.getBatchList(this.uniqueCode)
    }
  }
}
</script>

<style lang="scss" scoped>
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
.el-radio.is-bordered,
.el-radio.is-bordered + .el-radio.is-bordered {
  width: 220px;
  margin-left: unset;
  margin-bottom: 15px;
}
</style>
