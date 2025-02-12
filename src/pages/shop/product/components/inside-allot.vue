<template>
  <div>
    <el-form :model="allotForm">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="companyCid">
            <div class="form-item-title">调出产品类型</div>
            <el-select v-model="allotForm.oldProductType" placeholder="请选择调出产品类型">
              <el-option v-for="(item, index) in allotOutType" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="nowProductType">
            <div class="form-item-title">调入产品类型</div>
            <el-select v-model="allotForm.nowProductType" placeholder="请选择调入产品类型">
              <el-option v-for="(item, index) in allotInType" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="productName">
            <div class="form-item-title">产品名称</div>
            <el-input type="text" v-model="allotForm.productName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="barCode">
            <div class="form-item-title">产品型号</div>
            <el-select v-model="allotForm.barCode" placeholder="选择产品型号" @change="allotSkuChange">
              <el-option v-for="(item, index) in allotSku" :key="index" :value="item.value" :label="item.label" :disabled="item.disabled">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="datetime">
            <div class="form-item-title">生产日期</div>
            <div>
              <span style="margin-left: 5px">{{ allotForm.datetime || '无日期' }}</span>
              <el-button type="text" @click="handleDateShow(allotForm)">修改</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="unitCount">
            <div class="form-item-title">调拨数量(sku单位为准)</div>
            <el-input-number controls-position="right" class="form-item-input" v-model="allotForm.unitCount" :min="0" :max="allotForm.dateIndex !== undefined ? batchList[allotForm.dateIndex].surplus : allotForm.stock"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="unitCount">
            <div class="form-item-title">调拨数量(最小单位为准)</div>
            <el-input-number controls-position="right" class="form-item-input" v-model="smallUnitCount" :min="0" disabled></el-input-number>
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
import { insideAllotOrder, GetBatchListByPage } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
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
  computed: {
    smallUnitCount: {
      get() {
        return parseFloat((this.allotForm.unitCount * this.allotForm.convertCount).toFixed(2))
      },
      set(v) {
        this.allotForm.smallUnitCount = v
      }
    }
  },
  data() {
    return {
      allotOutType: [{ value: 1, label: '标准产品' }, { value: 2, label: '散称产品' }, { value: 4, label: '原料产品' }],
      allotInType: [{ value: 2, label: '散称产品' }, { value: 4, label: '原料产品' }],
      allotForm: {
        oldProductType: 1,
        nowProductType: 4,
        uniqueCode: '',
        barCode: '',
        productName: '',
        categoryId: '',
        stock: 0,
        unitName: '',
        unitCount: 0,
        convertCount: 1,
        smallUnitName: '',
        smallUnitCount: 0,
        datetime: ''
      },
      datetime: '',
      batchList: [],
      batchLoading: false,
      isDateShow: false,
      allotSku: [],
      allotCurrSku: {},
      allotRules: {
        barCode: [{ required: true, message: '请选择产品型号', trigger: 'change' }],
        unitCount: [{ required: true, message: '请输入数量', trigger: 'blur' }]
      },
      uniqueCode: '',
      bPageIndex: 1,
      bPageSize: 15,
      bTotal: 0
    }
  },
  mounted() {
    this.getAllotFormData()
  },
  methods: {
    // 数据处理
    getAllotFormData() {
      let { uniqueCode, sku, productName, categoryId, unitName, stock } = this.allotInfo
      this.allotSku = sku.map(v => {
        return {
          value: v.barCode,
          label: `${v.title}(${v.convertCount}${unitName})/${v.barCode}`,
          stock: this.allotInfo.stock,
          disabled: v.convertCount <= 0 || !v.unitName,
          price: v.price,
          title: v.title,
          convertCount: v.convertCount
        }
      })
      this.allotCurrSku = this.allotSku.filter(v => !v.disabled)[0]
      this.allotForm.barCode = this.allotSku.filter(v => !v.disabled)[0].value
      this.allotForm.unitName = this.allotSku.filter(v => !v.disabled)[0].title
      this.allotForm.convertCount = this.allotSku.filter(v => !v.disabled)[0].convertCount
      this.allotForm.uniqueCode = uniqueCode
      this.allotForm.productName = productName
      this.allotForm.categoryId = categoryId
      this.allotForm.smallUnitName = unitName
      this.allotForm.stock = stock
    },
    // sku选择改变
    allotSkuChange(val) {
      let obj = this.allotSku.find(v => {
        return v.value === val
      })
      this.allotCurrSku = JSON.parse(JSON.stringify(obj))
      this.allotForm.unitName = this.allotCurrSku.title
      this.allotForm.convertCount = this.allotCurrSku.convertCount
    },
    // 提交调拨单
    submitAllot() {
      if (!this.allotForm.barCode) {
        this.$message({
          type: 'warning',
          message: '请选择产品型号!'
        })
        return false
      }
      if (!this.allotForm.unitCount) {
        this.$message({
          type: 'warning',
          message: '请输入调拨数量!'
        })
        return false
      }
      // if (!this.allotForm.datetime) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择生产日期!'
      //   })
      //   return false
      // }
      if (this.allotCurrSku.stock - this.allotForm.unitCount * this.allotForm.convertCount < 0) {
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
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.searchCid
        }
        // console.log(params)
        insideAllotOrder(params).then(res => {
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
        this.allotForm.datetime = ''
      } else {
        this.allotForm.dateIndex = dateIndex
        this.allotForm.datetime = this.batchList[dateIndex].productionDate
        if (this.allotForm.unitCount > this.batchList[dateIndex].surplus) {
          this.allotForm.unitCount = this.batchList[dateIndex].surplus
        }
      }
      this.isDateShow = false
    },
    // 弹框关闭
    closed() {
      this.allotForm.dateIndex = undefined
      this.allotForm.unitCount = 0
      this.allotForm.datetime = ''
      // this.allotSku = []
      // this.allotForm = {
      //   oldProductType: 1,
      //   nowProductType: 2,
      //   uniqueCode: '',
      //   barCode: '',
      //   productName: '',
      //   categoryId: '',
      //   unitName: '',
      //   unitCount: 0,
      //   convertCount: 1,
      //   smallUnitName: '',
      //   smallUnitCount: 0,
      //   datetime: ''
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
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 200px;
}
.el-radio.is-bordered,
.el-radio.is-bordered + .el-radio.is-bordered {
  width: 220px;
  margin-left: unset;
  margin-bottom: 15px;
}
</style>
