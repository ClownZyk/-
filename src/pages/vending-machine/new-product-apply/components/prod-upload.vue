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
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true"> <img width="100%" :src="dialogImgUrl" alt="" /> </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
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
    },
    uploadSize: {
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
    }
  },
  data () {
    return {
      // 隐藏上传图片按钮
      hiddenUpload: false,
      dialogImgUrl: '',
      dialogVisible: false,
      img: {url: '', thumUrl: '', absoluteUrl: ''}
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
      if ((file.raw.type !== 'image/jpeg') &&
          (file.raw.type !== 'image/jpg') &&
          (file.raw.type !== 'image/png')) {
            this.$emit('update:imgs', fileList.filter(item => item.uid !== file.uid))
            return this.$message.warning('请上传jpg、jpeg、png格式的图片!')
      }
      if (file.size > (this.uploadSize * 1024 * 1024)) {
        this.$emit('update:imgs', fileList.filter(item => item.uid !== file.uid))
        return this.$message.warning(`图片大小不要超过${this.uploadSize * 1000}kb`)
      }
      this.$emit('handleUploadImgFile', file.raw)
      this.hiddenUpload = fileList.length >= this.limitUploadImgs
    },
    // 上传之前
    beforeUpload (file) {
      if ((file.type !== 'image/jpeg') &&
          (file.type !== 'image/jpg') &&
          (file.type !== 'image/png')) {
            this.$message({
              message: '请上传jpg、jpeg、png格式的图片!',
              type: 'warning'
            })
            return false
          }
      if (file.size > (this.uploadSize * 1024 * 1024)) {
        return this.$message.warning(`图片大小不要超过${this.uploadSize * 1000}kb`)
      }
      this.$emit('handleUploadImgFile', file)
    },
    // 删除上传文件钩子
    handleRemove (file, fileList) {
      this.$emit('handleRemoveImg', fileList)
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
