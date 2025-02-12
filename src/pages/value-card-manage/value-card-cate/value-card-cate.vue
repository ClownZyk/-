<template>
  <div class="face-container">
    <el-form>
      <el-form-item> <el-button type="primary" @click="handleFaceTypeAdd" v-permission="['/value-card-cate:insert']">新增卡面类型</el-button> </el-form-item>
    </el-form>
    <div class="alert">
      <el-alert
        title="卡面信息说明："
        description="卡面编码自行定义（可由卡面名称部分首字母组成），但不可重复；卡面新建完成后进入GemBI模块——门店管理——点击‘云点卡卡面门店限制配置’进行云点卡限制配置"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
    </div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="faceTypeList" border>
        <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
        <el-table-column align="center" prop="title" label="卡面名称" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="卡面编码" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.code || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="售卖机是否可用" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isFacility" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="卡面图片" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-image v-if="scope.row.images" :src="scope.row.images.url" fit="cover" :preview-src-list="[scope.row.images.url]" style="width:60px;height:40px">
              <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
            </el-image>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleFaceTypeEdit(scope.row)" v-permission="['/value-card-cate:update']">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleFaceTypeRemove(scope.row)" v-permission="['/value-card-cate:delete']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          background
          style="float:right;margin-top:15px"
        >
        </el-pagination>
      </el-col>
    </div>
    <!-- 卡面类型弹框 -->
    <el-dialog title="卡面类型信息" :visible.sync="isFaceTypeShow" width="550px" @close="isFaceTypeShow = false" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="卡面名称：" prop="title"> <el-input type="text" v-model.trim="addForm.title" placeholder="请输入卡面名称" clearable></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡面编码：" prop="code"> <el-input type="text" v-model.trim="addForm.code" placeholder="请输入卡面编码" clearable></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="售卖机是否可用" prop="isFacility"> <el-switch v-model="addForm.isFacility"></el-switch> </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="卡面图片：" prop="images">
            <my-upload ref="imgUploadRef" :imgs="cardImage" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg('images', 1, $event)" @handleUploadImg="handleUploadImg('images', 1, $event)"> </my-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer"> <el-button type="primary" @click="submitCardFaceTypeInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getValueCardFaceType, valueCardFaceTypeOperation } from '@/api/system'
import MyUpload from '@/components/my-upload'

export default {
  components: {
    MyUpload
  },
  data() {
    return {
      faceTypeList: [],
      addForm: {
        code: '',
        title: '',
        isFacility: false,
        images: null
      },
      cardImage: [],
      addFormState: 0,
      tableLoading: false,
      isFaceTypeShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        title: [{ required: true, message: '卡面类型名称不能为空！', trigger: 'blur' }],
        code: [{ required: true, message: '卡面编码不能为空！', trigger: 'blur' }]
      }
    }
  },
  watch: {
    isFaceTypeShow(val) {
      if (!val) {
        delete this.addForm._id
        this.$refs['addFormRef'].resetFields()
        this.$refs['imgUploadRef'].clearFiles()
        this.cardImage = []
      }
    }
  },
  mounted() {
    this.getValueCardFaceType()
  },
  methods: {
    getValueCardFaceType() {
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.tableLoading = true
      getValueCardFaceType(params)
        .then(res => {
          this.tableLoading = false
          this.faceTypeList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleFaceTypeAdd() {
      this.addFormState = 0
      this.isFaceTypeShow = true
    },
    handleFaceTypeEdit(row) {
      this.addFormState = 1
      this.isFaceTypeShow = true
      this.$nextTick(() => {
        let { code, title, isFacility, images, _id } = row
        this.addForm = {
          code,
          title,
          isFacility,
          images,
          _id
        }
        this.cardImage.push(images)
      })
    },
    handleFaceTypeRemove(row) {
      this.addFormState = 2
      this.$confirm('此操作将永久删除该卡面类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.faceTypeOperation(row)
        })
        .catch(() => {})
    },
    submitCardFaceTypeInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (!this.addForm.images) {
            return this.$message.warning('请上传卡面图片!')
          }
          this.faceTypeOperation()
        }
      })
    },
    stateChange(row) {
      this.addFormState = 1
      this.faceTypeOperation(row)
    },
    faceTypeOperation(row) {
      let publicParam = row ? { ...row } : { ...this.addForm }
      let params = {
        dto: {
          ...publicParam,
          creater: localStorage.getItem('creater'),
          roleId: localStorage.getItem('roleId'),
          cid: localStorage.getItem('cid')
        },
        action: this.addFormState
      }
      valueCardFaceTypeOperation(params).then(res => {
        this.isFaceTypeShow = false
        this.$message.success(res.msg)
        this.getValueCardFaceType()
      })
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.addForm[txt] = fileList
      } else {
        this.addForm[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.addForm[txt]) {
          this.$set(this.addForm, txt, [])
        }
        this.addForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.addForm[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getValueCardFaceType()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getValueCardFaceType()
    }
  }
}
</script>

<style lang="scss" scoped>
.face-container {
  padding: 20px;
  .alert {
    margin-bottom: 10px;
  }
}
</style>
