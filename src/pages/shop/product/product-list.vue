<template>
  <div class="product-container">
    <div class="product-list" v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item v-if="isManage">
            <el-select v-model="search.cid" placeholder="请选择门店" @change="storeChange">
              <el-option v-for="item in storeList" :key="item.cid" :value="item.cid" :label="item.companyName">{{ item.companyName }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-cascader v-model="search.categoryId" :options="categoryList" :props="cateProps" clearable placeholder="请选择产品分类"></el-cascader> </el-form-item>
          <el-form-item> <el-input v-model="search.productName" placeholder="请输入商品名检索" class="filters-search" clearable @keyup.enter.native="ShopGetListByPage"></el-input> </el-form-item>
          <el-form-item> <el-input v-model="search.code" placeholder="请输入商品条码" class="filters-search" clearable @keyup.enter.native="ShopGetListByPage"></el-input> </el-form-item>
          <el-form-item> <el-input style="width: 120px;" v-model="search.stock" placeholder="库存上限" class="filters-search" clearable @keyup.enter.native="ShopGetListByPage"></el-input> </el-form-item>
          <el-form-item>
            <el-select v-model="search.stockOrShow" placeholder="状态查询">
              <el-option v-for="(item, index) in stockOrShowList" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
            </el-select>
            <el-button type="primary" @click="_search">搜索</el-button>
          </el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item v-if="loginData.attribute === 4"> <el-button type="warning" @click="operateFunc('', '添加', 0)">新增产品</el-button> </el-form-item>
          <el-form-item>
            <el-upload style="display: inline-block;" ref="uploadProductRef1" action :limit="1" :show-file-list="false" :before-upload="beforeUploadProduct1" :http-request="uploadProduct1" :on-exceed="handleExceedProduct1">
              <el-button type="primary">成本导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-upload style="display: inline-block;" ref="uploadProductRef" action :limit="1" :show-file-list="false" :before-upload="beforeUploadProduct" :http-request="uploadProduct" :on-exceed="handleExceedProduct">
              <el-button type="primary">产品导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="exportExcel">导出</el-button> </el-form-item>
          <!-- <el-form-item> <el-button type="primary" @click="handleAsyncProduct">同步产品</el-button> </el-form-item> -->
          <!-- <el-form-item> <el-button type="primary" @click="_handlePurchase">一键采购</el-button> </el-form-item> -->
          <el-form-item> <el-button type="primary" @click="_down">无库存下架</el-button> </el-form-item>
          <el-form-item> <el-button :loading="shotLoading" type="warning" @click="saveProductSnapshot">生成商品库存快照</el-button> </el-form-item>
          <el-form-item> <el-button :loading="shotLoading" type="success" @click="handleProductSnapshotRecord">快照生成记录</el-button> </el-form-item>
          <el-form-item> <el-button type="danger" @click="operateDeleteMany" v-permission="['/product-list:delete']">批量删除</el-button> </el-form-item>
        </div>
      </el-form>
      <div class="alert" style="margin-top:10px">
        <el-alert
          title="出现产品存在临期或过期需要进行处理的情况，不允许在手机盘库端操作，只能在后台系统进行处理，具体操作：‘商城—>商城列表—>点击产品对应的'编辑'—>销售批次—>按需进行临期设置 / 报损操作 / 生产日期，保质期调整 ’"
          type="warning"
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading || uploadLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="55" type="index"></el-table-column>
          <el-table-column align="center" prop="productName" label="产品名称" min-width="280" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #67C23A;" v-show="scope.row.mainImg !== null && scope.row.mainImg.url" class="iconfont icon-tupian"></span> {{ scope.row.productName }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="categoryName" label="分类" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="barCode" label="产品条码" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.barCode + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="stock" label="库存" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.stock <= 5" style="color: red;">{{ scope.row.stock }}</span> <span v-else>{{ scope.row.stock }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="价格" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="vipPrice" label="会员价" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.vipPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isShow" label="上下架" min-width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShow" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sellWell" label="热销" min-width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sellWell" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isTop" label="店长推荐" min-width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isTop" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sales" label="销量" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="350" fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="formV8Detail(scope.row)">V8同步</el-button>
              <el-button type="primary" size="mini" @click="openAllot(scope.row)">调拨</el-button>
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)" v-permission="['/product-list:delete']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 15, 20, 25]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          ></el-pagination>
        </el-col>
      </div>
      <el-dialog title="库存修改" :visible.sync="skuModal" width="500px">
        <div class="sku-list">
          <div class="sku-item">
            <el-form :model="dialog" class="mag-dialog-row" style="display: inline;">
              <el-form-item prop="nickName" class="el-form-item">
                <div class="form-item-title">规格 <span class="border"></span> <span class="EnName">specs</span></div>
                <el-input class="form-item-input" v-model="dialog.nickName" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item prop="nickName" class="el-form-item">
                <div class="form-item-title">条码 <span class="border"></span> <span class="EnName">code</span></div>
                <el-input class="form-item-input" v-model="dialog.nickName" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item prop="nickName" class="el-form-item">
                <div class="form-item-title">库存 <span class="border"></span> <span class="EnName">stock</span></div>
                <el-input-number controls-position="right" class="form-item-input" v-model="dialog.nickName"></el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 调拨弹窗 -->
      <el-dialog title="调拨" :visible.sync="allotShow" width="700px" @closed="closeAllot(false)">
        <el-tabs v-model="activeName">
          <el-tab-pane label="门店调拨" name="first"> <store-allot ref="storeAllotRef" :allotInfo="allotInfo" :searchCid="search.cid" @closeAllot="closeAllot" @init="ShopGetListByPage"></store-allot> </el-tab-pane>
          <el-tab-pane label="内部调拨" name="second"> <inside-allot ref="insideAllotRef" :allotInfo="allotInfo" :searchCid="search.cid" @closeAllot="closeAllot" @init="ShopGetListByPage"></inside-allot> </el-tab-pane>
        </el-tabs>
        <!--
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeAllot">取 消</el-button>
            <el-button type="primary" @click="submitAllot">确 定</el-button>
          </span>
        -->
      </el-dialog>
      <!-- v8同步 -->
      <el-dialog title="同步内容选择" :visible.sync="dialogShow" width="600px" :before-close="handleClose">
        <el-form :inline="true" :model="dialogSynchro" class="demo-form-inline">
          <el-row>
            <el-col :span="8">
              <el-form-item label="产品分类"> <el-switch v-model="dialogSynchro.categoryId" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品名称"> <el-switch v-model="dialogSynchro.productName" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简介"> <el-switch v-model="dialogSynchro.summary" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="保存条件"> <el-switch v-model="dialogSynchro.storage" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品详情"> <el-switch v-model="dialogSynchro.content" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="列表主图"> <el-switch v-model="dialogSynchro.mainImg" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="产品sku"> <el-switch v-model="dialogSynchro.sku" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品标签"> <el-switch v-model="dialogSynchro.productLabel" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最小计量单位名称"> <el-switch v-model="dialogSynchro.unitName" active-color="#13ce66"></el-switch> </el-form-item>
            </el-col>
          </el-row>
          <!--
            <el-form-item label="商品详情页图片列表">
              <el-switch v-model="dialogSynchro.imgs" active-color="#13ce66"></el-switch>
            </el-form-item>
          -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="sureV8Detail">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { ShopGetListByPage, ShopOperation, GetAllCategory, VShopProductProductExcelNew, VShopProductImporProExcel, PorductCostImportExcel, UpdateUpDown, UpdateProduct, getAllStore, productSnapshotOperation } from '@/api/system'
import { formatDate } from '../../../../src/components/js/data'
import StoreAllot from './components/store-allot.vue'
import InsideAllot from './components/inside-allot.vue'
import { mapState } from 'vuex'

export default {
  name: 'product-list',
  components: {
    StoreAllot,
    InsideAllot
  },
  computed: {
    ...mapState(['loginData'])
  },
  watch: {
    $route(to, from) {
      if (to.name === 'product-list') {
        this.ShopGetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      storeList: [],
      activeName: 'first',
      allotInfo: {},
      allotShow: false, // 调拨弹窗
      stockOrShowList: [
        { value: 0, label: '全部' },
        { value: 1, label: '有库存' },
        { value: 2, label: '无库存' },
        { value: 3, label: '已上架' },
        { value: 4, label: '未上架' },
        { value: 5, label: '热销' },
        { value: 6, label: '店长推荐' }
      ],
      uploadLoading: false,
      skuModal: false, // 库存修改弹框显示状态
      containerIsShow: true,
      search: {
        categoryId: '',
        code: '',
        productName: '',
        stock: '',
        stockOrShow: 0,
        cid: ''
      },
      dialog: {},
      categoryList: [],
      productList: [],
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      // 多选删除的数据列表
      checkedDatas: [],
      outputs: [],
      dialogShow: false, // V8同步
      shotLoading: false,
      synchroProduct: {},
      dialogSynchro: {
        categoryId: false,
        productName: true,
        summary: false,
        storage: false,
        content: true,
        mainImg: true,
        imgs: false,
        sku: true,
        unitName: false,
        productLabel: false
      },
      cateProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  methods: {
    // 获取所有门店信息
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.storeList = res.data.map(item => {
            return {
              cid: item.cid,
              companyName: item.companyName
            }
          })
          this.search.cid = this.storeList[0].cid
          this.ShopGetListByPage()
          this.GetAllCategory()
        }
      })
    },
    storeChange() {
      this.GetAllCategory()
    },
    _search() {
      this.pageIndex = 1
      this.ShopGetListByPage()
    },
    formV8Detail(row) {
      this.dialogShow = true
      this.synchroProduct = row
    },
    handleClose() {
      this.dialogShow = false
    },
    sureV8Detail() {
      let param = {
        ...this.dialogSynchro,
        uniqueCode: this.synchroProduct.uniqueCode,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.search.cid
      }
      UpdateProduct(param).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.dialogShow = false
            this.ShopGetListByPage()
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },
    // 无库存下架
    _down() {
      let params = {
        stock: 0,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.search.cid
      }
      UpdateUpDown(params).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.ShopGetListByPage()
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },

    // 关闭调拨
    closeAllot(val) {
      this.allotShow = val
      this.$refs.storeAllotRef.closed()
      this.$refs.insideAllotRef.closed()
    },
    // 打开调拨
    openAllot(row) {
      if (row.sku.length <= 0) {
        this.$message({
          type: 'warning',
          message: '该产品无SKU信息!'
        })
        return false
      }
      this.allotShow = true
      this.allotInfo = row
    },
    // 导出
    exportExcel() {
      let parmas = {
        isStock: this.search.stockOrShow === 1 || this.search.stockOrShow === 2 ? this.search.stockOrShow : 0,
        isShow: this.search.stockOrShow === 3 ? 1 : this.search.stockOrShow === 4 ? 2 : 0,
        queryStock: this.search.stock,
        productName: this.search.productName,
        barCode: this.search.code,
        categoryId: this.search.categoryId,
        isPage: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.search.cid
      }
      VShopProductProductExcelNew(parmas)
        .then(res => {
          const content = res
          const blob = new Blob([content])
          let nowTime = formatDate(new Date(), 'yyyy-MM-dd')
          const fileName = `产品信息${nowTime}.xls`
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, {
              type: 'application/vnd.ms-excel'
            })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 上传文件个数超过定义的数量
    handleExceedProduct1(files, fileList) {
      this.$message.warning('一次只能上传一个文件导入')
    },
    // 产品导入之前
    beforeUploadProduct1(file) {
      const fileNameBack = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileNameBack !== 'xls' && fileNameBack !== 'xlsx') {
        this.$message({
          message: '上传文件只能是 xls、xlsx 格式!',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 产品导入
    uploadProduct1(param) {
      const file = param.file
      let formData = new FormData()
      formData.append('file', file)
      formData.append('cid', this.search.cid)
      formData.append('roleId', this.$store.state.UserRole)
      formData.append('creater', this.$store.state.UserID)
      this.uploadLoading = true
      PorductCostImportExcel(formData).then(
        res => {
          this.uploadLoading = false
          if (res.success) {
            this.$message({
              message: res.msg,
              type: 'info'
            })
            this.ShopGetListByPage()
          } else {
            this.$message.error(res.msg)
          }
          this.$refs.uploadProductRef.clearFiles()
        },
        err => {
          console.log(err)
          this.uploadLoading = false
          this.$refs.uploadProductRef.clearFiles()
        }
      )
    },
    // 上传文件个数超过定义的数量
    handleExceedProduct(files, fileList) {
      this.$message.warning('一次只能上传一个文件导入')
    },
    // 产品导入之前
    beforeUploadProduct(file) {
      const fileNameBack = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileNameBack !== 'xls' && fileNameBack !== 'xlsx') {
        this.$message({
          message: '上传文件只能是 xls、xlsx 格式!',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 产品导入
    uploadProduct(param) {
      const file = param.file
      let formData = new FormData()
      formData.append('file', file)
      formData.append('cid', this.search.cid)
      formData.append('roleId', this.$store.state.UserRole)
      formData.append('creater', this.$store.state.UserID)
      this.uploadLoading = true
      VShopProductImporProExcel(formData).then(
        res => {
          this.uploadLoading = false
          if (res.success) {
            this.$message({
              message: res.msg,
              type: 'info'
            })
            this.ShopGetListByPage()
          } else {
            const content = res
            const blob = new Blob([content])
            const fileName = '差异产品信息.xls'
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob, {
                type: 'application/vnd.ms-excel'
              })
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
            this.ShopGetListByPage()
          }
          this.$refs.uploadProductRef.clearFiles()
        },
        err => {
          console.log(err)
          this.uploadLoading = false
          this.$refs.uploadProductRef.clearFiles()
        }
      )
    },
    // 同步V8产品
    handleAsyncProduct() {
      this.$router.push('/v8-category')
    },
    // 自动生产采购单
    _handlePurchase() {
      this.$router.push('/product-purchase')
    },
    // 新增分类
    addCategory() {
      this.$router.push('/product-category')
    },
    handleProductAdd() {
      this.$router.push('/retail-product-detail')
    },
    // 增删改查
    operateFunc(row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push('/product-detail')
          break
        case '编辑': // 编辑
          this.$router.push({
            path: '/product-detail',
            query: {
              cid: row.cid,
              id: row._id,
              uniqueCode: row.uniqueCode
            }
          })
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
          this.$router.push({
            path: '/product-detail',
            query: { id: row._id, operate: 'view', uniqueCode: row.uniqueCode }
          })
          break
        default:
          return false
      }
    },
    // 库存修改
    _skuModify(row) {
      this.$confirm('是否修改库存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          Dto: Object.assign({}, row),
          Action: 1
        }
        ShopOperation(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.ShopGetListByPage()
        })
      })
    },
    // 操作的后台请求
    operateAxios(item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      ShopOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.ShopGetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany() {
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
    // 生成商品库存快照
    saveProductSnapshot() {
      this.$confirm('确定生成商品库存快照？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.shotLoading = true
        productSnapshotOperation().then(res => {
          this.shotLoading = false
          this.$message.success(res.msg)
        }).catch(() => {
          this.shotLoading = false
        })
      }).catch(() => {})
    },
    // 快照生成记录
    handleProductSnapshotRecord() {
      this.$router.push('/product-snapshot')
    },
    // 选中行
    selectTableRow(row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.ShopGetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.ShopGetListByPage()
    },
    // 加载商品分类
    async GetAllCategory() {
      let params = {
        belongMenu: '/product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.search.cid
      }
      await GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
            this.categoryList.unshift({
              value: '',
              label: '所有产品'
            })
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 加载数据
    async ShopGetListByPage() {
      // if (this.search.categoryIds.length > 0) {
      //   let _index = this.search.categoryIds.length - 1
      //   this.search.categoryId = this.search.categoryIds[_index]
      // } else {
      //   this.search.categoryId = ''
      // }
      let params = {
        isStock: this.search.stockOrShow === 1 || this.search.stockOrShow === 2 ? this.search.stockOrShow : 0,
        isShow: this.search.stockOrShow === 3 ? 1 : this.search.stockOrShow === 4 ? 2 : 0,
        queryStock: this.search.stock,
        categoryId: this.search.categoryId,
        productName: this.search.productName,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        barCode: this.search.code,
        isPage: true,
        isOrder: true,
        sellWell: !!(this.search.stockOrShow === 5),
        isTop: !!(this.search.stockOrShow === 6),
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.search.cid
      }
      this.listLoading = true
      await ShopGetListByPage(params).then(
        res => {
          this.listLoading = false
          this.productList = res.data
          this.total = res.total
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    }
  },
  mounted() {
    if (this.isManage) {
      this.getAllShop()
    } else {
      this.search.cid = this.$store.state._cid
      this.ShopGetListByPage()
      this.GetAllCategory()
    }
  }
}
</script>

<style lang="scss" scoped>
.product-container {
  position: relative;
  padding: 20px;
}
// .product-list {
//   position: fixed;
//   width: calc(100% - 240px);
//   height: calc(100vh - 90px);
//   overflow: scroll;
// }
.filters {
  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
      margin-bottom: 10px;
    }
  }
  .el-form-item {
    margin-bottom: 5px;
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
.sku-list {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  .sku-item {
    flex: 0 0 50%;
    .mag-dialog-row {
      .el-form-item {
        .form-item-input {
          width: 200px;
        }
      }
    }
  }
}
</style>
