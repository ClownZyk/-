<template>
  <div v-if="containerIsShow">
    <div class="gem-back-header"><el-page-header @back="goBack()" :content="$route.meta.name"> </el-page-header></div>
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>总库存</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-dingdan"></i>
          <div class="count-value">{{ saleData.stockTotal }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>总货值(元)</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ saleData.productValue }}</div>
        </div>
      </div>
    </div>
    <el-alert
      title="售卖机绑定产品说明"
      description="新增，修改，删除产品操作都会自动执行同步售卖机操作，若发现有后台绑定产品未同步到售卖机，可手动点击‘产品同步售卖机’按钮进行操作。若售卖柜基础库中不包含需要售卖的产品，可在‘新品申请’模块进行产品申请"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="产品条码"><el-input type="text" v-model.trim="filterParam.barCode" placeholder="请输入产品条码检索" clearable></el-input></el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
        <el-form-item> <el-button type="primary" @click="exportProducts">导出商品</el-button> </el-form-item>
        <el-form-item> <el-button type="primary" @click="handleMachineProdBind()">产品绑定</el-button> </el-form-item>
        <el-form-item> <el-button :loading="syncLoading" type="warning" @click="handleMachineProdSync()">产品同步售卖机</el-button> </el-form-item>
        <!-- GetVendingMachineProdsExport -->
      </div>
    </el-form>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="productList" border>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column label="产品名称" prop="name" min-width="260" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品编码" prop="itemCode" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品条码" prop="barCode" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品类型" prop="qrCodes" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.mQrCodes.length === 1 ? '单品' : '合集' }}
          </template>
        </el-table-column>
        <el-table-column label="产品库存" prop="stock" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="原价(元)" prop="originalPrice" width="130" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ parseFloat((scope.row.originalPrice / 100).toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="售价(元)" prop="price" width="130" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ parseFloat((scope.row.price / 100).toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="上下架" width="120" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isShow" @change="handleProductUpdate(scope.row)"></el-switch>
            <!-- <span v-else>{{ scope.row.isShow ? '已上架' : '已下架' }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="排序号(越大越在前)" width="140" align="center">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.sortNo"
              @change="
                newVal => {
                  handleSortNoChange(newVal, scope.row)
                }
              "
              :controls="false"
              :min="0"
              :step="1"
              step-strictly
              style="width:100%"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="售卖机数据" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.sync">
              <span v-if="scope.row.sync.actualPrice !== scope.row.price || scope.row.sync.originalPrice !== scope.row.originalPrice" style="color:#67C23A"
                >同步成功(柜子数据：原价¥{{ parseFloat((scope.row.sync.originalPrice / 100).toFixed(2)) }}，售价¥{{ parseFloat((scope.row.sync.actualPrice / 100).toFixed(2)) }})</span
              >
              <span v-else style="color:#67C23A">同步成功</span>
            </div>
            <div v-else style="color:#F56C6C">同步失败</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleProductEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="warning" @click="handleProductDetail(scope.row)">产品详情</el-button>
            <el-button size="mini" type="danger" @click="handleProductDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </div>
    <!-- 产品绑定弹框 -->
    <el-dialog title="产品绑定" :visible.sync="isMachineProdShow" width="800px" @close="isMachineProdShow = false" :close-on-click-modal="false">
      <div v-if="operateAction === 0" style="margin-bottom: 15px">
        <el-button type="warning" @click="handleJTBaseProductSelect">南京V6产品选择</el-button>
        <el-button type="warning" @click="handleProductSelect(true, 1)">南京V6产品选择</el-button>
        <el-button type="warning" @click="handleProductSelect(true, 2)">西安V8产品选择</el-button>
      </div>
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top" :disabled="!addForm.barCode">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="产品名称" prop="name"> <el-input type="text" v-model.trim="addForm.name" placeholder="请输入产品名称"></el-input> </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="产品编码" prop="itemCode"> <el-input type="text" v-model.trim="addForm.itemCode" placeholder="请输入产品编码" disabled></el-input> </el-form-item>
          </el-col>
          <!--
            <el-col :span="7">
              <el-form-item v-if="operateAction !== 0" label="产品库存" prop="stock"
                ><el-input-number v-model="addForm.stock" :min="0" :controls="false" :step="1" step-strictly label="库存" style="width: 100%"></el-input-number>
              </el-form-item>
            </el-col>
          -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="产品条码" prop="barCode"> <el-input type="text" v-model.trim="addForm.barCode" placeholder="请输入产品条码"></el-input> </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="原价(元)" prop="originalPrice"
              ><el-input-number v-model="addForm.originalPrice" :min="addForm.price" :controls="false" :step="0.01" step-strictly label="原价" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="售价(元)" prop="price"
              ><el-input-number v-model="addForm.price" :min="0" :max="addForm.originalPrice" :controls="false" :step="0.01" step-strictly label="售价" style="width: 100%"></el-input-number>
              <div style="font-size: 12px;color:#E6A23C">注：售价不能 >= 原价</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="售卖柜条码：" v-if="operateAction !== 0">{{ addForm.qrCodes }}</el-form-item>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitBindProdInfo">确 定</el-button> </span>
    </el-dialog>
    <!-- 商品选择器 -->
    <vending-product-select-radio ref="vendingProductRef" :isNjV6="isNjV6" :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></vending-product-select-radio>
    <!-- JT基础商品选择器 -->
    <vendingProductPicker @select="saveSelected" ref="vendingProductPickerRef"></vendingProductPicker>
    <!-- 互斥产品弹框 -->
    <el-dialog title="互斥产品" :visible.sync="isMutualProductShow" width="1000px" :close-on-click-modal="false">
      <el-table :data="mutualProductList" border>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column label="产品名称" prop="name" min-width="260" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品编码" prop="itemCode" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品条码" prop="barCode" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品库存" prop="stock" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="售价(元)" prop="price" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ parseFloat((scope.row.price / 100).toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="上下架" width="120" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isShow" @change="handleProductUpdate(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"> </span>
    </el-dialog>

    <!-- 下架或删除回仓弹框 -->
    <el-dialog title="产品回仓" :visible.sync="isProductReturnStockShow" width="1000px" :close-on-click-modal="false" @close="getMachineBindProd">
      <div style="margin-bottom: 20px">
        <strong>售卖柜产品库存：{{ returnStockData.stock }}</strong>
      </div>
      <el-table v-loading="detailLoading" size="small" :data="returnProductList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="产品条码" prop="barCode" min-width="180" align="center"> </el-table-column>
        <el-table-column label="仓库存" prop="stock" min-width="160" align="center"> </el-table-column>
        <el-table-column label="回仓数量" prop="returnStock" min-width="160" align="center">
          <template slot-scope="scope">
            <el-input-number size="small" v-model="scope.row.returnStock" :min="0" :step="1" step-strictly style="width:100%"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitProductReturnStockInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import {
  getVendingMachineProdsData,
  vendingMachineBindProd,
  GetVendingMachineProdsExport,
  getVendingMachineBindProdDetail,
  getVendingMachineBindProd,
  updateVendingMachineProd,
  vendingMachineProductUpdate,
  updateVendingMachineProdsSortNo
} from '@/api/system'
import vendingProductSelectRadio from '@/components/vending-product-select-radio'
import vendingProductPicker from '@/components/vending-product-picker.vue'

export default {
  components: {
    vendingProductSelectRadio,
    vendingProductPicker
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      saleData: {
        stockTotal: 0,
        productValue: 0
      },
      filterParam: {
        barCode: ''
      },
      productList: [],
      addForm: {
        name: '',
        itemCode: '',
        barCode: '',
        stock: 0,
        price: 0,
        originalPrice: 0,
        isShow: true
      },
      productDetail: {},
      operateAction: 0,
      updateAction: 0,
      isNjV6: 0,
      syncLoading: false,
      tableLoading: false,
      submitLoading: false,
      isMachineProdShow: false,
      isShowProductSelect: false,
      mutualProductList: [],
      isMutualProductShow: false,
      returnStockData: {},
      returnProductList: [],
      detailLoading: false,
      isProductReturnStockShow: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
        barCode: [{ required: true, message: '产品条码不能为空', trigger: 'blur' }],
        stock: [{ required: true, message: '产品库存不能为空', trigger: 'change' }],
        price: [{ required: true, message: '产品售价不能为空', trigger: 'change' }],
        originalPrice: [{ required: true, message: '产品原价不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'vending-machine-prod') {
        this.initData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isMachineProdShow(val) {
      if (!val) {
        delete this.addForm.vmcode
        this.$refs['addFormRef'].resetFields()
      }
    },
    isMutualProductShow(val) {
      if (!val) {
        this.mutualProductList = []
      }
    },
    isProductReturnStockShow(val) {
      if (!val) {
        this.returnStockData = {}
        this.returnProductList = []
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.getMachineProdsData()
      this.getMachineBindProd()
    },
    getMachineProdsData() {
      let params = {
        vmcode: this.$route.query.vmcode,
        cid: this.$route.query.queryCid
      }
      getVendingMachineProdsData(params).then(res => {
        this.saleData = res.data
      })
    },
    getMachineBindProd(refresh) {
      let params = {
        vmcode: this.$route.query.vmcode,
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.queryCid || this.$store.state._cid
      }
      this.tableLoading = true
      getVendingMachineBindProd(params)
        .then(res => {
          this.tableLoading = false
          this.productList = res.data.listData.map(item => {
            return {
              ...item,
              mQrCodes: item.qrCodes.split(',')
            }
          })
          this.total = res.data.total
          if (refresh === 'refresh') {
            this.machineProdSyncOperation()
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleMachineProdBind() {
      this.operateAction = 0
      this.isMachineProdShow = true
      this.addForm.vmcode = this.$route.query.vmcode
    },
    // 产品修改
    handleProductEdit(row) {
      this.operateAction = 1
      this.isMachineProdShow = true
      this.$nextTick(() => {
        let { vmcode, name, itemCode, barCode, stock, price, originalPrice, qrCodes } = row
        this.addForm = {
          vmcode,
          name,
          barCode,
          itemCode,
          stock,
          qrCodes,
          price: parseFloat((price / 100).toFixed(2)),
          originalPrice: parseFloat((originalPrice / 100).toFixed(2))
        }
      })
    },
    submitBindProdInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (!this.addForm.price || !this.addForm.originalPrice) {
            return this.$message.warning('价格不能为0元！')
          }
          if (this.addForm.price >= this.addForm.originalPrice) {
            return this.$message.warning('售价不能 >= 原价！')
          }
          let params = {
            ...this.addForm,
            price: parseInt((this.addForm.price * 100).toFixed(0)),
            originalPrice: parseInt((this.addForm.originalPrice * 100).toFixed(0)),
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          // console.log(params)
          this.submitLoading = true
          vendingMachineBindProd(params)
            .then(res => {
              this.submitLoading = false
              this.isMachineProdShow = false
              this.$message.success('产品绑定成功！')
              this.getMachineBindProd('refresh')
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    handleMachineProdSync() {
      this.$confirm('确认同步产品到售卖机?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.machineProdSyncOperation()
        })
        .catch(() => {})
    },
    machineProdSyncOperation() {
      this.syncLoading = true
      updateVendingMachineProd({ vmCode: this.$route.query.vmcode })
        .then(res => {
          this.syncLoading = false
          this.$message.success('产品同步售卖机成功！')
        })
        .catch(err => {
          this.syncLoading = false
          this.$message({
            type: 'error',
            message:
              err.data.status === 10004
                ? err.data.status + '：商品数量过多,售卖规划商品数量最多50个'
                : err.data.status === 40502
                ? err.data.status + '：存在重复商品'
                : err.data.status === 40503
                ? err.data.status + '：存在互斥商品'
                : err.data.status === 40504
                ? err.data.status + '：存在下架商品'
                : err.data.status === 40506
                ? err.data.status + '：自贩机不存在'
                : err.data.status === 40507
                ? err.data.status + '：存在未知商品'
                : err.data.status === 40531
                ? err.data.status + '：没有操作权限'
                : '同步失败',
            showClose: true,
            duration: 0
          })
          if (err.data && err.data.length > 0) {
            this.isMutualProductShow = true
            this.mutualProductList = err.data
          }
        })
    },
    handleProductSelect(flag, state) {
      this.isShowProductSelect = flag
      this.isNjV6 = state
      if (state === 1) {
        this.$refs['vendingProductRef'].initV6Data()
      } else if (state === 2) {
        this.$refs['vendingProductRef'].initXaV8Data()
      }
    },
    handleJTBaseProductSelect() {
      this.$refs['vendingProductPickerRef'].show()
    },
    saveSelected(row) {
      console.log(row)
      let { name, barCode, itemCode, price } = row
      this.addForm = {
        vmcode: this.$route.query.vmcode,
        name: name,
        itemCode: itemCode,
        barCode: barCode,
        stock: 0,
        price: price,
        originalPrice: price,
        isShow: true
      }
    },
    // 产品上下架
    handleProductUpdate(row) {
      this.updateAction = 1
      if (!row.isShow) {
        this.$confirm('下架该产品库存是否回仓?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '下架并回仓',
          cancelButtonText: '仅下架',
          type: 'warning'
        })
          .then(() => {
            this.isProductReturnStockShow = true
            this.returnStockData = row
            this.getProductDetail(row)
          })
          .catch(action => {
            if (action === 'cancel') {
              this.handleShowOrDeleteOperation(row, false, [])
            } else {
              row.isShow = !row.isShow
            }
          })
      } else {
        this.handleShowOrDeleteOperation(row, false, [])
      }
    },
    handleProductDelete(row) {
      this.updateAction = 2
      this.$confirm('删除该产品库存是否回仓?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除并回仓',
        cancelButtonText: '仅删除',
        type: 'warning'
      })
        .then(() => {
          this.isProductReturnStockShow = true
          this.returnStockData = { ...row, isShow: false }
          this.getProductDetail(row)
        })
        .catch(action => {
          if (action === 'cancel') {
            this.handleShowOrDeleteOperation(row, false, [])
          }
        })
    },
    submitProductReturnStockInfo() {
      let total = 0
      this.returnProductList.forEach(item => {
        total += item.returnStock
      })
      if (total !== this.returnStockData.stock) {
        return this.$message.warning('回仓总数量不能大于或小于售卖柜该产品库存数量！')
      }
      let emptyReturnProd = this.returnProductList.every(item => !item.returnStock)
      if (emptyReturnProd) {
        return this.$message.warning('请在需要回仓条码的回仓数量框中填入回仓数量后再操进行数据提交操作！')
      }
      let returnProdList = this.returnProductList
        .filter(item => item.returnStock)
        .map(item => {
          return {
            barCode: item.barCode,
            stock: item.returnStock
          }
        })
      this.handleShowOrDeleteOperation(this.returnStockData, true, returnProdList)
    },
    handleShowOrDeleteOperation(row, state, productBarCode) {
      let params = {
        _Id: row._id,
        isShow: row.isShow,
        isValid: this.updateAction === 2,
        isStockReturn: state,
        productBarCode
      }
      this.submitLoading = true
      vendingMachineProductUpdate(params)
        .then(res => {
          this.submitLoading = false
          this.isProductReturnStockShow = false
          this.isMutualProductShow = false
          this.$message.success(this.updateAction === 1 ? '产品上下架状态修改成功！' : '产品删除成功！')
          this.getMachineBindProd('refresh')
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    getProductDetail(row) {
      this.detailLoading = true
      getVendingMachineBindProdDetail({ _id: row._id })
        .then(res => {
          this.returnProductList = res.data.productlist
            .filter(item => item.isExist)
            .map(item => {
              return {
                ...item,
                returnStock: 0
              }
            })
          this.detailLoading = false
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    // 排序号修改
    handleSortNoChange(newVal, row) {
      let params = {
        _id: row._id,
        sortNo: row.sortNo
      }
      updateVendingMachineProdsSortNo(params).then(res => {
        this.$message.success(res.msg)
        this.getMachineBindProd()
      })
    },
    // 查看产品详情
    handleProductDetail(row) {
      this.$router.push({ path: '/vending-machine-prod-detail', query: { id: row._id, vmcode: row.vmcode, itemCode: row.itemCode } })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getMachineBindProd()
    },
    exportProducts() {
      let params = {
        vmcode: this.$route.query.vmcode,
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.queryCid || this.$store.state._cid
      }
      GetVendingMachineProdsExport(params).then(
        res => {
          console.log(res)
          const content = res
          const blob = new Blob([content])
          const fileName = '售卖机商品信息.xls'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, { type: 'application/vnd.ms-excel' })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        },
        () => {}
      )
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getMachineBindProd()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getMachineBindProd()
    },
    goBack() {
      this.$router.push({ path: '/vending-machine-list' })
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
ul {
  list-style: disc;
  color: #b6b6b6;
  font-size: 12px;
}
.home-count {
  width: 100%;
  padding-bottom: 10px;
  display: flex;
  display: -webkit-flex;
  .home-count-item {
    flex: 0 0 19%;
    background-color: #ffffff;
    box-shadow: 0 0 10px #dddddd;
    padding: 10px 15px;
    max-height: 112.81px;
    margin-right: 15px;
    .conut-l-title {
      color: #aaaaaa;
      font-size: 14px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
    }
    .count-l-total {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      display: -webkit-flex;
      align-items: baseline;
      div.count-value {
        font-size: 26px;
        font-weight: bold;
        color: #2c2c2c;
      }
      .iconfont {
        margin-right: 10px;
      }
    }
  }
}
</style>
