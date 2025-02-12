<template>
  <div class="video-upload">
    <el-upload
      ref="videoUploadRef"
      class="upload-demo"
      :action="uploadVideo"
      :headers="headers"
      accept="video/mp4, video/avi, video/wmv, video/rmvb"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :show-file-list="isFileListShow"
    >
      <el-button size="mini" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        <div class="progress" v-show="isProgressAlwaysShow && progressShow"><el-progress :percentage="uploadProgress"></el-progress></div>
        <div v-show="isProgressAlwaysShow">只能上传.mp4，.avi，.wmv，.rmvb文件，且不超过{{ uploadSize }}M</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import baseURL from '@/config/baseUrl.js'
import store from '@/store/index.js'

export default {
  props: {
    limit: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    videoRef: {
      type: String,
      default: 'uploadVideo'
    },
    isFileListShow: {
      type: Boolean,
      default: false
    },
    isProgressAlwaysShow: {
      type: Boolean,
      default: true
    },
    uploadSize: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      uploadVideo: baseURL + '/api/Base/VideoUpload',
      headers: {
        Authorization: 'Bearer ' + store.state.UserToken
      },
      uploadProgress: 0,
      videoTime: 0,
      progressShow: false,
      loading: false
    }
  },
  methods: {
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > this.uploadSize) {
        this.$message.warning(`视频大小不要超过${this.uploadSize}M！`)
        return false
      }
    },

    handleExceed() {
      this.$message.warning(`最多上传${this.limit}个视频！`)
    },

    handleProgress(event, file, fileList) {
      this.progressShow = true
      this.uploadProgress = file.percentage.toFixed(0) * 1
      if (this.uploadProgress === 100) {
        this.progressShow = false
      }
    },
    handleSuccess(response, file, fileList) {
      // 隐藏进度条
      this.progressShow = false
      this.uploadProgress = 0
      // 获取视频时长
      const url = URL.createObjectURL(new Blob([file.raw]))
      const videoElement = new Audio(url)
      videoElement.addEventListener('loadedmetadata', () => {
        if (videoElement.duration - parseInt(videoElement.duration) > 0.25) {
          this.videoTime = parseInt(videoElement.duration) + 1
        } else {
          this.videoTime = parseInt(videoElement.duration)
        }
        this.emitChange(file, this.videoTime)
      })
    },
    handleError() {
      this.progressShow = false
      this.$message.error('视频上传失败，请重新上传！')
    },
    handleRemove(file, fileList) {
      // console.log(fileList)
      this.emitChange({ response: { data: '' } }, 0)
    },
    emitChange(file, time) {
      this.$emit('change', file.response.data, time)
    },
    clearFiles() {
      this.$refs['videoUploadRef'].clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-upload {
  display: unset !important;
  text-align: left;
  .el-upload__tip {
    margin-top: unset;
  }
}
.progress {
  width: 330px;
}
.tip {
  font-size: 14px;
  color: #e6a23c;
  margin-bottom: 5px;
}
</style>
