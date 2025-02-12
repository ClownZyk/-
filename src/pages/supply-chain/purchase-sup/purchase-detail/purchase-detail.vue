<template>
  <div class="product-container">
    <div class="product">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.barCode" placeholder="请输入产品条码检索" class="filters-search" @keyup.enter.native="getProductByOrderId"></el-input>
            <el-button type="primary" @click="getProductByOrderId">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="$route.query.orderType !== 1">
          <el-button type="primary" @click="operateFunc('', '添加', 0)" :disabled="$route.query.orderStatus === 2">新增</el-button>
          <!-- <el-button type="primary" @click="importExcel">Excel导入产品</el-button> -->
          <el-button type="danger" @click="operateDeleteMany" :disabled="$route.query.orderStatus === 2">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 采购单相关信息 -->
      <!-- <el-form ref="form" label-width="80px" label-position="top"  class="form-contain">
        <div class="form-contain-item">
          <el-form-item prop="oddNumbers" class="item-middle" v-if="purchaseForm.oddNumbers">
            <div class="form-item-title">采购单号<span class="border"></span><span class="EnName">PURCHASENUM</span></div>
            <el-input placeholder="采购单号" v-model="purchaseForm.oddNumbers" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="orderName" class="item-middle">
            <div class="form-item-title">下单用户<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input placeholder="下单用户" v-model="purchaseForm.orderName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="orderName" class="item-middle">
            <div class="form-item-title">总金额<span class="border"></span><span class="EnName">TOTALMONEY</span></div>
            <el-input placeholder="总金额" v-model="purchaseForm.ordermony" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="remark" class="item-long">
            <div class="form-item-title">备注<span class="border"></span><span class="EnName">REMARK</span></div>
            <el-input type="textarea" :rows="2" v-model="purchaseForm.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
      </el-form> -->
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="image.url" label="产品图" min-width="120">
            <template slot-scope="scope">
              <img style="max-width: 100%; max-height: 60px;" v-if="scope.row.image && scope.row.image.url" :src="scope.row.image.url">
              <img style="max-width: 100%; max-height: 60px;" v-else :src="noImage">
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="产品条码" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="costPrice" label="供货价" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.productDetil" :key="index">
                <div v-if="item.count > 0">{{item.supName}}:{{item.costPrice}}元</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalCount" label="供货数量" width="100" show-overflow-tooltip></el-table-column>
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
          <el-table-column align="center" prop="supName" label="供应商" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              {{getSupNameStr(scope.row.productDetil)}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="200" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button> -->
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">供货分配</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)" v-if="$route.query.orderType !== 1" :disabled="$route.query.orderStatus === 2">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :page-sizes="[10, 15, 20, 25]"
                        :total="total"
                        layout="total, sizes, prev, pager, next"
                        background
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
      <!-- 采购单相关信息 -->
      <div>
        <div class="order-info">
          <span class="order-info-item" v-if="purchaseForm.oddNumbers">采购单号：{{purchaseForm.oddNumbers}}</span>
          <span class="order-info-item">下单用户：{{purchaseForm.orderName}}</span>
          <span class="order-info-item">总金额：<span class="money">{{purchaseForm.ordermony}}元</span></span>
        </div>
        <!-- <el-form ref="form" label-width="80px" label-position="top"  class="form-contain">
          <div class="form-contain-item">
            <el-form-item prop="remark" class="item-long">
              <div class="form-item-title">备注<span class="border"></span><span class="EnName">REMARK</span></div>
              <el-input type="textarea" :rows="2" v-model="purchaseForm.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
          </div>
        </el-form> -->
      </div>
     <!-- form -->
      <el-dialog :visible.sync="formV" width="1000px" @closed="closed">
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <div>
            <el-form-item label="产品条形码" prop="barCode">
              <el-input v-model="form.barCode"></el-input>
            </el-form-item>
            <el-button type="primary" @click="checkProduct">检测</el-button>
            <el-form-item style="float: right;">
              <img style="max-width: 150px; max-height: 150px;" v-if="form.image && form.image.url" :src="form.image.url">
              <img style="max-width: 150px; max-height: 150px;" v-else :src="noImage">
            </el-form-item>
          </div>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="总库供货价" prop="costPrice">
            <el-input-number controls-position="right" v-model="form.costPrice" disabled></el-input-number>
          </el-form-item> -->
          <el-form-item label="总供货数量" prop="totalCount">
            <el-input-number controls-position="right" v-model="form.totalCount" placeholder="总供货数量" disabled></el-input-number>
          </el-form-item>
          <el-form-item label="现有库存" prop="zkstock">
            <el-input-number controls-position="right" v-model="form.zkstock" placeholder="现有库存" disabled></el-input-number>
          </el-form-item>
          <!-- 只有V6向V8下的采购单可能会填写 -->
          <div v-if="$route.query.orderType === 1">
            <!-- <div>总库供应信息：</div> -->
            <el-form-item label="总库供货数量" prop="myDetil.count">
              <el-input-number controls-position="right" v-model="form.myDetil.count" placeholder="总供货数量"></el-input-number>
            </el-form-item>
          </div>
        </el-form>
        <el-table class="table-supplier" ref="tableSupplier" :data="form.productDetil" border>
          <el-table-column align="center" prop="supName" label="供应商" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="costPrice" label="供货价" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="count" label="供货数量" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input-number v-if="$route.query.orderType === 1" placeholder="供货数量" size="mini" v-model="scope.row.count"></el-input-number>
              <el-input-number v-else placeholder="供货数量" size="mini" v-model="scope.row.count" @blur="computeTotalCount"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading" :disabled="formDisabled || $route.query.orderStatus === 2 || form.getwState">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  SupplierGoodsGetListByPage,
  SupplierGoodsOperation,
  SupplierGoodsGetSupplierInfo,
  ShopGetListByPage,
  // UpdateGoodsFromV6,
  SupplierOrderGetDetailById,
  SupplierGoodsCreateOrder
} from '@/api/system'
export default {
  name: 'supply-purchase-sup-detail',
  watch: {
    list: {
      handler(newVal, oldVal) {
        this.calculateMoney()
      },
      deep: true
    }
  },
  data () {
    return {
      noImage: require('@/assets/image/no-image.jpg'),
      // 当前操作的采购单id和单号
      curr: {
        detailedid: '',
        oddNumbers: ''
      },
      // 采购单主体信息
      purchaseForm: {
        oddNumbers: '',
        orderName: this.$store.state.UserName,
        remark: '',
        goods: {},
        ordermony: 0
      },
      // 查询条件
      search: {
        barCode: ''
      },
      formDisabled: false,
      submitLoading: false,
      formV: false,
      form: {
        myDetil: {},
        productDetil: []
      },
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
      // 新选中的数据，用于保存
      newSelectedList: [],
      // 初始化的订单总金额
      oldOrderMoney: 0
    }
  },
  methods: {
    // 拼接供应商名称
    getSupNameStr(supList) {
      let str = ''
      supList.forEach(v => {
        str += (v.supName + ',')
      })
      return str.substring(0, str.length - 1)
    },
    // 计算总供货数量
    computeTotalCount () {
      let temp = 0
      this.form.productDetil.forEach(v => {
        temp += (v.count || 0)
      })
      this.form.totalCount = temp
    },
    // 检测，条形码查商品及供应商列表
    checkProduct () {
      if (!this.form.barCode) {
        this.$message({
          message: '请输入条形码查询',
          type: 'warning'
        })
        return false
      }
      if (this.$route.query.orderType === 1) {
        // 来自v6的采购单，产品信息已经有了，直接拿供应商信息
        this._getSupplierInfo()
      } else {
        this._getProductInfo()
      }
    },
    // 获取产品信息
    _getProductInfo () {
      let params = {
        productName: '',
        barCode: this.form.barCode,
        pageSize: 1,
        pageIndex: 1,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      ShopGetListByPage(params).then(res => {
        if (res.data && res.data.length > 0) {
          let dataTemp = res.data[0]
          let skuTemp = res.data[0].sku
          let skuFinal = {}
          skuTemp.forEach(v => {
            if (v.barCode === this.form.barCode) skuFinal = v
          })
          this.$set(this.form, 'productName', dataTemp.productName)
          this.$set(this.form, 'image', dataTemp.mainImg)
          this.$set(this.form, 'costPrice', skuFinal.costPrice)
          this.$set(this.form, 'zkstock', skuFinal.stock)
          this.$set(this.form, 'totalCount', 0)
        } else {
          this.$message({
            message: '未查询到相关产品信息',
            type: 'warning'
          })
        }
        this._getSupplierInfo()
      }, err => {
        console.log(err)
      })
    },
    // 获取供应商列表
    _getSupplierInfo () {
      let params = {
        barCode: this.form.barCode
      }
      SupplierGoodsGetSupplierInfo(params).then(res => {
        if (res.data && res.data.length > 0) {
          this.$set(this.form, 'productDetil', res.data)
        } else {
          this.$message({
            message: '未查询到相关供应商信息',
            type: 'warning'
          })
        }
      }, err => {
        console.log(err)
      })
    },
    // 提交form
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认' + this.operateTitle + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.form.detailedid = this.$route.query.id || this.curr.detailedid
            this.form.oddNumbers = this.$route.query.oddNumbers || this.curr.oddNumbers
            this.purchaseForm.oddNumbers = this.$route.query.oddNumbers || this.curr.oddNumbers
            this.form.fpStatues = true // 提交保存，改产品属于已分配状态
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleId', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.purchaseForm.goods = JSON.parse(JSON.stringify(this.form))
            this.purchaseForm.creater = this.$store.state.UserID
            this.purchaseForm.roleId = this.$store.state.UserRole
            this.purchaseForm.cid = this.$store.state._cid
            let params = Object.assign({}, this.purchaseForm)
            SupplierGoodsCreateOrder(params).then(res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
              this.curr.detailedid = res.data ? res.data.detailedid : ''
              this.curr.oddNumbers = res.data ? res.data.oddNumbers : ''
              if (res.success) this.getOrderDetail()
            })
          }).then(() => {
            this.closed()
          })
        }
      })
    },
    // 关闭form
    closed () {
      this.formV = false
      this.submitLoading = false
      this.formDisabled = false
      this.form = {
        myDetil: {},
        productDetil: []
      }
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateTitle = title
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          break
        case '编辑': // 编辑
          this.form = JSON.parse(JSON.stringify(row))
          if (!this.form.myDetil) this.form.myDetil = {}
          this.formV = true
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
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
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: JSON.parse(JSON.stringify(item)),
        Action: this.operateAction
      }
      if (this.$route.query.orderType === 1) {
        // 来自v6的采购单
        // UpdateGoodsFromV6(params).then(res => {
        //   this.$message({
        //     message: res.msg,
        //     type: res.success ? 'success' : 'error'
        //   })
        //   this.getProductByOrderId()
        // })
      } else {
        SupplierGoodsOperation(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.getProductByOrderId()
        })
      }
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.getProductByOrderId()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getProductByOrderId()
    },
    // 计算总金额
    calculateMoney () {
      let temp = 0
      this.newSelectedList.forEach(v => {
        temp += (v.costPrice * v.totalCount)
      })
      this.purchaseForm.ordermony = this.oldOrderMoney + temp
    },
    // 加载数据
    async getProductByOrderId () {
      let params = {
        _id: this.$route.query.id || this.curr.detailedid,
        barCode: this.search.barCode,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      await SupplierGoodsGetListByPage(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    // 获取采购单详情
    async getOrderDetail () {
      if (this.$route.query.id || this.curr.detailedid) {
        let parmas = {
          _id: this.$route.query.id || this.curr.detailedid
        }
        await SupplierOrderGetDetailById(parmas).then(res => {
          if (res.success) {
            this.purchaseForm = res.data
            this.oldOrderMoney = res.data.ordermony
            this.getProductByOrderId()
          } else {
              this.$message.error(res.msg)
          }
        }, err => {
            this.$message.error(err.msg)
        })
      }
    }
  },
  mounted() {
    this.getOrderDetail()
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
      color: #F56C6C;
    }
  }
</style>
