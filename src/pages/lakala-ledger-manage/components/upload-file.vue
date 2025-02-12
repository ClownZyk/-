<template>
  <div>
    <el-upload
      ref="fileUploadRef"
      action=""
      :http-request="handleUploadFile"
      :file-list="fileList"
      :list-type="listType"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :limit="limitUploadFiles"
      :on-exceed="handleExceed"
    >
      <el-button :loading="uploading" size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传{{ this.uploadType === 'image' ? 'jpg/png' : 'pdf' }}文件，且不超过{{ this.uploadSize }}M</div>
    </el-upload>
    <el-dialog :visible.sync="isImageDialogShow" :append-to-body="true"> <img width="100%" :src="dialogImgUrl" alt="" /> </el-dialog>
  </div>
</template>

<script>
import { lakalaUploadFile } from '@/api/system'

export default {
  props: {
    uploadType: {
      type: String,
      default: 'image'
    },
    listType: {
      type: String,
      default: 'picture'
    },
    limitUploadFiles: {
      type: Number,
      default: 1
    },
    uploadSize: {
      type: Number,
      default: 1
    },
    attType: {
      type: String,
      default: 'OTHERS'
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      uploading: false,
      dialogImgUrl: '',
      isImageDialogShow: false
    }
  },
  methods: {
    beforeUpload(file) {
      if (this.uploadType === 'image' && file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
        return this.$message.warning('请上传jpg、jpeg、png格式的图片!')
      }
      if (this.uploadType === 'file' && file.type !== 'application/pdf') {
        return this.$message.warning('请上传pdf格式的文件!')
      }
      if (file.size > this.uploadSize * 1024 * 1024) {
        return this.$message.warning(`文件大小不要超过${this.uploadSize}M`)
      }
    },
    handleExceed() {
      this.$messag.warning(`只能上传${this.limitUploadFiles} 个文件`)
    },
    handleUploadFile(param) {
      if (!this.attType) {
        this.$message.warning('请选择上传文件类型!')
      } else {
        let file = param.file
        let formData = new FormData()
        formData.append('attType', this.attType)
        formData.append('file', file)
        this.uploading = true
        lakalaUploadFile(formData)
          .then(res => {
            this.uploading = false
            this.$emit('handleUploadFileChange', { name: file.name, path: res.data.respData.attFileId })
          })
          .catch(() => {
            this.uploading = false
            this.clearFiles()
          })
      }
    },
    handlePreview(file) {
      if (this.uploadType === 'image') {
        this.isImageDialogShow = true
        this.dialogImgUrl = file.url
      }
    },
    handleRemove(file) {
      this.$emit('handleUploadFileChange', { name: '', path: '', file })
    },
    clearFiles() {
      this.$refs['fileUploadRef'].clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped></style>
