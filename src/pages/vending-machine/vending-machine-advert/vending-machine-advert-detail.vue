<template>
  <div v-loading="detailLoading">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form ref="advertDetailRef" :model="advertDetail" :rules="advertDetailRules" label-position="top">
      <el-row>
        <el-col :span="14">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="广告名称" prop="name"> <el-input type="text" v-model="advertDetail.name" placeholder="请输入广告名称"></el-input> </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商业类型" prop="businessType">
                <el-radio-group v-model="advertDetail.businessType">
                  <el-radio-button :label="1">公益</el-radio-button>
                  <el-radio-button :label="2">商业</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col>
              <el-form-item label="轮播时长(对于图片生效，视频时长由视频本身决定)" prop="duration">
                <el-input-number v-model="advertDetail.duration" :min="1" :step="1" step-strictly :controls="false" label="轮播时长"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="广告资源" prop="imgRelList">
            <div><el-button size="small" type="warning" @click="handleImageOrVideoAdd">素材添加</el-button></div>
            <el-table size="small" :data="advertDetail.imgRelList" border style="margin-top:10px">
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column label="素材资源" min-width="160" align="center" show-overflow-tooltip>
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
              <el-table-column label="播放顺序" min-width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input-number size="mini" v-model="scope.row.priority" :min="1" :max="100" :step="1" step-strictly :controls="false" label="播放顺序" style="width:100%"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleImageOrVideoDelete(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="addAdvertState === 1" label="关联设备">
            <el-table size="small" :data="advertDetail.vmList" border>
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column label="设备名称" prop="name" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
              <el-table-column label="设备编码" prop="code" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="submitAdvertTvInfo">确定并提交</el-button> </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 素材资源添加弹框 -->
    <el-dialog title="素材资源信息" :visible.sync="isImageOrVideoShow" width="1000px" @close="isImageOrVideoShow = false" :close-on-click-modal="false">
      <div style="margin-bottom:10px;font-size:14px;color:#E6A23C">注：广告资源素材添加：只能选择审核通过的素材</div>
      <el-table v-loading="listLoading" ref="listTableRef" :data="advertMaterialList" row-key="sourceMaterialsId" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" reserve-selection :selectable="rowSelect" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="素材名称" prop="name" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="素材类型" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.fileType === 1">图片</div>
            <div v-else-if="scope.row.fileType === 2">视频</div>
          </template>
        </el-table-column>
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
        <el-table-column label="申请状态" width="180" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1" style="color:#E6A23C">审核中</div>
            <div v-else-if="scope.row.status === 2" style="color:#67C23A">通过</div>
            <div v-else-if="scope.row.status === 3" style="color:#F56C6C">驳回</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
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
import { getVendingMachineAdvertDetail, getAdvertTvMaterialList, addVendingMachineAdvert, updateVendingMachineAdvert } from '@/api/system'
import MyUpload from '@/components/my-upload'
import VideoUpload from '@/components/video-upload'

export default {
  components: {
    MyUpload,
    VideoUpload
  },
  data() {
    return {
      advertDetail: {
        name: '',
        businessType: 1,
        duration: 5,
        imgRelList: []
      },
      advertMaterialList: [],
      selectedMaterialList: [],
      videoUrl: '',
      isVideoShow: false,
      listLoading: false,
      detailLoading: false,
      isImageOrVideoShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      advertDetailRules: {
        name: [{ required: true, message: '广告名称不能为空', trigger: 'blur' }],
        duration: [{ required: true, message: '播放时长不能为空', trigger: 'change' }]
      },
      addImageOrVideoFormRules: {
        priority: [{ required: true, message: '播放顺序不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    addAdvertState() {
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
        this.$refs['listTableRef'].clearSelection()
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
      this.getAdvertDetail()
    }
  },
  methods: {
    getAdvertDetail() {
      let params = {
        id: this.$route.query.id,
        vmcode: ''
      }
      this.detailLoading = true
      getVendingMachineAdvertDetail(params)
        .then(res => {
          this.detailLoading = false
          this.advertDetail = res.data
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    handleImageOrVideoAdd() {
      this.isImageOrVideoShow = true
      this.getVendingMachineAdvertMaterial()
    },
    getVendingMachineAdvertMaterial() {
      let params = {
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.listLoading = true
      getAdvertTvMaterialList(params)
        .then(res => {
          this.listLoading = false
          this.advertMaterialList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleSelectionChange(val) {
      this.selectedMaterialList = JSON.parse(JSON.stringify(val))
    },
    rowSelect(row) {
      if (row.status === 2) {
        return true
      } else {
        return false
      }
    },
    handleImageOrVideoDelete(index) {
      this.advertDetail['imgRelList'].splice(index, 1)
    },
    submitImageOrVideoInfo() {
      if (this.selectedMaterialList.length <= 0) {
        return this.$message.warning('请选择素材资源！')
      }
      let list = []
      if (this.advertDetail.imgRelList.length <= 0) {
        list = this.selectedMaterialList.map((item, index) => {
          return {
            priority: index + 1,
            fileType: item.fileType,
            fileUrl: item.fileUrl,
            sourceMaterialsId: item.id
          }
        })
      } else {
        let noRepeatList = this.selectedMaterialList.filter(item => {
          return this.advertDetail.imgRelList.every(val => val.sourceMaterialsId !== item.id)
        })
        let index = this.advertDetail.imgRelList.length
        let priority = this.advertDetail.imgRelList[index - 1].priority
        list = noRepeatList.map(item => {
          return {
            priority: priority + 1,
            fileType: item.fileType,
            fileUrl: item.fileUrl,
            sourceMaterialsId: item.id
          }
        })
      }
      this.advertDetail.imgRelList.push(...list)
      this.isImageOrVideoShow = false
    },
    handleVideoShow(row) {
      this.isVideoShow = true
      this.videoUrl = row.fileUrl
    },
    submitAdvertTvInfo() {
      this.$refs['advertDetailRef'].validate(valid => {
        if (valid) {
          if (this.advertDetail.imgRelList.length <= 0) {
            return this.$message.warning('素材资源信息不能为空！')
          }
          let params = {
            ...this.advertDetail,
            id: this.addAdvertState ? this.$route.query.id : 0
          }
          let addOrUpdateVendingMachineAdvert = this.$route.query.id ? updateVendingMachineAdvert : addVendingMachineAdvert
          addOrUpdateVendingMachineAdvert(params).then(res => {
            this.$message.success(res.msg)
            this.$router.back()
          })
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getVendingMachineAdvertMaterial()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getVendingMachineAdvertMaterial()
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
