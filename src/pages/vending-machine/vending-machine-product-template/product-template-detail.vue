<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form class="filters" inline>
      <el-form-item><el-button type="primary" @click="handleProductAdd">添加产品</el-button></el-form-item>
    </el-form>
    <el-table ref="tableListRef" v-loading="listLoading" :data="productList" border>
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="产品名称" prop="name" min-width="280" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品编码" prop="itemCode" min-width="160" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品条码" prop="barCode" min-width="160" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="原价(元)" prop="originalPrice" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ parseFloat((scope.row.originalPrice / 100).toFixed(2)) }}
        </template>
      </el-table-column>
      <el-table-column label="售价(元)" prop="price" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ parseFloat((scope.row.price / 100).toFixed(2)) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleProductEdit(scope.row)">修改</el-button>
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

    <!-- 产品绑定弹框 -->
    <el-dialog :title="`产品信息${formState === 0 ? '新增' : '修改'}`" :visible.sync="isMachineProdShow" width="550px" @close="isMachineProdShow = false" :close-on-click-modal="false">
      <div>
        <div v-if="formState === 0" style="margin: 0 0 15px 100px">
          <el-button type="warning" @click="handleProductSelect(true, 1)">南京V8产品选择</el-button>
          <el-button type="warning" @click="handleProductSelect(true, 2)">西安V8产品选择</el-button>
        </div>
        <el-form ref="addProductFormRef" :model="addProductForm" :rules="addProductFormRules" label-width="100px" label-position="right" :disabled="!addProductForm.barCode">
          <el-form-item label="产品名称" prop="name"> <el-input type="text" v-model.trim="addProductForm.name" placeholder="请输入产品名称" disabled></el-input> </el-form-item>
          <el-form-item label="产品编码" prop="itemCode"> <el-input type="text" v-model.trim="addProductForm.itemCode" placeholder="请输入产品编码" disabled></el-input> </el-form-item>
          <el-form-item label="产品条码" prop="barCode"> <el-input type="text" v-model.trim="addProductForm.barCode" placeholder="请输入产品条码"></el-input> </el-form-item>
          <el-form-item label="原价(元)" prop="originalPrice"><el-input-number v-model="addProductForm.originalPrice" :min="addProductForm.price" :controls="false" :step="0.01" step-strictly label="原价"></el-input-number> </el-form-item>
          <el-form-item label="售价(元)" prop="price"
            ><el-input-number v-model="addProductForm.price" :min="0" :max="addProductForm.originalPrice" :controls="false" :step="0.01" step-strictly label="售价"></el-input-number>
            <span style="font-size: 12px;color:#E6A23C">注：售价不得大于等于原价</span>
          </el-form-item>
          <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitProductInfo">确 定</el-button> </el-form-item>
        </el-form>
        <span slot="footer"> </span>
      </div>
    </el-dialog>
    <!-- 商品选择器 -->
    <machine-v8-product-select-radio ref="vendingProductRef" :isNjV8="isNjV8" :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></machine-v8-product-select-radio>
  </div>
</template>

<script>
import { getVendingMachineProductTemplate, vendingMachineProductTemplateAdd, vendingMachineProductTemplateDelete } from '@/api/system'
import MachineV8ProductSelectRadio from '@/components/machine-v8-product-select-radio'

export default {
  components: {
    MachineV8ProductSelectRadio
  },
  data() {
    return {
      productList: [],
      listLoading: false,
      tableLoading: false,
      addProductForm: {},
      isNjV8: 0,
      formState: 0,
      isMachineProdShow: false,
      isShowProductSelect: false,
      submitLoading: false,
      selectedProductList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addProductFormRules: {
        name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
        barCode: [{ required: true, message: '产品条码不能为空', trigger: 'blur' }],
        stock: [{ required: true, message: '产品库存不能为空', trigger: 'change' }],
        price: [{ required: true, message: '产品售价不能为空', trigger: 'change' }],
        originalPrice: [{ required: true, message: '产品原价不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    isMachineProdShow(val) {
      if (!val) {
        this.$refs['addProductFormRef'].resetFields()
      }
    }
  },
  mounted() {
    this.getProductTemplate()
  },
  methods: {
    getProductTemplate() {
      let params = {
        categoryId: this.$route.query.templateId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getVendingMachineProductTemplate(params)
        .then(res => {
          this.listLoading = false
          this.productList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleProductAdd() {
      this.formState = 0
      this.isMachineProdShow = true
    },
    handleProductEdit(row) {
      this.formState = 1
      this.isMachineProdShow = true
      this.$nextTick(() => {
        let { vmcode, name, itemCode, barCode, stock, price, originalPrice, isShow, categoryId } = row
        this.addProductForm = {
          vmcode,
          name,
          barCode,
          itemCode,
          stock,
          isShow,
          categoryId,
          price: parseFloat((price / 100).toFixed(2)),
          originalPrice: parseFloat((originalPrice / 100).toFixed(2))
        }
      })
    },
    handleProductSelect(flag, state) {
      this.isShowProductSelect = flag
      this.isNjV8 = state
      if (state === 1) {
        this.$refs['vendingProductRef'].initV8Data()
      } else if (state === 2) {
        this.$refs['vendingProductRef'].initXaV8Data()
      }
    },
    saveSelected(row) {
      let { name, barCode, itemCode, price } = row
      this.addProductForm = {
        name: name,
        itemCode: itemCode,
        barCode: barCode,
        stock: 0,
        price: price,
        originalPrice: price,
        isShow: true,
        categoryId: this.$route.query.templateId
      }
    },
    submitProductInfo() {
      this.$refs['addProductFormRef'].validate(valid => {
        if (valid) {
          if (!this.addProductForm.price || !this.addProductForm.originalPrice) {
            return this.$message.warning('价格不能为0元！')
          }
          if (this.addProductForm.price >= this.addProductForm.originalPrice) {
            return this.$message.warning('售价不得大于等于原价！')
          }
          let params = {
            ...this.addProductForm,
            price: parseInt((this.addProductForm.price * 100).toFixed(0)),
            originalPrice: parseInt((this.addProductForm.originalPrice * 100).toFixed(0)),
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          this.submitLoading = true
          vendingMachineProductTemplateAdd(params)
            .then(res => {
              this.submitLoading = false
              this.isMachineProdShow = false
              this.$message.success(res.msg)
              this.getProductTemplate('refresh')
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    handleProductDelete(row) {
      this.$confirm('确认删除该产品信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            productId: row._id
          }
          vendingMachineProductTemplateDelete(params).then(res => {
            this.$message.success(res.msg)
            this.getProductTemplate()
          })
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductTemplate()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProductTemplate()
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
}
</style>
