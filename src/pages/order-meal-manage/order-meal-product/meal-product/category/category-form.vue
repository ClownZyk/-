<template>
  <el-dialog :visible.sync="formV" :title="operateTitle" width="800px" @closed="closed">
    <el-form ref="form" :model="form" :rules="formRules" label-width="86px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分类名称" prop="categoryName"> <el-input v-model.trim="form.categoryName" clearable :disabled="operateAction === 1"></el-input> </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类编码" prop="code"> <el-input v-model.trim="form.code" clearable :disabled="operateAction === 1"></el-input> </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <!--
          <el-col :span="12">
            <el-form-item label="分类级数" prop="level"> <el-input-number v-model="form.level" :min="0" :step="1" step-strictly placeholder="分类级数" style="width: 100%"></el-input-number> </el-form-item>
          </el-col>
        -->
        <el-col :span="12">
          <el-form-item label="排序号" prop="sortNo"> <el-input-number v-model="form.sortNo" :min="99" :step="1" step-strictly placeholder="最小值为99" style="width: 100%"></el-input-number> </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="打印权限" prop="isPrint"> <el-switch v-model="form.isPrint"> </el-switch> </el-form-item>
        </el-col>
      </el-row>
      <!--
        <el-form-item label="父类" prop="belong">
          <el-cascader style="width:270px;" v-model="form.belongs" :options="belongList" :props="formProps" @change="changeBelong"></el-cascader>
        </el-form-item>
      -->
      <!-- <el-form-item label="跳转链接" prop="url"> <el-input v-model.trim="form.url" clearable></el-input> </el-form-item> -->
      <!-- <el-form-item label="分类简介" prop="remark"> <el-input v-model="form.remark" type="textarea" :rows="2"></el-input> </el-form-item> -->
      <el-form-item label="分类主图" prop="imgs">
        <my-upload :imgs="form.imgs" :limitUploadImgs="1" ref="uploadImg" @handleDisabledSubmit="handleDisabledSubmit" @handleRemoveImg="handleRemoveImg('img', 1, $event)" @handleUploadImg="handleUploadImg('img', 1, $event)"> </my-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" @click="closed">返回</el-button>
      <el-button type="primary" @click.native="formSubmit" :loading="formLoading" :disabled="disabledSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {Operation} from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  name: 'categoryForm',
  props: {
    formVisible: Boolean,
    operateTitle: String,
    operateAction: Number,
    oldForm: Object,
    belongList: Array,
    belongMenu: String
  },
  watch: {
    formVisible: function (newValue, oldValue) {
      this.formV = newValue
    },
    oldForm: {
      handler: function (newValue, oldValue) {
        this.form = JSON.parse(JSON.stringify(newValue))
        // 递归出form中belong的父子集结构
        if (this.belongList.length > 0 && this.form.belong) {
          this.form.belongs = []
          this.getBelongs(this.belongList, this.form.belong)
        }
      },
      deep: true
    }
  },
  components: {
    myUpload
  },
  data () {
    return {
      // 表单数据
      form: {
        sortNo: 99,
        isPrint: false,
        code: ''
      },
      // 控制form是否显示
      formV: false,
      // 控制是否显示loading
      formLoading: false,
      // form校验规则
      formRules: {
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 是否禁用提交按钮
      disabledSubmit: false,
      formProps: {
        value: '_id',
        label: 'categoryName',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  methods: {
    // 改变父级时
    changeBelong (curr) {
      if (this.form._id && (this.form._id === curr[curr.length - 1])) {
        this.$message({
          message: '分类的父级不能是自己',
          type: 'warning'
        })
        this.form.belongs = []
        return false
      }
    },
    // 根据belong获取belongs
    getBelongs (list, opt) {
      try {
        this._getBelongs(list, opt)
      } catch (e) {
        // console.log(that.form.belongs)
      }
    },
    _getBelongs (list, opt) {
      let that = this
      list.forEach(val => {
        that.form.belongs.push(val._id)
        if (val._id === opt) {
          // 跳出所以循环
          // eslint-disable-next-line
          throw ('break all')
        } else if (val.children && val.children.length > 0) {
          // 判断是否还有子项
          that._getBelongs(val.children, opt)
          // 如果子项循环完还是没有跳出循环，删除父级
          that.form.belongs.pop()
        } else {
          // 没有子项，直接删除当前节点
          that.form.belongs.pop()
        }
      })
    },
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.disabledSubmit = val
    },
    // 删除图片
    handleRemoveImg (txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
      }
    },
    // 图片上传成功回调
    handleUploadImg (txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    // 清空表单数据和表单验证
    closed: function () {
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
      this.$refs.uploadImg.clearFiles()
      this.disabledSubmit = false
      this.$emit('closeForm')
    },
    // 各种清空
    clear: function () {
      this.formLoading = false
      this.disabledSubmit = false
      this.$refs.uploadImg.clearFiles()
      this.$emit('closeForm')
      this.$emit('refreshData')
    },
    // 提交表单
    formSubmit: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          // 设置创建人、角色ID、cid
          this.$set(this.form, 'creater', this.$store.state.UserID)
          this.$set(this.form, 'isShow', true)
          this.$set(this.form, 'roleId', this.$store.state.UserRole)
          this.$set(this.form, 'cid', this.$store.state._cid)
          this.$set(this.form, 'belongMenu', this.belongMenu)
          // console.log(this.form)
          let belongs = this.form.belongs || []
          if (belongs.length > 0) {
            this.form.belong = belongs[belongs.length - 1]
          }
          let params = {
              Dto: Object.assign({}, this.form),
              Action: this.operateAction
          }
          Operation(params).then(res => {
              // console.log(res)
              this.$message({
                  message: res.msg,
                  type: res.success ? 'success' : 'error'
              })
              this.clear()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
