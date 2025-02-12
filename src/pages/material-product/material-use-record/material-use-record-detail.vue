<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form ref="addMaterialUseFormRef" :model="addMaterialUseForm" :rules="addMaterialUseFormRules" label-position="top">
      <el-row>
        <el-col :span="14">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="领用人姓名" prop="userName"> <el-input type="text" v-model.trim="addMaterialUseForm.userName" placeholder="请输入领用人姓名"></el-input> </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领用人电话" prop="userPhone"> <el-input type="text" v-model.trim="addMaterialUseForm.userPhone" placeholder="请输入领用人电话"></el-input> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="领用的耗材产品">
                <el-button size="small" type="warning" @click="handleProductSelect(true)" style="margin-bottom:10px">添加耗材产品</el-button>
                <el-table :data="addMaterialUseForm.useProducts" border>
                  <el-table-column type="index" width="60" align="center"></el-table-column>
                  <el-table-column label="产品名称" prop="productName" min-width="160" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column label="产品分类" prop="categoryName" min-width="120" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column label="产品条码" prop="barCode" min-width="120" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column label="领用数量" min-width="140" align="center">
                    <template slot-scope="scope">
                      <el-input-number size="small" v-model="scope.row.count" controls-position="right" :min="0" :step="0.1" step-strictly label="领用数量" style="width:100%"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="160" align="center" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" @click="removeUseProd(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item><el-button :loading="submitLoading" type="primary" @click="submitMaterialUseInfo">确定并提交</el-button></el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <material-prod-select :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></material-prod-select>
  </div>
</template>

<script>
import { getMaterialProductUseRecordDetail, materialProductUseRecordOperation } from '@/api/system'
import MaterialProdSelect from './components/material-prod-select.vue'

export default {
  components: {
    MaterialProdSelect
  },
  data() {
    return {
      addMaterialUseForm: {
        userName: '',
        userPhone: '',
        useProducts: []
      },
      submitLoading: false,
      isShowProductSelect: false,
      addMaterialUseFormRules: {
        userName: [{ required: true, message: '领用人姓名不能为空', trigger: 'blur' }],
        userPhone: [{ required: true, message: '领用人电话不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    addMaterialUseFormState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getMaterialUseRecordDetail()
    }
  },
  methods: {
    getMaterialUseRecordDetail() {
      let params = { _id: this.$route.query.id }
      getMaterialProductUseRecordDetail(params).then(res => {
        this.addMaterialUseForm = res.data
      })
    },
    saveSelected(list) {
      let noRepeatList = list
        .filter(item => {
          return this.addMaterialUseForm.useProducts.every(val => val.barCode !== item.barCode)
        })
        .map(item => {
          return {
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            uniqueCode: item.uniqueCode,
            productId: item._id,
            productName: item.productName,
            barCode: item.barCode,
            count: 1
          }
        })
      this.addMaterialUseForm.useProducts.push(...noRepeatList)
    },
    handleProductSelect(flag) {
      this.isShowProductSelect = flag
    },
    removeUseProd(index) {
      this.addMaterialUseForm.useProducts.splice(index, 1)
    },
    submitMaterialUseInfo() {
      this.$refs['addMaterialUseFormRef'].validate(valid => {
        if (valid) {
          if (this.addMaterialUseForm.useProducts.length <= 0) {
            return this.message.warning('请选择领用的耗材产品信息！')
          }
          let params = {
            dto: {
              ...this.addMaterialUseForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.addMaterialUseFormState
          }
          this.submitLoading = true
          materialProductUseRecordOperation(params)
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
