<template>
  <div>
    <el-form ref="addPropertyFormRef" :model="addPropertyForm" :rules="addPropertyFormRules" label-position="top">
      <el-row>
        <el-col :span="14">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="资产名称" prop="propertyName"> <el-input type="text" v-model.trim="addPropertyForm.propertyName" placeholder="请输入资产名称"></el-input> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产类别（中台账号添加）" prop="categoryId">
                <el-cascader v-model="addPropertyForm.categoryId" :options="categoryList" :props="cateProps" clearable placeholder="请选择资产类别" style="width:100%"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产编码" prop="propertyCode"> <el-input type="text" v-model.trim="addPropertyForm.propertyCode" placeholder="请输入资产编码"></el-input> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="资产位置" prop="address"> <el-input type="text" v-model.trim="addPropertyForm.address" placeholder="请输入资产位置"></el-input> </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="采购价格（元）" prop="price"> <el-input-number v-model="addPropertyForm.price" :controls="false" :min="0" :step="0.1" step-strictly label="采购价格" style="width:100%"></el-input-number> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购日期" prop="display">
                <el-date-picker v-model="addPropertyForm.display" type="datetime" placeholder="选择采购日期时间" format="yyyy/MM/dd HH:mm:ss" value-format="yyyy/MM/dd HH:mm:ss" style="width:100%"> </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保修日期" prop="warrantyDate">
                <el-date-picker v-model="addPropertyForm.warrantyDate" type="datetime" placeholder="选择报修日期时间" format="yyyy/MM/dd HH:mm:ss" value-format="yyyy/MM/dd HH:mm:ss" default-time="23:59:59" style="width:100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-divider content-position="left">资产负责人信息</el-divider>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="负责人姓名" prop="headUp.headUpName"> <el-input type="text" v-model.trim="addPropertyForm.headUp.headUpName" placeholder="请输入负责人姓名"></el-input> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负责人电话" prop="headUp.headUpPhone"> <el-input type="text" v-model.trim="addPropertyForm.headUp.headUpPhone" placeholder="请输入负责人电话"></el-input> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负责人职位" prop="headUp.job"> <el-input type="text" v-model.trim="addPropertyForm.headUp.job" placeholder="请输入负责人职位"></el-input> </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-divider content-position="left">供应商信息</el-divider>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="供应商名称" prop="supplier.supplierName"> <el-input type="text" v-model.trim="addPropertyForm.supplier.supplierName" placeholder="请输入供应商名称"></el-input> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商联系人" prop="supplier.contacts"> <el-input type="text" v-model.trim="addPropertyForm.supplier.contacts" placeholder="请输入供应商联系人"></el-input> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人电话" prop="supplier.supplierPhone"> <el-input type="text" v-model.trim="addPropertyForm.supplier.supplierPhone" placeholder="请输入供应商联系人电话"></el-input> </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="资产备注" prop="remarks"> <el-input type="textarea" v-model="addPropertyForm.remarks" :rows="2" placeholder="请输入资产备注"></el-input> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="资产图片">
                <my-upload :imgs="addPropertyForm.fileImages" :limitUploadImgs="3" @handleRemoveImg="handleRemoveImg('fileImages', 3, $event)" @handleUploadImg="handleUploadImg('fileImages', 3, $event)"> </my-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitPropertyInfo">确定并提交</el-button> </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import myUpload from '@/components/my-upload'
import { getDataString } from '@/filters/filters'
import { GetAllCategory, getPropertyInfoDetail, propertyInfoOperation } from '@/api/system'

export default {
  components: {
    myUpload
  },
  data() {
    return {
      categoryList: [],
      addPropertyForm: {
        propertyName: '',
        categoryId: '',
        display: getDataString(new Date(), 'yyyy/MM/dd hh:mm:ss'),
        price: 0,
        propertyCode: '',
        supplier: {},
        address: '',
        warrantyDate: getDataString(new Date(), 'yyyy/MM/dd 23:59:59'),
        headUp: {},
        remarks: '',
        fileImages: []
      },
      submitLoading: false,
      cateProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      addPropertyFormRules: {
        propertyName: [{ required: true, message: '请输入资产名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择资产类别', trigger: 'change' }],
        display: [{ required: true, message: '请选择采购日期', trigger: 'change' }],
        price: [{ required: true, message: '请输入资产采购价格', trigger: 'change' }],
        propertyCode: [{ required: true, message: '请输入资产编码', trigger: 'blur' }],
        address: [{ required: true, message: '请输入资产位置', trigger: 'blur' }],
        'headUp.headUpName': [{ required: true, message: '资产负责人姓名不能为空', trigger: 'blur' }],
        'headUp.headUpPhone': [{ required: true, message: '资产负责人电话不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    addPropertyFormState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.getPropertycate()
    if (this.$route.query.id) {
      this.getPropertyDetail()
    }
  },
  methods: {
    getPropertycate() {
      let params = {
        belongMenu: '/property-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
      })
    },
    getPropertyDetail() {
      let params = {
        _id: this.$route.query.id
      }
      getPropertyInfoDetail(params).then(res => {
        this.addPropertyForm = res.data
      })
    },
    submitPropertyInfo() {
      this.$refs['addPropertyFormRef'].validate(valid => {
        if (valid) {
          let params = {
            dto: {
              ...this.addPropertyForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.addPropertyFormState
          }
          // console.log(params)
          this.submitLoading = true
          propertyInfoOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.$router.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.addPropertyForm[txt] = fileList
      } else {
        this.addPropertyForm[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.addPropertyForm[txt]) {
          this.$set(this.addPropertyForm, txt, [])
        }
        this.addPropertyForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.addPropertyForm[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
