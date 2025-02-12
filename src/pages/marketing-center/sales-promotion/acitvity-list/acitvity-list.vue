<template>
  <div class="contains">
    <div class="" v-if="containerIsShow">
      <!-- <router-view></router-view> -->
      <!-- <div class="contains-main"> -->
      <!-- 搜索部分 -->
      <el-form class="filters" :inline="true">
        <el-form-item>
          <el-input v-model="search" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          <el-button type="primary" @click="GetListByPage">搜索</el-button>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="formV = true">新增</el-button> </el-form-item>
      </el-form>
      <el-table class="home-b-main" :data="categoryList" border tooltip-effect="dark" v-loading="listLoading">
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column prop="activityName" align="center" label="项目名称" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" align="center" label="开始时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" align="center" label="结束时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reserveName" align="center" label="开启状态" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.display" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="340" show-overflow-tooltip fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="_serview(scope.row, 1)">单品</el-button>
            <el-button type="primary" size="mini" @click="_serview(scope.row, 2)">组合</el-button>
            <el-button type="primary" size="mini" @click="_serview(scope.row, 3)">选购组合</el-button>
            <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
            <!-- <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          background
          style="float:right;margin-top: 10px;"
        ></el-pagination>
      </el-col>
      <!-- 弹窗 -->
      <el-dialog :visible.sync="formV" width="800px" @closed="closed">
        <el-form :model="form" label-width="80px" :rules="formRules" ref="form" class="form" :inline="true">
          <el-form-item label="名称" prop="activityName"> <el-input v-model="form.activityName" style="width:640px;"></el-input> </el-form-item>
          <el-form-item label="开启状态" prop="remarks"> <el-switch v-model="form.display"></el-switch> </el-form-item>
          <el-form-item label="活动时间" prop="timeList">
            <el-date-picker v-model="form.timeList" type="daterange" format="yyyy/MM/dd" value-format="yyyy/MM/dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          </el-form-item>
          <el-form-item label="简介" prop="remarks"> <el-input v-model="form.remarks" style="width:640px;" type="textarea" :rows="4"></el-input> </el-form-item>
          <el-form-item label="列表主图" prop="imgs">
            <my-upload :imgs="form.prodImage" :limitUploadImgs="3" ref="uploadImg" @handleRemoveImg="handleRemoveImg('prodImage', 3, $event)" @handleUploadImg="handleUploadImg('prodImage', 3, $event)"> </my-upload>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { GetActivity, ActivityOperation } from '@/api/system'
import myUpload from '@/components/my-upload'
import { formatDate } from '@/components/js/data'
export default {
  name: 'groupon',
  data() {
    return {
      formV: false,
      containerIsShow: true,
      form: {
        timeList: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')],
        activityName: '',
        display: true,
        prodImage: [],
        remarks: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      operateAction: 0,
      search: '',
      listLoading: false,
      categoryList: [],
      formRules: {
        activityName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        timeList: [{ required: true, message: '请选择活动时间', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    // 预约排单
    _serview(row, type) {
      let _path = type === 1 ? '/single-activity' : type === 2 ? '/muliti-activity' : '/choose-activity'
      this.$router.push({
        path: _path,
        query: {
          id: row._id
        }
      })
    },
    operateFunc(row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          this.operateAction = 0
          break
        case '编辑': // 编辑
          this.formV = true
          this.form = JSON.parse(JSON.stringify(row))
          this.operateAction = action
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(JSON.parse(JSON.stringify(row)))
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(JSON.parse(JSON.stringify(row)))
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios(item) {
      this.form.startTime = item.timeList[0]
      this.form.endTime = item.timeList[1]
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      ActivityOperation(params).then(res => {
        if (res.success) {
          this.formV = false
          this.GetListByPage()
          this.$message.success(res.msg)
        } else this.$message.err(res.msg)
      })
    },
    formSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('是否提交？', '提示', {}).then(() => {
            this.formLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleId', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            // if (!this.form.prodImage.length) {
            //   this.form.prodImage = [this.form.prodImage]
            // }
            this.operateAxios(this.form)
          })
        }
      })
    },
    // 获取列表
    async GetListByPage() {
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      await GetActivity(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.categoryList = res.data.map(item => {
              return {
                ...item,
                timeList: JSON.parse(JSON.stringify([item.startTime.split(' ')[0], item.endTime.split(' ')[0]]))
              }
            })
            this.total = res.total
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    },
    closed() {
      // this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.$refs.uploadImg.clearFiles()
      this.formV = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 删除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  },
  watch: {
    formV: {
      handler(newName, oldName) {
        if (newName === false) {
          this.$refs.form.resetFields()
        }
      }
    },
    $route(to, from) {
      if (to.name === 'acitvity-list') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    myUpload
  }
}
</script>

<style scoped>
.filters-search {
  width: 150px;
}
</style>
