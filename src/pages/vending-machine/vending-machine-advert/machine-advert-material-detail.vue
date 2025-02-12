<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form ref="advertDetailRef" :model="advertMaterialDetail" label-position="top">
      <el-row>
        <el-col :span="16">
          <el-form-item label="素材资源" prop="imgRelList">
            <div><el-button size="small" type="warning" @click="handleImageOrVideoAdd">资源添加</el-button></div>
            <el-table size="small" :data="advertMaterialDetail.imgRelList" border style="margin-top:10px">
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column label="素材名称" prop="name" width="140" align="center"></el-table-column>
              <el-table-column label="素材资源" min-width="160" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.fileType === 1">
                    <div v-if="scope.row.fileUrl"><el-image style="width: 120px; height: 60px" :src="scope.row.fileUrl" fit="fill" :preview-src-list="[scope.row.fileUrl]"></el-image></div>
                    <div v-else>--</div>
                  </div>
                  <div v-else-if="scope.row.fileType === 2">
                    <div v-if="scope.row.fileUrl">
                      <span class="video-url" @click="handleVideoShow(scope.row)">{{ scope.row.fileUrl }}</span>
                    </div>
                    <div v-else>--</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="素材类型" min-width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.fileType === 1">图片</div>
                  <div v-else-if="scope.row.fileType === 2">视频</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="handleImageOrVideoEdit(scope.row, scope.$index)">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleImageOrVideoDelete(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitAdvertTvMaterialInfo">确定并提交</el-button> </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 图片/视频添加，修改弹框 -->
    <el-dialog title="资源信息" :visible.sync="isImageOrVideoShow" width="600px" @close="isImageOrVideoShow = false" :close-on-click-modal="false">
      <el-form ref="addImageOrVideoFormRef" :model="addImageOrVideoForm" :rules="addImageOrVideoFormRules" label-position="top">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="素材名称：" prop="name"> <el-input type="text" v-model.trim="addImageOrVideoForm.name"></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="素材类型：">
              <el-radio-group size="medium" v-model="addImageOrVideoForm.fileType" @input="typeChange">
                <el-radio-button :label="1">图片</el-radio-button>
                <el-radio-button :label="2">视频</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片上传：" v-show="addImageOrVideoForm.fileType === 1">
          <div v-show="false">{{ addImageOrVideoForm.fileUrl }}</div>
          <my-upload ref="uploadImage" :imgs="images" :limitUploadImgs="1" :uploadSize="0.5" @handleRemoveImg="handleRemoveImg($event)" @handleUploadImg="handleUploadImg($event)"> </my-upload>
        </el-form-item>
        <el-form-item label="视频上传：" v-show="addImageOrVideoForm.fileType === 2">
          <video-upload ref="uploadVideo" videoRef="uploadVideo" :fileList="videos" :limit="1" :uploadSize="20" :isFileListShow="true" :isProgressAlwaysShow="false" @change="uploadVideoChange"> </video-upload>
        </el-form-item>
        <el-form-item style="color: #b6b6b6;">
          <div>图片：支持jpg.jpeg.png格式，尺寸为1920*800px，不超过500K</div>
          <div>视频：支持mp4格式，尺寸为1920*800px，不超过20M，长度不超过120秒</div>
        </el-form-item>
      </el-form>
      <span slot="footer"> <el-button type="primary" @click="submitImageOrVideoInfo">确 定</el-button> </span>
    </el-dialog>

    <!-- 视频查看弹框 -->
    <el-dialog title="视频信息" :visible.sync="isVideoShow" width="500px" @close="isVideoShow = false" :close-on-click-modal="false">
      <div class="video-contain"><video class="video-item" :src="videoUrl"></video></div>
      <span slot="footer"></span>
    </el-dialog>
  </div>
</template>

<script>
import { applyAdvertTvMaterial } from '@/api/system'
import MyUpload from '@/components/my-upload'
import VideoUpload from '@/components/video-upload'

export default {
  components: {
    MyUpload,
    VideoUpload
  },
  data() {
    return {
      advertMaterialDetail: {
        imgRelList: []
      },
      addImageOrVideoForm: {
        name: '',
        fileType: 1,
        fileUrl: ''
      },
      images: [],
      videos: [],
      videoUrl: '',
      addImageOrVideoState: 0,
      isVideoShow: false,
      isImageOrVideoShow: false,
      submitLoading: false,
      addImageOrVideoFormRules: {
        name: [{ required: true, message: '素材名称不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    isImageOrVideoShow(val) {
      if (!val) {
        if (this.addImageOrVideoForm.fileType === 1) {
          this.$refs['uploadImage'].clearFiles()
        } else {
          this.$refs['uploadVideo'].clearFiles()
        }
        this.addImageOrVideoForm = {
          name: '',
          fileType: 1,
          fileUrl: ''
        }
        this.images = []
        this.videos = []
      }
    }
  },
  methods: {
    handleImageOrVideoAdd() {
      this.addImageOrVideoState = 0
      this.isImageOrVideoShow = true
    },
    handleImageOrVideoEdit(row, index) {
      this.addImageOrVideoState = 1
      this.selectIndex = index
      this.isImageOrVideoShow = true
      this.$nextTick(() => {
        let { fileUrl, fileType, name } = row
        this.addImageOrVideoForm = {
          fileUrl,
          fileType,
          name
        }
        if (fileType === 1) {
          this.images = [{ url: fileUrl, name: '广告图片' }]
        } else {
          this.videos = [{ url: fileUrl, name: '广告视频' }]
        }
      })
    },
    handleImageOrVideoDelete(index) {
      this.addImageOrVideoState = 2
      this.advertMaterialDetail['imgRelList'].splice(index, 1)
    },
    submitImageOrVideoInfo() {
      this.$refs['addImageOrVideoFormRef'].validate(valid => {
        if (valid) {
          if (!this.addImageOrVideoForm.fileUrl) {
            return this.$message.warning('请上传图片或视频！')
          }
          if (this.addImageOrVideoState === 0) {
            this.advertMaterialDetail['imgRelList'].push(JSON.parse(JSON.stringify(this.addImageOrVideoForm)))
          } else if (this.addImageOrVideoState === 1) {
            this.advertMaterialDetail['imgRelList'].splice(this.selectIndex, 1, JSON.parse(JSON.stringify(this.addImageOrVideoForm)))
          }
          this.isImageOrVideoShow = false
        }
      })
    },
    submitAdvertTvMaterialInfo() {
      if (this.advertMaterialDetail.imgRelList.length <= 0) {
        this.$message.warning('请添加素材资源！')
      }
      this.submitLoading = true
      applyAdvertTvMaterial(this.advertMaterialDetail.imgRelList).then(res => {
        this.$message.success(res.msg)
        this.$router.back()
      })
    },
    handleVideoShow(row) {
      this.isVideoShow = true
      this.videoUrl = row.fileUrl
    },
    typeChange(val) {
      this.addImageOrVideoForm.fileUrl = ''
      if (val === 1) {
        this.$refs['uploadVideo'].clearFiles()
      } else {
        this.$refs['uploadImage'].clearFiles()
      }
    },
    // 图片上传删除回调
    handleRemoveImg() {
      this.addImageOrVideoForm.fileUrl = ''
    },
    handleUploadImg(imgObj) {
      this.addImageOrVideoForm.fileUrl = JSON.parse(JSON.stringify(imgObj)).url
    },
    // 视频上传回调
    uploadVideoChange(ret) {
      this.addImageOrVideoForm.fileUrl = ret
    }
  }
}
</script>

<style lang="scss" scoped>
.video-url {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
.video-contain {
  margin-top: 5px;
  .video-item {
    width: 100%;
    height: 300px;
  }
}
</style>
