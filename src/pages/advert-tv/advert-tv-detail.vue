<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
      <el-row>
        <el-col :span="16">
          <el-form-item label="内容标题" prop="title"> <el-input type="text" v-model="addForm.title" placeholder="请输入内容标题"></el-input> </el-form-item>
          <el-form-item label="内容图片集" prop="images">
            <div><el-button size="small" type="warning" @click="handleImageOrVideoAdd('images')">图片添加</el-button></div>
            <el-table size="small" :data="addForm.images" border style="margin-top:10px">
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column label="图片" width="160" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.url"><el-image :src="scope.row.url" fit="fill" :preview-src-list="[scope.row.url]"></el-image></div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column label="展示方式" min-width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.type === 1">立即展示</div>
                  <div v-else>定时展示</div>
                </template>
              </el-table-column>
              <el-table-column label="展示时间" min-width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.type === 2 ? `${scope.row.startTime}-${scope.row.endTime}` : '--' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="handleImageOrVideoEdit(scope.row, scope.$index, 'images')">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleImageOrVideoDelete(scope.$index, 'images')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="内容视频集" prop="videos">
            <div><el-button size="small" type="warning" @click="handleImageOrVideoAdd('videos')">视频添加</el-button></div>
            <el-table size="small" :data="addForm.videos" border style="margin-top:10px">
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column label="视频路径" min-width="200">
                <template slot-scope="scope">
                  <div v-if="scope.row.url">
                    <span class="video-url" @click="handleVideoShow(scope.row)">{{ scope.row.url }}</span>
                  </div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column label="展示方式" min-width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.type === 1">立即展示</div>
                  <div v-else>定时展示</div>
                </template>
              </el-table-column>
              <el-table-column label="展示时间" min-width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.type === 2 ? `${scope.row.startTime}-${scope.row.endTime}` : '--' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="handleImageOrVideoEdit(scope.row, scope.$index, 'videos')">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleImageOrVideoDelete(scope.$index, 'videos')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="内容备注" prop="remarks"> <el-input type="textarea" v-model="addForm.remarks" :rows="2" placeholder="请输入内容备注"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="submitAdvertTvInfo">确定并提交</el-button> </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 图片/视频添加，修改弹框 -->
    <el-dialog :title="addType === 'images' ? '图片信息' : '视频信息'" :visible.sync="isImageOrVideoShow" width="600px" @close="isImageOrVideoShow = false" :close-on-click-modal="false">
      <el-form ref="addImageOrVideoFormRef" :model="addImageOrVideoForm" :rules="addImageOrVideoFormRules" label-position="top">
        <div v-if="addType === 'images'">
          <el-form-item label="图片上传："> <my-upload ref="uploadImage" :imgs="images" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg('url', $event)" @handleUploadImg="handleUploadImg('url', $event)"> </my-upload> </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="视频上传：">
            <video-upload ref="uploadVideo" videoRef="uploadVideo" :fileList="videos" :limit="1" :isFileListShow="true" :isProgressAlwaysShow="false" @change="uploadVideoChange"> </video-upload>
          </el-form-item>
        </div>
        <el-form-item label="展示方式：">
          <el-radio-group v-model="addImageOrVideoForm.type" size="medium" @input="typeChange">
            <el-radio-button :label="1">立即展示</el-radio-button>
            <el-radio-button :label="2">定时展示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展示时间：" prop="sTime" v-if="addImageOrVideoForm.type === 2">
          <el-date-picker
            v-model="addImageOrVideoForm.sTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy/MM/dd HH:mm:ss"
            value-format="yyyy/MM/dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer"> <el-button type="primary" @click="submitImageOrVideoInfo">确 定</el-button> </span>
    </el-dialog>

    <!-- 视频展示弹框 -->
    <el-dialog title="视频信息" :visible.sync="isVideoShow" width="600px" @close="isVideoShow = false" :close-on-click-modal="false">
      <div class="video-contain"><video class="video-item" ref="videoPlay" :src="videoUrl" controls muted></video></div>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import MyUpload from '@/components/my-upload'
import VideoUpload from '@/components/video-upload'
import { getAdvertTvDetail, advertTvOperation } from '@/api/system'

export default {
  components: {
    MyUpload,
    VideoUpload
  },
  data() {
    return {
      addForm: {
        tvCode: '',
        onlyCode: '',
        title: '',
        images: [],
        videos: [],
        remarks: ''
      },
      addImageOrVideoForm: {
        url: '',
        type: 1,
        sTime: []
      },
      images: [],
      videos: [],
      addType: 'images',
      selectIndex: 0,
      imageOrVideoOperation: 0,
      videoUrl: '',
      isImageOrVideoShow: false,
      isVideoShow: false,
      addFormRules: {
        title: [{ required: true, message: '请输入电视广告内容标题', trigger: 'blur' }]
      },
      addImageOrVideoFormRules: {
        sTime: [{ required: true, message: '请输入电视广告内容标题', trigger: 'change' }]
      }
    }
  },
  computed: {
    addFormState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  watch: {
    isImageOrVideoShow(val) {
      if (!val) {
        this.addImageOrVideoForm = {
          url: '',
          type: 1,
          sTime: []
        }
        if (this.addType === 'images') {
          this.$refs['uploadImage'].clearFiles()
        } else {
          this.$refs['uploadVideo'].clearFiles()
        }
      }
    },
    isVideoShow(val) {
      if (!val) {
        this.videoUrl = ''
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getAdvertTvDetail()
    }
  },
  methods: {
    getAdvertTvDetail() {
      getAdvertTvDetail({ _id: this.$route.query.id }).then(res => {
        this.addForm = res.data
      })
    },
    handleImageOrVideoAdd(uploadType) {
      this.imageOrVideoOperation = 0
      this.addType = uploadType
      this.isImageOrVideoShow = true
    },
    handleImageOrVideoEdit(row, index, uploadType) {
      this.imageOrVideoOperation = 1
      this.addType = uploadType
      this.selectIndex = index
      this.isImageOrVideoShow = true
      this.$nextTick(() => {
        let { url, type, startTime, endTime } = row
        this.addImageOrVideoForm = {
          url,
          type,
          sTime: [startTime, endTime]
        }
        if (uploadType === 'images') {
          this.images = [{ url, name: '广告图片' }]
        } else {
          this.videos = [{ url, name: '广告视频' }]
        }
      })
    },
    handleImageOrVideoDelete(index, uploadType) {
      this.addImageOrVideoForm[uploadType].splice(index, 1)
    },
    handleVideoShow(row) {
      this.isVideoShow = true
      this.videoUrl = row.url
    },
    submitImageOrVideoInfo() {
      this.$refs['addImageOrVideoFormRef'].validate(valid => {
        if (valid) {
          if (!this.addImageOrVideoForm.url) {
            return this.$message.warning('请上传图片或视频！')
          }
          if (this.addImageOrVideoForm.type === 2 && (!this.addImageOrVideoForm.sTime || this.addImageOrVideoForm.sTime.length <= 0)) {
            return this.$message.warning('请选择定时展示的时间段！')
          }
          let row = {
            url: this.addImageOrVideoForm.url,
            type: this.addImageOrVideoForm.type,
            startTime: this.addImageOrVideoForm.sTime[0] || null,
            endTime: this.addImageOrVideoForm.sTime[1] || null
          }
          if (this.imageOrVideoOperation === 0) {
            this.addForm[this.addType].push(JSON.parse(JSON.stringify(row)))
          } else {
            this.addForm[this.addType].splice(this.selectIndex, 1, JSON.parse(JSON.stringify(row)))
          }
          this.isImageOrVideoShow = false
        }
      })
    },
    submitAdvertTvInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (this.addForm.images.length <= 0 && this.addForm.videos.length <= 0) {
            return this.$message.warning('图片和视频不能同时为空！')
          }
          let params = {
            dto: {
              ...this.addForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.addFormState
          }
          advertTvOperation(params).then(res => {
            this.$message.success(res.msg)
            this.$router.back()
          })
        }
      })
    },
    typeChange(val) {
      if (val === 1) {
        this.addImageOrVideoForm.sTime = []
      }
    },
    // 图片上传删除回调
    handleRemoveImg(txt, fileList) {
      this.addImageOrVideoForm[txt] = ''
    },
    handleUploadImg(txt, imgObj) {
      this.addImageOrVideoForm[txt] = JSON.parse(JSON.stringify(imgObj)).url
    },
    // 视频上传回调
    uploadVideoChange(ret) {
      this.addImageOrVideoForm.url = ret
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
