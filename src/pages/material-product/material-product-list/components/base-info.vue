<template>
  <div class="base-info">
    <el-form ref="productDetailRef" :model="productDetail" :rules="productDetailRules" label-position="top">
      <el-row>
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item label="商品名称" prop="productName"> <el-input type="text" v-model.trim="productDetail.productName" placeholder="请输入商品名称"></el-input> </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="商品分类" prop="categoryId"> <el-cascader v-model="productDetail.categoryId" :options="categoryList" :props="{ emitPath: false, checkStrictly: true }" style="width:100%"></el-cascader> </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商品单位" prop="unitName"> <el-input type="text" v-model.trim="productDetail.unitName" placeholder="请输入商品单位"></el-input> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品库存" prop="stock"> <el-input-number v-model="productDetail.stock" :min="0" :controls="false" :step="1" step-strictly style="width:100%"></el-input-number> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序号" prop="sortNo"> <el-input-number v-model="productDetail.sortNo" :min="0" :step="1" step-strictly style="width:100%"></el-input-number> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品型号" prop="sku">
                <el-table :data="productDetail.sku" border>
                  <el-table-column align="center" prop="id" label="id" min-width="60" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" prop="barCode" label="商品条码" min-width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="换算单位" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>1{{ scope.row.title }} = {{ scope.row.convertCount }}{{ productDetail.unitName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="price" label="价格" min-width="80" show-overflow-tooltip></el-table-column>
                  <!--
                    <el-table-column align="center" prop="img" label="图片" width="160" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <img v-if="scope.row.img && scope.row.img.url" :src="scope.row.img.url" style="max-width: 100%; max-height: 60px;" /> <span v-else>--</span>
                      </template>
                    </el-table-column>
                  -->
                  <!--
                    <el-table-column align="center" label="操作" width="160" fixed="right">
                      <template slot-scope="scope">
                        <el-button type="warning" size="mini" @click="handleSkuEdit(scope.row, scope.$index)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleSkuDelete(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  -->
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品主图">
                <my-upload :imgs="productDetail.mainImgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)" @handleUploadImg="handleUploadImg('mainImg', 1, $event)"> </my-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { materialProductOperation, GetAllCategory } from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  props: {
    productDetail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    myUpload
  },
  data() {
    return {
      categoryList: [],
      productDetailRules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        unitName: [{ required: true, message: '商品单位不能为空', trigger: 'change' }],
        stock: [{ required: true, message: '商品库存不能为空', trigger: 'change' }],
        sortNo: [{ required: true, message: '排序号不能为空', trigger: 'change' }]
      }
    }
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
  mounted() {
    this.GetAllCategory()
  },
  methods: {
    GetAllCategory() {
      let params = {
        belongMenu: '/material-product-category',
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
    // 提交表单
    formSubmit() {
      this.$refs['productDetailRef'].validate(valid => {
        if (valid) {
          if (this.productDetail.sku.length <= 0) {
            return this.$message({
              message: '商品型号不能为空！',
              type: 'warn'
            })
          }
          this.$confirm('确认提交该耗材产品数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              dto: {
                ...this.productDetail,
                creater: this.$store.state.UserID,
                roleId: this.$store.state.UserRole,
                cid: this.$route.query.cid
              },
              action: this.operateAction
            }
            // console.log(params)
            materialProductOperation(params).then(res => {
              this.$message.success(res.msg)
              this.$router.push('material-product-list')
            })
          })
        }
      })
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.productDetail[txt] = fileList
      } else {
        this.productDetail[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.productDetail[txt]) {
          this.$set(this.productDetail, txt, [])
        }
        this.productDetail[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.productDetail[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
