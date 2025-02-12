<template>
  <div class="product-container">
    <div class="product">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.barCode" placeholder="请输入产品条码检索" class="filters-search" @keyup.enter.native="getProductByOrderId"></el-input>
            <el-button type="primary" @click="getProductByOrderId">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item> <el-button type="primary" @click="handleProductSelect(true)">添加产品</el-button> </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="filterTableData" border tooltip-effect="dark" v-loading="listLoading" size="small" :row-class-name="handleRowClass">
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="产品条码" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="costPrice" label="供货价" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- (未提交的产品，默认显示总库供货价) || (已提交并且总库有供货的产品总库供货价会显示) -->
              <div>供货价：{{ scope.row.costPrice }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalCount" label="供货数量" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.totalCount"
                @change="calculateMoney"
                size="mini"
                :min="0"
                :disabled="scope.row.isDeleted || ($route.query.operate !== 'add' && purchaseForm.status !== 1 && purchaseForm.status !== 3 && purchaseForm.status !== 4)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="getwState" label="入库状态" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.getwState" style="color: #13CE66;">已入库</div>
              <div v-else style="color: #909399;">未入库</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="fpStatues" label="分配状态" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.fpStatues" style="color: #13CE66;">已分配</div>
              <div v-else style="color: #909399;">未分配</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="200" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)" :disabled="scope.row.isDeleted">查看</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)" :disabled="scope.row.isDeleted">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 采购单相关信息 -->
      <div>
        <div class="order-info">
          <span class="order-info-item" v-if="purchaseForm.oddNumbers">采购单号：{{ purchaseForm.oddNumbers }}</span> <span class="order-info-item">下单用户：{{ purchaseForm.orderName }}</span>
          <span class="order-info-item"
            >供货总数量：<span class="money">{{ purchaseForm.ordercount }}</span></span
          >
          <span class="order-info-item"
            >总金额：<span class="money">{{ purchaseForm.ordermony }}元</span></span
          >
        </div>
        <el-form ref="form" label-width="80px" label-position="top" class="form-contain">
          <div class="form-contain-item">
            <el-form-item prop="purchaseWay" class="item-long">
              <div class="form-item-title">采购方式<span class="border"></span><span class="EnName">ORDERTYPE</span></div>
              <el-radio-group v-model="purchaseForm.purchaseWay" size="medium" :disabled="$route.query.id">
                <el-radio :label="1" border>订货</el-radio>
                <el-radio :label="2" border>到货</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="form-contain-item">
            <el-form-item prop="remark" class="item-long">
              <div class="form-item-title">备注<span class="border"></span><span class="EnName">REMARK</span></div>
              <el-input type="textarea" :rows="2" v-model="purchaseForm.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-button type="primary" :loading="submitLoading" @click="submit" :disabled="purchaseForm.synchro">提交</el-button>
      <!-- form -->
      <el-dialog :visible.sync="formV" width="1000px" @closed="closed" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <div>
            <el-form-item label="产品条形码" prop="barCode"> <el-input v-model="form.barCode"></el-input> </el-form-item>
            <el-form-item style="float: right;">
              <img style="max-width: 150px; max-height: 150px;" v-if="form.image && form.image.url" :src="form.image.url" /> <img style="max-width: 150px; max-height: 150px;" v-else :src="noImage" />
            </el-form-item>
          </div>
          <el-form-item label="产品名称" prop="productName"> <el-input v-model="form.productName" disabled></el-input> </el-form-item>
          <el-form-item label="总库供货价" prop="costPrice"> <el-input-number controls-position="right" v-model="form.costPrice" disabled></el-input-number> </el-form-item>
          <el-form-item label="总供货数量" prop="totalCount"> <el-input-number controls-position="right" v-model="form.totalCount" placeholder="总供货数量" disabled></el-input-number> </el-form-item>
          <!-- 只有V6向V8下的采购单可能会填写 -->
          <el-form-item label="总库供货数量" prop="myDetil.count"> <el-input-number controls-position="right" v-model="form.myDetil.count" placeholder="总库供货数量"></el-input-number> </el-form-item>
        </el-form>
        <el-table class="table-supplier" ref="tableSupplier" :data="form.productDetil.supid ? [form.productDetil] : []" border>
          <el-table-column align="center" prop="supName" label="供应商" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ '云极云仓' + (scope.row.code || '') }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="costPrice" label="供货价" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="count" label="供货数量" width="180" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <!-- 商品选择器 -->
    <v8-product-select :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></v8-product-select>
  </div>
</template>

<script type="text/ecmascript-6">
import v8ProductSelect from '@/components/v8-product-select.vue'
import {createPurchaseOrder, getGoodsForV6ByOrderNum} from '@/api/systemForV8'
export default {
  name: 'supply-purchase-detail',
  components: {
    v8ProductSelect
  },
  watch: {
    list: {
      handler(newVal, oldVal) {
        this.calculateMoney()
      },
      deep: true
    }
  },
  computed: {
    filterTableData() {
      return this.list.filter(v => !v.hidden)
    }
  },
  mounted() {
    this.getOrderDetail()
  },
  data () {
    return {
      noImage: require('@/assets/image/no-image.jpg'),
      // 采购单主体信息
      purchaseForm: {
        oddNumbers: '',
        orderName: this.$store.state.UserName,
        purchaseWay: 1,
        remark: '',
        goodsList: [],
        ordercount: 0,
        ordermony: 0
      },
      // 是否打开产品选择器
      isShowProductSelect: false,
      // 查询条件
      search: {
        barCode: ''
      },
      formDisabled: false,
      formV: false,
      form: {
        myDetil: {},
        productDetil: {}
      },
      submitLoading: false,
      formRules: {
        barCode: [
          {required: true, message: '请输入条形码', trigger: 'blur'}
        ],
        productName: [
          {required: true, message: '产品信息不能为空', trigger: 'change'}
        ]
      },
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      operateTitle: '',
      // 多选删除的数据列表
      checkedDatas: [],
      // 初始化的订单总金额
      oldOrderMoney: 0,
      commonParam: {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
    }
  },
  methods: {
    // 计算总金额
    calculateMoney () {
      this.purchaseForm.ordermony = parseFloat(this.list.reduce((preTotal, item) => {
        return item.isDeleted ? preTotal : preTotal + item.costPrice * item.totalCount
      }, 0).toFixed(2))
      this.purchaseForm.ordercount = parseFloat(this.list.reduce((preTotal, item) => {
        return preTotal + parseFloat(item.totalCount)
      }, 0).toFixed(2))
    },
    // 提交采购单
    submit () {
      if (this.list.length <= 0) {
        this.$message({
          message: '产品列表不能为空',
          type: 'warning'
        })
        return false
      }
      this.$confirm('确认提交采购单吗？', '提示', {}).then(() => {
        let param = {
          orderInfo: {
            orderName: this.purchaseForm.orderName,
            ordermony: this.purchaseForm.ordermony,
            oddNumbers: this.$route.query.oddNumbers || '',
            remark: this.purchaseForm.remark,
            purchaseWay: this.purchaseForm.purchaseWay,
            whCid: this.purchaseForm.whCid ? this.purchaseForm.whCid : this.$route.query.whCid,
            ...this.commonParam
          },
          orderProductInfo: this.list.map(item => {
            return {
              barCode: item.barCode,
              productName: item.productName,
              costPrice: item.costPrice,
              totalCount: item.totalCount,
              uniqueCode: item.uniqueCode,
              ...this.commonParam
            }
          })
        }
        this.submitLoading = true
        createPurchaseOrder(param).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.submitLoading = false
          if (res.success) this.$router.back(-1)
        }).catch(() => {
          this.submitLoading = false
        })
      }).catch(() => {})
    },
    // 打开或关闭产品选择器
    handleProductSelect (flag) {
      this.isShowProductSelect = flag
    },
    // 保存选中数据
    saveSelected (newSelectedList) {
      let selectList = JSON.parse(JSON.stringify(newSelectedList))
      let norepeatSelect = selectList.filter(item => {
        return this.list.every(v => v.barCode !== item.barCode)
      })
      if (selectList.length !== norepeatSelect.length) {
        this.$message.warning('重复添加商品请直接修改数量')
      }
      this.list.push(...norepeatSelect)
      this.handleProductSelect(false)
    },
    // 关闭form
    closed () {
      this.formV = false
      this.formDisabled = false
      this.form = {
        myDetil: {}
      }
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 增删改查
    operateFunc (row, title, action) {
      if (!row.myDetil) row.myDetil = {}
      this.operateTitle = title
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          break
        case '编辑': // 编辑
          this.form = JSON.parse(JSON.stringify(row))
          this.formV = true
          break
        case '删除': // 删除
          if (this.list.some(v => v.barCode === row.barCode)) {
            // 当前数据暂未提交
            this.$confirm('确认删除吗？', '提示', {}).then(() => {
              this.list.splice(this.list.findIndex(v => v.barCode === row.barCode), 1)
            })
          }
          break
        case '查看': // 查看
          this.formDisabled = true
          this.formV = true
          this.form = JSON.parse(JSON.stringify(row))
          break
        default:
          return false
      }
    },
    // 加载数据
    async getProductByOrderId () {
      this.list.forEach(item => {
        if (item.barCode.lastIndexOf(this.search.barCode) >= 0) {
          if (item.hidden) {
            item.hidden = false
          }
        } else {
          if (item.hidden !== undefined) {
            item.hidden = true
          } else {
            this.$set(item, 'hidden', true)
          }
        }
      })
    },
    // 获取采购单详情
    async getOrderDetail () {
      if (this.$route.query.oddNumbers) {
        let parmas = {
          oddNumbers: this.$route.query.oddNumbers,
          ...this.commonParam
        }
        await getGoodsForV6ByOrderNum(parmas).then(res => {
            if (res.success) {
              this.list = res.data.orderProductInfo
              this.purchaseForm = res.data.orderInfo
            } else {
              this.$message.error(res.msg)
            }
        }, err => {
          this.$message.error(err.msg)
        })
      }
    },
    handleRowClass({row}) {
      return row.isDeleted ? 'disabled' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
.form-contain {
  margin-top: 20px;
  .form-contain-item {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    .el-form-item {
      margin-right: 20px;
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
  }
}
.list-table {
  color: #666666;
  padding: 20px 0;
  .table-main {
    text-align: center;
    margin-bottom: 15px;
  }
}
.form {
  .item-long {
    width: 492px;
  }
  .el-input-number {
    width: 202px;
  }
}
.order-info {
  .order-info-item {
    margin-right: 25px;
  }
  .money {
    color: #f56c6c;
  }
}
</style>
