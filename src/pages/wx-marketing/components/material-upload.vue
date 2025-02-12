<template>
  <div>
    <el-upload
      ref="uploadImg"
      :file-list="imgs"
      :multiple="true"
      action="#"
      :auto-upload="false"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-exceed="onExceed"
      :limit="limitUploadImgs"
      :class="{ hide: hiddenUpload }"
      :on-change="onChange"
    >
      <!-- :http-request="uploadImg" -->
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">只能上传jpg、png文件，且不超过10M</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true"> <img width="100%" :src="dialogImgUrl" alt="" /> </el-dialog>

    <el-dialog title="素材应用类型选择" :visible.sync="isApplyTypeShow" width="400px" top="30vh" @close="isApplyTypeShow = false" :close-on-click-modal="false" append-to-body>
      <el-radio-group v-model="from">
        <el-radio :label="1">云极咖啡</el-radio>
        <el-radio :label="2">云极小超</el-radio>
      </el-radio-group>
      <span slot="footer"> <el-button :loading="qwUploadLoading" type="primary" @click="uploadImg()">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { qiweiImageUpload } from '@/api/system'
export default {
  name: 'my-upload',
  props: {
    imgs: {
      type: Array,
      default: function () {
        return []
      }
    },
    limitUploadImgs: {
      type: Number,
      default: 1
    }
  },
  watch: {
    imgs: {
      handler: function (newValue, oldValue) {
        // 判断是否隐藏上传图片按钮
        this.hiddenUpload = newValue.length >= this.limitUploadImgs
      },
      immediate: true,
      deep: true
    },
    isApplyTypeShow(val) {
      if (!val) {
        this.from = 1
      }
    }
  },
  data () {
    return {
      from: 1,
      uploadFile: null,
      // 隐藏上传图片按钮
      hiddenUpload: false,
      dialogImgUrl: '',
      dialogVisible: false,
      isApplyTypeShow: false,
      qwUploadLoading: false,
      uploadSize: 10 * 1024 * 1024
    }
  },
  methods: {
    // 清空
    clearFiles () {
      this.$refs.uploadImg.clearFiles()
      this.hiddenUpload = false
    },
    // 上传图片change事件,添加文件、上传成功和上传失败时都会被调用
    onChange (file, fileList) {
      this.hiddenUpload = fileList.length >= this.limitUploadImgs
      this.isApplyTypeShow = true
      this.$nextTick(() => {
        this.uploadFile = file.raw
      })
    },
    // 上传图片
    uploadImg () {
      let formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('from', this.from)
      this.qwUploadLoading = true
      qiweiImageUpload(formData).then(res => {
        if (res.success) {
          let data = res.data
          this.$emit('handleDisabledSubmit', false)
          this.$emit('handleUploadImg', data)
          this.isApplyTypeShow = false
          this.qwUploadLoading = false
        }
      }, (err) => {
        this.$message({
          message: err.msg,
          type: 'error'
        })
        this.$emit('handleDisabledSubmit', false)
        this.isApplyTypeShow = false
        this.qwUploadLoading = false
      })
    },
    // 上传之前
    beforeUpload (file) {
      this.$emit('handleDisabledSubmit', true)
      if ((file.type !== 'image/jpg') &&
          (file.type !== 'image/png')) {
            this.$message({
              message: '请上传jpg、png格式的图片!',
              type: 'warning'
            })
            return false
          }
      if (file.size > this.uploadSize) {
          return this.$message.warning('图片大小不要超过10M')
      }
    },
    // 删除上传文件钩子
    handleRemove (file, fileList) {
      this.$emit('handleRemoveImg', fileList)
      this.$emit('handleDisabledSubmit', false)
      this.hiddenUpload = fileList.length >= this.limitUploadImgs
    },
    // 点击上传图片钩子
    handlePictureCardPreview (file) {
      this.dialogImgUrl = file.url
      this.dialogVisible = true
    },
    // 上传图片超出限制
    onExceed (files, fileList) {
      this.$message({
        message: '只能上传 ' + this.limitUploadImgs + ' 张图片',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .hide .el-upload--picture-card {
  display: none;
}
</style>
