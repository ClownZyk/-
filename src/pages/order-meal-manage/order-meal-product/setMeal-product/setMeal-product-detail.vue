<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form v-loading="detailLoading" ref="setMealFormRef" :model="setMealForm" :rules="setMealFormRules" label-position="top">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="套餐名称" prop="setMealName"> <el-input v-model.trim="setMealForm.setMealName" placeholder="请输入套餐名称"></el-input> </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="套餐价格" prop="setPrice"> <el-input-number v-model="setMealForm.setPrice" :min="0" :controls="false" :precision="2" :step="0.01" style="width:100%"></el-input-number> </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="套餐会员价" prop="setVipPrice">
            <el-input-number v-model="setMealForm.setVipPrice" :min="0" :max="setMealForm.setPrice" :controls="false" :precision="2" :step="0.01" style="width:100%"></el-input-number
          ></el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="上下架" prop="display"> <el-switch v-model="setMealForm.display"></el-switch> </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="排序号" prop="sortNo"> <el-input-number v-model="setMealForm.sortNo" :min="0" :precision="0" :step="1" style="width:100%"></el-input-number> </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="套餐包含菜品" prop="fixedProduct">
        <el-button size="small" type="warning" @click="addFixedProd">添加菜品</el-button>
        <el-table size="small" :data="setMealForm.fixedProduct" border>
          <el-table-column align="center" type="index" label="编号" width="55"></el-table-column>
          <el-table-column prop="productName" label="菜品名称" min-width="160"></el-table-column>
          <el-table-column prop="skuTitle" label="菜品规格" min-width="140"></el-table-column>
          <el-table-column align="center" prop="barCode" label="菜品条码" min-width="140"> </el-table-column>
          <el-table-column align="center" prop="price" label="菜品价格(元)" min-width="140"> </el-table-column>
          <el-table-column align="center" prop="sortNo" label="排序号" min-width="140">
            <template slot-scope="scope">
              <el-input-number size="small" v-model="scope.row.sortNo" :min="0" :precision="0" :step="1" style="width:100%"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="removeFixedProd(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="套餐可选分类/菜品" prop="optCategory">
        <el-button type="warning" size="mini" @click="addChooseCategoryOrProd">添加分类</el-button>
        <div class="tips">注：若只选择分类，不选菜品，则默认该分类下的全部菜品</div>
        <el-table :data="setMealForm.optCategory" border size="small">
          <el-table-column type="expand" width="55" align="center">
            <template slot-scope="props">
              <el-table size="mini" :data="props.row.optProduct" border>
                <el-table-column label="菜品名称" prop="productName" min-width="160"></el-table-column>
                <el-table-column label="菜品规格" prop="skuTitle" min-width="140" align="center"></el-table-column>
                <el-table-column label="菜品条码" prop="barCode" min-width="160" align="center"></el-table-column>
                <el-table-column label="菜品价格(元)" prop="price" min-width="160" align="center"></el-table-column>
                <el-table-column label="排序号" prop="sortNo" min-width="140" align="center">
                  <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.sortNo" :min="0" :precision="0" :step="1" style="width:100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" plain @click="removeCategoryProd(props.row.categoryId, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column align="center" type="index" label="编号" width="55"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="分类名称" min-width="160"></el-table-column>
          <el-table-column align="center" prop="number" label="可选数量" min-width="140">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.number" :min="1" :controls="false" :precision="0" :step="1" style="width:100%"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="addCateProd(scope.row)">菜品选择</el-button>
              <el-button size="mini" type="danger" @click="removeChooseCategory(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="套餐图片" prop="prodImage">
        <my-upload :imgs="setMealForm.prodImage" :limitUploadImgs="3" ref="uploadImg" @handleRemoveImg="handleRemoveImg('prodImage', $event)" @handleUploadImg="handleUploadImg('prodImage', $event)"> </my-upload>
      </el-form-item>
      <el-form-item> <el-button :loading="submitLoading" type="primary" @click="sumbitSetMealInfo">提交</el-button> </el-form-item>
    </el-form>

    <!-- 分类选择弹框 -->
    <el-dialog title="分类选择" :visible.sync="cateDialogVisible" width="600px" :close-on-click-modal="false">
      <el-table v-loading="cateLoading" :data="categoryList" border @selection-change="handleCateSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="label" label="分类名称" align="center"></el-table-column>
      </el-table>
      <span slot="footer"> <el-button type="primary" @click="saveSelectedCate">确 定</el-button> </span>
    </el-dialog>

    <!-- 菜品选择弹框 -->
    <table-product-select ref="tableProdSelectRef" :selectCateId="selectCateId" :isTableProductShow="isTableProductShow" @handleDialogIsShow="handleDialogIsShow" @savedTableProdData="savedTableProdData"></table-product-select>
  </div>
</template>

<script>
import { GetAllCategory, getTableSetMealDetail, tableSetMealOperation } from '@/api/system'
import myUpload from '@/components/my-upload'
import TableProductSelect from './components/table-product-select.vue'

export default {
  components: {
    myUpload,
    TableProductSelect
  },
  data() {
    return {
      categoryList: [],
      setMealForm: {
        setMealName: '',
        setPrice: 0,
        setVipPrice: 0,
        fixedProduct: [],
        optCategory: [],
        prodImage: [],
        display: true,
        sortNo: 0
      },
      addType: 'fixProd',
      selectCateId: '',
      cateLoading: false,
      detailLoading: false,
      submitLoading: false,
      isTableProductShow: false,
      cateDialogVisible: false,
      setMealFormRules: {
        setMealName: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
        setPrice: [{ required: true, message: '套餐价格不能为空', trigger: 'change' }],
        setVipPrice: [{ required: true, message: '套餐会员价格不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    formState() {
      if (this.$route.query.setMealId) {
        return 1
      } else {
        return 0
      }
    },
    totalMoney() {
      let total = 0
      this.setMealForm.fixedProduct.forEach(item => {
        total += item.price
      })
      return total
    }
  },
  mounted() {
    if (this.$route.query.setMealId) {
      this.getSetMealProductDetail()
    }
  },
  methods: {
    getSetMealProductDetail() {
      let params = {
        _id: this.$route.query.setMealId
      }
      this.detailLoading = true
      getTableSetMealDetail(params)
        .then(res => {
          this.detailLoading = false
          this.setMealForm = res.data
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    getProductCategory() {
      let params = {
        belongMenu: '/table-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.cateLoading = true
      GetAllCategory(params)
        .then(res => {
          this.cateLoading = false
          this.categoryList = res.data
        })
        .catch(() => {
          this.cateLoading = false
        })
    },
    addFixedProd() {
      this.addType = 'fixProd'
      this.selectCateId = ''
      this.handleDialogIsShow(true)
    },
    removeFixedProd(index) {
      this.$confirm('确认删除此菜品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setMealForm.fixedProduct.splice(index, 1)
        })
        .catch(() => {})
    },
    addChooseCategoryOrProd() {
      this.cateDialogVisible = true
      this.getProductCategory()
    },
    handleCateSelectionChange(val) {
      this.selectedCate = val.map(item => {
        return {
          categoryId: item.value,
          categoryName: item.label,
          number: 1,
          optProduct: []
        }
      })
    },
    saveSelectedCate() {
      let norepeatSelect = this.selectedCate.filter(item => {
        return this.setMealForm.optCategory.every(v => v.categoryId !== item.categoryId)
      })
      this.setMealForm.optCategory.push(...norepeatSelect)
      this.cateDialogVisible = false
    },
    addCateProd(row) {
      this.addType = 'cateProd'
      this.selectCateId = row.categoryId
      this.handleDialogIsShow(true)
    },
    removeCategoryProd(cateId, pIndex) {
      let cateIndex = this.setMealForm.optCategory.findIndex(item => item.categoryId === cateId)
      this.setMealForm.optCategory[cateIndex].optProduct.splice(pIndex, 1)
    },
    removeChooseCategory(index) {
      this.$confirm('确认删除此分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setMealForm.optCategory.splice(index, 1)
        })
        .catch(() => {})
    },
    handleDialogIsShow(flag) {
      this.isTableProductShow = flag
      if (flag) {
        this.$refs['tableProdSelectRef'].initProdData(this.selectCateId)
      }
    },
    savedTableProdData(list) {
      if (this.addType === 'fixProd') {
        let norepeatSelect = list
          .filter(item => {
            return this.setMealForm.fixedProduct.every(v => v.barCode !== item.barCode)
          })
          .map(item => {
            return {
              uniqueCode: item.uniqueCode,
              productName: item.productName,
              barCode: item.barCode,
              skuTitle: item.title,
              price: item.price,
              markupPrice: 0,
              images: item.imgs && item.imgs.length > 0 ? item.imgs[0].url : '',
              sortNo: 0
            }
          })
        this.setMealForm.fixedProduct.push(...norepeatSelect)
      } else if (this.addType === 'cateProd') {
        let index = this.setMealForm.optCategory.findIndex(item => item.categoryId === this.selectCateId)
        let norepeatSelect = list
          .filter(item => {
            return this.setMealForm.optCategory[index].optProduct.every(v => v.barCode !== item.barCode)
          })
          .map(item => {
            return {
              uniqueCode: item.uniqueCode,
              productName: item.productName,
              barCode: item.barCode,
              skuTitle: item.title,
              price: item.price,
              markupPrice: 0,
              images: item.imgs && item.imgs.length > 0 ? item.imgs[0].url : '',
              sortNo: 0
            }
          })
        this.setMealForm.optCategory[index].optProduct.push(...norepeatSelect)
      }
    },
    sumbitSetMealInfo() {
      this.$refs['setMealFormRef'].validate(valid => {
        if (valid) {
          if (this.setMealForm.optCategory.length <= 0 && this.setMealForm.fixedProduct.length <= 0) {
            return this.$message.warning('请选择套餐包含的固定产品或可选分类！')
          }
          if (this.setMealForm.setPrice < this.setMealForm.setVipPrice) {
            return this.$message.warning('套餐价格不得低于套餐会员价！')
          }
          if (this.setMealForm.optCategory.length <= 0 && this.totalMoney < this.setMealForm.setPrice) {
            return this.$message.warning('套餐价格不得高于套餐所包含产品价格！')
          }
          let params = {
            dto: {
              ...this.setMealForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.formState
          }
          this.submitLoading = true
          tableSetMealOperation(params)
            .then(res => {
              this.$message.success(res.msg)
              this.submitLoading = false
              this.$router.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    handleUploadImg(txt, imgObj) {
      if (!this.setMealForm[txt]) {
        this.$set(this.setMealForm, txt, [])
      }
      this.setMealForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
    },
    // 图片删除回调
    handleRemoveImg(txt, fileList) {
      this.setMealForm[txt] = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #f56c6c;
}
</style>
