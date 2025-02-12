<template>
  <div v-loading="listLoading" class="base-info">
    <el-form ref="formRef" :model="form" :rules="formRules" label-position="top">
      <el-row :gutter="20">
        <!-- 商品基本信息 -->
        <el-col :span="12">
          <el-divider content-position="left">基本信息</el-divider>
          <!-- 产品名称和分类 -->
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="产品名称" prop="productName"> <el-input type="text" v-model.trim="form.productName" placeholder="请输入产品名称" clearable></el-input> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品分类" prop="categoryId">
                <el-cascader v-model="form.categoryId" :options="categoryList" :props="{ checkStrictly: true, emitPath: false }" :show-all-levels="false" clearable placeholder="请选择产品分类" style="width: 100%"></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 单位，共享库存，排序号 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="产品主单位" prop="unitName"> <el-input type="text" v-model.trim="form.unitName" placeholder="请输入产品主单位" clearable></el-input> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享库存" prop="stock"> <el-input-number v-model="form.stock" :controls="false" :min="0" :step="1" step-strictly style="width:100%"></el-input-number> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序号"> <el-input-number v-model="form.sortNo" controls-position="right" :min="0" :step="1" step-strictly style="width:100%"></el-input-number> </el-form-item>
            </el-col>
          </el-row>
          <!-- 简介 -->
          <el-row>
            <el-col>
              <el-form-item label="产品简介"> <el-input type="textarea" :rows="4" v-model="form.summary" placeholder="请输入产品简介"></el-input> </el-form-item>
            </el-col>
          </el-row>
          <!-- 上下架，店长推荐，热销 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="上下架"> <el-switch v-model="form.isShow"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="店长推荐"> <el-switch v-model="form.isTop"></el-switch> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否热销"> <el-switch v-model="form.sellWell"></el-switch> </el-form-item>
            </el-col>
          </el-row>
          <!-- 图片 -->
          <el-row>
            <el-col>
              <el-form-item label="产品主图">
                <my-upload :imgs="form.mainImgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)" @handleUploadImg="handleUploadImg('mainImg', 1, $event)"> </my-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <!-- 商品型号 -->
        <el-col :span="12">
          <el-divider content-position="left">商品型号</el-divider>
          <shop-model :baseUnitName="form.unitName" :skuList="form.sku"></shop-model>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { GetAllCategory, ShopOperation } from '@/api/system'
import myUpload from '@/components/my-upload'
import ShopModel from './shop-model.vue'

export default {
  props: {
    listLoading: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    myUpload,
    ShopModel
  },
  computed: {
    operateAction() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  data() {
    return {
      categoryList: [],
      formRules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        unitName: [{ required: true, message: '请输入商品主单位', trigger: 'blur' }],
        stock: [{ required: true, message: '库存不能为空', trigger: 'change' }]
      },
      skuRules: {
        title: [{ required: true, message: '请输入商型号', trigger: 'blur' }],
        barCode: [{ required: true, message: '请输入商品条形码', trigger: 'blur' }],
        price: [
          {
            required: true,
            pattern: /^[0-9]+([.][0-9]{1,2})?$/,
            message: '请输入正确价格，且仅保留两位小数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getAllCategory()
  },
  methods: {
    getAllCategory() {
      this.loading = true
      let params = {
        belongMenu: '/product-category,/service-category',
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
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          if (this.form.sku.length <= 0) {
            return this.$message.warning('商品型号不能为空！')
          }
          let params = {
            dto: {
              ...this.form,
              cid: this.$store.state._cid,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole
            },
            action: this.operateAction
          }
          // console.log(params)
          ShopOperation(params).then(res => {
            this.$message.success(res.msg)
            this.$router.push('/product-list')
          })
        }
      })
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
