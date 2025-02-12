<template>
  <div>
    <el-dialog title="员工信息" :visible.sync="isShow" width="800px" @close="handleDialogClosed" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="detailForm" :rules="addFormRules" label-width="120px" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="员工姓名" prop="realName"><el-input type="text" v-model.trim="detailForm.realName" placeholder="请输入员工姓名"></el-input></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工电话" prop="phone"><el-input type="text" v-model.trim="detailForm.phone" placeholder="请输入员工电话"></el-input></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工职位" prop="post"><el-input type="text" v-model.trim="detailForm.post" placeholder="请输入员工职位"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" v-show="isManage">
            <el-form-item label="所属门店" prop="belongCid">
              <el-select v-model="detailForm.belongCid" placeholder="请选择员工所属门店" @change="shopChange">
                <el-option v-for="item in shopList.slice(1)" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工等级" prop="grade"><el-input type="text" v-model.trim="detailForm.grade" placeholder="请输入员工等级"></el-input></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工勋章" prop="medal">
              <el-select v-model="detailForm.medal" placeholder="请选择员工勋章" multiple collapse-tags> <el-option v-for="item in medalList" :key="item.id" :label="item.medalListName" :value="item.id"> </el-option> </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!--
            <el-col :span="8">
              <el-form-item label="员工积分" prop="integral">
                <el-input-number v-model="detailForm.integral" :controls="false" :min="0" :step="0.1" step-strictly label="请输入员工积分"></el-input-number>
              </el-form-item>
            </el-col>
          -->
          <!--
            <el-col :span="8">
              <el-form-item label="员工标签" prop="labels">
                <el-input type="text" v-model.trim="detailForm.labels" placeholder="请输入员工标签"></el-input>
              </el-form-item>
            </el-col>
          -->
          <el-col :span="8">
            <el-form-item label="是否为管理员" prop="isLookUp">
              <el-radio-group v-model="detailForm.isLookUp" size="medium">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="员工居住地" prop="address"> <el-input type="text" v-model.trim="detailForm.address" placeholder="请输入员工居住地"></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="员工证件照" prop="faceImage">
              <my-upload :imgs="imgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg('faceImage', $event)" @handleUploadImg="handleUploadImg('faceImage', $event)"> </my-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClosed">取 消</el-button>
        <el-button type="primary" @click="submitStaff">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllStore } from '@/api/system'
import myUpload from '@/components/my-upload'

export default {
  props: {
    isStaffShow: {
      type: Boolean,
      default: false
    },
    detailForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    myUpload
  },
  watch: {
    detailForm(val) {
      this.imgs = val.faceImage && val.faceImage.url ? [val.faceImage] : []
    },
    isStaffShow(val) {
      this.isShow = val
      if (!val) {
        this.detailForm.belongName = ''
        this.$refs.addFormRef.resetFields()
        this.imgs = []
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      isShow: false,
      shopList: [],
      medalList: [],
      imgs: [],
      staffLabels: '',
      addFormRules: {
        realName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入员工电话', trigger: 'blur' }],
        number: [{ required: true, message: '请输入员工编号', trigger: 'blur' }],
        post: [{ required: true, message: '请输入员工职位', trigger: 'blur' }],
        belongCid: [{ required: true, message: '请选择员工所属门店', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getAllShop()
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
          this.shopList = res.data.map(item => {
            return {
              cid: item.cid,
              companyName: item.companyName
            }
          })
        }
      })
    },
    submitStaff() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (!this.detailForm.faceImage || !this.detailForm.faceImage.url) {
            this.$message.warning('请上传员工证件照！')
            return false
          }
          this.$emit('staffOperation')
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:isStaffShow', false)
    },
    shopChange(val) {
      this.detailForm.belongName = this.shopList.find(item => item.cid === val).companyName
    },
    handleRemoveImg(txt, fileList) {
      this.detailForm[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
    },
    handleUploadImg(txt, imgObj) {
      this.detailForm[txt] = JSON.parse(JSON.stringify(imgObj))
    }
  }
}
</script>

<style lang="scss" scoped></style>
