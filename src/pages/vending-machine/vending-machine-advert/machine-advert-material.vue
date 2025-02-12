<template>
  <div>
    <div v-if="containerIsShow">
      <el-form>
        <el-form-item> <el-button type="warning" @click="addAdvertMaterial">申请广告素材</el-button> </el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="advertMaterialList" border>
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
        <el-table-column label="申请时间" prop="createTime" width="180" align="center"> </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteAdvertMaterial(scope.row)">删除</el-button>
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

      <el-dialog title="视频信息" :visible.sync="isVideoShow" width="600px" @close="isVideoShow = false" :close-on-click-modal="false">
        <div class="video-contain"><video class="video-item" ref="videoPlay" :src="videoUrl" controls muted></video></div>
        <span slot="footer"> </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getAdvertTvMaterialList, deleteAdvertTvMaterial } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'machine-advert-material') {
        this.getVendingMachineAdvertMaterial()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isVideoShow(val) {
      if (!val) {
        this.videoUrl = ''
      }
    }
  },
  data() {
    return {
      advertMaterialList: [],
      videoUrl: '',
      listLoading: false,
      isVideoShow: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getVendingMachineAdvertMaterial()
  },
  methods: {
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
    handleVideoShow(row) {
      this.isVideoShow = true
      this.videoUrl = row.fileUrl
    },
    addAdvertMaterial() {
      this.$router.push('/machine-advert-material-detail')
    },
    deleteAdvertMaterial(row) {
      this.$confirm('此操作将永久删除该素材资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: row.id
          }
          deleteAdvertTvMaterial(params).then(res => {
            this.$message.success(res.msg)
            this.getVendingMachineAdvertMaterial()
          })
        })
        .catch(() => {})
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
.video-contain {
  margin-top: 5px;
  .video-item {
    width: 100%;
    height: 300px;
  }
}
</style>
