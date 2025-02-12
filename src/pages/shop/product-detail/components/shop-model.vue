<template>
  <div class="shop-model">
    <div class="page-contain">
      <el-form ref="addFormRef" :model="addForm" label-position="top" :rules="formRules">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="型号" prop="title"> <el-input type="text" v-model.trim="addForm.title" placeholder="请输入型号"></el-input> </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="单位换算" prop="unitName">
              <span>1</span>
              <el-input type="text" v-model.trim="addForm.unitName" style="width: 40%"></el-input>
              <span>=</span>
              <el-input-number v-model="addForm.convertCount" :min="1" :step="1" step-strictly :controls="false" style="width: 40%"></el-input-number>
              <span>{{ baseUnitName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="产品条码" prop="barCode"> <el-input type="text" v-model.trim="addForm.barCode" placeholder="请输入产品条码"></el-input> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="零售价" prop="price">
              <el-input-number
                v-model="addForm.price"
                placeholder="请输入零售价"
                :min="0"
                :step="0.01"
                step-strictly
                :controls="false"
                style="width: 100%"
                @change="(currentValue, oldValue) => priceChange(currentValue, oldValue, 'addForm')"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员价" prop="vipPrice"> <el-input-number v-model="addForm.vipPrice" placeholder="请输入会员价" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成本价" prop="costPrice"> <el-input-number v-model="addForm.costPrice" placeholder="请输入成本价" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="sku主图">
              <my-upload :imgs="addForm.imgs" :limitUploadImgs="1" ref="uploadImgRef" @handleRemoveImg="handleRemoveImg('addForm', 'img', 1, $event)" @handleUploadImg="handleUploadImg('addForm', 'img', 1, $event)"></my-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item> <el-button size="small" type="warning" @click="addSku">添加型号</el-button> </el-form-item>
      </el-form>
      <!-- sku列表 -->
      <div class="list-table">
        <el-table ref="listTableRef" :data="skuList" border>
          <el-table-column type="index" width="60" align="center"></el-table-column>
          <!-- <el-table-column align="center" prop="id" label="id" width="60" show-overflow-tooltip></el-table-column> -->
          <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="barCode" label="商品条码" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="换算关系" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>1{{ scope.row.unitName }} = {{ scope.row.convertCount }}{{ baseUnitName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="零售价" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="vipPrice" label="会员价" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="costPrice" label="成本价" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="img" label="图片" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <img v-if="scope.row.img && scope.row.img.url" :src="scope.row.img.url" style="max-width: 100%; max-height: 60px;" /> <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleSkuEdit(scope.row, scope.$index)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handleSkuRemove(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog title="sku信息" :visible.sync="isEditFormShow" width="700px" @closed="closedEditForm" :close-on-click-modal="false">
        <el-form ref="editFormRef" :model="editForm" :rules="formRules">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="型号" prop="title"> <el-input v-model="editForm.title"></el-input> </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品条码" prop="barCode"> <el-input v-model="editForm.barCode" disabled></el-input> </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位换算" prop="unitName">
                <span>1</span>
                <el-input type="text" v-model.trim="editForm.unitName" style="width: 40%"></el-input>
                <span>=</span>
                <el-input-number v-model="editForm.convertCount" :min="1" :step="1" step-strictly :controls="false" style="width: 40%"></el-input-number>
                <span>{{ baseUnitName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="零售价" prop="price">
                <el-input-number v-model="editForm.price" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%" @change="(currentValue, oldValue) => priceChange(currentValue, oldValue, 'editForm')"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="会员价" prop="vipPrice"> <el-input-number v-model="editForm.vipPrice" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成本价" prop="costPrice"> <el-input-number v-model="editForm.costPrice" :min="0" :step="0.01" step-strictly :controls="false" style="width: 100%"></el-input-number> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="列表主图" prop="imgs" style="width: 100%;">
              <my-upload :imgs="editForm.imgs" :limitUploadImgs="1" ref="editFormUploadImgRef" @handleRemoveImg="handleRemoveImg('editForm', 'img', 1, $event)" @handleUploadImg="handleUploadImg('editForm', 'img', 1, $event)"></my-upload>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer"><el-button type="primary" @click.native="submitEditForm">修改</el-button></div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import myUpload from '@/components/my-upload'
export default {
  props: {
    skuList: {
      type: Array,
      default() {
        return []
      }
    },
    baseUnitName: {
      type: String,
      default: ''
    }
  },
  components: {
    myUpload
  },
  data() {
    return {
      addForm: {
        title: '',
        barCode: '',
        unitName: '',
        convertCount: 1,
        price: 0,
        vipPrice: 0,
        costPrice: 0,
        oriPrice: 0,
        stock: 0,
        shaJia: 0,
        img: null,
        imgs: []
      },
      editForm: {},
      editIndex: 0,
      isEditFormShow: false,
      formRules: {
        title: [{ required: true, message: '请输入商型号', trigger: 'blur' }],
        barCode: [{ required: true, message: '请输入商品条形码', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
        price: [
          {
            required: true,
            pattern: /^[0-9]+([.][0-9]{1,2})?$/,
            message: '请输入正确价格，且仅保留两位小数',
            trigger: 'blur'
          }
        ],
        vipPrice: [
          {
            required: true,
            pattern: /^[0-9]+([.][0-9]{1,2})?$/,
            message: '请输入正确价格，且仅保留两位小数',
            trigger: 'blur'
          }
        ],
        oriPrice: [
          {
            required: true,
            pattern: /^[0-9]+([.][0-9]{1,2})?$/,
            message: '请输入正确价格，且仅保留两位小数',
            trigger: 'blur'
          }
        ],
        shaJia: [
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
  methods: {
    priceChange(currentVal, oldValue, formType) {
      this[formType].vipPrice = currentVal
    },
    // 添加一条记录
    addSku() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (this.skuList.length === 0) {
            this.addForm.id = 1
          } else {
            let index = this.skuList.length
            let id = this.skuList[index - 1].id
            this.addForm.id = id + 1
          }
          this.skuList.push(JSON.parse(JSON.stringify(this.addForm)))
          this.clear()
        }
      })
    },
    handleSkuEdit(row, index) {
      this.isEditFormShow = true
      this.editIndex = index
      this.editForm = JSON.parse(JSON.stringify(row))
      if (row.img && row.img.url) {
        this.editForm.imgs.push({ url: row.img.url })
      }
    },
    handleSkuRemove(index) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.skuList.splice(index, 1)
        })
        .catch(() => {})
    },
    handleRemoveImg(formTxt, txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this[formTxt][txt] = fileList
      } else {
        this[formTxt][txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    handleUploadImg(formTxt, txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this[formTxt][txt]) {
          this.$set(this[formTxt], txt, [])
        }
        this[formTxt][txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this[formTxt][txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    clearEditForm() {
      this.$refs['editFormRef'].clearValidate()
      this.$refs['editFormRef'].resetFields()
      this.editForm = {}
      this.$refs['editFormUploadImgRef'].clearFiles()
    },
    closedEditForm() {
      this.isEditFormShow = false
      this.clearEditForm()
    },
    submitEditForm() {
      this.$refs['editFormRef'].validate(valid => {
        if (valid) {
          this.$confirm('确认修改该sku信息吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.skuList.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.editForm)))
            this.closedEditForm()
            this.$message({
              type: 'success',
              message: '修改成功，若无其他操作，请提交商品信息'
            })
          })
        }
      })
    },
    clear() {
      this.$refs['addFormRef'].clearValidate()
      this.$refs['addFormRef'].resetFields()
      this.addForm = {
        title: '',
        barCode: '',
        unitName: '',
        convertCount: 1,
        price: 0,
        vipPrice: 0,
        costPrice: 0,
        oriPrice: 0,
        stock: 0,
        shaJia: 0,
        img: null,
        imgs: []
      }
      this.$refs['uploadImgRef'].clearFiles()
    }
  }
}
</script>
<style lang="scss" scoped></style>
