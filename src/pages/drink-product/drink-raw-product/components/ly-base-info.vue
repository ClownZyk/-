<template>
  <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="原料名称" prop="productName"> <el-input type="text" v-model.trim="addForm.productName" placeholder="请输入原料名称"></el-input> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原料分类" prop="categoryId">
              <el-cascader v-model="addForm.categoryId" :options="categoryList" :props="{ checkStrictly: true, emitPath: false }" :show-all-levels="false" placeholder="请选择原料分类" clearable style="width:100%"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 库存，单位，排序号 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="主单位" prop="unitName"> <el-input type="text" v-model.trim="addForm.unitName" placeholder="请输入商品主单位"></el-input> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存" prop="stock"> <el-input-number v-model="addForm.stock" :controls="false" placeholder="库存" :min="0" :step="1" step-strictly style="width:100%"></el-input-number></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序号" prop="sortNo"> <el-input-number v-model="addForm.sortNo" :controls="false" placeholder="排序号" :min="99" :step="1" step-strictly style="width:100%"></el-input-number></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="原料型号">
              <el-table :data="addForm.sku" border size="small">
                <el-table-column label="型号" min-width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.title" placeholder="型号"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="条码" min-width="160" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.barCode" placeholder="请输入条码"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="单位换算" min-width="180" align="center">
                  <template slot-scope="scope">
                    1 <el-input size="mini" v-model.trim="scope.row.unitName" style="width: 60px"></el-input> =
                    <el-input-number size="mini" :controls="false" v-model="scope.row.convertCount" :min="0" :step="1" step-strictly style="width:60px"></el-input-number><span>{{ addForm.unitName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="采购价" min-width="120" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number size="mini" controls-position="right" v-model="scope.row.oriPrice" placeholder="采购价" :min="0" :step="0.01" step-strictly style="width:100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="供货价" min-width="120" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number size="mini" controls-position="right" v-model="scope.row.costPrice" placeholder="供货价" :min="0" :step="0.01" step-strictly style="width:100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="市场参考价" min-width="120" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number size="mini" controls-position="right" v-model="scope.row.price" placeholder="市场参考价" :min="0" :step="0.01" step-strictly style="width:100%"></el-input-number>
                  </template>
                </el-table-column>
                <!--
                  <el-table-column label="会员价" min-width="120" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input-number size="mini" controls-position="right" v-model="scope.row.vipPrice" placeholder="会员价" :min="0" :step="0.01" step-strictly style="width:100%"></el-input-number>
                    </template>
                  </el-table-column>
                -->
                <el-table-column width="160" align="center" fixed="right">
                  <template slot="header" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAddSku(scope.row)">新增型号</el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDeleteSku(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 主图 -->
        <el-row>
          <el-col>
            <el-form-item label="原料主图" prop="mainImg">
              <my-upload :imgs="mainImgFilelist" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)" @handleUploadImg="handleUploadImg('mainImg', 1, $event)"></my-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item> <el-button type="primary" @click="sumbitRawProductInfo">提交</el-button> </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getDrinkRawProductDetail, drinkRawProductOperation, GetAllCategory } from '@/api/system'
import myUpload from '@/components/my-upload'

export default {
  components: {
    myUpload
  },
  data() {
    return {
      addForm: {
        rawType: 2,
        categoryId: '',
        categoryName: '',
        productName: '',
        sortNo: 99,
        mainImg: null,
        imgs: [],
        sku: [],
        unitName: '',
        stock: 0
      },
      mainImgFilelist: [],
      categoryList: [],
      addFormRules: {
        productName: [{ required: true, message: '原料名称不能为空', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择原料分类', trigger: 'change' }],
        unitName: [{ required: true, message: '原料主单位不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    addFormState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.getProductCategory()
    if (this.$route.query.id) {
      this.getRawProductDetail()
    }
  },
  methods: {
    // 获取原料产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/raw-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
      })
    },
    getRawProductDetail() {
      let params = {
        _id: this.$route.query.id
      }
      getDrinkRawProductDetail(params).then(res => {
        this.addForm = res.data
        if (res.data.mainImg && res.data.mainImg.url) {
          this.mainImgFilelist = [{ url: res.data.mainImg.url }]
        }
      })
    },
    handleAddSku() {
      let row = {
        title: '',
        barCode: '',
        unitName: '',
        convertCount: 1,
        price: 0,
        vipPrice: 0,
        costPrice: 0,
        oriPrice: 0,
        shaJia: 0,
        stock: 0,
        img: null
      }
      if (this.addForm.sku.length === 0) {
        row.id = 1
      } else {
        let index = this.addForm.sku.length
        let id = this.addForm.sku[index - 1].id
        row.id = id + 1
      }
      this.addForm.sku.push(row)
    },
    handleDeleteSku(index) {
      this.addForm.sku.splice(index, 1)
    },
    sumbitRawProductInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (this.addForm.sku.length <= 0) {
            return this.$message.warning('请添加原料商品型号！')
          }
          let sku = this.addForm.sku.find(v => !v.title || !v.barCode)
          if (sku) {
            return this.$message.warning('请将型号或条码填写完整后再提交！')
          }
          let params = {
            dto: {
              ...this.addForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.addFormState
          }
          drinkRawProductOperation(params).then(res => {
            this.$message.success(res.msg)
            this.$router.back()
          })
        }
      })
    },
    // 删除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.addForm[txt] = fileList
      } else {
        this.addForm[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.addForm[txt]) {
          this.$set(this.addForm, txt, [])
        }
        this.addForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.addForm[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
